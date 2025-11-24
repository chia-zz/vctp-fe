import React, { useState, useEffect } from "react";

// 這裡我們用一個環境變數來抓後端網址
const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [message, setMessage] = useState("連線中...");

  useEffect(() => {
    // 測試連線到後端
    fetch(`${BACKEND_URL}/`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => setMessage("無法連線到後端 😭"));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", textAlign: "center" }}>
      <h1 style={{ color: "#007bff" }}>✈️ Travel Planner AI</h1>
      <div
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          borderRadius: "10px",
          marginTop: "20px",
        }}
      >
        <h3>上傳你的行程單據</h3>
        <p>這是一個 MVP 示範頁面</p>
        <button
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          選擇圖片
        </button>
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "10px",
          background: "#f0f0f0",
          borderRadius: "5px",
        }}
      >
        <strong>後端連線狀態：</strong>
        <span style={{ color: message.includes("Working") ? "green" : "red" }}>
          {message}
        </span>
      </div>
    </div>
  );
}

export default App;
