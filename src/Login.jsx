import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { fetchSession } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("아이디와 비밀번호를 모두 입력하세요.");
      return;
    }

    const res = await fetch("/checksum/login.jsp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
      credentials: "include", // ★ 세션 유지 핵심!
    });

    const data = await res.json();

    if (data.success) {
      await fetchSession(); // 로그인 상태 즉시 반영
      navigate("/"); // 세션이 확인되면 이동
    } else {
      alert("로그인 실패 : " + data.message);
      setError(data.message || "로그인 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col items-center mt-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          로그인
        </h2>
        <div className="flex flex-col items-center gap-y-3 bg-gray-100 text-black dark:bg-zinc-700 dark:text-white  p-4 rounded-lg">
          <div className="w-md">
            <label
              htmlFor="input_username"
              className="block text-sm font-bold mb-2"
            >
              아이디
            </label>
            <input
              type="text"
              id="input_username"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-64 h-8"
            />
          </div>
          <div className="w-md">
            <label
              htmlFor="input_password"
              className="block text-sm font-bold mb-2"
            >
              비밀번호
            </label>
            <input
              type="password"
              id="input_password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-64 h-8"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded text-white transition bg-green-500 hover:bg-green-700 hover:dark:bg-green-700"
          >
            로그인
          </button>
        </div>
        <div className="flex justify-center text-sm text-gray-500 gap-2 mt-5">
          <Link to="/findid" className="hover:underline text-gray-500">
            아이디 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/resetpassword" className="hover:underline text-gray-500">
            비밀번호 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/signup" className="hover:underline text-gray-500">
            회원가입
          </Link>
        </div>
      </div>
    </form>
  );
}
