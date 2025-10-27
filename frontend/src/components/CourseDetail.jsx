import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./styles/CourseDetail.module.css";

import { Link } from "react-router-dom";

function CourseDetail() {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Lấy id từ URL

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/courses/${id}`);
        setCourse(response.data);
        setError(null);
      } catch (err) {
        setError("Không thể tải chi tiết khóa học.");
        console.error("Lỗi khi tải chi tiết khóa học:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCourseDetail();
    }
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!course) {
    return <div className={styles.container}>Không tìm thấy khóa học.</div>;
  }

  return (
    <div className={styles.container}>
      {/* LEFT: Course Description */}
      <div className={styles.content}>
        <h1 className={styles.title}>{course.title}</h1>
        <p className={styles.description}>{course.description}</p>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Nội dung khóa học</h2>
          <div className={styles.videoGrid}>
            {course.Videos && course.Videos.length > 0 ? (
              course.Videos.map((video) => (
                <div key={video.videoId} className={styles.videoCard}>
                  <video
                    src={`http://localhost:5000${video.videoUrl}`}
                    controls
                    className={styles.videoPlayer}
                  ></video>
                  <div className={styles.videoTitle}>{video.title}</div>
                </div>
              ))
            ) : (
              <p>Không có video nào cho khóa học này.</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Info Card */}
      <div className={styles.sidebar}>
        <img src={`http://localhost:5000${course.imageUrl}`} alt={course.title} className={styles.sidebarImage} />
        <h2 className={styles.sidebarTitle}>{course.title}</h2>
        <p className={styles.priceLabel}>
          Giá: <span className={styles.price}>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}</span>
        </p>
        <Link to={`/payment/${course.courseId}`} className={styles.button}>
          Mua ngay
        </Link>
      </div>
    </div>
  );
}

export default CourseDetail;