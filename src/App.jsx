import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./MainPage";
import Login from "./Login";
import Signup from "./signup";
import Community from "./community";
import NewPost from "./NewPost";
import PostView from "./PostView";
import MyPage from "./MyPage";

import { AuthProvider } from "./contexts/AuthContext"; // ✅ 추가

const user = null; // 추후 로그인 상태로 교체 예정

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage user={user} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/community" element={<Community />} />
          <Route path="/newpost" element={<NewPost />} />
          <Route path="/postview/:postId" element={<PostView />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
