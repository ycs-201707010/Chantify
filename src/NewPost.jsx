import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useAuth } from "./contexts/AuthContext";

export default function NewPost() {
  const editorRef = useRef();
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  // 일반 사용자는 공지사항 게시판에 작성할 수 없게 구분하는 용도
  const { userId } = useAuth();

  // 페이지 이동
  const navigate = useNavigate();

  // 이미지가 업로드 되는 로직
  const handleImageUpload = async (blob, callback) => {
    const formData = new FormData();
    formData.append("image", blob); // blob은 업로드된 이미지 파일

    try {
      const res = await fetch("/checksum/upload_editor_image.jsp", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        // 서버에서 반환한 실제 이미지 URL을 에디터에 삽입
        callback(result.url, "이미지 설명");
      } else {
        alert("이미지 업로드 실패: " + result.error);
      }
    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      alert("서버 오류로 이미지 업로드 실패");
    }
  };

  // const handleImageUpload = async (blob, callback) => {
  //   const formData = new FormData();
  //   formData.append("image", blob);

  //   try {
  //     const res = await fetch("/checksum/upload_temp_image.jsp", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const result = await res.json();
  //     if (result.success) {
  //       callback(result.url, "이미지 설명"); // 임시 이미지 URL 삽입
  //     } else {
  //       alert("이미지 업로드 실패: " + result.error);
  //     }
  //   } catch (err) {
  //     console.error("임시 이미지 업로드 오류:", err);
  //     alert("서버 오류로 이미지 업로드 실패");
  //   }
  // };

  // 글쓰기 확정 시
  const handleSubmit = async () => {
    console.log(selectedBoard);
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

    // // 1. 에디터 내용에서 이미지 src 추출
    // const tempImageUrls = Array.from(
    //   content.matchAll(/<img[^>]+src="([^">]+\/temp\/[^">]+)"/g)
    // ).map((match) => match[1]);

    // let updatedContent = content;
    // try {
    //   const res = await fetch("/checksum/finalize_images.jsp", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ tempImageUrls }),
    //   });

    //   const result = await res.json();
    //   if (result.success) {
    //     // 서버가 이동된 경로로 매핑을 반환했다고 가정
    //     for (const [tempUrl, newUrl] of Object.entries(result.mapping)) {
    //       updatedContent = updatedContent.replaceAll(tempUrl, newUrl);
    //     }
    //   } else {
    //     setError("이미지 정리 중 오류 발생");
    //     return;
    //   }
    // } catch (err) {
    //   console.error("이미지 정리 실패:", err);
    //   setError("이미지 정리 중 서버 오류");
    //   return;
    // }

    // 3. 글쓰기 요청 (이미지 경로가 정리된 content 사용)
    try {
      const res = await fetch("/checksum/write_post.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          board_id: Number(selectedBoard),
          title,
          content,
          user_id: userId,
        }),
      });

      const result = await res.json();
      if (result.success) {
        navigate(`/postview/${result.post_id}`);
      } else {
        setError("글 작성에 실패했습니다.");
      }
    } catch (err) {
      console.error("서버 오류:", err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    // 마운트 후 강제로 HTML 초기화.
    // 글쓰기 화면 진입 시 자꾸 프리뷰 텍스트가 작성되어서 조치를 취했음
    if (editorRef.current) {
      editorRef.current.getInstance().setHTML("");
    }
  }, []);

  useEffect(() => {
    // 게시판 목록 불러오는 메서드
    const fetchBoards = async () => {
      try {
        const res = await fetch("/checksum/get_board_list.jsp");
        const data = await res.json();
        const allowedBoards =
          userId === "root"
            ? data
            : data.filter((board) => board.name !== "공지사항");
        console.log(allowedBoards);
        setBoardList(allowedBoards);
        if (allowedBoards.length > 0) {
          setSelectedBoard(allowedBoards[0].id);
        }
      } catch (err) {
        console.error("게시판 목록을 불러오는 데 실패했습니다", err);
      }

      console.log("날아라 슈퍼보드 : " + selectedBoard);
    };
    fetchBoards();

    /** selectedBoard 번호 사전에 지정하는 로직 추가 필요 */
  }, [userId]);

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white dark:bg-green-900 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">글쓰기</h2>

      {/* 게시판 선택 */}
      <select
        value={selectedBoard}
        onChange={(e) => setSelectedBoard(e.target.value)}
        className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
      >
        {boardList.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
          </option>
        ))}
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
