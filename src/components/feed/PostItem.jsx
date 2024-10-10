// components/PostItem.jsx
import React from "react";
import useAPI from "../../hooks/useAPI";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  openOptionsModal,
  closeOptionsModal,
} from "../../redux/optionsModalSlice";
import { openConfirmModal } from "../../redux/confirmModalSlice";
import OptionsModal from "../ui/modal/OptionsModal";
import ConfirmModal from "../ui/modal/ConfirmModal";
import moreIcon from "../../assets/images/icon_more_vertical_mini.svg";
import defaultProfileIcon from "../../assets/images/user_profile.svg";
import styles from "../feed/PostFeed.module.scss";
import HeartComponent from "../heart/HeartComponent";
import commentsIcon from "../../assets/images/icon_chat.svg";

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

const PostItem = ({ post, selectedPost, setSelectedPost, commentCount }) => {
  const location = useLocation();
  const path = location.pathname;

  const { del, token } = useAPI();
  const imageArray = post.image
    ? post.image
        .split(",")
        .filter((url) => url && url !== `${import.meta.env.VITE_API_URL}/`)
    : [];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 게시글 삭제 함수
  const handleDelete = async () => {
    {
      const response = await del(
        `${import.meta.env.VITE_API_URL}/post/${post.id}`,
        "application/json",
        token
      );

      if (response.meta?.rejectedWithValue) {
        if (response.payload === "HTTP error.! status: 403") {
          alert("잘못된 요청입니다. 로그인 정보를 확인하세요.");
          navigate("/home");
        } else if (response.payload === "HTTP error.! status: 404") {
          alert("존재하지 않는 게시글입니다.");
          navigate("/home");
        } else {
          alert(`${response.payload.message || "게시글 삭제에 실패했습니다."}`);
        }
      } else {
        alert("삭제되었습니다.");
        navigate("/home");
      }
    }
  };

  // 삭제,수정,닫기 옵션모달
  const actionHandlersOptions = {
    optionDelete: () => {
      handleOpenConfirmModal();
    },
    optionEdit: () => {
      navigate(`/edit/${post.id}`);
      dispatch(closeOptionsModal());
    },
  };
  const handleOpenOptionsModal = () => {
    if (!path.includes("detail")) {
      setSelectedPost();
    }
    const options = [
      { text: "삭제", actionId: "optionDelete" },
      { text: "수정", actionId: "optionEdit" },
    ];
    dispatch(
      openOptionsModal({
        options: options,
      })
    );
  };

  // 삭제 컨펌모달
  const actionHandlersConfirm = {
    confirmDelete: async () => {
      await handleDelete();
      dispatch(closeOptionsModal());
    },
  };

  const handleOpenConfirmModal = () => {
    dispatch(
      openConfirmModal({
        modalType: "confirm",
        modalTitle: "게시글을 삭제할까요?",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
        confirmActionId: "confirmDelete",
      })
    );
  };

  const profileImageSrc =
    post.author.image === "http://146.56.183.55:5050/Ellipse.png"
      ? defaultProfileIcon
      : post.author.image;

  return (
    <>
      <div className={styles.feedItem}>
        <img
          className={styles.profileImg}
          src={profileImageSrc}
          alt={`${post.author.username}의 프로필사진`}
        />
        <div className={styles.postContent}>
          <div className={styles.author}>
            <div>
              <h3 className={styles.username}>{post.author.username}</h3>
              <p className={styles.accountname}>@{post.author.accountname}</p>
            </div>
            <button
              className={styles.openModal}
              onClick={handleOpenOptionsModal}
              aria-label="옵션 열기"
            >
              <img src={moreIcon} alt="더보기" />
            </button>
          </div>
          <Link to={`/detail/${post.id}`}>
            <p className={styles.textContent}>{post.content}</p>
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
                  className={styles.images}
                />
              ))}
          </Link>
          <div>
            <HeartComponent
              hearts={post.heartCount}
              postId={post.id}
              hearted={post.hearted}
            />
            <Link to={`/detail/${post.id}`}>
              <img src={commentsIcon} alt="댓글 수" />
              {post.comments.length}
            </Link>
          </div>
          <p className={styles.date}>{formatDate(post.createdAt)}</p>
        </div>
        {(path.includes("detail") || selectedPost === post.id) && (
          <>
            <OptionsModal actionHandlers={actionHandlersOptions} />
            <ConfirmModal actionHandlers={actionHandlersConfirm} />
          </>
        )}
      </div>
    </>
  );
};

export default PostItem;
