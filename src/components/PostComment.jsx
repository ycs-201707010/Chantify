import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function PostComment({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null); // 대댓글용 parent_id
  const [replyContent, setReplyContent] = useState("");
  const { isLoggedIn, userId } = useAuth();

  // 페이지 이동
  const navigate = useNavigate();

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/checksum/get_comments.jsp?postId=${postId}`);
        const data = await res.json();
        if (data.success) setComments(data.comments);
      } catch (err) {
        console.error("댓글 불러오기 실패", err);
      }
    };

    if (postId) fetchComments();
  }, [postId]);

  // 불러온 댓글의 합계 계산
  const countTotalComments = (comments) => {
    let count = 0;
    for (const c of comments) {
      count += 1;
      if (c.children && c.children.length > 0) {
        count += countTotalComments(c.children);
      }
    }
    return count;
  };

  // 댓글 작성하기
  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      console.log("댓글 작성 진입");

      const res = await fetch("/checksum/write_comment.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          content: newComment,
          username: userId,
        }),
      });
      const result = await res.json();

      if (result.success) {
        setNewComment("");
        setComments((prev) => [...prev, result.comment]);
      }
    } catch (err) {
      console.error("댓글 작성 실패", err);
    }
  };

  // 답글 작성하기
  const handleReplySubmit = async (parentId) => {
    if (!replyContent.trim()) return;

    try {
      console.log("답글 작성 진입");

      const res = await fetch("/checksum/write_comment.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: postId,
          parent_id: parentId,
          content: replyContent,
          username: userId,
        }),
      });
      const result = await res.json();

      if (result.success) {
        setReplyTo(null);
        setReplyContent("");
        // 새로고침 없이 구조 반영
        const refresh = async () => {
          const res = await fetch(
            `/checksum/get_comments.jsp?postId=${postId}`
          );
          const data = await res.json();
          if (data.success) setComments(data.comments);
        };
        refresh();
      }
    } catch (err) {
      console.error("답글 작성 실패", err);
    }
  };

  // 불러온 댓글을 렌더링
  const renderComment = (comment, isChild = false) => (
    <li
      key={comment.comment_id}
      className={`rounded p-3 text-sm ${
        isChild
          ? "ml-6 border-l-2 border-gray-300 dark:border-zinc-600"
          : "bg-gray-100 dark:bg-zinc-700"
      }`}
    >
      <p className="text-gray-800 dark:text-white">{comment.content}</p>
      <div className="text-gray-500 text-xs mt-1">
        {comment.username} | {comment.created_at}
      </div>

      <button
        onClick={() => setReplyTo(comment.comment_id)}
        className="text-xs text-blue-500 mt-2"
      >
        답글
      </button>

      {replyTo === comment.comment_id && (
        <div className="mt-2 ml-2 flex gap-2">
          <input
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글 입력"
            className="flex-1 px-2 py-1 border rounded dark:bg-zinc-800 dark:text-white"
          />
          <button
            onClick={() => handleReplySubmit(comment.comment_id)}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            등록
          </button>
        </div>
      )}

      {/* 대댓글 출력 */}
      {comment.children && comment.children.length > 0 && (
        <ul className="mt-3 space-y-2">
          {comment.children.map((child) => renderComment(child, true))}
        </ul>
      )}
    </li>
  );

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        댓글 {countTotalComments(comments)}
      </h3>

      <ul className="space-y-3 mb-6">
        {comments.map((c) => renderComment(c))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="댓글을 입력하세요"
          value={newComment}
          onClick={() => {
            if (!isLoggedIn) {
              alert("로그인 후 이용해주세요.");
              navigate("/login");
            }
          }}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1 px-3 py-2 border rounded dark:bg-zinc-800 dark:text-white"
        />
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          등록
        </button>
      </div>
    </div>
  );
}
