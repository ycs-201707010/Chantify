import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FindId() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const navigate = useNavigate(); // ← 추가

  const submit = async () => {
    const res = await fetch(
      `/checksum/find_id.jsp?email=${encodeURIComponent(email)}`
    );
    const data = await res.json();
    setResult(data);

    if (data.success) {
      // 30초 뒤에 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 30000);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-zinc-800 rounded">
      <h2 className="text-xl font-bold mb-4">아이디 찾기</h2>
      <input
        type="email"
        placeholder="가입된 이메일"
        className="w-full p-2 mb-3 border rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={submit}
        className="w-full py-2 text-white bg-green-500 hover:bg-green-700 rounded"
      >
        찾기
      </button>
      {result && (
        <p className="mt-4 text-center">
          {result.success
            ? `회원님의 아이디는: ${result.username} (로그인 페이지로 이동합니다)`
            : result.error}
        </p>
      )}
    </div>
  );
}
