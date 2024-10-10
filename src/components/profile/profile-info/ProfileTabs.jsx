import React, { useState, useEffect } from "react";
import PostList from "./PostList";
import PostGrid from "./PostGrid";
import useAPI from "../../../hooks/useAPI";
import iconListOn from "../../../assets/images/icon_post_list_on.svg";
import iconListOff from "../../../assets/images/icon_post_list_off.svg";
import iconAlbumOn from "../../../assets/images/icon_post_album_on.svg";
import iconAlbumOff from "../../../assets/images/icon_post_album_off.svg";
import styles from "./ProfileInfo.module.scss";

const ProfileTabs = ({ accountname }) => {
  const [isListView, setIsListView] = useState(true); // 기본값: 리스트 뷰
  const [posts, setPosts] = useState([]);
  const { get } = useAPI();
  const [limit] = useState(10); // 페이지당 게시물 수
  const [skip, setSkip] = useState(0); // 시작 위치 초기값

  // 데이터 가져오기
  const fetchPosts = async () => {
    const token = localStorage.getItem("userToken");
    const response = await get(
      `${
        import.meta.env.VITE_API_URL
      }/post/${accountname}/userpost?limit=${limit}&skip=${skip}`,
      "application/json",
      token
    );

    setPosts(response.payload.post); // 받아온 게시물 데이터 설정
  };

  // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
  useEffect(() => {
    if (accountname) {
      fetchPosts();
    }
  }, [accountname]);

  // 리스트 뷰와 그리드 뷰 간 전환
  const tabView = (view) => {
    setIsListView(view);
  };
  return (
    <div>
      <div className={styles.profileTabs}>
        {/* 리스트 뷰 아이콘 */}
        <img
          src={isListView ? iconListOn : iconListOff}
          alt="리스트 뷰 아이콘"
          onClick={() => {
            tabView(true);
          }}
        />
        {/* 앨범(그리드) 뷰 아이콘 */}
        <img
          src={isListView ? iconAlbumOff : iconAlbumOn}
          alt="앨범 뷰 아이콘"
          onClick={() => {
            tabView(false);
          }}
        />
      </div>
      {/* 게시물 렌더링: 리스트 뷰 또는 그리드 뷰 */}
      {isListView ? <PostList posts={posts} /> : <PostGrid posts={posts} />}
    </div>
  );
};

export default ProfileTabs;
