import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    axiosClient.get(`/courses/${id}`).then(res => setCourse(res.data));
  }, [id]);

  if (!course) return <p>Đang tải...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p>{course.description}</p>
      <p className="font-bold">{course.price} VND</p>
    </div>
  );
}

export default CourseDetail;