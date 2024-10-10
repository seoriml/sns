// 프로필 설정을 수정하는 페이지
import React, { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import useAPI from "../../hooks/useAPI";
import { useNavigate } from "react-router-dom";
import ProfileImagePlaceholder from "../../assets/images/user_profile.svg";
import BackButton from "../../components/ui/button/BackButton";
import ButtonComponent from "../../components/ui/Button";
import ImageUploadButton from "../../components/ui/button/ImageUploadButton";

const ProfileEdit = () => {
  const [username, setUsername] = useState("");
  const [accountName, setAccountName] = useState("");
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState(ProfileImagePlaceholder);
  const [warningMessage, setWarningMessage] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [accountNameError, setAccountNameError] = useState("");
  const [introError, setIntroError] = useState("");

  const { get, put, error } = useAPI();
  const navigate = useNavigate();

  useEffect(() => {
    // 현재 사용자 프로필 정보 가져오기
    const fetchProfile = async () => {
      const token = localStorage.getItem("userToken");
      const response = await get(
        `${import.meta.env.VITE_API_URL}/user/myinfo`,
        "application/json",
        token
      );
      const userData = response.payload.user;
      setUsername(userData.username);
      setAccountName(userData.accountname);
      setIntro(userData.intro);
      setProfileImage(userData.image || ProfileImagePlaceholder); // 기존 프로필 이미지 가져오기
    };
    fetchProfile();
  }, [get]);

  const validateUsername = (username) => {
    if (!username) {
      setUsernameError("* 사용자 이름을 입력해주세요.");
    } else if (username.length < 2 || username.length > 10) {
      setUsernameError("* 2-10자 이내로 작성해주세요.");
    } else {
      setUsernameError("");
    }
  };

  const validateAccountName = (accountName) => {
    const regex = /^[A-Za-z0-9._]+$/;
    if (!accountName) {
      setAccountNameError("* 계정 ID 를 입력해주세요.");
    } else if (!regex.test(accountName)) {
      setAccountNameError("* 영문, 숫자, 밑줄, 마침표만 사용할 수 있습니다.");
    } else {
      setAccountNameError("");
    }
  };

  const validateIntro = (intro) => {
    if (!intro) {
      setIntroError("* 소개 글을 입력해주세요.");
    } else if (intro.length > 60) {
      setIntroError("* 60자 이내로 작성해주세요.");
    } else {
      setIntroError("");
    }
  };

  const handleImageChange = (files) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result); // 업로드한 이미지 미리보기 설정
      };
      reader.readAsDataURL(file); // 파일을 읽어와서 데이터 URL로 변환
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("userToken");
    const result = await put(
      `${import.meta.env.VITE_API_URL}/user`,
      {
        user: {
          username,
          accountname: accountName,
          intro,
          image: profileImage || "",
        },
      },
      "application/json",
      token
    );

    console.log(result);

    if (result.payload?.user) {
      navigate("/profile", { replace: true });
    } else {
      setWarningMessage("*" + result.payload.message);
    }
  };

  if (error) return <div>에러: {error}</div>;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <BackButton />
        <ButtonComponent
          onClick={handleSubmit}
          buttonType="buttonPost"
          disabled={!username || !accountName || !intro}
          style={{ width: "90px", height: "32px" }}
        >
          저장
        </ButtonComponent>
      </div>
      <div>
        <img
          src={profileImage}
          alt="프로필 이미지"
          style={{ width: "110px", height: "110px", borderRadius: "50%" }}
        />
        <ImageUploadButton onChange={handleImageChange} />
      </div>

      <Input
        name="username"
        label="사용자 이름"
        warningMessage={usernameError}
        type="text"
        value={username}
        placeholder="2-10자 이내여야 합니다."
        onChange={(e) => {
          setUsername(e.target.value);
          validateUsername(e.target.value);
        }}
      />
      <Input
        name="accountName"
        label="계정 ID"
        warningMessage={accountNameError}
        type="text"
        value={accountName}
        placeholder="영문, 숫자, 특수문자(.),(_)만 사용 가능합니다."
        onChange={(e) => {
          setAccountName(e.target.value);
          validateAccountName(e.target.value);
        }}
      />
      <Input
        name="intro"
        label="소개"
        warningMessage={introError}
        type="text"
        value={intro}
        placeholder="자신을 소개해 주세요!"
        onChange={(e) => {
          setIntro(e.target.value);
          validateIntro(e.target.value);
        }}
      />
    </form>
  );
};

export default ProfileEdit;
