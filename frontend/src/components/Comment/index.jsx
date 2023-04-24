import classNames from "classnames/bind";

import styles from "./Comment.module.scss";

const cx = classNames.bind(styles);

function Comment({ comment }) {
  console.log(comment);
  return (
    <div className={cx("container")}>
      <img className={cx("profile-img")} src={comment.avatar} alt="ava" />
      <span className={cx("wrapper-input")}>
        <span className={cx("name")}>
          {`${comment.surname} `}
          {comment.givent_name ? comment.given_name : ""}
        </span>
        <input
          className={cx("input-comment")}
          type="text"
          value={comment.comment}
          disabled
        />
      </span>
    </div>
  );
}

export default Comment;
