import {Route, Routes} from "react-router-dom";
import MainPage from "../component/page/MainPage";
import AdminRoutes from "./AdminRoutes";
import LoginRoutes from "./LoginRoutes";
import BlogRoutes from "./BlogRoutes";
import SettingRoutes from "./SettingRoutes";
import TravelRoutes from "./TravelRoutes";

interface RoutersTreeProps {

}

function RoutersTree(props : RoutersTreeProps) {
  // 깃 푸쉬테스트3
  return (
    <Routes>
      <Route path="/home/*" element={<MainPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/setting/*" element={<SettingRoutes />} />
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/blog/*" element={<BlogRoutes />} />
      <Route path="/travel/*" element={<TravelRoutes />} />
    </Routes>
  )
}

export default RoutersTree;