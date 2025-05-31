import React from "react";

// 더미 활동 데이터: 날짜별 게시글 + 댓글 수 (YYYY-MM-DD)
const activityData = {
  "2025-05-31": 2,
  "2025-05-30": 5,
  "2025-05-29": 3,
  "2025-05-28": 1,
  "2025-05-27": 0,
  // ... (최대 최근 1년치 데이터)
};

// 색상 단계 설정
function getColorLevel(count) {
  if (count === 0) return "bg-zinc-800";
  if (count < 2) return "bg-green-200";
  if (count < 4) return "bg-green-400";
  if (count < 6) return "bg-green-600";
  return "bg-green-800";
}

function getMonthLabels(startDate) {
  const labels = [];
  for (let i = 0; i < 53; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i * 7);
    if (d.getDate() <= 7) {
      labels.push({
        week: i,
        month: d.toLocaleString("default", { month: "short" }),
      });
    }
  }
  return labels;
}

export default function CommunityActivityHeatmap() {
  const today = new Date();
  const days = 365;
  const start = new Date();
  start.setDate(today.getDate() - days + 1);

  const grid = Array.from({ length: 7 }, () => []); // 7행 (일~토)

  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().split("T")[0];
    const count = activityData[key] || 0;
    const day = d.getDay(); // 0:일 ~ 6:토
    grid[day].push({ key, count });
  }

  const monthLabels = getMonthLabels(start);

  return (
    <div className="overflow-x-auto">
      <div className="flex text-sm text-gray-500 dark:text-gray-400 ml-10">
        {monthLabels.map(({ week, month }) => (
          <div
            key={week}
            style={{ width: "12px" }}
            className="text-center mr-[3px]"
          >
            {month}
          </div>
        ))}
      </div>
      <div className="flex">
        <div className="flex flex-col justify-between mr-1 text-xs text-gray-500 dark:text-gray-400 h-[88px]">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>
        <div className="flex gap-[3px]">
          {grid[0].map((_, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-[3px]">
              {grid.map((dayCol, dayIdx) => (
                <div
                  key={dayIdx}
                  title={`${dayCol[weekIdx]?.key || ""}: ${
                    dayCol[weekIdx]?.count || 0
                  }회`}
                  className={`w-3.5 h-3.5 rounded-sm ${getColorLevel(
                    dayCol[weekIdx]?.count || 0
                  )}`}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
