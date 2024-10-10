// components/PostDetailComponent.jsx
import React, { useState, useEffect } from "react";
import PostItem from "../feed/PostItem";
import styles from "../feed/PostFeed.module.scss";
import BackButton from "../ui/button/BackButton";
import CommentList from "./comment/CommentList";

export default function PostDetailComponent({ post }) {
  const [commentCount, setCommentCount] = useState(post.comments.length);

  const updateCommentCount = (newCount) => {
    setCommentCount(newCount);
  };

  useEffect(() => {
    setCommentCount(post.comments.length);
  }, [post.comments.length]);

  return (
    <>
      <div className={styles.header}>
        <BackButton />
      </div>
      <div className={styles.postsWrapper}>
        <PostItem post={post} commentCount={commentCount} />
        <CommentList postId={post.id} updateCommentCount={updateCommentCount} />
      </div>
    </>
  );
}
