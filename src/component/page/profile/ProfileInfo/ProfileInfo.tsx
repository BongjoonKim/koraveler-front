import React from "react";
import { User, Mail, Calendar, Shield, Pencil } from "lucide-react";
import useProfileInfo from "./useProfileInfo";
import {
  Stack,
  Card,
  CardHead,
  SectionTitle,
  Field,
  Label,
  TextInput,
  GhostButton,
  PrimaryButton,
  OutlineButton,
  Actions,
  Alert,
  Badge,
  Avatar,
  InfoRow,
  IdentityRow,
  IdentityName,
  IdentityHandle,
  BadgeRow,
  Spinner,
  PageLoader,
} from "../profileUi";

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

  if (isLoading) return <PageLoader />;
  if (!profile) return null;

  return (
    <Stack>
      {/* 신원 카드 */}
      <Card>
        <IdentityRow>
          <Avatar name={profile.name || profile.userId} src={profile.src} />
          <div>
            <IdentityName>{profile.name || profile.userId}</IdentityName>
            <IdentityHandle>@{profile.userId}</IdentityHandle>
            {!!profile.roles?.length && (
              <BadgeRow>
                {profile.roles.map((role) => (
                  <Badge key={role}>{role}</Badge>
                ))}
              </BadgeRow>
            )}
          </div>
        </IdentityRow>
      </Card>

      {/* 메시지 */}
      {successMsg && <Alert tone="success">{successMsg}</Alert>}
      {errorMsg && <Alert tone="error">{errorMsg}</Alert>}

      {/* 프로필 정보 */}
      <Card>
        <CardHead>
          <SectionTitle>Profile Information</SectionTitle>
          {!isEditing && (
            <GhostButton onClick={handleEdit}>
              <Pencil size={15} />
              Edit
            </GhostButton>
          )}
        </CardHead>

        {isEditing ? (
          <>
            <Field>
              <Label>Name</Label>
              <TextInput
                value={form.name ?? ""}
                onChange={(v) => handleChange("name", v)}
                placeholder="Enter your name"
                autoComplete="name"
              />
            </Field>

            <Field>
              <Label>Email</Label>
              <TextInput
                type="email"
                value={form.email ?? ""}
                onChange={(v) => handleChange("email", v)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </Field>

            <Field>
              <Label>Birthday</Label>
              <TextInput
                type="date"
                value={form.birthday ?? ""}
                onChange={(v) => handleChange("birthday", v)}
              />
            </Field>

            <Actions>
              <OutlineButton onClick={handleCancel} disabled={isSaving}>
                Cancel
              </OutlineButton>
              <PrimaryButton onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Spinner /> : "Save changes"}
              </PrimaryButton>
            </Actions>
          </>
        ) : (
          <div>
            <InfoRow icon={<User size={16} />} label="Name" value={profile.name} />
            <InfoRow icon={<Mail size={16} />} label="Email" value={profile.email} />
            <InfoRow
              icon={<Calendar size={16} />}
              label="Birthday"
              value={
                profile.birthday
                  ? new Date(profile.birthday).toLocaleDateString()
                  : "—"
              }
            />
            <InfoRow icon={<Shield size={16} />} label="User ID" value={profile.userId} />
            <InfoRow
              icon={<Calendar size={16} />}
              label="Joined"
              value={
                profile.created
                  ? new Date(profile.created).toLocaleDateString()
                  : "—"
              }
            />
          </div>
        )}
      </Card>
    </Stack>
  );
}
