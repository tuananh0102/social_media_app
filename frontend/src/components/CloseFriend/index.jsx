import classNames from "classnames/bind";

import styles from "./CloseFriend.module.scss";

const cx = classNames.bind(styles);

function CloseFriend({ user }) {
  return (
    <>
      <img className={cx("friend-img")} src={user.mediaLocation} />
      <span className={cx("friend-name")}>{user.username}</span>
    </>
  );
}

export default CloseFriend;
