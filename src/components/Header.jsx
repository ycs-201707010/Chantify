import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

const menuItems = [
  { name: "홈", path: "/" },
  { name: "일정", path: "/schedule" },
  { name: "순위", path: "/ranking" },
  { name: "뉴스", path: "/news" },
  { name: "커뮤니티", path: "/community" },
  { name: "배팅", path: "/betting" },
  { name: "상점", path: "/shop" },
  { name: "마이페이지", path: "/mypage" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b shadow-sm sticky top-0 z-50 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between relative">
        {/* 왼쪽: 햄버거 + 로고 (모바일 기준 좌측 정렬) */}
        <div className="flex items-center gap-2">
          {/* 햄버거 버튼 (모바일만) */}
          <button
            className="block md:hidden text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
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
          <nav className="absolute top-full left-0 w-full border-t shadow-md md:hidden px-4 py-3 flex flex-col gap-2 text-gray-700 z-40 text-center">
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
          아이콘 배치
        </div>
      </div>
    </header>
  );
}
