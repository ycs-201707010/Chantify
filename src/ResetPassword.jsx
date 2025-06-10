import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate(); // ← 추가

  const submit = async () => {
    const res = await fetch("/checksum/reset_password.jsp", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `username=${encodeURIComponent(
        username
      )}&email=${encodeURIComponent(email)}`,
    });
    const data = await res.json();
    setMsg(data);

    if (data.success) {
      // 2초 뒤 로그인으로 이동
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-800 rounded">
      <h2 className="text-xl font-bold mb-4">비밀번호 재설정</h2>
      <input
        placeholder="아이디"
        className="w-full p-2 mb-2 border rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="가입된 이메일"
        className="w-full p-2 mb-3 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={submit}
        className="w-full py-2 text-white bg-green-500 hover:bg-green-700 rounded"
      >
        재설정 요청
      </button>
      {msg && (
        <p className="mt-4 text-center">
          {msg.success
            ? `${msg.message} (로그인 페이지로 이동합니다)`
            : msg.error}
        </p>
      )}
    </div>
  );
}
