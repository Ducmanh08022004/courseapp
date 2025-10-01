import { useState } from "react";
import axiosClient from "../api/axiosClient";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post("/auth/register", { name, email, password });
      alert("Đăng ký thành công!");
    } catch (err) {
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
      <h1 className="text-2xl font-bold mb-4">Đăng ký</h1>
      <input type="text" placeholder="Tên" value={name} onChange={(e)=>setName(e.target.value)} className="border p-2 w-full mb-2"/>
      <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} className="border p-2 w-full mb-2"/>
      <input type="password" placeholder="Mật khẩu" value={password} onChange={(e)=>setPassword(e.target.value)} className="border p-2 w-full mb-2"/>
      <button className="bg-blue-600 text-white px-4 py-2">Đăng ký</button>
    </form>
  );
}

export default Register;