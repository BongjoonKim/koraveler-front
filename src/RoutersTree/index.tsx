// RoutersTree/index.tsx
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import BlogRoutes from "./BlogRoutes";
import SettingRoutes from "./SettingRoutes";
import TravelRoutes from "./TravelRoutes";
import {Alert, AlertContent, AlertDescription, AlertIndicator, AlertRoot, AlertTitle} from "@chakra-ui/react"; // AlertIcon → AlertIndicator
import TechRoutes from "./TechRoutes";
import ChatRoutes from "./ChatRoutes";
import MainPage from "../component/page/MainPage";
import LoginRoutes from "./LoginRoutes/LoginRoutes";

export default function RoutersTree() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<MainPage/>}/>
        <Route path="/blog/*" element={<BlogRoutes/>}/>
        <Route path="/travel/*" element={<TravelRoutes/>}/>
        <Route path="/tech/*" element={<TechRoutes/>}/>
        <Route path="/chat/*" element={<ChatRoutes/>}/>
        <Route path="/login/*" element={<LoginRoutes/>}/>
        <Route path="/setting/*" element={
            <SettingRoutes/>
        }/>
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