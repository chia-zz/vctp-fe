import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// 建立 Socket 連線
const socket = io(BACKEND_URL);

function App() {
  const [activeTab, setActiveTab] = useState("plan");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("檢查中...");
  const [tripData, setTripData] = useState(null);

  // --- 聊天室狀態 ---
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    // 檢查 HTTP 連線
    fetch(`${BACKEND_URL}/`)
      .then((res) => res.text())
      .then((data) => setServerStatus("🟢 後端連線正常"))
      .catch((err) => setServerStatus("🔴 無法連線"));

    // 監聽 Socket 訊息
    socket.on("receive_message", (data) => {
      setMessages((list) => [...list, data]);
    });

    // 清理連線
    return () => {
      socket.off("receive_message");
    };
  }, []);

  // 捲動到最新訊息
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch(`${BACKEND_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setTripData(data);
    } catch (err) {
      alert("分析失敗");
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        author: "Me",
        message: currentMessage,
        time: new Date().toLocaleTimeString().slice(0, 5),
      };

      // 送出訊息給伺服器
      await socket.emit("send_message", messageData);

      // 把自己的訊息加到列表
      setMessages((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            ✈️ Travel Planner AI
          </h1>
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-500">
            {serverStatus}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("plan")}
            className={`pb-2 px-4 ${
              activeTab === "plan"
                ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                : "text-gray-500"
            }`}
          >
            行程規劃
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={`pb-2 px-4 ${
              activeTab === "chat"
                ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                : "text-gray-500"
            }`}
          >
            多人討論區 💬
          </button>
        </div>

        {activeTab === "plan" && (
          <div className="space-y-6">
            <div className="p-8 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 text-center relative hover:bg-blue-100 transition">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-4xl mb-3">{loading ? "🤖" : "📸"}</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {loading ? "AI 分析中..." : "上傳單據"}
              </h3>
            </div>
            {tripData && (
              <div className="bg-white p-4 rounded shadow animate-fade-in">
                <h2 className="font-bold mb-2">生成行程：</h2>
                {tripData.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="mb-2 p-2 bg-gray-50 rounded border-l-4 border-blue-400"
                  >
                    <span className="font-bold text-blue-600">
                      Day {day.day}:
                    </span>{" "}
                    {day.activities.map((a) => a.title).join(" ➔ ")}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* --- Phase 2: Chat Room --- */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[500px] flex flex-col">
            <div className="bg-blue-600 p-4 text-white font-bold">
              Trip Chat Room (Live)
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 mt-10">
                  還沒有訊息，打個招呼吧！👋
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.author === "Me" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.author === "Me"
                        ? "bg-blue-500 text-white"
                        : "bg-white border text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-xs text-gray-400 mt-1">{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t flex gap-2">
              <input
                type="text"
                value={currentMessage}
                onChange={(event) => setCurrentMessage(event.target.value)}
                onKeyPress={(event) => event.key === "Enter" && sendMessage()}
                placeholder="輸入訊息..."
                className="flex-1 border p-2 rounded-full px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700"
              >
                ➤
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
