import {Navigate, Route, Routes} from "react-router-dom";
import MainPage from "../component/page/MainPage";
import AdminRoutes from "./AdminRoutes";
import LoginRoutes from "./LoginRoutes";
import BlogRoutes from "./BlogRoutes";
import SettingRoutes from "./SettingRoutes";
import TravelRoutes from "./TravelRoutes";
import {Alert, AlertIcon, AlertTitle} from "@chakra-ui/react";
import TechRoutes from "./TechRoutes";

interface RoutersTreeProps {

}

function RoutersTree(props : RoutersTreeProps) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />  // 홈 화면으로 이동하기
      <Route path="/home/*" element={<MainPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/setting/*" element={<SettingRoutes />} />
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/blog/*" element={<BlogRoutes />} />
      <Route path="/travel/*" element={< TravelRoutes />} />
      <Route path="/tech/*" element={< TechRoutes />} />
    </Routes>
  )
}

export default RoutersTree;