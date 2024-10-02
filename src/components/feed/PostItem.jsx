// components/PostItem.jsx
import React from "react";
import { Link } from "react-router-dom";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

const PostItem = ({ post }) => {
  const imageArray = post.image ? post.image.split(",") : [];

  return (
    <div>
      <div>
        <img
          src={post.author.image}
          alt={`${post.author.username}의 프로필`}
          style={{ width: "42px", borderRadius: "100%", background: "#ccc" }}
        />
        <h3>{post.author.username}</h3>
        <p>@{post.author.accountname}</p>
      </div>
      <Link to={`/edit/${post.id}`}>
        <button>수정</button>
      </Link>
      <div>
        <p>{post.content}</p>
        {imageArray.length > 0 &&
          imageArray.map((image, index) => (
            <img
              key={index}
              src={
                image.startsWith("http")
                  ? image
                  : `${import.meta.env.VITE_API_URL}/${image}`
              }
              alt={`게시물 이미지 ${index + 1}`}
              style={{ maxWidth: "100%", height: "auto" }}
            />
          ))}
      </div>
      <div>
        <p>{formatDate(post.createdAt)}</p>
      </div>
    </div>
  );
};

export default PostItem;
