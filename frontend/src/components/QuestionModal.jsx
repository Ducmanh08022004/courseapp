import React, { useState } from 'react';
import axios from 'axios';
import styles from './styles/CourseModal.module.css';

function QuestionModal({ examId, question, onClose, onSave }) {
  const [content, setContent] = useState(question ? question.content : '');
  const [answers, setAnswers] = useState(question ? question.answer : ['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(question ? question.correctAnswer : 'A');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      const questionData = {
        content,
        answer: answers,
        correctAnswer,
        examId: parseInt(examId)
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let response;
      if (question) {
        response = await axios.put(
          `http://localhost:5000/api/questions/${question.questionId}`,
          questionData,
          { headers }
        );
      } else {
        response = await axios.post(
          'http://localhost:5000/api/questions',
          questionData,
          { headers }
        );
      }

      onSave(response.data);
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{question ? 'Sửa câu hỏi' : 'Thêm câu hỏi mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="content">Nội dung câu hỏi:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Nhập nội dung câu hỏi"
            />
          </div>

          {answers.map((answer, index) => (
            <div key={index} className={styles.formGroup}>
              <label htmlFor={`answer-${index}`}>
                Đáp án {String.fromCharCode(65 + index)}:
              </label>
              <input
                type="text"
                id={`answer-${index}`}
                value={answer}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                required
                placeholder={`Nhập đáp án ${String.fromCharCode(65 + index)}`}
              />
            </div>
          ))}

          <div className={styles.formGroup}>
            <label htmlFor="correctAnswer">Đáp án đúng:</label>
            <select
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : question ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default QuestionModal;