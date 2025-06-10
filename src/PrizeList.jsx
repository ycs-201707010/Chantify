import { useState, useEffect } from "react";
import Header from "./components/Header";

export default function PrizeList() {
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 경품 목록 불러오기
  useEffect(() => {
    const fetchPrizes = async () => {
      try {
        const res = await fetch("/checksum/get_prizes.jsp");
        const data = await res.json();

        if (data.success) {
          setPrizes(data.prizes);
        } else {
          console.error("불러오기 실패:", data.error);
        }
      } catch (err) {
        console.error("서버 오류:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrizes();
  }, []);

  if (loading) {
    return <div className="text-center text-zinc-500">불러오는 중...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-white">
        🎁 응모 가능한 경품
      </h2>

      {prizes.length === 0 ? (
        <div className="text-center text-zinc-500">
          현재 응모 가능한 상품이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {prizes.map((prize) => (
            <div
              key={prize.prize_id}
              className="bg-white dark:bg-zinc-800 shadow rounded p-4 flex flex-col"
            >
              <img
                src={prize.image_url}
                alt={prize.title}
                className="w-full h-48 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                {prize.title}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-300 mt-1">
                필요 포인트:{" "}
                <span className="font-bold">{prize.cost_point}P</span>
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-300">
                마감일: {new Date(prize.deadline).toLocaleString()}
              </p>

              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded mt-4"
                onClick={() => alert("응모 로직은 추후 구현")}
              >
                응모하기
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
