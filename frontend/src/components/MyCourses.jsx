import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/MyCourses.module.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Bạn cần đăng nhập để xem khóa học của mình.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/progress/my-courses', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCourses(res.data);
      } catch (err) {
        setError('Không thể tải danh sách khóa học. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  useEffect(() => {
    const fetchExamsForCourses = async () => {
      if (courses.length > 0) {
        const examsData = {};
        const token = localStorage.getItem('token');

        for (const course of courses) {
          try {
            const res = await axios.get(`http://localhost:5000/api/exams/course/${course.courseId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (res.data.length > 0) {
              examsData[course.courseId] = res.data[0];
            }
          } catch (err) {
            console.error(`Failed to fetch exam for course ${course.courseId}`, err);
          }
        }
        setExams(examsData);
      }
    };

    if (!loading) {
      fetchExamsForCourses();
    }
  }, [courses, loading]);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.myCoursesContainer}>
      <h1>Khóa học của tôi</h1>
      {courses.length > 0 ? (
        <div className={styles.courseGrid}>
          {courses.map(course => (
            <div key={course.courseId} className={styles.courseCard}>
              <img src={course.imageUrl ? `http://localhost:5000${course.imageUrl}` : 'https://via.placeholder.com/300x200'} alt={course.title} />
              <div className={styles.courseInfo}>
                <h2>{course.title}</h2>
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar} style={{ width: `${course.totalPercent || 0}%` }}></div>
                </div>
                <p>{`Hoàn thành ${Math.round(course.totalPercent || 0)}%`}</p>
                <Link to={`/course/${course.courseId}/videos`} className={styles.viewCourseButton}>Vào học</Link>
                <div className={styles.examSection}>
                  <h4>Bài kiểm tra</h4>
                  {exams[course.courseId] ? (
                    <Link to={`/course/${course.courseId}/exam/${exams[course.courseId].examId}`} className={styles.viewExamButton}>Làm bài kiểm tra</Link>
                  ) : (
                    <p>Chưa có bài kiểm tra.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Bạn chưa đăng ký khóa học nào.</p>
      )}
    </div>
  );
};

export default MyCourses;
