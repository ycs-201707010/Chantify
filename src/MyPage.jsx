import { useState } from "react";
import Header from "./components/Header";
import PostCard from "./components/PostCard";
// import CommunityActivityHeatmap from "./components/CommunityActivityHeatmap";
import MemberProfile from "./components/MemberProfile";

const categories = ["커뮤니티 활동", "배팅 내역", "환경 설정"];

const boards = ["전체보기", "자유게시판", "유머게시판"];

export default function MyPage() {
  const [selectedCategory, setSelectedCategory] = useState("커뮤니티 활동");
  const [selected, setSelected] = useState("전체보기");

  const dummyPoints = 25400;

  const dummyBets = [
    {
      id: 1,
      match: "첼시 vs 맨시티",
      prediction: "첼시 승",
      result: "적중",
      point: 300,
      date: "2025.06.01",
    },
    {
      id: 2,
      match: "리버풀 vs 아스날",
      prediction: "무승부",
      result: "실패",
      point: -200,
      date: "2025.05.30",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <Header></Header>

      <main className="max-w-5xl mx-auto px-4">
        {/* 사용자 프로필 */}
        <MemberProfile></MemberProfile>

        {/* 카테고리 필터 버튼 */}
        <div className="flex gap-2 mt-5 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded border ${
                selectedCategory === cat
                  ? "bg-green-600 text-white dark:bg-white dark:text-black hover:bg-green-800"
                  : "bg-white text-gray-700 dark:bg-zinc-800  dark:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 선택된 카테고리에 따라 다른 내용 출력 */}
        <div className="max-w-[975px] bg-white dark:bg-zinc-800 rounded-lg shadow p-4">
          {selectedCategory === "커뮤니티 활동" && (
            <>
              {/* <p className="text-gray-700 dark:text-gray-200 mb-4">
                최근 1년간의 게시글 및 댓글 활동
              </p> */}
              {/*<CommunityActivityHeatmap />*/}

              {/* 게시판 선택 */}
              <select
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded shadow-sm text-sm dark:bg-zinc-800 dark:text-white dark:border-zinc-700 mb-3"
              >
                {boards.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {/* 게시글 목록 */}
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <PostCard
                    key={i}
                    postId={i}
                    title={`글 제목 ${i}`}
                    thumbnail={null}
                    boardName="자유게시판"
                    nickname="김은별"
                    createdAt="2025.06.01"
                    views={123 + i}
                    comments={3 + i}
                    likes={i}
                  />
                ))}
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center mt-8 space-x-2">
                <button className="px-3 py-1 border rounded">이전</button>
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    className={`px-3 py-1 border rounded ${
                      num === 1
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : ""
                    }`}
                  >
                    {num}
                  </button>
                ))}
                <button className="px-3 py-1 border rounded">다음</button>
              </div>
            </>
          )}
          {selectedCategory === "배팅 내역" && (
            <>
              <div className="flex justify-around">
                <div className="flex flex-col text-center py-3">
                  <span className="text-zinc-600">현재 보유 포인트</span>
                  <span className="text-5xl font-bold">{dummyPoints}</span>
                </div>

                <ul className="w-2/3 divide-y divide-gray-200 dark:divide-zinc-700">
                  {dummyBets.map((bet) => (
                    <li key={bet.id} className="py-3 flex justify-between">
                      <div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">
                          {bet.match} -{" "}
                          <span className="text-blue-500">
                            {bet.prediction}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {bet.date}
                        </p>
                      </div>
                      <div className="text-sm text-right">
                        <p
                          className={`font-bold ${
                            bet.result === "적중"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {bet.result}
                        </p>
                        <p className="text-xs text-gray-500">{bet.point}P</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {selectedCategory === "환경 설정" && (
            <p className="text-gray-700 dark:text-gray-200">
              환경 설정 메뉴를 표시합니다.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
