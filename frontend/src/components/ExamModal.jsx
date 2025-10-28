import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './styles/CourseModal.module.css';

function ExamModal({ courseId, exam, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (exam) {
      setTitle(exam.title);
    }
  }, [exam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Bạn cần đăng nhập để thực hiện chức năng này');
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      let response;
      if (exam) {
        // Sửa exam hiện có
        response = await axios.put(`http://localhost:5000/api/exams/${exam.examId}`, 
          { title },
          { headers }
        );
      } else {
        // Tạo exam mới
        response = await axios.post('http://localhost:5000/api/exams', 
          { courseId, title },
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

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{exam ? 'Sửa bài kiểm tra' : 'Thêm bài kiểm tra mới'}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Tên bài kiểm tra:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="Nhập tên bài kiểm tra"
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}
          
          <div className={styles.buttonGroup}>
            <button type="button" onClick={onClose} disabled={loading}>
              Hủy
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Đang xử lý...' : exam ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExamModal;