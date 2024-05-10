import {Route, Routes} from "react-router-dom";
import MenuAdmin from "../../../component/page/menu/admin/MenuAdmin";

export default function MenuAdminRoutes() {
  return (
    <Routes>
      <Route path="/menu" element={<MenuAdmin />} />
    </Routes>
  )
}