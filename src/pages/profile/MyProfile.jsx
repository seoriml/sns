import React from "react";
import { useParams } from "react-router-dom";
import ProfileInfo from "../../components/profile/profile-info/ProfileInfo";
import ProfileTabs from "../../components/profile/profile-info/ProfileTabs";

export default function MyProfile() {
  // const { accountName } = useParams();
  // console.log(useParams());
  return (
    <div>
      <ProfileInfo isMyProfile={true} />
      <ProfileTabs accountname={"codegram1"} />
    </div>
  );
}

// "codegram1"
// "String2"
