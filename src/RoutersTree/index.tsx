import {Route, Routes} from "react-router-dom";
import MainPage from "../component/page/MainPage";
import AdminRoutes from "./AdminRoutes";
import LoginRoutes from "./LoginRoutes";
import BlogRoutes from "./BlogRoutes";
import SettingRoutes from "./SettingRoutes";

interface RoutersTreeProps {

}

function RoutersTree(props : RoutersTreeProps) {
  return (
    <Routes>
      <Route path="/home/*" element={<MainPage />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/setting/*" element={<SettingRoutes />} />
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/blog/*" element={<BlogRoutes />} />
    </Routes>
  )
}

export default RoutersTree;