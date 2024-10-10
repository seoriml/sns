// src/components/heart/HeartComponent.jsx
import React, { useState } from 'react';
import useAPI from '../../hooks/useAPI';
import emptyHeart from "../../assets/images/icon_heart.svg";
import fillHeart from "../../assets/images/icon_heart_fill.svg";

// hearts: 초기 좋아요 수, hearted: 사용자의 초기 좋아요 상태
function HeartComponent({ hearts, postId, hearted }) {
  const [heartCount, setHeartCount] = useState(hearts);
  const [localHearted, setLocalHearted] = useState(hearted);
  const { post, del } = useAPI();
  const token = localStorage.getItem('userToken');

  // 게시물 좋아요
  const handleHeart = async () => {
    // 즉시 로컬 상태 업데이트
    setHeartCount(prevCount => prevCount + 1);
    setLocalHearted(true);
    try {
      await post (
        `${import.meta.env.VITE_API_URL}/post/${postId}/heart`,
        "",
        "application/json",
        token
      );
      console.log("게시물 좋아요 성공");
    }
    catch (error) {
      // 게시물 좋아요 API 호출 실패 시 로컬 상태 되돌리기
      setHeartCount(prevCount => prevCount - 1);
      setLocalHearted(false);
      alert("좋아요 API 요청 중 에러 발생");
      console.error("좋아요 API 요청 중 에러 발생:", error);
    }
  };

  // 게시물 좋아요 취소
  const handleUnHeart = async () => {
    // 즉시 로컬 상태 업데이트
    setHeartCount(prevCount => prevCount - 1);
    setLocalHearted(false);
    try {
      await del (
        `${import.meta.env.VITE_API_URL}/post/${postId}/unheart`,
        "application/json",
        token
      );
      console.log("게시물 좋아요 취소 성공");
    }
    catch (error) {
      // 게시물 좋아요 취소 API 호출 실패 시 로컬 상태 되돌리기
      setHeartCount(prevCount => prevCount + 1);
      setLocalHearted(true);
      alert("좋아요 취소 API 요청 중 에러 발생");
      console.error("좋아요 취소 API 요청 중 에러 발생:", error);
    }
  };

  return (
    <>
      {localHearted
        ? (
          <button onClick={handleUnHeart}>
            <img src={fillHeart} alt="이미 좋아요를 한 게시글입니다." />
            <span>{heartCount}</span>
          </button>
        ) 
        : (
          <button onClick={handleHeart}>
            <img src={emptyHeart} alt="아직 좋아요를 안 한 게시글입니다." />
            <span>{heartCount}</span>
          </button>
        )
      }
    </>
  )
}

export default HeartComponent;