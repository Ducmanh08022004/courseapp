import { useState } from "react"
import axios from "axios"
import styles from "./styles/Login.module.css"
import { Link, useNavigate } from "react-router-dom"

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();
    
    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
            
            // ✅ Giả sử backend trả về token
            const token = res.data.token;

            // ✅ Lưu token và thông tin user vào localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("username", username);
            localStorage.setItem("userId", res.data.userId); // Lưu userId nếu cần
            localStorage.setItem("fullname", res.data.fullname);
            localStorage.setItem("role", res.data.user.role); 


            alert("Đăng nhập thành công!");

            navigate("/");
        } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            alert(err.response.data.msg); // Hiện lý do lỗi từ backend
        } else {
            alert("Đăng nhập thất bại!"); // Không rõ lỗi
        }
        }
    };

    return (
        <div className={styles.auth}>
            <h2 className={styles.title}>Đăng nhập</h2>
            <form>
                <div>
                    <label htmlFor="username" className={styles.label}>Tên tài khoản:</label>
                    <input type="text" id="username" className={styles.input} name="username" placeholder="Nhập tên tài khoản" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password" className={styles.label}>Mật khẩu:</label>
                    <input type="password" id="password" className={styles.input} name="password" placeholder="Nhập mật khẩu" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div className={styles.buttonRow}>
                    <Link to="/RegisterPage" className={styles.subLink}>Đăng kí</Link>
                    <button type="button" className={styles.btn} onClick={handleLogin}>Đăng nhập</button> 
                </div>
            </form>
        </div>
    )
}

export default Login