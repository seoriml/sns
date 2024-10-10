import React, { useEffect, useState } from "react";
import useAPI from "../../../hooks/useAPI";

export default function CommentList({ postId, updateCommentCount }) {
  const { get, post, token } = useAPI();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  // 댓글 목록 불러오기
  const getCommentsList = async () => {
    {
      const response = await get(
        `${import.meta.env.VITE_API_URL}/post/${postId}/comments`,
        "application/json",
        token
      );

      setComments(response.payload.comments);
      updateCommentCount(response.payload.comments.length); // 댓글 수 업데이트
    }
  };

  useEffect(() => {
    getCommentsList();
  }, []);

  // 댓글 작성
  const handleAddComment = async () => {
    if (!newComment) {
      alert("댓글을 입력해주세요.");
      return;
    }

    const response = await post(
      `${import.meta.env.VITE_API_URL}/post/${postId}/comments`,
      {
        comment: {
          content: newComment,
        },
      },
      "application/json",
      token
    );

    if (response && response.payload.comment) {
      setComments((prevComments) => [
        ...prevComments,
        response.payload.comment.content,
      ]);
      await getCommentsList(); // 댓글 목록 새로 고침
      updateCommentCount(response.payload.comments.length); // 댓글 수 업데이트
      setNewComment("");
      alert("댓글이 추가되었습니다.");
    } else {
      alert("댓글 추가에 실패했습니다.");
    }
  };

  return (
    <div>
      <h3>댓글목록</h3>
      <ul>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id}>
              <p>{comment.content}</p>
            </li>
          ))
        ) : (
          <p>댓글이 없습니다.</p>
        )}
      </ul>
      <div>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글 입력하기"
        />
        <button onClick={handleAddComment}>게시</button>
      </div>
    </div>
  );
}
