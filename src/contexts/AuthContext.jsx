import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // 초기 로딩 처리용

  // (로그인 시 바로 세션 반영되게)
  const fetchSession = async () => {
    const res = await fetch("/checksum/check-session.jsp", {
      credentials: "include",
    });
    const data = await res.json();
    if (data.loggedIn) {
      setIsLoggedIn(true);
      setUserId(data.user_id);
    } else {
      setIsLoggedIn(false);
      setUserId(null);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/checksum/check-session.jsp", {
          credentials: "include", // ✅ 세션 쿠키 포함
        });
        const data = await res.json();

        if (data.loggedIn) {
          setIsLoggedIn(true);
          setUserId(data.user_id);
        } else {
          setIsLoggedIn(false);
          setUserId(null);
        }
      } catch (err) {
        console.error("세션 확인 실패", err);
        setIsLoggedIn(false);
        setUserId(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    try {
      await fetch("/checksum/logout.jsp");
    } catch (e) {
      console.error("로그아웃 실패", e);
    } finally {
      setIsLoggedIn(false);
      setUserId(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, userId, logout, loading, fetchSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
