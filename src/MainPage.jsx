import Header from "./components/Header";

// export default function MainPage() {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header />
//       <main className="flex-grow px-4 py-6 bg-gray-50"></main>
//     </div>
//   );
// }

export default function MainPage({ user }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow px-4 py-6 bg-gray-50">
        {user ? (
          <h1 className="text-2xl font-semibold">
            👋 {user.nickname}님, 환영합니다!
          </h1>
        ) : (
          <h1 className="text-2xl">로그인하고 시작해보세요!</h1>
        )}
      </main>
    </div>
  );
}
