import { useEffect, useState } from "react";
import axios from "axios";
import Course from "./Course";
import styles from "./styles/CourseList.module.css";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (err) {
        setError("Không thể tải danh sách khóa học.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Đang tải...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.courseList}>
      {courses.map((course) => (
        <Course
          key={course.courseId}
          id={course.courseId}
          title={course.title}
          description={course.description}
          image={`http://localhost:5000${course.imageUrl}`}
          price={course.price}
        />
      ))}
    </div>
  );
}

export default CourseList;