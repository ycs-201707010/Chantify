import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import PostCard from "./components/PostCard";
import { useAuth } from "./contexts/AuthContext";

export default function Community() {
  const [boardMap, setBoardMap] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [posts, setPosts] = useState([]);
  const [notices, setNotices] = useState([]);

  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const { isLoggedIn, userId, logout } = useAuth();

  const pageSize = 10;

  // 페이지 이동
  const navigate = useNavigate();

  // JSP를 통해 데이터를 받아오는 구조
  // 게시판 목록을 불러오는 메서드
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/checksum/get_board_list.jsp");
        const data = await res.json();

        // boardMap 생성
        const map = {};
        data.forEach((item) => {
          map[item.name] = item.id;
        });

        setCategories(["전체", ...data.map((d) => d.name)]);
        setBoardMap(map);
      } catch (err) {
        console.error("게시판 목록을 불러오는 데 실패했습니다", err);
      }
    };

    fetchCategories();
  }, []);

  // 글 목록을 불러오는 메서드. (추후 게시판 개별 선택에 맞게 로직 수정)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const boardId = boardMap[selectedCategory];
        const boardQuery =
          selectedCategory === "전체" || !boardId ? "" : `&boardId=${boardId}`;

        const query = `?page=${currentPage}&pageSize=${pageSize}${boardQuery}`;
        const res = await fetch(`/checksum/get_post_list.jsp${query}`);
        const data = await res.json();

        setPosts(data.posts);
        setTotalPages(Math.ceil(data.totalCount / pageSize)); // 페이지네이션 용도
      } catch (err) {
        console.error("게시글을 불러오는 데 실패했습니다", err);
      }
    };

    fetchPosts();
  }, [currentPage, selectedCategory, boardMap]);

  // 불러온 게시판

  // 공지사항을 불러오는 메서드.
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await fetch("/checksum/get_notices.jsp");
        const data = await res.json();
        setNotices(data);
      } catch (err) {
        console.error("공지사항을 불러오는 데 실패했습니다", err);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* 카테고리 필터 버튼 */}
        <div className="flex gap-2 mb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1); // ✅ 페이지 초기화
              }}
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

        {/* 공지사항 */}
        <div className="space-y-2 mb-6">
          {notices.map((notice) => (
            <div
              key={notice.post_id}
              onClick={() => {
                navigate(`/postview/${notice.post_id}`);
              }}
              className="flex justify-between items-center border px-4 py-2 rounded text-red-600 dark:text-red-400"
            >
              <span>
                <strong>공지사항</strong> | {notice.title}
              </span>
              <span className="text-sm text-gray-400">{notice.created_at}</span>
            </div>
          ))}
        </div>

        {/* 일반 게시글 목록 */}
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

        {/* 글쓰기 버튼 
          비로그인 상태에서 누르면 alert로 경고 띄운 후 로그인 창으로 이동
        */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              if (!isLoggedIn) {
                alert("로그인 후 이용해주세요.");
                navigate("/login");
              } else {
                navigate("/newpost");
              }
            }}
            className="px-4 py-2 mt-7 border rounded text-white bg-green-500 hover:bg-green-700"
          >
            글쓰기
          </button>
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
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded"
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}
