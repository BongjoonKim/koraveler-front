import React from "react";
import {
  Box, VStack, HStack, Text, Button, Input, Badge, Spinner,
} from "@chakra-ui/react";
import { User, Mail, Calendar, Shield, Pencil } from "lucide-react";
import CusFormCtrl from "../../../../common/elements/CusFormCtrl";
import CusAvatar from "../../../../common/elements/CusAvatar";
import useProfileInfo from "./useProfileInfo";
import styled from "styled-components";

export default function ProfileInfo() {
  const {
    profile,
    isLoading,
    isEditing,
    form,
    handleChange,
    handleEdit,
    handleCancel,
    handleSave,
    isSaving,
    successMsg,
    errorMsg,
  } = useProfileInfo();

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <StyledProfileInfo>
      <VStack gap={6} align="stretch">
        {/* 프로필 헤더 */}
        <HStack gap={4} p={6} bg="gray.50" borderRadius="xl">
          <CusAvatar
            name={profile.name || profile.userId}
            src={profile.src}
            size="lg"
          />
          <Box>
            <Text fontSize="xl" fontWeight="bold">{profile.name || profile.userId}</Text>
            <Text fontSize="sm" color="gray.500">@{profile.userId}</Text>
            <HStack gap={2} mt={1}>
              {profile.roles?.map((role) => (
                <Badge key={role} colorPalette="purple" size="sm">
                  {role}
                </Badge>
              ))}
            </HStack>
          </Box>
        </HStack>

        {/* 메시지 표시 */}
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

        {/* 프로필 정보 */}
        <VStack gap={4} align="stretch" p={6} borderWidth="1px" borderRadius="xl" borderColor="gray.200">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="semibold">Profile Information</Text>
            {!isEditing && (
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Pencil size={16} />
                Edit
              </Button>
            )}
          </HStack>

          {isEditing ? (
            <>
              <CusFormCtrl formTitle="Name">
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Enter your name"
                />
              </CusFormCtrl>

              <CusFormCtrl formTitle="Email">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter your email"
                />
              </CusFormCtrl>

              <CusFormCtrl formTitle="Birthday">
                <Input
                  type="date"
                  value={form.birthday}
                  onChange={(e) => handleChange("birthday", e.target.value)}
                />
              </CusFormCtrl>

              <HStack gap={3} justify="flex-end" pt={2}>
                <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                  Cancel
                </Button>
                <Button
                  colorPalette="blue"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? <Spinner size="sm" /> : "Save"}
                </Button>
              </HStack>
            </>
          ) : (
            <VStack gap={3} align="stretch">
              <InfoRow icon={<User size={16} />} label="Name" value={profile.name} />
              <InfoRow icon={<Mail size={16} />} label="Email" value={profile.email} />
              <InfoRow
                icon={<Calendar size={16} />}
                label="Birthday"
                value={profile.birthday ? new Date(profile.birthday).toLocaleDateString() : "-"}
              />
              <InfoRow icon={<Shield size={16} />} label="User ID" value={profile.userId} />
              <InfoRow
                icon={<Calendar size={16} />}
                label="Joined"
                value={profile.created ? new Date(profile.created).toLocaleDateString() : "-"}
              />
            </VStack>
          )}
        </VStack>
      </VStack>
    </StyledProfileInfo>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string }) {
  return (
    <HStack gap={3} py={2} borderBottomWidth="1px" borderColor="gray.100">
      <Box color="gray.400">{icon}</Box>
      <Text fontSize="sm" color="gray.500" minW="80px">{label}</Text>
      <Text fontSize="sm" fontWeight="medium">{value || "-"}</Text>
    </HStack>
  );
}

const StyledProfileInfo = styled.div`
  width: 100%;
`;
