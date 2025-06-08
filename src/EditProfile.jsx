import { useState, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";
import { useAuth } from "./contexts/AuthContext";

export default function EditProfile() {
  const { userId } = useAuth();

  const [nickname, setNickname] = useState("");
  const [comment, setComment] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const inputRef = useRef();

  // 기존 정보 불러오기
  useEffect(() => {
    fetch(`/checksum/get_profile.jsp?user_id=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setNickname(data.nickname || "");
          setComment(data.comment || "");
        }
      });
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("nickname", nickname);
    formData.append("comment", comment);

    if (imageSrc && croppedAreaPixels) {
      const blob = await getCroppedImageBlob();
      formData.append("image", blob, "profile.jpg");
    }

    const res = await fetch("/checksum/update_profile.jsp", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.success) {
      alert("프로필이 저장되었습니다!");
    } else {
      alert("실패: " + result.error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-zinc-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        프로필 편집
      </h2>

      <label className="block text-sm mb-1 text-gray-700 dark:text-white">
        닉네임
      </label>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="w-full p-2 border rounded mb-4 dark:bg-zinc-700 dark:text-white"
      />

      <label className="block text-sm mb-1 text-gray-700 dark:text-white">
        소개글
      </label>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="w-full p-2 border rounded mb-4 dark:bg-zinc-700 dark:text-white"
      />

      <label className="block text-sm mb-1 text-gray-700 dark:text-white">
        프로필 사진
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        ref={inputRef}
        className="mb-4"
      />

      {imageSrc && (
        <div className="relative w-full aspect-square mb-4">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round" // 또는 'rect'
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, croppedArea) =>
              setCroppedAreaPixels(croppedArea)
            }
            showGrid={false}
          />
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          저장
        </button>
        <button
          onClick={() => {
            setImageSrc(null);
            inputRef.current.value = null;
          }}
          className="px-4 py-2 border rounded text-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          초기화
        </button>
      </div>
    </div>
  );
}
