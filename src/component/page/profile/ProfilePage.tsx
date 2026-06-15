import React from "react";
import ProfileInfo from "./ProfileInfo/ProfileInfo";
import PasswordChange from "./PasswordChange/PasswordChange";
import AccountDelete from "./AccountDelete/AccountDelete";
import useProfilePage from "./useProfilePage";
import { Page, Inner, PageHeader, TabBar, TabButton } from "./profileUi";

export default function ProfilePage() {
  const { tabs, activeTab, setActiveTab } = useProfilePage();

  return (
    <Page>
      <Inner>
        <PageHeader
          eyebrow="Account"
          title="My Profile"
          sub="Manage your personal information, password, and account."
        />

        <TabBar role="tablist">
          {tabs.map((tab) => (
            <TabButton
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              $active={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
            </TabButton>
          ))}
        </TabBar>

        {activeTab === "profile" && <ProfileInfo />}
        {activeTab === "password" && <PasswordChange />}
        {activeTab === "account" && <AccountDelete />}
      </Inner>
    </Page>
  );
}
