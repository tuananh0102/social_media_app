import TopBar from "~/components/TopBar";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";
import Cookies from "universal-cookie";
import styles from "./Profile.module.scss";

import SideBar from "~/components/SideBar";
import Feed from "~/components/Feed";
import RightBar from "~/components/RightBar";
import { useParams } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { getUserById } from "~/apiServices/user/getUserById";
import { UserContext } from "~/contexts";
import { getFriendUser } from "~/apiServices/user/getFriendUser";
import { getPostsByUser } from "~/apiServices/post/getPostsByUser";
import { PersonAdd, HourglassEmpty, People } from "@material-ui/icons";
import { createRequestAddFriend } from "~/apiServices/user/createRequestAddFriend";
import { deleteRequestAddFriend } from "~/apiServices/user/deleteRequestAddFriend";
import { getIsFriend } from "~/apiServices/user/getIsFriend";
import { changeAvatar } from "~/apiServices/user/changeAvatar";

const cx = classNames.bind(styles);
function Profile() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const cookies = new Cookies();
  let { id } = useParams();

  const [profileUser, setProfileUser] = useState({});
  const [friendsUser, setFriendsUser] = useState([]);
  const [isAppearShare, setIsAppearShare] = useState(false);
  const [posts, setPosts] = useState([]);

  const [isDisPlayStatus, setIsDisplayStatus] = useState(false);
  const [isNoFriend, setIsNoFriend] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isFriend, setIsFriend] = useState(false);

  const [isCurrentImg, setIsCurrentImg] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const avatarRef = useRef();

  const handleAddFriend = () => {
    const fetchAddFriendApi = async () => {
      await createRequestAddFriend(id);
      setIsNoFriend(false);
      setIsPending(true);
    };

    fetchAddFriendApi();
  };

  const fetchCurrnetUserApi = async () => {
    try {
      const res = await getUserById(cookies.get("id"));
      setCurrentUser(res.data);
      setProfileUser(res.data);
    } catch (e) {}
  };
  const handleDeleteAddFriend = async () => {
    const fetchDeleteRequestApi = async () => {
      await deleteRequestAddFriend(id);
      setIsPending(false);
      setIsFriend(false);
      setIsNoFriend(true);
    };

    fetchDeleteRequestApi();
  };

  const handleOnClickAvatar = () => {
    avatarRef.current.click();
  };

  const handleUploadImage = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUndo = () => {
    setSelectedFile(null);
    avatarRef.current.value = null;
  };

  const handleSubmitAvatar = () => {
    const fetchPostApi = async (formData) => {
      await changeAvatar(formData);
      await fetchCurrnetUserApi();

      // setCurrentUser(res.data);
    };
    const formData = new FormData();
    formData.append("formFile", selectedFile);
    fetchPostApi(formData);
    avatarRef.current.value = null;
    setSelectedFile(null);
  };

  useEffect(() => {
    const fetchUserProfileApi = async () => {
      try {
        if (id) {
          console.log("profile ", id);
          const res = await getUserById(id);

          setProfileUser(res.data);
        } else {
          console.log("profile null ", id);
          const res = await getUserById(cookies.get("id"));

          setProfileUser(res.data);
        }
      } catch (e) {
        if (e.response.status == 401) navigate("/login");
      }
    };

    const fetchPostApi = async () => {
      let res;
      if (id) res = await getPostsByUser(id);
      else res = await getPostsByUser(cookies.get("id"));
      setPosts(res.data);
    };

    const fetchFriendsUser = async () => {
      let res;
      if (id) res = await getFriendUser(id);
      else res = await getFriendUser(cookies.get("id"));

      setFriendsUser(res.data);
    };

    const fetchIsFriendUser = async () => {
      try {
        if (id && id != cookies.get("id")) {
          const res = await getIsFriend(id);
          setIsFriend(res.data);
          setIsNoFriend(!res.data);
        }
      } catch (e) {}
    };

    fetchUserProfileApi();
    fetchPostApi();
    fetchFriendsUser();
    fetchIsFriendUser();
  }, [id]);

  useEffect(() => {
    if (profileUser.id == cookies.get("id")) {
      setIsAppearShare(true);
      setIsDisplayStatus(false);
    } else {
      console.log(profileUser.id, cookies.get("id"));

      setIsAppearShare(false);
      setIsDisplayStatus(true);
    }
  }, [profileUser]);

  return (
    <div className={cx("container")}>
      <TopBar />
      <div className={cx("body-wrapper")}>
        <SideBar />
        <div className={cx("wrapper-profile")}>
          <div className={cx("profile-top")}>
            <img
              className={cx("cover-img")}
              src="/assets/post/2.jpeg"
              alt="img"
            />
            <div className={cx("avatars")}>
              <input
                disabled={!id || id == cookies.get("id") ? false : true}
                ref={avatarRef}
                type="file"
                hidden
                onChange={(e) => {
                  handleUploadImage(e);
                }}
              />
              <img
                className={cx("avatar")}
                src={
                  selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : profileUser.avatar
                }
                alt="avatar"
                onClick={handleOnClickAvatar}
              />
              {selectedFile && (
                <div className={cx("buttons")}>
                  <button className={cx("undo")} onClick={handleUndo}>
                    Undo
                  </button>
                  <button className={cx("change")} onClick={handleSubmitAvatar}>
                    Change
                  </button>
                </div>
              )}

              <p className={cx("name")}>
                {`${profileUser.surname} `}
                {profileUser.given_name ? profileUser.given_name : ""}
              </p>
              <p className={cx("desc")}>Hello my friend</p>
            </div>
            {isDisPlayStatus && (
              <div className={cx("friend-status-btn")}>
                {isNoFriend && (
                  <div className={cx("friend-btn")}>
                    <PersonAdd className={cx("icon-status")} />
                    <span
                      className={"friend-status"}
                      onClick={() => handleAddFriend()}
                    >
                      Add Friend
                    </span>
                  </div>
                )}
                {isPending && (
                  <div className={cx("friend-btn")}>
                    <HourglassEmpty className={cx("icon-status")} />
                    <span
                      className={"friend-status"}
                      onClick={() => handleDeleteAddFriend()}
                    >
                      Pending
                    </span>
                  </div>
                )}
                {isFriend && (
                  <div className={cx("friend-btn")}>
                    <People className={cx("icon-status")} />
                    <span
                      className={"friend-status"}
                      onClick={() => handleDeleteAddFriend()}
                    >
                      Friend
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={cx("profile-bottom")}>
            <Feed share={isAppearShare} posts={posts} />
            <RightBar profile friendsUser={friendsUser} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
