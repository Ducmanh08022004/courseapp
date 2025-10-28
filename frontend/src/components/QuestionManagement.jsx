import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import QuestionModal from './QuestionModal';
import styles from './styles/QuestionManagement.module.css';

function QuestionManagement() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { examId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/questions/exam/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setQuestions(response.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách câu hỏi');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setSelectedQuestion(null);
    setShowModal(true);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setShowModal(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setQuestions(questions.filter(q => q.questionId !== questionId));
    } catch (err) {
      setError('Không thể xóa câu hỏi');
      console.error(err);
    }
  };

  const handleModalSave = (savedQuestion) => {
    if (selectedQuestion) {
      setQuestions(questions.map(question => 
        question.questionId === savedQuestion.questionId ? savedQuestion : question
      ));
    } else {
      setQuestions([...questions, savedQuestion]);
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý câu hỏi</h1>
        <button onClick={handleAddQuestion} className={styles.addButton}>
          Thêm câu hỏi
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nội dung</th>
              <th>Đáp án đúng</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {questions.map(question => (
              <tr key={question.questionId}>
                <td>{question.content}</td>
                <td>{question.correctAnswer}</td>
                <td className={styles.actions}>
                  <button 
                    onClick={() => handleEditQuestion(question)} 
                    className={styles.editButton}
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDeleteQuestion(question.questionId)} 
                    className={styles.deleteButton}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <QuestionModal
          examId={examId}
          question={selectedQuestion}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default QuestionManagement;