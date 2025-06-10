import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MemberProfile() {
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [imageSrc, setImageSrc] = useState(null); // 업로드된 이미지 URL 또는 기본 이미지
  const { isLoggedIn, userId } = useAuth(); // "내" 로그인 정보

  // 페이지 이동
  const navigate = useNavigate();

  // 사용자 정보 불러오기
  useEffect(() => {
    fetch(`/checksum/get_profile.jsp?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNickname(data.nickname);
          setComment(data.comment);
          setImageSrc(data.picture_url); // 서버에서 img URL 제공 필요
        }
      });
  }, [userId]);

  return (
    <div
      className="max-w-[975px] h-[200px] bg-black bg-cover bg-center relative
          "
      style={{ backgroundImage: `url()` }}
    >
      {/* 편집하기 버튼은 본인 계정 프로필 조회 시만 */}
      <a
        onClick={() => navigate("/editprofile")}
        className="absolute right-0 top-0 mr-2 mt-2 text-white"
      >
        편집하기
      </a>

      <div className="absolute left-0 bottom-0 ml-11 mb-8 ">
        <img
          src={
            imageSrc ||
            "https://www.dummyimage.com/64x64/000000/ffffff.png&text=Profile"
          }
          className="w-16 h-16 rounded-full mb-2 border"
        />
        <div>
          <p className="text-lg text-white font-bold">사용자 @{nickname}</p>
          <p className="text-sm text-gray-300">{comment}</p>
        </div>
      </div>
    </div>
  );
}
