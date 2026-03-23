import {useCurrentUser} from "../hooks/useCurrentUser";
import {Navigate, useLocation} from "react-router-dom";
import {Flex, Spinner, Text} from "@chakra-ui/react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function ProtectedRoute({
  children,
  requiredRoles = []
}: ProtectedRouteProps) {
  const {data : currentUser, isLoading} = useCurrentUser();
  const location = useLocation();
  //
  if (isLoading) {
    return (
      <Flex
        h={"100%"}
        align={"center"}
        justify={"center"}
        direction={"column"}
        gap={4}
      >
        <Spinner size="xl" color="blue.500"/>
        <Text color={"gray.600"}>
          Loading...
        </Text>
      </Flex>
    )
  }
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
