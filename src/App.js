import React, { useState, useEffect } from "react";

// 這是你的後端網址
const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [activeTab, setActiveTab] = useState("plan"); // plan, expense
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("檢查中...");

  // 模擬行程資料 (之後會從後端抓)
  const [itinerary, setItinerary] = useState([
    {
      day: 1,
      date: "2024-04-01",
      activities: [
        { time: "10:00", title: "抵達東京成田機場", type: "transport" },
        { time: "18:00", title: "新宿晚餐", type: "food" },
      ],
    },
    {
      day: 2,
      date: "2024-04-02",
      activities: [{ time: "09:00", title: "迪士尼樂園", type: "fun" }],
    },
  ]);

  // 檢查後端連線
  useEffect(() => {
    fetch(`${BACKEND_URL}/`)
      .then((res) => res.text())
      .then((data) => setServerStatus("🟢 後端連線正常"))
      .catch((err) => setServerStatus("🔴 無法連線到後端"));
  }, []);

  const handleFileUpload = () => {
    setLoading(true);
    // 模擬上傳等待
    setTimeout(() => {
      setLoading(false);
      alert("圖片上傳功能即將開放！目前先顯示範例行程。");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      {/* 頂部導覽列 */}
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
        {/* 分頁按鈕 */}
        <div className="flex space-x-4 mb-6 border-b">
          <button
            onClick={() => setActiveTab("plan")}
            className={`pb-2 px-4 transition-colors ${
              activeTab === "plan"
                ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            行程規劃
          </button>
          <button
            onClick={() => setActiveTab("expense")}
            className={`pb-2 px-4 transition-colors ${
              activeTab === "expense"
                ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            旅費記帳
          </button>
        </div>

        {/* --- 行程規劃區塊 --- */}
        {activeTab === "plan" && (
          <div className="space-y-6">
            {/* 上傳卡片 */}
            <div className="p-8 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 text-center transition hover:bg-blue-100 cursor-pointer">
              <div className="text-4xl mb-3">📄</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                上傳行程單據 / 機票 / 訂房截圖
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                支援 AI 自動辨識，一鍵生成行程表
              </p>
              <button
                onClick={handleFileUpload}
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold shadow hover:bg-blue-700 transition"
              >
                {loading ? "AI 正在分析中..." : "選擇圖片上傳"}
              </button>
            </div>

            {/* 行程列表 */}
            <div className="grid gap-4">
              {itinerary.map((day) => (
                <div
                  key={day.day}
                  className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500 hover:shadow-md transition"
                >
                  <h3 className="font-bold text-lg mb-3 flex justify-between">
                    <span>Day {day.day}</span>
                    <span className="text-gray-400 font-normal text-sm">
                      {day.date}
                    </span>
                  </h3>
                  <ul className="space-y-3">
                    {day.activities.map((act, idx) => (
                      <li
                        key={idx}
                        className="flex items-center text-gray-700 bg-gray-50 p-2 rounded"
                      >
                        <span className="w-16 font-mono text-sm font-semibold text-blue-500">
                          {act.time}
                        </span>
                        <span>{act.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 記帳區塊 (靜態範例) --- */}
        {activeTab === "expense" && (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500 py-12">
            <div className="text-5xl mb-4">💰</div>
            <p>記帳功能開發中... (Phase 1 預覽)</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
