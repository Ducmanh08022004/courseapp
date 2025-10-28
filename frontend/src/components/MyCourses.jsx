import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './styles/MyCourses.module.css';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState({});
  const [showExamModal, setShowExamModal] = useState(false);
  const [examOptions, setExamOptions] = useState([]);
  const [activeCourseForExam, setActiveCourseForExam] = useState(null);
  const navigate = useNavigate();
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

        setCourses(res.data || []);
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
            // store array of exams (may be empty)
            examsData[course.courseId] = res.data;
          } catch (err) {
            console.error(`Failed to fetch exam for course ${course.courseId}`, err);
            examsData[course.courseId] = [];
          }
        }
        setExams(examsData);
      }
    };

    if (!loading) {
      fetchExamsForCourses();
    }
  }, [courses, loading]);

  // Open exam picker: if multiple exams show modal, if one exam navigate directly
  const openExamPicker = async (courseId) => {
    setActiveCourseForExam(courseId);
    const token = localStorage.getItem('token');
    try {
      let options = exams[courseId];
      if (!options) {
        const res = await axios.get(`http://localhost:5000/api/exams/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        options = res.data;
        setExams(prev => ({ ...prev, [courseId]: options }));
      }

      if (!options || options.length === 0) {
        alert('Chưa có bài kiểm tra cho khóa học này.');
        return;
      }

      if (options.length === 1) {
        navigate(`/course/${courseId}/exam/${options[0].examId}`);
        return;
      }

      setExamOptions(options);
      setShowExamModal(true);
    } catch (err) {
      console.error(err);
      alert('Không thể tải danh sách bài kiểm tra.');
    }
  };

  const selectExam = (examId) => {
    setShowExamModal(false);
    navigate(`/course/${activeCourseForExam}/exam/${examId}`);
  };

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
                  {exams[course.courseId] && exams[course.courseId].length > 0 ? (
                    <>
                      <button
                        className={styles.viewExamButton}
                        onClick={() => openExamPicker(course.courseId)}
                      >
                        Làm bài kiểm tra
                      </button>
                    </>
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

      {showExamModal && (
        <div className={styles.modalOverlay} onClick={() => setShowExamModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>Chọn bài kiểm tra</h3>
            <ul className={styles.examList}>
              {examOptions.map(ex => (
                <li key={ex.examId} className={styles.examItem}>
                  <div>
                    <strong>{ex.title}</strong>
                    <div className={styles.examMeta}>{(ex.Questions?.length || 0) + ' câu hỏi'}</div>
                  </div>
                  <button className={styles.selectButton} onClick={() => selectExam(ex.examId)}>Làm bài</button>
                </li>
              ))}
            </ul>
            <div style={{ textAlign: 'right', marginTop: '1rem' }}>
              <button className={styles.closeButton} onClick={() => setShowExamModal(false)}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCourses;
