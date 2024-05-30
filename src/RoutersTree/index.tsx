import {Route, Routes} from "react-router-dom";
import MainPage from "../component/page/MainPage";
import MenuRoutes from "./MenuRoutes";
import LoginRoutes from "./LoginRoutes";

interface RoutersTreeProps {

}

function RoutersTree(props : RoutersTreeProps) {
  return (
    <Routes>
      <Route path="/*" element={<MainPage />} />
      <Route path="/menu/*" element={<MenuRoutes />} />
      <Route path="/login/*" element={<LoginRoutes />} />
    </Routes>
  )
}

export default RoutersTree;