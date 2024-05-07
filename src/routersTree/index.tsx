import {Route, Routes} from "react-router-dom";
import MainPage from "../component/page/MainPage";
import MenuRoutes from "./MenuRoutes";

interface RoutersTreeProps {

}

function RoutersTree(props : RoutersTreeProps) {
  return (
    <Routes>
      <Route path="/*" element={<MainPage />} />
      <Route path="/menu/*" element={<MenuRoutes />} />
    </Routes>
  )
}

export default RoutersTree;