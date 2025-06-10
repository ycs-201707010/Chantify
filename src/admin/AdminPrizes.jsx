import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function AdminPrizes() {
  const [prizes, setPrizes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    cost_point: "",
    stock: "",
    deadline: "",
    image: null,
  });
  const { isLoggedIn, userId } = useAuth(); // 관리자 페이지 전반에 걸쳐 추가하자

  // 페이지 이동
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || userId !== "root") {
      alert("접근 권한이 없습니다.");
      navigate("/");
    }
  }, [userId, navigate]);

  // 경품 목록 불러오기
  const fetchPrizes = async () => {
    const res = await fetch("/checksum/admin/get_prizes.jsp");
    const data = await res.json();
    if (data.success) setPrizes(data.prizes);
  };

  useEffect(() => {
    fetchPrizes();
  }, []);

  // input 변경 핸들러
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 경품 추가
  const handleAddPrize = async () => {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("cost_point", form.cost_point);
    formData.append("stock", form.stock);
    formData.append("deadline", form.deadline);
    formData.append("image", form.image);

    const res = await fetch("/checksum/admin/add_prize.jsp", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    if (result.success) {
      alert("경품이 추가되었습니다.");
      setShowModal(false);
      setForm({
        title: "",
        cost_point: "",
        stock: "",
        deadline: "",
        image: null,
      });
      fetchPrizes();
    } else {
      alert("오류 발생: " + result.error);
    }
  };

  // 경품 삭제
  const handleDeletePrize = async (prizeId) => {
    const ok = window.confirm("정말 이 경품을 삭제하시겠습니까?");
    if (!ok) return;

    const res = await fetch("/checksum/admin/delete_prize.jsp", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ prize_id: prizeId }),
    });
    const result = await res.json();

    if (result.success) {
      alert("삭제되었습니다.");
      fetchPrizes();
    } else {
      alert("삭제 실패: " + result.error);
    }
  };

  return (
    <div className="p-6 text-white bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">🎁 경품 관리</h1>

      {/* 경품 추가 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-xl shadow"
          onClick={() => setShowModal(true)}
        >
          + 새 경품
        </button>
      </div>

      {/* 경품 목록 테이블 */}
      <div className="overflow-x-auto bg-gray-800 rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">제목</th>
              <th className="py-3 px-4 text-left">이미지</th>
              <th className="py-3 px-4 text-left">포인트</th>
              <th className="py-3 px-4 text-left">관리</th>
            </tr>
          </thead>
          <tbody>
            {prizes.map((p) => (
              <tr key={p.prize_id} className="border-t border-gray-700">
                <td className="py-2 px-4">{p.prize_id}</td>
                <td className="py-2 px-4">{p.title}</td>
                <td className="py-2 px-4">
                  <img
                    src={p.image_url}
                    alt="경품"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </td>
                <td className="py-2 px-4">{p.cost_point.toLocaleString()}P</td>

                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDeletePrize(p.prize_id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    🗑 삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달: 경품 추가 */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-2xl w-96 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold">📦 새 경품 등록</h2>

            <input
              type="text"
              name="title"
              placeholder="경품 제목"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
              value={form.title}
              onChange={handleChange}
            />
            <input
              type="number"
              name="cost_point"
              placeholder="포인트 비용"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
              value={form.cost_point}
              onChange={handleChange}
            />
            <input
              type="number"
              name="stock"
              placeholder="당첨자 수"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
              value={form.stock}
              onChange={handleChange}
            />
            <input
              type="datetime-local"
              name="deadline"
              placeholder="응모 마감 시간"
              className="w-full px-3 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
              value={form.deadline}
              onChange={handleChange}
            />
            <input
              type="file"
              name="image"
              accept="image/*"
              className="w-full text-sm text-gray-300"
              onChange={handleChange}
            />

            <div className="flex justify-end space-x-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded"
              >
                취소
              </button>
              <button
                onClick={handleAddPrize}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
