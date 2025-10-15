import React, { useState } from "react";

const API_BASE = "http://localhost:5000/api";

const routes = [
  "auth",
  "courses",
  "exams",
  "notifications",
  "orders",
  "payment",
  "progress",
  "questions",
  "userExam",
  "videos"
];

function App() {
  const [route, setRoute] = useState("auth");
  const [method, setMethod] = useState("GET");
  const [path, setPath] = useState("");
  const [body, setBody] = useState("{}");
  const [response, setResponse] = useState("");
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const sendRequest = async () => {
    try {
      const url = `${API_BASE}/${route}${path}`;
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
      };

      if (method !== "GET" && method !== "DELETE") {
        options.body = body;
      }

      const res = await fetch(url, options);
      const data = await res.json();

      // Nếu đang login và có token → lưu vào localStorage
      if (route === "auth" && path === "/login" && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
      }

      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Error: " + err.message);
    }
  };

  const uploadVideo = async () => {
    if (!file) {
      alert("Chọn video trước đã!");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("file", file); // ✅ đúng với upload.single('file')
      formData.append("title", "My Test Video");
      formData.append("duration", "120");
      formData.append("courseId", "1");

      const res = await fetch(`${API_BASE}/videos`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"), // ✅ dùng token đã lưu
        },
        body: formData,
      });

      const data = await res.json();
      setResponse(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponse("Upload error: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>API Tester</h2>

      {/* Hiển thị token hiện tại */}
      <div style={{ marginBottom: "15px", padding: "10px", border: "1px solid #ccc" }}>
        <strong>Current Token:</strong>
        <pre style={{ background: "#f9f9f9", padding: "5px" }}>
          {token || "Chưa có token, hãy login trước"}
        </pre>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "15px" }}>
        <h3>Gửi Request API</h3>
        <div>
          <label>Route: </label>
          <select value={route} onChange={(e) => setRoute(e.target.value)}>
            {routes.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Method: </label>
          <select value={method} onChange={(e) => setMethod(e.target.value)}>
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        </div>

        <div>
          <label>Path: </label>
          <input
            type="text"
            placeholder="/login or /1"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </div>

        <div>
          <label>Body (JSON): </label>
          <textarea
            rows="5"
            cols="50"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>

        <button onClick={sendRequest} style={{ marginTop: "10px" }}>
          Send
        </button>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h3>Upload Video</h3>
        <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={uploadVideo} style={{ marginLeft: "10px" }}>
          Upload
        </button>
      </div>

      <h3>Response:</h3>
      <pre style={{ background: "#f0f0f0", padding: "10px" }}>{response}</pre>
    </div>
  );
}

export default App;
