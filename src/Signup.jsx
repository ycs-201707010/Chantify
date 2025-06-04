import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // npm install @heroicons/react. 아이콘을 추가한다.

export default function Signup() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    passwordCheck: "",
    nickname: "",
    email: "",
    emailCode: "",
  });

  /// 항목별 유효성 상태
  const [valid, setValid] = useState({
    username: false,
    nickname: false,
    email: false,
    emailCode: false,
    password: false,
    passwordMatch: false,
  });

  // 페이지 이동
  const navigate = useNavigate();

  // 유효성 검사 함수 정의
  const validateUsername = (username) => /^[a-zA-Z0-9_]{4,16}$/.test(username);
  const validateNickname = (nickname) =>
    /^[가-힣a-zA-Z0-9]{2,20}$/.test(nickname);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // 비밀번호 보안 수준 분석 함수
  const getPasswordStrength = (pw) => {
    if (!pw) return { level: "없음", color: "text-gray-400" };

    const strong = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}/;
    const medium = /(?=.*[a-z])(?=.*\d).{6,}/;

    if (strong.test(pw)) return { level: "강함", color: "text-green-600" };
    if (medium.test(pw)) return { level: "보통", color: "text-yellow-500" };
    return { level: "약함", color: "text-red-500" };
  };

  const strength = getPasswordStrength(form.password);
  const isMatch = form.password && form.password === form.passwordCheck;

  // 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // 실시간 유효성 검사
    if (name === "username") {
      setValid((prev) => ({ ...prev, username: validateUsername(value) }));
    } else if (name === "nickname") {
      setValid((prev) => ({ ...prev, nickname: validateNickname(value) }));
    } else if (name === "email") {
      setValid((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (name === "password") {
      const strength = getPasswordStrength(value);
      setValid((prev) => ({ ...prev, password: strength.level !== "약함" }));
    } else if (name === "passwordCheck") {
      setValid((prev) => ({
        ...prev,
        passwordMatch: value === form.password,
      }));
    }
  };

  // 아이디/닉네임 중복 확인 메서드
  const checkDuplicate = async (field) => {
    const value = form[field];
    if (!value) return;

    const res = await fetch(
      `/checksum/check-duplicate.jsp?type=${field}&value=${value}`
    );
    const data = await res.json();

    if (data.exists) {
      alert(
        `이미 사용 중인 ${field === "username" ? "아이디" : "닉네임"}입니다`
      );
    } else {
      alert("사용 가능한 값입니다!");
      setValid((prev) => ({ ...prev, [field]: true }));
    }
  };

  // 이메일 인증 코드 발송 메서드
  const handleSendCode = async () => {
    if (!validateEmail(form.email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/checksum/send_email_code.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ email: form.email }),
      });

      const result = await res.json();
      if (result.success) {
        alert(
          "인증 코드가 이메일로 전송되었습니다. 5분 내로 인증을 완료해주세요."
        );
      } else {
        alert("전송 실패: " + result.error);
      }
    } catch (err) {
      alert("서버 통신 오류");
    }
  };

  // ✅ 인증코드 입력 후 확인 버튼 추가
  const handleVerifyCode = async () => {
    if (!/^\d{6}$/.test(form.emailCode)) {
      alert("6자리 숫자 코드를 입력하세요.");
      return;
    }

    try {
      const res = await fetch("/checksum/verify_email_code.jsp", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          email: form.email,
          code: form.emailCode,
        }),
      });

      const result = await res.json();
      if (result.verified) {
        alert("이메일 인증 성공!");
        setValid((prev) => ({ ...prev, email: true, emailCode: true }));
      } else {
        alert("인증코드가 일치하지 않습니다.");
      }
    } catch (err) {
      alert("서버 오류");
    }
  };

  /// 모든 조건이 완료되면 회원가입 버튼 활성화.
  const isAllValid =
    Object.values(valid).every((v) => v) &&
    form.username &&
    form.nickname &&
    form.email &&
    form.emailCode &&
    form.password &&
    form.passwordCheck;

  // 회원가입 버튼 눌렀을 때 메서드
  const handleSubmit = async () => {
    const formData = new URLSearchParams(form).toString(); // form: useState로 관리 중

    try {
      const res = await fetch("/checksum/signup.jsp", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        alert("성공적으로 회원가입이 완료되었습니다!");
        setForm({
          username: "",
          password: "",
          passwordCheck: "",
          nickname: "",
          email: "",
          emailCode: "",
        });
        navigate("/login");
      } else {
        alert("회원 가입에 실패하였습니다. : " + result.error);
        navigate("");
      }
    } catch (err) {
      alert("서버 연결 실패!");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-lg shadow-md bg-white dark:bg-zinc-800">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        회원가입
      </h2>

      {/* 아이디 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-200">
          아이디
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="flex-1 border px-3 py-2 rounded dark:bg-zinc-700 dark:text-white"
          />
          <button
            type="button"
            className={`px-3 py-1 rounded text-sm dark:bg-zinc-600 dark:text-white ${
              valid.username
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!valid.username}
            onClick={() => checkDuplicate("username")}
          >
            중복확인
          </button>
        </div>
        {!valid.username && form.username && (
          <p className="text-sm text-red-500 mt-1">
            아이디는 영문과 숫자로 구성된 4~16자로 입력하세요.
          </p>
        )}
      </div>

      {/* 비밀번호 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-200">
          비밀번호
        </label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border focus:outline-none dark:bg-zinc-700 ${
            strength.level === "강함"
              ? "border-green-500"
              : strength.level === "보통"
              ? "border-yellow-400"
              : form.password
              ? "border-red-500"
              : "border-gray-300"
          }`}
        />
        {form.password.length > 0 && (
          <p className={`text-sm mt-1 ${strength.color}`}>
            보안 수준: {strength.level}
          </p>
        )}
      </div>

      {/* 비밀번호 확인 */}
      <div className="mb-4 relative">
        <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-200">
          비밀번호 확인
        </label>
        <input
          type="password"
          name="passwordCheck"
          value={form.passwordCheck}
          onChange={handleChange}
          className={`w-full px-3 py-2 rounded border focus:outline-none dark:bg-zinc-700 transition-all duration-300 ${
            isMatch
              ? "border-green-400 shadow-[0_0_0_3px_rgba(34,197,94,0.4)]"
              : form.passwordCheck
              ? "border-red-400"
              : "border-gray-300"
          }`}
        />
        {/* 체크 아이콘 */}
        {isMatch && (
          <CheckCircleIcon className="w-5 h-5 text-green-500 absolute right-3 top-9 " />
        )}

        {!isMatch && form.passwordCheck && (
          <p className="text-sm text-red-500 mt-1">
            비밀번호가 일치하지 않습니다.
          </p>
        )}
      </div>

      {/* 닉네임 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-200">
          닉네임
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="nickname"
            value={form.nickname}
            onChange={handleChange}
            className="flex-1 border px-3 py-2 rounded dark:bg-zinc-700 dark:text-white"
          />
          <button
            type="button"
            disabled={!valid.nickname}
            className={`px-3 py-1 rounded text-sm dark:bg-zinc-600 dark:text-white" ${
              valid.nickname
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            onClick={() => checkDuplicate("nickname")}
          >
            중복확인
          </button>
        </div>
        {!valid.nickname && form.nickname && (
          <p className="text-sm text-red-500 mt-1">
            2~20자 한글/영문/숫자만 가능합니다.
          </p>
        )}
      </div>

      {/* 이메일 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-200">
          이메일
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="flex-1 border px-3 py-2 rounded dark:bg-zinc-700 dark:text-white"
          />
          <button
            type="button"
            className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
            onClick={handleSendCode}
          >
            인증코드 발송
          </button>
        </div>
        {!valid.email && form.email && (
          <p className="text-sm text-red-500 mt-1">
            유효한 이메일 형식이 아닙니다.
          </p>
        )}
      </div>

      {/* 인증코드 입력 */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold text-sm text-gray-700 dark:text-gray-200">
          인증코드
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="emailCode"
            value={form.emailCode}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded dark:bg-zinc-700 dark:text-white"
          />
          <button
            type="button"
            className={`px-3 py-1 rounded text-sm dark:bg-zinc-600 dark:text-white ${
              form.emailCode.length > 0
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={form.emailCode.length === 0}
            onClick={handleVerifyCode}
          >
            인증코드 확인
          </button>
        </div>
      </div>

      {/* 제출 버튼 */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!isAllValid}
        className={`w-full py-2 rounded text-white transition ${
          isAllValid
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        가입하기
      </button>
    </div>
  );
}
