// RoutersTree/index.tsx
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import BlogRoutes from "./BlogRoutes";
import SettingRoutes from "./SettingRoutes";
import {Alert, AlertContent, AlertDescription, AlertIndicator, AlertRoot, AlertTitle} from "@chakra-ui/react"; // AlertIcon → AlertIndicator
import ChatRoutes from "./ChatRoutes";
import MainPage from "../component/page/MainPage";
import LoginRoutes from "./LoginRoutes/LoginRoutes";
import MainLayout from "../common/layout/MainLayout/MainLayout";
import HomePage from "../component/page/homePage/HomePage";
import AdminRoutes from "./AdminRoutes";
import ForbiddenPage from "../component/page/error/ForbiddenPage";
import UserRoutes from "./UserRoutes";
import ProfileRoutes from "./ProfileRoutes";
import TravelRoutes from "./TravelRoutes";

export default function RoutersTree() {
  return (
    <Router>
        <Routes>
            <Route path="/*" element={<MainPage/>}/>
            <Route path="/blog/*" element={<BlogRoutes/>}/>
            <Route path="/chat/*" element={<ChatRoutes/>}/>
            <Route path="/login/*" element={<LoginRoutes/>}/>
            <Route path="/travel/*" element={<TravelRoutes/>}/>
          <Route path="/profile/*" element={<ProfileRoutes />} />
          <Route path="/admin/*" element={<AdminRoutes />} />
          <Route path="/user/*" element={<UserRoutes />} />
          <Route path="/error/403" element={<ForbiddenPage />} />
          <Route path="*" element={
            <AlertRoot status="error">
              <AlertIndicator /> {/* AlertIcon → AlertIndicator */}
              <AlertContent>
                <AlertTitle>404 - 페이지를 찾을 수 없습니다!</AlertTitle>
                <AlertDescription>
                  요청하신 페이지가 존재하지 않습니다.
                </AlertDescription>
              </AlertContent>
            </AlertRoot>
          }/>
        </Routes>
    </Router>
  );
}