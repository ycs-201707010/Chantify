import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const menuItems = [
  { name: "홈", path: "/" },
  { name: "일정", path: "/schedule" },
  { name: "순위", path: "/ranking" },
  { name: "뉴스", path: "/news" },
  { name: "커뮤니티", path: "./community" },
  { name: "배팅", path: "/betting" },
  { name: "상점", path: "/shop" },
  { name: "마이페이지", path: "/mypage" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // 상단에 추가
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 임시 로그인 상태
  const profileImgUrl = "https://avatars.githubusercontent.com/u/9919?v=4"; // 더미 이미지

  useEffect(() => {
    // ⚡ 클릭 이벤트를 감지하는 함수 정의
    const handleClickOutside = (e) => {
      console.log(e.target);

      // isOpen이 true일 때만 작동 (메뉴가 열려 있을 때만)
      // menuRef.current는 메뉴 DOM 요소를 참조
      // e.target은 사용자가 실제로 클릭한 요소

      if (
        isOpen && // 메뉴가 열려 있고
        menuRef.current && // menuRef가 뭔가를 참조하고 있으며
        !menuRef.current.contains(e.target) // 클릭한 대상이 메뉴 내부가 아니라면
      ) {
        setIsOpen(false); // 👉 메뉴 닫기
      }
    };

    // 🔔 마우스를 눌렀을 때 handleClickOutside 함수를 실행하도록 이벤트 등록
    document.addEventListener("click", handleClickOutside);

    // 🧹 컴포넌트가 언마운트되거나 isOpen이 바뀔 때 이벤트 제거 (메모리 누수 방지)
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]); // 💡 isOpen이 바뀔 때마다 이 effect가 다시 실행됨

  return (
    <header
      className="border-b shadow-sm sticky top-0 z-50 bg-white"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* 왼쪽: 햄버거 + 로고 (모바일 기준 좌측 정렬) */}
        <div className="flex items-center gap-2">
          {/* 햄버거 버튼 (모바일만) */}
          <button
            className="block md:hidden text-gray-600"
            onClick={(e) => {
              e.stopPropagation(); // 👉 여기 추가
              setIsOpen(!isOpen);
            }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

          {/* 로고 */}
          <Link to="/" className="text-xl font-bold text-blue-600">
            로고
          </Link>
        </div>

        {/* 중앙: 메뉴 (데스크탑) */}
        <nav className="hidden flex-1 md:flex justify-center gap-6 text-sm font-medium text-gray-700">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="hover:text-blue-500 transition"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* 모바일 드롭다운 메뉴 */}
        {isOpen && (
          <nav
            ref={menuRef}
            className="absolute top-full left-0 w-full border-t shadow-md md:hidden px-4 py-3 flex flex-col gap-2 text-gray-700 z-40 text-center"
          >
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false) /** 메뉴 클릭시 리스트 닫기 */}
                className="hover:text-blue-500"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}

        {/* 오른쪽: 로그인 or 아이콘 */}
        <div className="text-sm text-gray-500 whitespace-nowrap">
          {isLoggedIn ? (
            <img
              src={profileImageUrl}
              alt="프로필"
              className="w-8 h-8 rounded-full border border-gray-300 dark:border-zinc-700"
            />
          ) : (
            <>
              {/* <Link> 태그는 JSX 식이라서 부모 태그가 하나 있어야 한다. 따라서 빈 태그를 하나 생성. */}
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="border px-3 py-1 rounded hover:bg-blue-600 hover:text-white dark:text-white dark:border-white dark:hover:bg-blue-500 ml-3"
              >
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
