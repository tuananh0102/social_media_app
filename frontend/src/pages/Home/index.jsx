import TopBar from "~/components/TopBar";
import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import styles from "./Home.module.scss";

import SideBar from "~/components/SideBar";
import Feed from "~/components/Feed";
import RightBar from "~/components/RightBar";
import { UserContext } from "~/contexts";
import { useEffect, useState } from "react";
import { getUserById } from "~/apiServices/user/getUserById";
import { getFriendUser } from "~/apiServices/user/getFriendUser";
import { getAllPosts } from "~/apiServices/post/getAllPosts";

const cx = classNames.bind(styles);

function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const cookies = new Cookies();
  const [posts, setPosts] = useState([]);
  const [friendsUser, setFriendsUser] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getUserById(cookies.get("id"));
        setCurrentUser(res.data);
      } catch (e) {
        navigate("/login");
      }
    };

    const fetchPostApi = async () => {
      try {
        const res = await getAllPosts();
        setPosts(res.data);
      } catch (e) {
        navigate("/login");
      }
    };

    const fetchFriendsUser = async () => {
      try {
        const res = await getFriendUser(cookies.get("id"));
        setFriendsUser(res.data);
      } catch (e) {
        setFriendsUser([]);
      }
    };
    fetchApi();
    fetchPostApi();
    fetchFriendsUser();
  }, []);
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <div>
        <TopBar />
        <div className={cx("body-wrapper")}>
          <SideBar />
          <Feed share={true} posts={posts} />
          <RightBar home friendsUser={friendsUser} />
        </div>
      </div>
    </UserContext.Provider>
  );
}

export default Home;
