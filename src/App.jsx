import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./MainPage";
import Login from "./Login";
import Signup from "./signup";
import FindId from "./FindId";
import ResetPassword from "./ResetPassword";
import ChangePassword from "./ChangePassword";
import News from "./News";
import Community from "./community";
import NewPost from "./NewPost";
import EditPost from "./EditPost";
import PostView from "./PostView";
import MyPage from "./MyPage";
import EditProfile from "./EditProfile";
import PrizeList from "./PrizeList";
import AdminDashboard from "./admin/AdminDashBoard";
import AdminPrizes from "./admin/AdminPrizes";

import { AuthProvider } from "./contexts/AuthContext"; // ✅ 추가
import { DarkModeProvider } from "./contexts/DarkModeContext";

const user = null; // 추후 로그인 상태로 교체 예정

export default function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainPage user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/findid" element={<FindId />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/changepassword" element={<ChangePassword />} />
            <Route path="/news" element={<News />} />
            <Route path="/community" element={<Community />} />
            <Route path="/newpost" element={<NewPost />} />
            <Route path="/postview/:postId" element={<PostView />} />
            <Route path="/editpost/:postId" element={<EditPost />} />
            <Route path="/editprofile" element={<EditProfile />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/prizelist" element={<PrizeList />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />}></Route>
            <Route path="/admin/prizes" element={<AdminPrizes />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </DarkModeProvider>
  );
}
