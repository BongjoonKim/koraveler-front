import { useCallback, useEffect, useState } from "react";
import { useUserProfile, useUpdateUserProfile } from "../../../../hooks/useUserQueries";
import { UserUpdateRequest } from "../../../../types/users/UsersDTO";
import moment from "moment";

export default function useProfileInfo() {
  const { data: profile, isLoading } = useUserProfile();
  const updateMutation = useUpdateUserProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<UserUpdateRequest>({
    name: "",
    email: "",
    birthday: "",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        birthday: profile.birthday ? profile.birthday.substring(0, 10) : "",
      });
    }
  }, [profile]);

  const handleChange = useCallback((field: keyof UserUpdateRequest, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrorMsg("");
  }, []);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setSuccessMsg("");
    setErrorMsg("");
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setErrorMsg("");
    if (profile) {
      setForm({
        name: profile.name || "",
        email: profile.email || "",
        birthday: profile.birthday ? profile.birthday.substring(0, 10) : "",
      });
    }
  }, [profile]);

  const handleSave = useCallback(async () => {
    setErrorMsg("");
    setSuccessMsg("");
    updateMutation.mutate({
      ...form,
      birthday : moment(form.birthday).format('YYYY-MM-DDTHH:mm:ss')
    }, {
      onSuccess: () => {
        setIsEditing(false);
        setSuccessMsg("Profile updated successfully.");
      },
      onError: (error: any) => {
        const code = error?.response?.data?.code;
        if (code === "USER_005") {
          setErrorMsg("This email is already in use.");
        } else {
          setErrorMsg("Failed to update profile.");
        }
      },
    });
  }, [form, updateMutation]);

  return {
    profile,
    isLoading,
    isEditing,
    form,
    handleChange,
    handleEdit,
    handleCancel,
    handleSave,
    isSaving: updateMutation.isPending,
    successMsg,
    errorMsg,
  };
}
