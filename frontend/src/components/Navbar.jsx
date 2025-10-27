import { useState, useEffect } from "react";
import styles from "./styles/Navbar.module.css";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [username, setUsername] = useState(null); // ✅ lưu trạng thái người dùng
  const navigate = useNavigate();

  // 🔍 Khi Navbar được render, kiểm tra token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setUsername(savedUsername);
    } else {
      setUsername(null);
    }
  }, []);

  // 🔁 Khi người dùng đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("fullname");
    setUsername(null);
    navigate("/");
  };

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
        
          {/* Subjects 
          <div className={styles.courseList}>
            <div
              className={styles.dropdown}
              onClick={() => handleToggleMenu("subjects")}
            >
              <span>Khóa học ▾</span>
              {openMenu === "subjects" && (
                <ul className={`${styles.dropdownMenu} ${styles.show}`}>
                  <li>Tiếng Anh</li>
                  <li>Tiếng Nhật</li>
                  <li>Tiếng Trung</li>
                  <li>Tiếng Hàn</li>
                </ul>
              )}
            </div>
          </div>
            */}
          {username ? (
            <div className={styles.courseList}>
              <Link to="/my-courses" className={styles.dropdown} style={{ textDecoration: "none", color: "#e6007e"}}>
                Khóa học của tôi
              </Link>
            </div>
            ) : null
          }

          <div className={styles.searchBar}>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Tìm khóa học"
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
