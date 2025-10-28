import React, { useState, useEffect } from 'react';
import styles from './styles/CourseManagement.module.css';
import CourseModal from './CourseModal';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/courses/${courseId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (response.ok) {
          fetchCourses();
        } else {
          const errorData = await response.json();
          console.error('Error deleting course:', errorData.msg);
          alert(`Error: ${errorData.msg}`);
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('An error occurred while deleting the course.');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleModalSave = () => {
    fetchCourses();
    handleModalClose();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lí khóa học</h2>
        <button className={styles.addButton} onClick={handleAddCourse}>
          Thêm khóa học
        </button>
      </div>
      <table className={styles.courseTable}>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên khóa học</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.courseId}>
              <td>
                <img
                  src={course.imageUrl ? `http://localhost:5000${course.imageUrl}` : '/default.jpg'}
                  alt={course.title}
                  className={styles.courseImage}
                />
              </td>
              <td>{course.title}</td>
              <td>{course.description}</td>
              <td>{course.price}</td>
              <td>
                <button
                  className={styles.actionButton}
                  onClick={() => handleEditCourse(course)}
                >
                  Sửa
                </button>
                <button
                  className={`${styles.actionButton} ${styles.deleteButton}`}
                  onClick={() => handleDeleteCourse(course.courseId)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <CourseModal
          course={selectedCourse}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default CourseManagement;
