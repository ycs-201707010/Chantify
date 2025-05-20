import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import MainPage from "./MainPage";
import Login from "./Login";
import Signup from "./signup";

const user = null; // 추후 로그인 상태로 교체 예정

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage user={user} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
