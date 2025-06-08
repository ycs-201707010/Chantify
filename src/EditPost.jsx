import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useAuth } from "./contexts/AuthContext";

export default function EditPost() {
  const { postId } = useParams();
  const { userId } = useAuth();
  const navigate = useNavigate();

  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/checksum/get_post.jsp?postId=${postId}`);
        const data = await res.json();

        if (data.success) {
          const post = data.post;

          if (!post.user_id || post.user_id !== userId) {
            alert("수정 권한이 없습니다.");
            navigate("/community");
            return;
          }

          setTitle(post.title);
          setContent(post.content);

          setTimeout(() => {
            editorRef.current?.getInstance().setHTML(post.content);
          }, 0); // 에디터가 마운트된 이후 실행되도록
        } else {
          setError("글을 불러오는 데 실패했습니다.");
        }
      } catch (err) {
        console.error("글 조회 실패:", err);
        setError("서버 오류 발생");
      }
    };

    fetchPost();
  }, [postId, userId, navigate]);

  const handleSubmit = async () => {
    const updatedContent = editorRef.current.getInstance().getHTML();

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }

    if (title.length > 40) {
      setError("제목은 40자 이내로 작성해주세요.");
      return;
    }

    if (updatedContent.replace(/<[^>]*>/g, "").length > 2000) {
      setError("내용은 2000자 이내로 작성해주세요.");
      return;
    }

    try {
      const res = await fetch("/checksum/update_post.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          post_id: Number(postId),
          title,
          content: updatedContent,
        }),
      });

      const result = await res.json();
      if (result.success) {
        navigate(`/postview/${postId}`);
      } else {
        setError("글 수정에 실패했습니다.");
      }
    } catch (err) {
      console.error("글 수정 실패:", err);
      setError("서버 오류 발생");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">글 수정</h2>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        placeholder="제목"
        maxLength={40}
      />

      <Editor
        ref={editorRef}
        initialValue={content}
        height="700px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
      />

      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          수정 완료
        </button>
        <button
          onClick={() => navigate(`/postview/${postId}`)}
          className="px-4 py-2 border rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          취소
        </button>
      </div>
    </div>
  );
}
