import { useState, useEffect, useContext } from "react";
import styles from "./styles/Navbar.module.css";
import { IoSearch } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { SearchContext } from "./SearchContext"; // Context để share searchTerm

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [username, setUsername] = useState(null);
  const [inputValue, setInputValue] = useState(""); // input search
  const { setSearchTerm } = useContext(SearchContext); // từ context
  const navigate = useNavigate();

  // Khi Navbar được render, kiểm tra token trong localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUsername = localStorage.getItem("username");
    if (token && savedUsername) {
      setUsername(savedUsername);
    } else {
      setUsername(null);
    }
  }, []);

  // Debounce search 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 300);

    return () => clearTimeout(handler);
  }, [inputValue, setSearchTerm]);

  // Khi người dùng đăng xuất
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

          {username ? (
            <div className={styles.courseList}>
              <Link
                to="/my-courses"
                className={styles.dropdown}
                style={{ textDecoration: "none", color: "#e6007e" }}
              >
                Khóa học của tôi
              </Link>
            </div>
          ) : null}

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
            <>
              <Link to="/LoginPage" className={styles.login}>
                Đăng nhập
              </Link>
              <Link to="/RegisterPage" className={styles.register}>
                Đăng ký
              </Link>
            </>
          ) : (
            <div className={styles.userMenu}>
              <span
                className={styles.username}
                onClick={() => handleToggleMenu("user")}
              >
                <FaRegUser /> {username} ▾
              </span>

              {openMenu === "user" && (
                <ul className={`${styles.dropdownMenu} ${styles.show}`}>
                  <li>
                    <Link
                      to="/ProfilePage"
                      style={{ textDecoration: "none", color: "#e6007e" }}
                    >
                      Xem thông tin
                    </Link>
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
