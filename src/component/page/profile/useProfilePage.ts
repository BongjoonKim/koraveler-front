import { useState } from "react";

export default function useProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { label: "Profile", value: "profile" },
    { label: "Password", value: "password" },
    { label: "Account", value: "account" },
  ];

  return {
    activeTab,
    setActiveTab,
    tabs,
  };
}
