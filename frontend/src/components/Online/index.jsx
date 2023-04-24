import classNames from "classnames/bind";

import styles from "./Online.module.scss";

const cx = classNames.bind(styles);

function Online({ user }) {
  return (
    <div className={cx("online-friend")}>
      <img className={cx("profile-img")} src={user.avatar} alt="img-profile" />
      <div className={cx("online-status")}></div>
      <span className={cx("name")}>
        {`${user.surname} `}
        {user.given_name ? user.given_name : ""}
      </span>
    </div>
  );
}

export default Online;
