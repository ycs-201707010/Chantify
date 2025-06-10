import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { useAuth } from "./contexts/AuthContext";

import PostComment from "./components/PostComment";

export default function PostView() {
  console.log("🔥 컴포넌트 렌더링됨");

  const { postId } = useParams("postId");
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [userVote, setUserVote] = useState({ up: false, down: false });
  const { isLoggedIn, userId } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  // 페이지 이동
  const navigate = useNavigate();

  console.log("postId:", postId);
  console.log("📦 postId의 타입:", typeof postId); // ← 이거 꼭 찍어봐

  // useEffect(() => {
  //   console.log("📌 첫 번째 useEffect 실행됨");
  // }, []);

  useEffect(() => {
    console.log("🧪 showReportModal 상태 변경:", showReportModal);
  }, [showReportModal]);

  // 게시글 불러오기
  useEffect(() => {
    console.log("📌 두 번째 useEffect 실행됨, postId:", postId);

    if (!postId) {
      setError("postId가 존재하지 않습니다.");
      return;
    }

    const fetchPost = async () => {
      try {
        // 조회수 증가 요청
        const res_view = await fetch(
          `/checksum/increase_view.jsp?postId=${postId}`
        );

        // 조회수 증가 요청 종료 수 게시글 조회.
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

  // 개추/비추
  const handleVote = async (type) => {
    if (userVote[type]) {
      alert(`이미 ${type === "up" ? "추천" : "비추천"}하셨습니다.`);
      return;
    }

    try {
      const res = await fetch("/checksum/vote_post.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.post_id,
          username: userId, // 현재 로그인한 사용자
          vote_type: type,
        }),
      });

      const result = await res.json();
      if (result.success) {
        setUserVote((prev) => ({ ...prev, [type]: true }));
        if (type === "up") {
          setPost((prev) => ({ ...prev, upvotes: prev.upvotes + 1 }));
        } else {
          setPost((prev) => ({ ...prev, downvotes: prev.downvotes + 1 }));
        }
      } else {
        alert(result.message || "투표에 실패했습니다.");
      }
    } catch (err) {
      console.error("투표 오류:", err);
    }
  };

  // 신고 창 띄우기
  const handleReportClick = () => {
    if (!isLoggedIn) {
      console.log("게시글 신고하기 :로그인 아닐 시 ");
      alert("로그인 후 이용해주세요.");
      navigate("/login");
      return;
    }
    console.log("게시글 신고하기 :로그인 했을 시");
    setShowReportModal(true);
  };

  // 신고 접수하기
  const handleReportSubmit = async () => {
    if (!reportReason.trim()) {
      alert("신고 사유를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/checksum/report_post.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: post.post_id,
          username: userId,
          reason: reportReason,
        }),
      });

      const result = await res.json();
      if (result.success) {
        alert("신고가 접수되었습니다.");
        setShowReportModal(false);
        setReportReason("");
      } else {
        alert(result.error || "신고 처리 중 문제가 발생했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류로 신고에 실패했습니다.");
    }
  };

  // 게시글 삭제
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 글을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/checksum/delete_post.jsp?postId=${postId}`, {
        method: "POST",
      });
      const result = await res.json();

      if (result.success) {
        alert("글이 성공적으로 삭제되었습니다.");
        navigate("/community");
      } else {
        alert("삭제에 실패했습니다: " + result.error);
      }
    } catch (err) {
      console.error("삭제 중 오류 발생:", err);
      alert("서버 오류로 삭제에 실패했습니다.");
    }
  };

  // URL 복사
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("URL이 복사되었습니다!");
    } catch (err) {
      console.error("URL 복사 실패:", err);
      alert("URL 복사에 실패했습니다.");
    }
  };

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
                조회 {post.views} | 추천 {post.votes} |{" "}
                <a
                  href="#commentList"
                  className="text-gray-500 dark:text-gray-400"
                >
                  댓글 {post.comment_count}
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
              <p>{post.upvotes}</p>
              <button
                onClick={() => handleVote("up")}
                className="px-4 py-3 border-[2px] bg-blue-600 hover:bg-blue-800 border-blue-400 text-white rounded-md"
              >
                추천
              </button>
            </div>
            <div className="flex gap-4 items-center ml-2">
              <button
                onClick={() => handleVote("down")}
                className="px-4 py-3 border-[2px] bg-red-600 hover:bg-red-800 border-red-400 text-white rounded-md"
              >
                비추
              </button>
              <p>{post.downvotes}</p>
            </div>
          </div>

          <div>
            <button
              onClick={handleCopyUrl}
              className="px-2 py-1 border-[2px] border-gray-700 rounded-md mr-2"
            >
              URL 복사
            </button>

            <button
              onClick={handleReportClick}
              className="px-2 py-1 border-[2px] border-gray-700 rounded-md"
            >
              신고
            </button>
          </div>
        </div>

        {/** 수정/삭제/글쓰기 버튼 */}
        <div className="w-[100%] flex justify-end">
          {userId === post.user_id && (
            <div className="flex justify-end gap-2 mt-4 mr-2">
              {/* 수정 버튼 */}
              <button
                onClick={() => navigate(`/editpost/${post.post_id}`)}
                className="px-4 py-2 mt-7 border rounded text-white bg-zinc-500 hover:bg-zinc-700"
              >
                수정
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={handleDelete}
                className="px-4 py-2 mt-7 border rounded text-white bg-zinc-500 hover:bg-zinc-700"
              >
                삭제
              </button>
            </div>
          )}

          <button
            onClick={() => {
              if (!isLoggedIn) {
                alert("로그인 후 이용해주세요.");
                navigate("/login");
              } else {
                navigate("/newpost");
              }
            }}
            className="px-4 py-2 mt-11 border rounded text-white bg-green-500 hover:bg-green-700"
          >
            글쓰기
          </button>
        </div>

        {/** 프로필 */}

        {/** 댓글 창 */}
        <div id="commentList">
          <PostComment postId={postId} />
        </div>
      </main>

      {/* 디버깅용: 조건문 없이 무조건 띄움 */}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-zinc-800 p-6 rounded shadow-md w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              게시글 신고
            </h2>
            <textarea
              className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
              placeholder="신고 사유를 작성해주세요"
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-3 py-1 rounded border dark:text-white"
              >
                취소
              </button>
              <button
                onClick={handleReportSubmit}
                className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-700"
              >
                신고하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
