import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="font-bold text-lg">CourseApp</div>
      <div className="space-x-4">
        <Link to="/">Trang chủ</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/notifications">Thông báo</Link>
        <Link to="/login">Đăng nhập</Link>
      </div>
    </nav>
  );
}

export default Navbar;