import { useEffect, useState, useContext } from "react";
import { SearchContext } from "./SearchContext.jsx";
import axios from "axios";
import Course from "./Course";
import styles from "./styles/CourseList.module.css";

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { searchTerm } = useContext(SearchContext); // lấy search term từ Navbar

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

  // Lọc khóa học dựa trên searchTerm
  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.courseList}>
      {filteredCourses.length > 0 ? (
        filteredCourses.map((course) => (
          <Course
            key={course.courseId}
            id={course.courseId}
            title={course.title}
            description={course.description}
            image={`http://localhost:5000${course.imageUrl}`}
            price={course.price}
          />
        ))
      ) : (
        <p>Không tìm thấy khóa học phù hợp.</p>
      )}
    </div>
  );
}

export default CourseList;