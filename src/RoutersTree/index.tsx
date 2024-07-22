import {Route, Routes} from "react-router-dom";
import MainPage from "../component/page/MainPage";
import MenuRoutes from "./MenuRoutes";
import LoginRoutes from "./LoginRoutes";
import BlogRoutes from "./BlogRoutes";

interface RoutersTreeProps {

}

function RoutersTree(props : RoutersTreeProps) {
  return (
    <Routes>
      <Route path="/home/*" element={<MainPage />} />
      <Route path="/menu/*" element={<MenuRoutes />} />
      <Route path="/login/*" element={<LoginRoutes />} />
      <Route path="/blog/*" element={<BlogRoutes />} />
    </Routes>
  )
}

export default RoutersTree;