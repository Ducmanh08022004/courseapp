import { useState, useEffect } from "react";
import { useContext } from "react";
import { SearchContext } from "./SearchContext.jsx";
import styles from "./styles/Navbar.module.css";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [username, setUsername] = useState(null); // ✅ lưu trạng thái người dùng
  const [role, setRole] = useState(null); // ✅ lưu vai trò người dùng
  const [inputValue, setInputValue] = useState(""); // input search
  const { setSearchTerm } = useContext(SearchContext); // từ context
  const navigate = useNavigate();

  // 🔍 Khi Navbar được render, kiểm tra token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    const savedRole = localStorage.getItem("role"); // lấy vai trò
    if (token && savedUsername) {
      setUsername(savedUsername);
      setRole(savedRole); // cập nhật vai trò
    } else {
      setUsername(null);
      setRole(null);
    }
  }, []);

  // 🔁 Khi người dùng đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullname");
    localStorage.removeItem("role"); // xóa vai trò
    setUsername(null);
    setRole(null);
    navigate("/");
  };

  // Debounce search 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchTerm]);


  const handleToggleMenu = (menuName) => {
    setOpenMenu((prevMenu) => (prevMenu === menuName ? null : menuName));
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.container}>
        {/* ==== LEFT SECTION ==== */}
        <div className={styles.leftSection}>
          <div className={styles.logo}>
            <Link to="/">
              <img src="/Logo.png" alt="Logo" height="50" />
            </Link>
          </div>
        
          {username ? (
            <div className={styles.courseList}>
              <Link to="/my-courses" className={styles.dropdown} style={{ textDecoration: "none", color: "#e6007e"}}>
                Khóa học của tôi
              </Link>
            </div>
            ) : null
          }

          {role === 'admin' && (
            <div className={styles.courseList}>
              <Link to="/resource-management" className={styles.dropdown} style={{ textDecoration: "none", color: "#e6007e"}}>
                Quản lí tài nguyên
              </Link>
            </div>
          )}

          {/* Search bar */}
          <div className={styles.searchBar}>
            <input
              type="text"
              placeholder="Tìm khóa học"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">
              <IoSearch size={24} />
            </button>
          </div>
        </div>

        {/* ==== RIGHT SECTION ==== */}
        <div className={styles.rightSection}>
          {!username ? (
            // ✅ Nếu chưa đăng nhập
            <>
              <Link to="/LoginPage" className={styles.login}>
                Đăng nhập
              </Link>
              <Link to="/RegisterPage" className={styles.register}>
                Đăng ký
              </Link>
            </>
          ) : (
            // ✅ Nếu đã đăng nhập
            <div className={styles.userMenu}>
              {/* 1. THÊM onClick VÀO ĐÂY */}
              <span
                className={styles.username}
                onClick={() => handleToggleMenu("user")}
              >
                <FaRegUser /> {username} ▾
              </span>

              {/* THÊM ĐIỀU KIỆN RENDER Ở ĐÂY */}
              {openMenu === "user" && (
                // (Và sửa lại cú pháp className)
                <ul className={`${styles.dropdownMenu} ${styles.show}`}>
                  <li>
                    <Link to="/ProfilePage" style={{ textDecoration: "none", color: "#e6007e"}}>Xem thông tin</Link>
                  </li>
                  <li onClick={handleLogout}>Đăng xuất</li>
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
