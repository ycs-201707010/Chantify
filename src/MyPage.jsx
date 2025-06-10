import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Header from "./components/Header";
import PostCard from "./components/PostCard";
// import CommunityActivityHeatmap from "./components/CommunityActivityHeatmap";
import MemberProfile from "./components/MemberProfile";
import { useDarkMode } from "./contexts/DarkModeContext";

const categories = ["커뮤니티 활동", "응모 내역", "환경 설정"];

// const boards = ["전체보기", "자유게시판", "유머게시판"];

export default function MyPage() {
  const { isDark, setIsDark } = useDarkMode();
  const [selectedCategory, setSelectedCategory] = useState("커뮤니티 활동");
  /** 마이페이지 - 게시판에 작성한 글을 불러오기 위한 상태변수 */
  const [boardMap, setBoardMap] = useState({});
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("전체보기");
  const [posts, setPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoggedIn, userId, logout } = useAuth();
  const [point, setPoint] = useState(null);
  const [entries, setEntries] = useState([]);

  // 포인트 불러오기
  useEffect(() => {
    fetch(`/checksum/get_user_point.jsp`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPoint(data.point);
        } else {
          console.error("포인트 불러오기 실패:", data.error);
        }
      })
      .catch((err) => {
        console.error("서버 에러:", err);
      });
  }, []);

  const pageSize = 10;

  // 페이지 이동
  const navigate = useNavigate();

  // 게시판 목록 불러오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await fetch("/checksum/get_board_list.jsp");
        const data = await res.json();

        // boardMap 생성
        const map = {};
        data.forEach((item) => {
          map[item.name] = item.id;
        });

        setBoards(["전체", ...data.map((d) => d.name)]);
        setBoardMap(map);
      } catch (err) {
        console.error("게시판 목록을 불러오는 데 실패했습니다", err);
      }
    };

    fetchBoards();
  }, []);

  // 글 목록을 불러오는 메서드. (추후 게시판 개별 선택에 맞게 로직 수정)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const boardId = boardMap[selectedBoard];
        const boardQuery =
          selectedBoard === "전체보기" || !boardId ? "" : `&boardId=${boardId}`;

        const query = `?page=${currentPage}&pageSize=${pageSize}${boardQuery}&userId=${userId}`;
        const res = await fetch(`/checksum/get_post_list.jsp${query}`);
        const data = await res.json();

        setPosts(data.posts);
        setTotalPages(Math.ceil(data.totalCount / pageSize)); // 페이지네이션 용도
      } catch (err) {
        console.error("게시글을 불러오는 데 실패했습니다", err);
      }
    };

    fetchPosts();
  }, [currentPage, selectedBoard, boardMap]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch("/checksum/get_user_entries.jsp", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setEntries(data.entries); // entries: [{ id, title, point, date, status }]
        } else {
          console.error("응모 내역 불러오기 실패:", data.message);
        }
      } catch (err) {
        console.error("서버 오류:", err);
      }
    };

    fetchEntries();
  }, []);

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
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
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
                {posts.length === 0 ? (
                  <div className="text-center text-gray-400 dark:text-gray-500 border rounded p-6">
                    등록된 게시글이 없습니다.
                  </div>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.post_id}
                      postId={post.post_id}
                      title={post.title}
                      thumbnail={post.thumbnail || null}
                      boardName={post.board_name}
                      nickname={post.nickname}
                      createdAt={post.created_at}
                      views={post.views}
                      comment_count={post.comment_count}
                      votes={post.recommend_count}
                    />
                  ))
                )}
              </div>

              {/* 페이지네이션 */}
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 border rounded"
                >
                  이전
                </button>
                {[...Array(totalPages).keys()].map((i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === i + 1
                        ? "bg-green-600 hover:bg-green-800 text-white dark:border-white"
                        : ""
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="px-3 py-1 border rounded"
                >
                  다음
                </button>
              </div>
            </>
          )}
          {selectedCategory === "응모 내역" && (
            <>
              <div className="flex justify-around">
                <div className="flex flex-col text-center py-3">
                  <span className="text-zinc-600">현재 보유 포인트</span>
                  <span className="text-5xl font-bold">{point}</span>
                </div>

                <ul className="w-2/3 divide-y divide-gray-200 dark:divide-zinc-700">
                  {entries.length === 0 ? (
                    <li className="py-6 text-center text-gray-500 dark:text-gray-400">
                      응모한 경품이 없습니다.
                    </li>
                  ) : (
                    entries.map((entry) => (
                      <li key={entry.id} className="py-3 flex justify-between">
                        <div>
                          <p className="text-sm text-gray-800 dark:text-gray-200 font-semibold">
                            {entry.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(entry.date).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-sm text-right">
                          <p
                            className={`font-bold ${
                              entry.status === "당첨"
                                ? "text-green-600"
                                : entry.status === "미당첨"
                                ? "text-red-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {entry.status}
                          </p>
                          <p className="text-xs text-gray-500">
                            {entry.point}P 사용
                          </p>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </>
          )}
          {selectedCategory === "환경 설정" && (
            <div className="p-4 dark:text-white dark:bg-zinc-800">
              {/* <h2 className="text-xl font-bold mb-4">설정</h2> */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDark}
                  onChange={(e) => setIsDark(e.target.checked)}
                />
                다크 모드
              </label>
              <button
                onClick={() => navigate("/changepassword?from=mypage")}
                className="w-[60%] mt-6 text-green-600 hover:text-white hover:bg-green-700 border border-green-600 dark:hover:bg-green-700 dark:hover:border-white transition"
              >
                비밀번호 변경
              </button>

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="w-[60%] mt-6 text-red-600 hover:text-white hover:bg-red-700 border border-red-600 dark:hover:bg-red-700 dark:hover:border-white transition"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
