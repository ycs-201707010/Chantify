import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [reportSummary, setReportSummary] = useState([]);
  const [entrySummary, setEntrySummary] = useState([]);
  const navigate = useNavigate();

  //   useEffect(() => {
  //     // 신고 요약
  //     fetch("/admin/api/get_report_summary.jsp")
  //       .then((res) => res.json())
  //       .then((data) => setReportSummary(data.reports));

  //     // 경품 응모 요약
  //     fetch("/admin/api/get_entry_summary.jsp")
  //       .then((res) => res.json())
  //       .then((data) => setEntrySummary(data.entries));
  //   }, []);

  return (
    <div className="p-6 space-y-6 text-white">
      <h1 className="text-2xl font-bold">📊 관리자 대시보드</h1>

      {/* 신고 내역 요약 */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">📌 신고 내역</h2>
          <button
            className="text-sm text-blue-400 hover:underline"
            onClick={() => navigate("/admin/reports")}
          >
            신고 관리로 이동 →
          </button>
        </div>
        {reportSummary.length === 0 ? (
          <p className="text-gray-400 text-sm">최근 신고 내역이 없습니다.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {reportSummary.slice(0, 5).map((report, i) => (
              <li key={i} className="border-b border-gray-600 pb-2">
                <strong>{report.reporter}</strong>님이{" "}
                <strong>‘{report.post_title}’</strong>를 신고함
                <span className="text-gray-400 ml-2">({report.reason})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 경품 응모 요약 */}
      <div className="bg-gray-800 rounded-2xl p-4 shadow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold">🎁 경품 응모 내역</h2>
          <button
            className="text-sm text-blue-400 hover:underline"
            onClick={() => navigate("/admin/prizes")}
          >
            경품 관리로 이동 →
          </button>
        </div>
        {entrySummary.length === 0 ? (
          <p className="text-gray-400 text-sm">최근 응모 내역이 없습니다.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {entrySummary.slice(0, 5).map((entry, i) => (
              <li key={i} className="border-b border-gray-600 pb-2">
                <strong>{entry.username}</strong>님이{" "}
                <strong>{entry.prize_title}</strong>에 응모함
                <span className="text-gray-400 ml-2">({entry.created_at})</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
