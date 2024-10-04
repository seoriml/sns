import React, { useState } from "react";
import Input from "../ui/Input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, redirect } from "react-router-dom";
import useAPI from "./../../hooks/useAPI";
import { setCredentials } from "../../redux/apiSlice";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { token, isLoggedIn, post, loading, error } = useAPI();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateEmail = (email) => {
    if (!email) {
      setEmailError("* 이메일을 입력해주세요.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError("* 비밀번호를 입력해주세요.");
    } else {
      setPasswordError("");
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    setWarningMessage("");
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await post(`${import.meta.env.VITE_API_URL}/user/login`, {
      user: {
        email: email,
        password: password,
      },
    });
    console.log(result);
    if (result.payload?.user?.token) {
      dispatch(setCredentials(result.payload.user));
      navigate("/home");
    } else {
      setWarningMessage("*" + result.payload.message);
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;
  return (
    <form onSubmit={handleSubmit} noValidate>
      <Input
        name="email"
        label="이메일"
        warningMessage={emailError ? emailError : warningMessage}
        type="email"
        onChange={handleEmailChange}
      />
      <Input
        name="password"
        label="비밀번호"
        warningMessage={passwordError}
        type="password"
        onChange={handlePasswordChange}
        onBlur={() => validatePassword(password)}
      />
      <button
        type="submit"
        style={{ border: "1px solid black", margin: "10px" }}
        disabled={!!emailError || !!passwordError || !email || !password || !!warningMessage}
      >
        Login button
      </button>
    </form>
  );
}
