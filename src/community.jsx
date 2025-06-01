import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import PostCard from "./components/PostCard";

const categories = ["전체", "공지사항", "자유게시판", "유머게시판"];

export default function Community() {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [posts, setPosts] = useState([]);

  // 페이지 이동
  const navigate = useNavigate();

  // JSP를 통해 데이터를 받아오는 구조
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/checksum/community.jsp");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("게시글을 불러오는 데 실패했습니다", err);
      }
    };

    fetchPosts();
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
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1 rounded border ${
                selectedCategory === cat
                  ? "bg-black text-white dark:bg-white dark:text-black hover:bg-gray-600"
                  : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 "
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
                nickname={post.username}
                createdAt={post.created_at}
                views={post.views}
                comments={post.comments}
                likes={post.upvotes}
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
              navigate("/newpost");
            }}
            className="px-4 py-2 mt-7 border rounded text-white bg-green-500 hover:bg-green-700"
          >
            글쓰기
          </button>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-8 space-x-2">
          {posts.length === 0 ? (
            <></>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.post_id}
                postId={post.post_id}
                title={post.title}
                thumbnail={post.thumbnail || null}
                boardName={post.board_name}
                nickname={post.username}
                createdAt={post.created_at}
                views={post.views}
                comments={post.comments}
                likes={post.upvotes}
              />
            ))
          )}
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
