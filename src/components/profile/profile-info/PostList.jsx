import React, { useState } from "react";
import PostItem from "../../feed/PostItem";
import OptionsModal from "../../ui/modal/OptionsModal";
import ConfirmModal from "../../ui/modal/ConfirmModal";

const PostList = ({ posts }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  const handleSelectPost = (postId) => {
    setSelectedPost(postId);
  };

  return (
    <div
      style={{
        backgroundColor: posts.length === 0 ? "#efefef" : "transparent",
        // minHeight: "100vh",
        // width: "100%",
      }}
    >
      {posts.length > 0 &&
        posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            selectedPost={selectedPost}
            setSelectedPost={() => handleSelectPost(post.id)}
            OptionsModalComponent={OptionsModal}
            ConfirmModalComponent={ConfirmModal}
          />
        ))}
    </div>
  );
};

export default PostList;
