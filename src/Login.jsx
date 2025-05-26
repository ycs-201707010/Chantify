import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div>
      <div className="flex flex-col items-center mt-10 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          로그인
        </h2>
        <div className="flex flex-col items-center gap-y-3 bg-gray-100 p-4 rounded-lg">
          <div className="w-md">
            <label htmlFor="" className="block text-sm font-bold mb-2">
              아이디
            </label>
            <input type="text" className="w-64 h-8" />
          </div>
          <div className="w-md">
            <label htmlFor="" className="block text-sm font-bold mb-2">
              비밀번호
            </label>
            <input type="password" className="w-64 h-8" />
          </div>

          <button
            type="submit"
            className="bg-blue-600 w-full py-2 rounded text-white transition bg-green-500 hover:bg-green-700"
          >
            로그인
          </button>
        </div>
        <div className="flex justify-center text-sm text-gray-500 gap-2 mt-5">
          <Link to="/find-username" className="hover:underline text-gray-500">
            아이디 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/find-password" className="hover:underline text-gray-500">
            비밀번호 찾기
          </Link>
          <span className="text-gray-300">|</span>
          <Link to="/signup" className="hover:underline text-gray-500">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
