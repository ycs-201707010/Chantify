// ChangePassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function ChangePassword() {
  const { userId } = useAuth();
  const navigate = useNavigate();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!currentPw || !newPw || !confirmPw) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (newPw !== confirmPw) {
      setError("새 비밀번호와 확인이 일치하지 않습니다.");
      return;
    }

    try {
      const res = await fetch("/checksum/update_password.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `user_id=${encodeURIComponent(
          userId
        )}&current_pw=${encodeURIComponent(
          currentPw
        )}&new_pw=${encodeURIComponent(newPw)}`,
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg("비밀번호가 성공적으로 변경되었습니다.");
        // 2초 뒤 마이페이지로 돌아가기
        setTimeout(() => navigate("/mypage"), 2000);
      } else {
        setError(data.error || "비밀번호 변경에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-800 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">비밀번호 변경</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1 dark:text-gray-300">
            현재 비밀번호
          </label>
          <input
            type="password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 dark:text-gray-300">
            새 비밀번호
          </label>
          <input
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm mb-1 dark:text-gray-300">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            className="w-full p-2 border rounded dark:bg-zinc-700 dark:text-white"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate("/mypage")}
            className="px-4 py-2 border rounded dark:text-white"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            변경하기
          </button>
        </div>
      </form>
    </div>
  );
}
