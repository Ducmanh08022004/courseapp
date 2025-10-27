import { useState } from "react"
import axios from "axios"
import styles from "./styles/Login.module.css"
import { Link } from "react-router-dom"

function Register() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [fullName, setFullName] = useState("")

    const handleRegister = async () => {
        if (password !== confirmPassword) return alert("Mật khẩu không khớp");
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { username, password, fullName, email });
            alert("Đăng ký thành công!");
        } catch (err) {
        if (err.response && err.response.data && err.response.data.msg) {
            alert(err.response.data.msg); // Hiện lý do lỗi từ backend
        } else {
            alert("Đăng ký thất bại"); // Không rõ lỗi
        }
        }
    }

    return (
        <div className={styles.auth}>
            <h2 className={styles.title}>Đăng ký</h2>
            <form>
                <div>
                    <label htmlFor="email" className={styles.label}>Email:</label>
                    <input type="email" id="email" className={styles.input} name="email" placeholder="Nhập email" onChange={e => setEmail(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="fullname" className={styles.label}>Họ tên:</label>
                    <input type="text" id="fullname" className={styles.input} name="fullname" placeholder="Nhập họ tên" onChange={e => setFullName(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="username" className={styles.label}>Tên tài khoản:</label>
                    <input type="text" id="username" className={styles.input} name="username" placeholder="Nhập tên tài khoản" onChange={e => setUsername(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="password" className={styles.label}>Mật khẩu:</label>
                    <input type="password" id="password" className={styles.input} name="password" placeholder="Nhập mật khẩu" onChange={e => setPassword(e.target.value)}/>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className={styles.label}>Nhập lại mật khẩu:</label>
                    <input type="password" id="confirmPassword" className={styles.input} name="confirmPassword" placeholder="Nhập lại mật khẩu" onChange={e => setConfirmPassword(e.target.value)}/>
                </div>
                <div className={styles.buttonRow}>
                    <Link to="/LoginPage" className={styles.subLink}>Đăng nhập</Link>
                    <button type="button" className={styles.btn} onClick={handleRegister}>Đăng ký</button> 
                </div>
            </form>
        </div>
    )
}

export default Register