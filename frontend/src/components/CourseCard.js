import { Link } from "react-router-dom";

function CourseCard({ course }) {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold">{course.title}</h2>
      <p className="text-gray-600">{course.description}</p>
      <p className="font-bold">{course.price} VND</p>
      <Link to={`/courses/${course.id}`} className="text-blue-600">
        Xem chi tiết
      </Link>
    </div>
  );
}

export default CourseCard;