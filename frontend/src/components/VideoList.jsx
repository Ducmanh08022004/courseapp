import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./styles/VideoList.module.css";

function VideoList() {
  const [videos, setVideos] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { courseId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Bạn cần đăng nhập để xem video.");
          setLoading(false);
          return;
        }

        // Fetch course details to get the title
        const courseResponse = await axios.get(`http://localhost:5000/api/courses/${courseId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        setCourseTitle(courseResponse.data.title);

        // Fetch videos for the course
        const videosResponse = await axios.get(`http://localhost:5000/api/videos/course/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setVideos(videosResponse.data);
        setError(null);
      } catch (err) {
        if (err.response && err.response.status === 403) {
            setError("Bạn không có quyền truy cập vào khóa học này.");
        } else {
            setError("Không thể tải dữ liệu.");
        }
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchData();
    }
  }, [courseId]);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{courseTitle}</h1>
      <div className={styles.videoGrid}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <div key={video.videoId} className={styles.videoCard}>
              <video
                src={`http://localhost:5000/${video.url}`}
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
  );
}

export default VideoList;
