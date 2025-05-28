import React from "react";
// import UserAccesibility from "./components/user-accesibility";
import UserAccountStatus from "./components/user-account-status";
import UserFeedBack from "./components/user-feedback";
import UserLanguage from "./components/user-language";
import UserNotificationPreference from "./components/user-notifcation-preference";
import UserProfilePic from "./components/user-profile-picture";
import UserSecurity from "./components/user-security";
import UsersInfo from "./components/usersInfo";

const Settings: React.FC = () => {
  return (
    <div className="flex gap-5 flex-col lg:flex-row  justify-evenly  p-4">
      <div className="flex flex-col items-center  space-y-5 ">
        <UserProfilePic />
        <UserNotificationPreference />
        <UserSecurity />
        <UserLanguage />
      </div>
      <div className="flex flex-col items-start justify-start space-y-5">
        <UsersInfo />
        {/* <UserAccesibility /> */}
        <UserFeedBack />
        <UserAccountStatus />
      </div>
    </div>
  );
};

export default Settings;
