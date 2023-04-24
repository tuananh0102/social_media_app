import classNames from "classnames/bind";

import styles from "./SearchItem.module.scss";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function SearchItem({ user, onClick }) {
  return (
    <Link
      className={cx("container")}
      to={`/profile/${user.id}`}
      onClick={onClick}
    >
      <span className={cx("wrapper-avatar")}>
        <img className={cx("avatar")} src={user.avatar} alt="avatar" />
      </span>
      <span className={cx("name")}>
        {`${user.surname} `}
        {user.given_name ? user.given_name : ""}
      </span>
    </Link>
  );
}

export default SearchItem;
