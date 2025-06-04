import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

export default function PostView() {
  // 페이지 이동
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <Header></Header>

      <main className="max-w-5xl mx-auto mt-11 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow mb-6">
        {/* 글 작성 정보 (제목, 작성자, 작성일 등) */}
        <div className="flex justify-between px-2 pt-2 pb-5 border-b">
          <div className="w-[100%]">
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              글제목글제목글제목글제목글제목글제목글제목
            </p>

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <p>작성자 | 2025. 06. 04. 13:59:27 | 자유게시판</p>
              <p className="">
                조회 0 | 추천 0 |{" "}
                <a href="" className="text-gray-500 dark:text-gray-400">
                  댓글 0
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 글 본문 */}
        <div className="px-3 py-5">집에 가고 싶다</div>

        {/* 개추/비추 영역 (선택) */}
        <div className="w-[100%] flex justify-center mt-6">
          <div className="flex">
            <div className="flex gap-4 items-center">
              <p>0</p>
              <button className="px-4 py-3 border-[2px] border-blue-600 rounded-md">
                추천
              </button>
            </div>
            <div className="flex gap-4 items-center">
              <button className="px-4 py-3 border-[2px] border-red-600 rounded-md">
                비추
              </button>
              <p>0</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
