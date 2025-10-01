import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import CourseCard from "../components/CourseCard";

function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axiosClient.get("/courses").then(res => setCourses(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Danh sách khóa học</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {courses.map(c => (
          <CourseCard key={c.id} course={c} />
        ))}
      </div>
    </div>
  );
}

export default Home;