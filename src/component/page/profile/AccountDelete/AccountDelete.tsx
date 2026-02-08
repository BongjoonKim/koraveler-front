import React from "react";
import { Box, VStack, Text, Button, Spinner } from "@chakra-ui/react";
import { AlertTriangle, Lock } from "lucide-react";
import CusFormCtrl from "../../../../common/elements/CusFormCtrl";
import CusInput from "../../../../common/elements/textField/CusInput";
import CusModal from "../../../../common/elements/CusModal";
import useAccountDelete from "./useAccountDelete";

export default function AccountDelete() {
  const {
    password,
    setPassword,
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    handleDelete,
    isDeleting,
    errorMsg,
    setErrorMsg,
  } = useAccountDelete();

  return (
    <>
      <VStack gap={6} align="stretch" p={6} borderWidth="1px" borderRadius="xl" borderColor="red.200" bg="red.50">
        <VStack gap={2} align="flex-start">
          <Text fontSize="lg" fontWeight="semibold" color="red.600">
            Delete Account
          </Text>
          <Text fontSize="sm" color="gray.600">
            Once you delete your account, there is no going back. All your data including
            blog posts, comments, and bookmarks will be permanently removed.
          </Text>
        </VStack>

        {errorMsg && (
          <Box p={3} bg="red.100" borderRadius="md" borderWidth="1px" borderColor="red.300">
            <Text color="red.700" fontSize="sm">{errorMsg}</Text>
          </Box>
        )}

        <CusFormCtrl formTitle="Confirm your password">
          <CusInput
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMsg("");
            }}
            placeholder="Enter your password"
            startElement={<Lock size={16} />}
          />
        </CusFormCtrl>

        <Box>
          <Button
            colorPalette="red"
            size="sm"
            onClick={handleOpenModal}
          >
            Delete My Account
          </Button>
        </Box>
      </VStack>

      {/* 확인 모달 */}
      <CusModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Confirm Account Deletion"
        size="sm"
        footer={
          <Box display="flex" gap={3} justifyContent="flex-end" w="100%">
            <Button variant="outline" size="sm" onClick={handleCloseModal} disabled={isDeleting}>
              Cancel
            </Button>
            <Button colorPalette="red" size="sm" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Spinner size="sm" /> : "Delete"}
            </Button>
          </Box>
        }
      >
        <VStack gap={4} align="center" py={4}>
          <Box color="red.500">
            <AlertTriangle size={48} />
          </Box>
          <Text textAlign="center" fontSize="sm" color="gray.600">
            Are you sure you want to delete your account?
            This action cannot be undone.
          </Text>
        </VStack>
      </CusModal>
    </>
  );
}
