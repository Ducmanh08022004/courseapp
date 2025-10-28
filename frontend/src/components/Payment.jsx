import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/Payment.module.css';

const Payment = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourse(res.data);
      } catch (err) {
        setError('Failed to fetch course details.');
        console.error(err);
      }
    };
    fetchCourse();
  }, [courseId]);

  const handlePayment = async () => {
    // --- THÊM PHẦN XÁC NHẬN TẠI ĐÂY ---
    const isConfirmed = window.confirm(
      `Bạn có chắc chắn muốn thanh toán cho khóa học "${course.title}"?`
    );

    // Nếu người dùng không đồng ý (nhấn "Cancel"), dừng hàm tại đây
    if (!isConfirmed) {
      return;
    }
    // ------------------------------------

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      // 1. Create Order
      const orderRes = await axios.post('http://localhost:5000/api/orders', { courseId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const { orderId } = orderRes.data;

      // 2. Process Payment
      await axios.post('http://localhost:5000/api/payments', { orderId, method: 'momo' }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 3. Redirect to My Courses
      navigate('/my-courses');

    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    // Sử dụng class .loading từ file CSS
    return <div className={styles.loading}>Loading course details...</div>;
  }

  return (
    <div className={styles.paymentContainer}>
      <h2>Thanh toán khóa học</h2>
      <div className={styles.courseInfo}>
        <h3>{course.title}</h3>
        <p>{course.description}</p>
        <h4>Giá: {course.price.toLocaleString('vi-VN')} VNĐ</h4>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <button onClick={handlePayment} disabled={loading} className={styles.paymentButton}>
        {loading ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
      </button>
    </div>
  );
};

export default Payment;