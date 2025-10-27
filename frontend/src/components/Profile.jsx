import React, { useState, useEffect } from "react";
import styles from "./styles/Profile.module.css";
import axios from "axios";

export default function ProfileEdit() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [originalFullname, setOriginalFullname] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [userId, setUserId] = useState(null); 

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:5000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          const userData = res.data;
          setFullname(userData.fullname || ""); 
          setEmail(userData.email || "");
          setOriginalFullname(userData.fullname || "");
          setOriginalEmail(userData.email || "");

          // 💡 Sửa từ `userData.id` thành `userData.userId`
          setUserId(userData.userId);
        })
        .catch((err) => {
          console.error("Lỗi khi lấy thông tin người dùng:", err); 
          alert("Không thể tải thông tin người dùng. Vui lòng kiểm tra lại đường dẫn API trong code và đảm bảo server backend đang chạy.");
        });
    }
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Chưa thể xác định người dùng. Vui lòng tải lại trang.");
      return;
    }

    if (password && password !== confirmPassword) {
      alert("Lỗi: Mật khẩu nhập lại không trùng khớp!");
      return;
    }

    const updatedData = {};
    if (fullname !== originalFullname) {
      updatedData.fullname = fullname;
    }
    if (email !== originalEmail) {
      updatedData.email = email;
    }
    if (password) {
      updatedData.password = password;
    }

    if (Object.keys(updatedData).length === 0) {
      alert("Bạn chưa thay đổi thông tin nào.");
      return;
    }

    axios
      .put(`http://localhost:5000/api/users/${userId}`, updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        alert("Cập nhật thông tin thành công!");
        
        if (updatedData.fullname) {
          localStorage.setItem("username", updatedData.fullname);
        }

        setOriginalFullname(res.data.fullname || "");
        setOriginalEmail(res.data.email || "");
        setPassword("");
        setConfirmPassword("");

        window.location.reload(); 
      })
      .catch((err) => {
        console.error("Lỗi khi cập nhật:", err); 
        alert("Có lỗi xảy ra khi cập nhật. Vui lòng thử lại.");
      });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Chỉnh sửa thông tin</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Họ tên:</label>
          <input
            type="text"
            className={styles.input}
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            placeholder="Nhập tên"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email:</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mật khẩu mới:</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Để trống nếu không muốn đổi"
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nhập lại mật khẩu:</label>
          <input
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Để trống nếu không muốn đổi"
          />
        </div>

        <button type="submit" className={styles.button}>
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
}