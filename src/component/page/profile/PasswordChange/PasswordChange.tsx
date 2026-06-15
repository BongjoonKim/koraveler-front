import React from "react";
import { Lock } from "lucide-react";
import usePasswordChange from "./usePasswordChange";
import {
  Card,
  CardHead,
  SectionTitle,
  Field,
  Label,
  PasswordInput,
  PrimaryButton,
  Actions,
  Alert,
  Spinner,
} from "../profileUi";

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

  const lock = <Lock size={16} />;

  return (
    <Card>
      <CardHead>
        <SectionTitle>Change Password</SectionTitle>
      </CardHead>

      {successMsg && <Alert tone="success">{successMsg}</Alert>}
      {errorMsg && <Alert tone="error">{errorMsg}</Alert>}

      <div style={{ marginTop: successMsg || errorMsg ? 16 : 0 }}>
        <Field>
          <Label>Current Password</Label>
          <PasswordInput
            value={currentPassword}
            onChange={(v) => {
              setCurrentPassword(v);
              setErrorMsg("");
            }}
            placeholder="Enter current password"
            leftIcon={lock}
            autoComplete="current-password"
          />
        </Field>

        <Field>
          <Label>New Password</Label>
          <PasswordInput
            value={newPassword}
            onChange={(v) => {
              setNewPassword(v);
              setErrorMsg("");
            }}
            placeholder="Enter new password"
            leftIcon={lock}
            autoComplete="new-password"
          />
        </Field>

        <Field>
          <Label>Confirm New Password</Label>
          <PasswordInput
            value={confirmPassword}
            onChange={(v) => {
              setConfirmPassword(v);
              setErrorMsg("");
            }}
            placeholder="Confirm new password"
            leftIcon={lock}
            autoComplete="new-password"
          />
        </Field>
      </div>

      <Actions>
        <PrimaryButton onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Change Password"}
        </PrimaryButton>
      </Actions>
    </Card>
  );
}
