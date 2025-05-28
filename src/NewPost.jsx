import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";

export default function NewPost() {
  const editorRef = useRef();
  const [category, setCategory] = useState("자유");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // 페이지 이동
  const navigate = useNavigate();

  const handleSubmit = () => {
    const content = editorRef.current.getInstance().getHTML();

    if (!title.trim()) {
      setError("제목을 입력해주세요.");
      return;
    }
    if (title.length > 40) {
      setError("제목은 40자 이내로 작성해주세요.");
      return;
    }
    if (content.replace(/<[^>]*>/g, "").length > 2000) {
      setError("내용은 2000자 이내로 작성해주세요.");
      return;
    }

    setError("");
    alert("제출됨! 서버 연동은 나중에");
  };

  const handleImageUpload = async (blob, callback) => {
    const tempUrl = URL.createObjectURL(blob);
    callback(tempUrl, "업로드 이미지");
    // 실제 구현 시 FormData 전송 + 서버에 저장 + 정식 URL 반환 필요
  };

  useEffect(() => {
    // 마운트 후 강제로 HTML 초기화.
    // 글쓰기 화면 진입 시 자꾸 프리뷰 텍스트가 작성되어서 조치를 취했음
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML("");
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">글쓰기</h2>

      {/* 게시판 선택 */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
      >
        <option value="공지">공지</option>
        <option value="자유">자유</option>
        <option value="유머">유머</option>
      </select>

      {/* 제목 입력 */}
      <input
        type="text"
        placeholder="제목을 입력하세요 (최대 40자)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        maxLength={40}
      />

      {/* 에디터 */}
      <Editor
        ref={editorRef}
        initialValue=""
        // previewStyle="vertical"
        height="700px"
        initialEditType="wysiwyg"
        useCommandShortcut={true}
        hooks={{
          addImageBlobHook: handleImageUpload,
        }}
      />

      {error && <p className="text-red-500 mt-3 text-sm">{error}</p>}

      <div className="mt-6 flex justify-end gap-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          등록
        </button>
        <button
          onClick={() => {
            navigate("/community");
          }}
          className="px-4 py-2 border rounded text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          취소
        </button>
      </div>
    </div>
  );
}
