// EditProfile.jsx (GitHub 스타일 기반 프로필 편집 화면)

import { useState, useRef } from "react";
import Cropper from "react-easy-crop";

export default function EditProfile() {
  const [nickname, setNickname] = useState("LSD");
  const [email, setEmail] = useState("yell2735@naver.com");
  const [comment, setComment] = useState("Hi.");
  const [imageSrc, setImageSrc] = useState(null); // 원본 이미지
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const inputRef = useRef();

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

  const handleSaveCropped = async () => {
    const blob = await getCroppedImageBlob();
    setImageSrc(URL.createObjectURL(blob));
    setShowCropper(false);
  };

  const handleRemovePhoto = () => {
    setImageSrc(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 text-black dark:text-white">
      <h2 className="text-2xl font-bold mb-6">Public profile</h2>
      <hr />
      <div className="flex gap-8 mt-6">
        {/* 왼쪽 정보 입력 영역 */}
        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-zinc-700 p-2 rounded"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Public email</label>
            <input
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-zinc-700 p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Bio</label>
            <textarea
              className="w-full bg-gray-50 dark:bg-zinc-900 border border-zinc-700 p-2 rounded"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>

        {/* 오른쪽 프로필 사진 영역 */}
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
              className="absolute bottom-0 right-0 bg-zinc-700 px-2 py-1 text-xs rounded"
              onClick={() => setShowMenu(!showMenu)}
            >
              ✏️ Edit
            </button>
            {showMenu && (
              <div className="absolute mt-2 right-0 bg-zinc-800 border border-zinc-600 rounded shadow z-10">
                <button
                  className="block w-full px-4 py-2 hover:bg-zinc-700 text-sm"
                  onClick={() => {
                    setShowMenu(false);
                    inputRef.current.click();
                  }}
                >
                  Upload a photo…
                </button>
                <button
                  className="block w-full px-4 py-2 hover:bg-zinc-700 text-sm"
                  onClick={() => {
                    setShowMenu(false);
                    handleRemovePhoto();
                  }}
                >
                  Remove photo
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
