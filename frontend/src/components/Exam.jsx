import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/Exam.module.css';

function Exam() {
  const { courseId, examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Bạn cần đăng nhập để làm bài.');
          setLoading(false);
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const courseData = response.data;
        const currentExam = courseData.Exams.find(e => e.examId === parseInt(examId));

        if (currentExam) {
          setExam(currentExam);
        } else {
          setError('Không tìm thấy bài kiểm tra.');
        }
      } catch (err) {
        setError('Lỗi khi tải bài kiểm tra.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [courseId, examId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formattedAnswers = Object.keys(answers).map(questionId => ({
        questionId: parseInt(questionId),
        userAnswer: answers[questionId],
      }));

      const response = await axios.post('http://localhost:5000/api/exam-users/submit', 
        { examId: parseInt(examId), answers: formattedAnswers }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResult(response.data);
    } catch (err) {
      setError('Lỗi khi nộp bài.');
      console.error(err);
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!exam) return <div className={styles.error}>Không có dữ liệu bài kiểm tra.</div>;

  if (result) {
    return (
      <div className={styles['result-container']}>
        <h2 className={styles['result-title']}>Kết quả bài kiểm tra</h2>
        <p className={styles['result-details']}>Điểm số: {result.score} / {result.totalQuestions}</p>
        <p className={styles['result-details']}>Tỉ lệ đúng: {result.percent.toFixed(2)}%</p>
        <button onClick={() => navigate(`/my-courses`)} className={styles['submit-btn']}>
          Quay lại khóa học
        </button>
      </div>
    );
  }

  return (
    <div className={styles['exam-container']}>
      <h1 className={styles['exam-title']}>{exam.title}</h1>
      <form onSubmit={handleSubmit}>
        {[...exam.Questions].sort((a, b) => a.questionId - b.questionId).map(q => (
          <div key={q.questionId} className={styles['question-card']}>
            <p className={styles['question-content']}>{q.content}</p>
            <div className={styles.answers}>
              {q.answer.map((option, index) => {
                const answerValue = String.fromCharCode(65 + index);
                return (
                  <label key={option} className={styles['answer-label']}>
                    <input
                      type="radio"
                      name={`question-${q.questionId}`}
                      value={answerValue}
                      onChange={() => handleAnswerChange(q.questionId, answerValue)}
                      required
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          </div>
        ))}
        <button type="submit" className={styles['submit-btn']}>Nộp bài</button>
      </form>
    </div>
  );
}

export default Exam;
