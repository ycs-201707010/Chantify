// 다크모드 페이지 만들 시 이 페이지 기준으로!!

import { useAuth } from "./contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [imageSrc, setImageSrc] = useState(null); // 업로드된 이미지 URL 또는 기본 이미지
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null); // 크롭된 영역 정보
  const [showCropper, setShowCropper] = useState(false); // 크롭 모달 표시 여부
  const [showMenu, setShowMenu] = useState(false); // Edit 버튼의 드롭다운 메뉴 표시 여부
  const [crop, setCrop] = useState({ x: 0, y: 0 }); // 크롭 위치
  const [zoom, setZoom] = useState(1); // 크롭 줌 수준
  const inputRef = useRef(); // 파일 input 참조
  const { isLoggedIn, userId } = useAuth();

  // 페이지 이동
  const navigate = useNavigate();

  // 사용자 정보 불러오기
  useEffect(() => {
    console.log("사용자 정보 불러오기 : " + userId);

    fetch(`/checksum/get_profile.jsp?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNickname(data.nickname);
          setComment(data.comment);
          setImageSrc(data.picture_url); // 서버에서 img URL 제공 필요

          console.log("사용자 정보 불러오기 성공? : " + data);
        }
      });
  }, [userId]);

  // 이미지 업로드 핸들러: 이미지 선택 시 미리보기 + 크롭 모달 표시
  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // 크롭된 이미지 데이터를 blob으로 생성하는 함수 (canvas 사용)
  const getCroppedImageBlob = () =>
    new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;
        ctx.drawImage(
          image,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0,
          0,
          croppedAreaPixels.width,
          croppedAreaPixels.height
        );
        canvas.toBlob((blob) => resolve(blob), "image/jpeg");
      };
    });

  // 크롭 완료 후 저장 버튼 눌렀을 때 실행됨
  // 자른 이미지로 미리보기 갱신 후 크롭 모달 닫기
  const handleSaveCropped = async () => {
    const blob = await getCroppedImageBlob();
    setImageSrc(URL.createObjectURL(blob));
    setShowCropper(false);
  };

  // 프로필 이미지 제거 버튼 눌렀을 때 → 기본 이미지로 초기화
  const handleRemovePhoto = async () => {
    if (!userId) return;

    try {
      const res = await fetch(
        `/checksum/remove_profile_image.jsp?user_id=${userId}`
      );
      const data = await res.json();

      if (data.success) {
        // 프로필 사진 제거 성공 시 상태 초기화
        setImageSrc(null); // 미리보기 URL 제거
        setShowCropper(false); // 혹시 열려 있다면 닫기
        alert("기본 프로필로 변경되었습니다.");
      } else {
        console.error("프로필 사진 제거 실패:", data.error);
        alert("프로필 사진을 제거하지 못했습니다.");
      }
    } catch (err) {
      console.error("서버 오류:", err);
      alert("서버 오류로 프로필 사진 제거 실패");
    }
  };

  // 변경된 프로필 저장하는 핸들러 함수.
  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("nickname", nickname);
      formData.append("comment", comment);

      // imageSrc가 새로 자른 이미지일 경우 Blob으로 전송
      if (imageSrc && imageSrc.startsWith("blob:")) {
        const blob = await fetch(imageSrc).then((res) => res.blob());
        formData.append("profile_image", blob, "profile.jpg");
      }

      const res = await fetch("/checksum/update_profile.jsp", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert("프로필이 저장되었습니다!");
        navigate(`/mypage`); // 저장 후 마이페이지로 이동
      } else {
        alert("프로필 저장 실패: " + data.error);
      }
    } catch (err) {
      console.error("저장 중 오류:", err);
      alert("서버 오류로 프로필 저장에 실패했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">
        프로필 수정
      </h2>
      <hr />
      <div className="flex gap-8 mt-6">
        {/* 왼쪽 프로필 사진 영역 */}
        <div className="w-64 flex flex-col items-center">
          <div className="relative">
            <img
              src={
                imageSrc ||
                "https://www.dummyimage.com/160x160/000/fff&text=Profile"
              }
              className="w-32 h-32 rounded-full border"
              alt="프로필"
            />
            <button
              className="absolute bottom-0 right-0 bg-gray-50 text-black dark:bg-zinc-700 dark:text-white px-2 py-1 text-xs rounded"
              onClick={() => setShowMenu(!showMenu)}
            >
              ✏️ Edit
            </button>
            {showMenu && (
              <div className="absolute mt-2 right-0 bg-gray-50 dark:bg-zinc-700 text-black dark:text-white border border-gray-300 dark:border-zinc-700 rounded shadow z-10">
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-400 dark:hover:bg-zinc-800 text-sm"
                  onClick={() => {
                    setShowMenu(false);
                    inputRef.current.click();
                  }}
                >
                  사진 업로드..
                </button>
                <button
                  className="block w-full px-4 py-2 hover:bg-gray-400 dark:hover:bg-zinc-800 text-sm"
                  onClick={() => {
                    setShowMenu(false);
                    handleRemovePhoto();
                  }}
                >
                  사진 제거
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputRef}
              onChange={handleUploadImage}
            />
          </div>
        </div>

        {/* 오른쪽 정보 입력 영역 */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm mb-1">사용자 별명</label>
            <input
              className="w-full bg-gray-50 dark:bg-zinc-700 border border-zinc-700 p-2 rounded"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          {/* <div>
            <label className="block text-sm mb-1">Public email</label>
            <input
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-zinc-700 p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div> */}
          <div>
            <label className="block text-sm mb-1">자기소개</label>
            <textarea
              className="w-full bg-gray-50 dark:bg-zinc-700 border border-zinc-700 p-2 rounded"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 justify-end">
        <button className="px-4 py-2 mt-7 border border-gray-300 dark:border-zinc-700 rounded text-white bg-zinc-500 hover:bg-zinc-700">
          뒤로 가기
        </button>

        <button
          onClick={handleSaveProfile}
          className="px-4 py-2 mt-7 border border-gray-300 dark:border-zinc-700 rounded text-white bg-green-500 hover:bg-green-700 dark:hover:bg-green-700"
        >
          프로필 저장
        </button>
      </div>

      {/* 크롭 팝업 */}
      {showCropper && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className="bg-zinc-900 p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">
              Crop your new profile picture
            </h3>
            <div className="relative w-full aspect-square mb-4">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, area) => setCroppedAreaPixels(area)}
                showGrid={false}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded"
                onClick={() => setShowCropper(false)}
              >
                취소
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded"
                onClick={handleSaveCropped}
              >
                Set new profile picture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
