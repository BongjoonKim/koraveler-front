import {Route, Routes} from "react-router-dom";
import MainPage from "../component/page/MainPage";

interface RoutersTreeProps {

}

function RoutersTree(props : RoutersTreeProps) {
  return (
    <Routes>
      <Route path="/*" element={<MainPage />} />
    </Routes>
  )
}

export default RoutersTree;