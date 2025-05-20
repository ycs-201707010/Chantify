export default function Login() {
  return (
    <div className="max-w-md mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4 text-center">로그인</h2>
      <form className="flex flex-col gap-4">
        <input type="email" placeholder="이메일" className="border p-2" />
        <input type="password" placeholder="비밀번호" className="border p-2" />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          로그인
        </button>
      </form>
    </div>
  );
}
