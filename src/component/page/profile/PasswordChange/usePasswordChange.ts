import { useCallback, useState } from "react";
import { useChangePassword } from "../../../../hooks/useUserQueries";
import { PasswordChangeRequest } from "../../../../types/users/UsersDTO";

export default function usePasswordChange() {
  const changePasswordMutation = useChangePassword();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const validate = useCallback(() => {
    if (!currentPassword) {
      setErrorMsg("Please enter your current password.");
      return false;
    }
    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg("New passwords do not match.");
      return false;
    }
    return true;
  }, [currentPassword, newPassword, confirmPassword]);

  const handleSubmit = useCallback(async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!validate()) return;

    changePasswordMutation.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setSuccessMsg("Password changed successfully.");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
        onError: (error: any) => {
          const code = error?.response?.data?.code;
          if (code === "USER_004") {
            setErrorMsg("Current password is incorrect.");
          } else {
            setErrorMsg("Failed to change password.");
          }
        },
      }
    );
  }, [currentPassword, newPassword, confirmPassword, validate, changePasswordMutation]);

  return {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    isSubmitting: changePasswordMutation.isPending,
    successMsg,
    errorMsg,
    setErrorMsg,
  };
}
