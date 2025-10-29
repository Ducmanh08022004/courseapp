import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ExamModal from './ExamModal';
import styles from './styles/ExamManagement.module.css';

function ExamManagement() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const { courseId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, [courseId]);

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/exams/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExams(response.data);
      setError('');
    } catch (err) {
      setError('Không thể tải danh sách bài kiểm tra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExam = () => {
    setSelectedExam(null);
    setShowModal(true);
  };

  const handleEditExam = (exam) => {
    setSelectedExam(exam);
    setShowModal(true);
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Bạn có chắc muốn xóa bài kiểm tra này?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/exams/${examId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setExams(exams.filter(exam => exam.examId !== examId));
    } catch (err) {
      setError('Không thể xóa bài kiểm tra');
      console.error(err);
    }
  };

  const handleModalSave = (savedExam) => {
    if (selectedExam) {
      setExams(exams.map(exam => 
        exam.examId === savedExam.examId ? savedExam : exam
      ));
    } else {
      setExams([...exams, savedExam]);
    }
  };

  if (loading) return <div className={styles.loading}>Đang tải...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản lý bài kiểm tra</h1>
        <button onClick={handleAddExam} className={styles.addButton}>
          Thêm bài kiểm tra
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableContainer}>
        {exams.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tên bài kiểm tra</th>
                <th>Số câu hỏi</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {exams.map(exam => (
                <tr key={exam.examId}>
                  <td>{exam.title}</td>
                  <td>
                    <span className={styles.examCount}>
                      {exam.Questions?.length || 0} câu hỏi
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button 
                      onClick={() => navigate(`/admin/exam/${exam.examId}/questions`)} 
                      className={styles.manageButton}
                      title="Quản lý câu hỏi"
                    >
                      Quản lý câu hỏi
                    </button>
                    <button 
                      onClick={() => handleEditExam(exam)} 
                      className={styles.editButton}
                      title="Sửa bài kiểm tra"
                    >
                      Sửa
                    </button>
                    <button 
                      onClick={() => handleDeleteExam(exam.examId)} 
                      className={styles.deleteButton}
                      title="Xóa bài kiểm tra"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            <h3>Chưa có bài kiểm tra nào</h3>
            <p>Hãy thêm bài kiểm tra đầu tiên cho khóa học này</p>
          </div>
        )}
      </div>

      {showModal && (
        <ExamModal
          courseId={courseId}
          exam={selectedExam}
          onClose={() => setShowModal(false)}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
}

export default ExamManagement;