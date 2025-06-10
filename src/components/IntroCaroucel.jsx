// IntroCarousel.jsx
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";

export default function IntroCarousel() {
  const slides = [
    { title: "⚽ 실시간 경기·스탯", desc: "전 세계 경기 일정과 라이브 스코어" },
    { title: "✉️ 지금 뜨는 뉴스", desc: "세계 각지의 축구/스포츠 뉴스" },
    { title: "🗣️ 팬 커뮤니티", desc: "직접 글 작성, 댓글·추천·포인트 지급" },
    { title: "🏆 포인트 랭킹·경품", desc: "모은 포인트로 상품 응모·랭킹 경쟁" },
  ];
  const settings = {
    dots: false,
    autoplay: true,
    arrows: false,
    infinite: true,
  };

  return (
    <Slider {...settings}>
      {slides.map((s) => (
        <div key={s.title} className="p-6 text-center">
          <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
          <p className="text-gray-300">{s.desc}</p>
        </div>
      ))}
    </Slider>
  );
}
