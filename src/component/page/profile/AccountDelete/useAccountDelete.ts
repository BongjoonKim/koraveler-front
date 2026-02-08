import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteUserAccount } from "../../../../hooks/useUserQueries";
import { useAuth } from "../../../../appConfig/AuthProvider";
import { UserDeleteRequest } from "../../../../types/users/UsersDTO";

export default function useAccountDelete() {
  const deleteMutation = useDeleteUserAccount();
  const { clearAuth } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenModal = useCallback(() => {
    setErrorMsg("");
    if (!password) {
      setErrorMsg("Please enter your password to confirm.");
      return;
    }
    setIsModalOpen(true);
  }, [password]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleDelete = useCallback(async () => {
    setErrorMsg("");
    deleteMutation.mutate(
      { password },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          clearAuth();
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/home");
        },
        onError: (error: any) => {
          setIsModalOpen(false);
          const code = error?.response?.data?.code;
          if (code === "USER_004") {
            setErrorMsg("Password is incorrect.");
          } else {
            setErrorMsg("Failed to delete account.");
          }
        },
      }
    );
  }, [password, deleteMutation, clearAuth, navigate]);

  return {
    password,
    setPassword,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleDelete,
    isDeleting: deleteMutation.isPending,
    errorMsg,
    setErrorMsg,
  };
}
