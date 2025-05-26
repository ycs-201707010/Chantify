import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "./components/Header";

const categories = ["전체", "공지사항", "자유게시판", "유머게시판"];

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 카테고리 필터 버튼 */}
        <div className="flex gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded border ${
                selectedCategory === cat
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 공지사항 */}
        <div className="space-y-2 mb-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center border px-4 py-2 rounded text-red-600 dark:text-red-400"
            >
              <span>
                <strong>공지사항</strong> | 공지제목
              </span>
              <span className="text-sm text-gray-400">날짜</span>
            </div>
          ))}
        </div>

        {/* 일반 게시글 목록 */}
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex justify-between items-center border px-4 py-3 rounded dark:bg-zinc-800"
            >
              <div className="flex gap-3 items-center">
                <div className="text-center">
                  <button>👍</button>
                  <div className="text-xs">추천수</div>
                </div>
                <div className="w-12 h-12 bg-gray-300 dark:bg-zinc-700 rounded-md" />
                <div>
                  <div className="font-semibold">글 제목</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    게시판 / 닉네임 / 작성시간
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                [댓글수]
              </div>
            </div>
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
      </main>
    </div>
  );
}
