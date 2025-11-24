import React, { useState, useEffect } from "react";

const BACKEND_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function App() {
  const [activeTab, setActiveTab] = useState("plan");
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState("檢查中...");
  const [tripData, setTripData] = useState(null); // 存行程資料

  // 預設顯示空行程，或分析後的行程
  const itinerary = tripData ? tripData.itinerary : [];

  useEffect(() => {
    fetch(`${BACKEND_URL}/`)
      .then((res) => res.text())
      .then((data) => setServerStatus("🟢 後端系統連線正常"))
      .catch((err) => setServerStatus("🔴 無法連線到後端"));
  }, []);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    // 準備上傳資料
    const formData = new FormData();
    formData.append("image", file);

    try {
      // 真的發送請求給後端
      const res = await fetch(`${BACKEND_URL}/api/upload-image`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      // 收到資料，更新畫面
      setTripData(data);
    } catch (err) {
      alert("分析失敗，請檢查後端連線");
    } finally {
      setLoading(false);
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
            onClick={() => setActiveTab("expense")}
            className={`pb-2 px-4 ${
              activeTab === "expense"
                ? "border-b-2 border-blue-500 text-blue-600 font-bold"
                : "text-gray-500"
            }`}
          >
            旅費記帳
          </button>
        </div>

        {activeTab === "plan" && (
          <div className="space-y-6">
            {/* 上傳區塊 */}
            <div className="p-8 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50 text-center relative transition hover:bg-blue-100">
              <input
                type="file"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="text-4xl mb-3">{loading ? "🤖" : "📸"}</div>
              <h3 className="text-lg font-bold text-gray-700 mb-2">
                {loading ? "AI 正在分析您的單據..." : "點擊上傳行程截圖 / 機票"}
              </h3>
              <p className="text-sm text-gray-500">
                {loading
                  ? "正在擷取日期與地點資訊 (約需 2 秒)"
                  : "支援 JPG, PNG 圖片，自動生成行程表"}
              </p>
            </div>

            {/* 結果顯示區塊 */}
            {tripData ? (
              <div className="grid gap-4 animate-fade-in">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-green-800 text-sm flex justify-between">
                  <span>📅 日期: {tripData.dates.join(" ~ ")}</span>
                  <span>📍 地點: {tripData.destinations.join(", ")}</span>
                </div>

                {tripData.itinerary.map((day) => (
                  <div
                    key={day.day}
                    className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-500"
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
            ) : (
              <div className="text-center text-gray-400 py-10">
                尚未有行程，請先上傳圖片試試看！👆
              </div>
            )}
          </div>
        )}

        {activeTab === "expense" && (
          <div className="bg-white p-6 rounded shadow text-center text-gray-500 py-12">
            Phase 2 功能開發中 🚧
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
