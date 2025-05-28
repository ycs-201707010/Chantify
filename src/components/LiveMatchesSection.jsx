import { useEffect, useState, useRef } from "react";

// 예시용 더미 데이터 (API 연결 전)
const dummyMatches = [
  {
    id: 1,
    league: "프리미어리그",
    homeTeam: "노팅엄",
    awayTeam: "첼시",
    homeScore: 0,
    awayScore: 1,
    homeLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    awayLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    inning: "전반",
    isLive: true,
  },
  {
    id: 2,
    league: "챔피언스리그",
    homeTeam: "바르셀로나",
    awayTeam: "도르트문트",
    homeScore: 2,
    awayScore: 2,
    homeLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    awayLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    inning: "후반",
    isLive: true,
  },
  {
    id: 3,
    league: "라리가",
    homeTeam: "베티스",
    awayTeam: "아틀레티코",
    homeScore: 1,
    awayScore: 2,
    homeLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    awayLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    inning: "후반",
    isLive: true,
  },
  {
    id: 4,
    league: "라리가",
    homeTeam: "베티스",
    awayTeam: "아틀레티코",
    homeScore: 1,
    awayScore: 2,
    homeLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    awayLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    inning: "후반",
    isLive: true,
  },
  {
    id: 5,
    league: "라리가",
    homeTeam: "베티스",
    awayTeam: "아틀레티코",
    homeScore: 1,
    awayScore: 2,
    homeLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    awayLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    inning: "후반",
    isLive: true,
  },
  {
    id: 6,
    league: "라리가",
    homeTeam: "베티스",
    awayTeam: "아틀레티코",
    homeScore: 1,
    awayScore: 2,
    homeLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    awayLogo: "https://www.dummyimage.com/48x48/000000/ffffff.png&text=Logo",
    inning: "후반",
    isLive: true,
  },
];

// 실제 서버 연동 시 사용하는 fetch 메서드 (예시용 비동기 더미)
async function fetchLiveMatches() {
  try {
    // const response = await fetch("/api/live-matches.jsp");
    // const data = await response.json();
    // return data;
    return new Promise((resolve) => {
      setTimeout(() => resolve(dummyMatches.filter((m) => m.isLive)), 300);
    });
  } catch (error) {
    console.error("실시간 경기 데이터를 불러오는 데 실패했습니다.", error);
    return [];
  }
}

export default function LiveMatchesSection() {
  const [matches, setMatches] = useState([]);
  const scrollRef = useRef();

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const showButtons = matches.length >= 5;

  useEffect(() => {
    fetchLiveMatches().then((liveOnly) => setMatches(liveOnly));
  }, []);

  if (!matches.length) return null; // 실시간 경기 없을 경우 미표시

  return (
    <section className="relative bg-gray-100 dark:bg-zinc-800 p-4 rounded-lg shadow mb-6">
      {showButtons && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-700 shadow rounded-full w-8 h-8 flex items-center justify-center z-10"
        >
          ‹
        </button>
      )}

      <div
        className="flex gap-4 overflow-x-hidden scrollbar-hide px-9 touch-pan-x scroll-smooth"
        ref={scrollRef}
      >
        {matches.map((match) => (
          <div
            key={match.id}
            className="min-w-[300px] flex flex-col bg-white dark:bg-zinc-800 p-3 rounded-lg"
          >
            <div className="text-center text-[12px] mb-2">{match.league}</div>
            <div className="flex justify-around mb-4">
              <div className="w-[86px] flex flex-col items-center justify-start text-[13px] font-bold ml-3 pt-4">
                <img src={match.homeLogo} />
                {match.homeTeam}
              </div>
              <div className="flex items-center justify-center mx-4">
                <span className="text-lg font-bold">{match.homeScore}</span>
                <div className="flex flex-col justify-start items-center mx-3">
                  {match.isLive ? (
                    <>
                      <div className="text-white bg-red-600 rounded px-1 font-bold text-xs mb-1">
                        LIVE
                      </div>
                      <div className="text-black dark:text-white font-semibold">
                        {match.inning}
                      </div>
                    </>
                  ) : (
                    <>
                      <span>종료</span>
                    </>
                  )}
                </div>
                <span className="text-lg font-bold">{match.awayScore}</span>
              </div>
              <div className="w-[86px] flex flex-col items-center justify-start text-[13px] font-bold mr-3 pt-4">
                <img src={match.awayLogo} />
                {match.awayTeam}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showButtons && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-zinc-700 shadow rounded-full w-8 h-8 flex items-center justify-center z-10"
        >
          ›
        </button>
      )}
    </section>
  );
}
