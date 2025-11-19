import {useCurrentUser} from "../hooks/useCurrentUser";
import {Navigate, useLocation} from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({
  children,
  requiredRoles = []
}: ProtectedRouteProps) {
  const currentUser = useCurrentUser();
  const location = useLocation();
  console.log("currentUsercurrentUser", currentUser)
  if (!currentUser) {
    return <Navigate to={'/login'} state={{from: location.pathname}} replace />
  }
  
  if (requiredRoles?.length > 0) {
    const hasRequiredRole = requiredRoles.some(role => {
      return currentUser.roles?.includes(role);
    })
    
    if (!hasRequiredRole) {
      return <Navigate to={"/error/403"} replace />
    }
  }
  return (
    <>
      {children}
    </>
  )
  
}