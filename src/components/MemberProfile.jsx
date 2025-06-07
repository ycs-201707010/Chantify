export default function MemberProfile() {
  return (
    <div
      className="max-w-[975px] h-[200px] bg-black bg-cover bg-center relative
          "
      style={{ backgroundImage: `url()` }}
    >
      {/* 편집하기 버튼은 본인 계정 프로필 조회 시만 */}
      <a className="absolute right-0 top-0 mr-2 mt-2 text-white" href="">
        편집하기
      </a>

      <div className="absolute left-0 bottom-0 ml-11 mb-8 ">
        <img
          src={
            "https://www.dummyimage.com/64x64/000000/ffffff.png&text=Profile"
          }
          className="w-16 h-16 rounded-full mb-2 border"
        />
        <div>
          <p className="text-lg text-white font-bold">사용자 @김은별</p>
          <p className="text-sm text-gray-300">기본 정보 입니다.</p>
        </div>
      </div>
    </div>
  );
}
