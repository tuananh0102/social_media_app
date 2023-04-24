import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./RightBar.module.scss";

import Online from "../Online";
const cx = classNames.bind(styles);

function RightBar({ home = false, profile = false, friendsUser = [] }) {
  const navigator = useNavigate();
  const HomeRightBar = () => {
    return (
      <>
        <div className={cx("birthday-container")}>
          <img className={cx("gift-img")} src="/assets/gift.png" alt="gift" />
          <span className={cx("birthday-friends")}>
            <b>Pola Foster</b> and <b>3 other friends</b> have a birthday today
          </span>
        </div>
        <div className={cx("ad-container")}>
          <img className={cx("ad-img")} src="assets/ad.png" alt="ad" />
        </div>
        <div className={cx("online-container")}>
          <h4 className={cx("title")}>Online Friends</h4>
          <div className={cx("list-online-friends")}>
            {friendsUser.map((user) => (
              <Online key={user.id} user={user} />
            ))}
          </div>
        </div>
      </>
    );
  };

  const ProfileRightBar = () => {
    return (
      <div className="profile-container">
        <div className={cx("infos")}>
          <p className={cx("title")}>User Information</p>
          <div className={cx("detail-info")}>
            <span className={cx("label")}>City: </span>
            <span className={cx("info")}>New York</span>
          </div>
          <div className={cx("detail-info")}>
            <span className={cx("label")}>From: </span>
            <span className={cx("info")}>Madrid</span>
          </div>
          <div className={cx("detail-info")}>
            <span className={cx("label")}>Relationship: </span>
            <span className={cx("info")}>Single</span>
          </div>
        </div>
        <div className={cx("wrapper-friends")}>
          <p className={cx("title")}>User Friends</p>
          <div className={cx("friends")}>
            {friendsUser.map((user) => {
              return (
                <div
                  key={user.id}
                  className={cx("wrapper-friend")}
                  onClick={() => {
                    navigator(`/profile/${user.id}`);
                  }}
                >
                  <div className={cx("friend")}>
                    <img
                      className={cx("avatar")}
                      src={user.avatar}
                      alt="avatar"
                    />
                    <span className={cx("name")}>
                      {`${user.surname} `}
                      {user.given_name ? user.given_name : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cx("container")}>
      {home && <HomeRightBar />}
      {profile && <ProfileRightBar />}
    </div>
  );
}

export default RightBar;
