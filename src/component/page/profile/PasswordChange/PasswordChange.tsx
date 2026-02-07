import React from "react";
import { Box, VStack, Text, Button, Spinner } from "@chakra-ui/react";
import { Lock } from "lucide-react";
import CusFormCtrl from "../../../../common/elements/CusFormCtrl";
import CusInput from "../../../../common/elements/textField/CusInput";
import usePasswordChange from "./usePasswordChange";

export default function PasswordChange() {
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    isSubmitting,
    successMsg,
    errorMsg,
    setErrorMsg,
  } = usePasswordChange();

  return (
    <VStack gap={6} align="stretch" p={6} borderWidth="1px" borderRadius="xl" borderColor="gray.200">
      <Text fontSize="lg" fontWeight="semibold">Change Password</Text>

      {successMsg && (
        <Box p={3} bg="green.50" borderRadius="md" borderWidth="1px" borderColor="green.200">
          <Text color="green.700" fontSize="sm">{successMsg}</Text>
        </Box>
      )}
      {errorMsg && (
        <Box p={3} bg="red.50" borderRadius="md" borderWidth="1px" borderColor="red.200">
          <Text color="red.700" fontSize="sm">{errorMsg}</Text>
        </Box>
      )}

      <CusFormCtrl formTitle="Current Password">
        <CusInput
          type="password"
          value={currentPassword}
          onChange={(e) => {
            setCurrentPassword(e.target.value);
            setErrorMsg("");
          }}
          placeholder="Enter current password"
          startElement={<Lock size={16} />}
        />
      </CusFormCtrl>

      <CusFormCtrl formTitle="New Password">
        <CusInput
          type="password"
          value={newPassword}
          onChange={(e) => {
            setNewPassword(e.target.value);
            setErrorMsg("");
          }}
          placeholder="Enter new password"
          startElement={<Lock size={16} />}
        />
      </CusFormCtrl>

      <CusFormCtrl formTitle="Confirm New Password">
        <CusInput
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setErrorMsg("");
          }}
          placeholder="Confirm new password"
          startElement={<Lock size={16} />}
        />
      </CusFormCtrl>

      <Box pt={2}>
        <Button
          colorPalette="blue"
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner size="sm" /> : "Change Password"}
        </Button>
      </Box>
    </VStack>
  );
}
