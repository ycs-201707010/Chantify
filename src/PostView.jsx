import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";

import PostComment from "./components/PostComment";

export default function PostView() {
  console.log("🔥 컴포넌트 렌더링됨");

  const { postId } = useParams("postId");
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  // 페이지 이동
  const navigate = useNavigate();

  console.log("postId:", postId);
  console.log("📦 postId의 타입:", typeof postId); // ← 이거 꼭 찍어봐

  useEffect(() => {
    console.log("📌 첫 번째 useEffect 실행됨");
  }, []);

  // 게시글 불러오기
  useEffect(() => {
    console.log("📌 두 번째 useEffect 실행됨, postId:", postId);

    if (!postId) {
      setError("postId가 존재하지 않습니다.");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/checksum/get_post.jsp?postId=${postId}`);
        const data = await res.json();
        console.log("✅ fetch 결과:", data);

        if (data.success) {
          console.log("✅ PostView 컴포넌트 성공");
          setPost(data.post);
        } else {
          console.error(data.error);
          setError(data.error || "글을 불러올 수 없습니다.");
        }
      } catch (err) {
        setError("서버 오류가 발생했습니다.");
        console.error(err);
      }
    };

    fetchPost();

    console.log(post);
  }, [postId]);

  // const sanitizedContent = DOMPurify.sanitize(post.content);
  // console.log("Sanitized:", sanitizedContent);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!post) return <div className="p-4">로딩 중...</div>;

  // 그리고 나중에 여기만 추가
  try {
    const sanitizedContent = DOMPurify.sanitize(post?.content || "");
  } catch (e) {
    console.error("post.content 렌더링 중 에러", e);
  }

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <Header></Header>

      <main className="max-w-5xl mx-auto mt-11 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow mb-6">
        {/* 글 작성 정보 (제목, 작성자, 작성일 등) */}
        <div className="flex justify-between px-2 pt-2 pb-5 border-b">
          <div className="w-[100%]">
            <p className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {post.title}
            </p>

            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
              <p>
                {post.username} | {post.created_at} | {post.board_name}
              </p>
              <p className="">
                조회 {post.views} | 추천 {/*post.recommend_count*/} |{" "}
                <a href="" className="text-gray-500 dark:text-gray-400">
                  {/* 댓글 {post.comment_count} */}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* 글 본문 */}
        <div
          className="px-3 py-5 editor-content"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        ></div>

        {/* 개추/비추 영역 (선택) */}
        <div className="w-[100%] flex flex-col items-center justify-center mt-6">
          <div className="flex mb-3">
            <div className="flex gap-4 items-center mr-2">
              <p>0</p>
              <button className="px-4 py-3 border-[2px] border-blue-600 rounded-md">
                추천
              </button>
            </div>
            <div className="flex gap-4 items-center ml-2">
              <button className="px-4 py-3 border-[2px] border-red-600 rounded-md">
                비추
              </button>
              <p>0</p>
            </div>
          </div>

          <div>
            <button className="px-2 py-1 border-[2px] border-gray-700 rounded-md mr-2">
              URL 복사
            </button>
            <button className="px-2 py-1 border-[2px] border-gray-700 rounded-md">
              신고
            </button>
          </div>
        </div>

        {/** 프로필 */}

        {/** 댓글 창 */}
        <PostComment postId={postId} />
      </main>
    </div>
  );
}
