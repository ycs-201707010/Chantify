import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";

export default function PrizeList() {
  const [prizes, setPrizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [point, setPoint] = useState(null);
  const { isLoggedIn, userId, logout } = useAuth();

  // 포인트 불러오기
  useEffect(() => {
    fetch(`/checksum/get_user_point.jsp`, {
      credentials: "include", // 이게 중요해!
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPoint(data.point);
        } else {
          console.error("포인트 불러오기 실패:", data.message);
        }
      })
      .catch((err) => {
        console.error("서버 에러:", err);
      });
  }, []);

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

  // 응모 로직
  const handleEntry = async (prize) => {
    const isEnough = point !== null && point >= prize.cost_point; // ✅ 다시 계산

    if (!isEnough) {
      alert("포인트가 부족합니다.");
      return;
    }

    // ✅ 확인 창 추가
    const confirmed = window.confirm(
      `정말 "${prize.title}" 경품에 ${prize.cost_point}포인트를 사용해 응모하시겠습니까?`
    );

    if (!confirmed) {
      return; // 사용자가 취소 눌렀을 경우
    }

    try {
      const res = await fetch("/checksum/enter_prize.jsp", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          prize_id: prize.prize_id,
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert("응모가 완료되었습니다!");
        setPoint((prev) => prev - prize.cost_point);
      } else {
        alert("응모 실패: " + data.message);
      }
    } catch (err) {
      console.error("서버 오류:", err);
      alert("서버 오류로 인해 응모에 실패했습니다.");
    }
  };

  if (loading) {
    return <div className="text-center text-zinc-500">불러오는 중...</div>;
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <Header></Header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-white">
          🎁 응모 가능한 경품
        </h2>
        {point !== null && (
          <p className="text-center text-xl text-zinc-600 dark:text-zinc-300 mb-6">
            현재 보유 포인트: <span className="font-semibold">{point}P</span>
          </p>
        )}

        {prizes.length === 0 ? (
          <div className="text-center text-zinc-500">
            현재 응모 가능한 상품이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {prizes.map((prize) => {
              const isEnough = point !== null && point >= prize.cost_point;

              return (
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
                    className="px-4 py-2 text-white transition bg-green-500 hover:bg-green-700 hover:dark:bg-green-700 rounded mt-4"
                    onClick={() => {
                      handleEntry(prize);
                    }}
                    disabled={!isEnough}
                  >
                    {isEnough ? "응모하기" : "포인트 부족"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
