import { useEffect, useState } from "react";

export default function PointRanking() {
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    fetch("/checksum/get_point_ranking.jsp")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRanking(data.ranking);
        else console.error("❌ 포인트 랭킹 조회 실패:", data.error);
      });
  }, []);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
        🏆 포인트 랭킹 TOP 5
      </h2>
      <ol className="space-y-2">
        {ranking.map((user, index) => (
          <li
            key={user.username}
            className="flex justify-between items-center text-gray-700 dark:text-gray-200"
          >
            <span>
              <span className="font-semibold mr-2">#{index + 1}</span>
              {user.username}
            </span>
            <span className="text-sm">{user.total_point} pt</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
