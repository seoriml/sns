import React from "react";
import iconImageLayers from "../../../assets/images/icon_image_layers.svg";
import { useNavigate } from "react-router-dom";

const PostGrid = ({ posts }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        padding: "20px",
        backgroundColor: posts.length === 0 ? "#efefef" : "transparent",
        // minHeight: "100vh",
        // width: "100%",
      }}
    >
      {posts.length > 0 &&
        posts
          .filter((post) => post.image)
          .map((post) => {
            const imageArray = post.image.split(",");
            return (
              <div
                key={post.id}
                style={{ position: "relative", overflow: "hidden" }}
                onClick={() => navigate(`/detail/${post.id}`)}
              >
                <img
                  src={
                    imageArray[0].startsWith("http")
                      ? imageArray[0]
                      : `${import.meta.env.VITE_API_URL}/${imageArray[0]}`
                  }
                  alt={`게시물 이미지 ${post.id}`}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
                {imageArray.length > 1 && (
                  <img
                    src={iconImageLayers}
                    alt="여러 이미지 아이콘"
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      width: "24px",
                      height: "24px",
                    }}
                  />
                )}
              </div>
            );
          })}
    </div>
  );
};

export default PostGrid;
