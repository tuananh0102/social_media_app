import classNames from "classnames/bind";
import { MoreVert, Send } from "@material-ui/icons";
import styles from "./Post.module.scss";
import { Users } from "~/dummyData";
import { useContext, useState } from "react";
import Comment from "~/components/Comment";
import { createComment } from "~/apiServices/comment/createComment";
import { getCommentByPost } from "~/apiServices/comment/getCommentByPost";
import { UserContext } from "~/contexts";
import { Link } from "react-router-dom";

const cx = classNames.bind(styles);

function Post({ post }) {
  const [like, setLikes] = useState(post.like);
  const [isLike, setIsLike] = useState(false);
  const [isOpenComment, setIsOpenComment] = useState(false);
  const [inputComment, setInputComment] = useState("");
  const [comments, setComments] = useState([]);

  const { currentUser } = useContext(UserContext);

  const fetchGetCommentApi = async () => {
    const res = await getCommentByPost(post.id);
    setComments(res.data);
  };

  const hanldeOnOpenComment = () => {
    setIsOpenComment((prev) => {
      if (!prev) {
        fetchGetCommentApi();
      }
      return !prev;
    });
  };

  const handleSubmitComment = () => {
    const fetchPostCommentApi = async () => {
      await createComment(post.id, { comment: inputComment });
      setInputComment("");
      await fetchGetCommentApi();
    };

    if (inputComment.trim() !== "") {
      fetchPostCommentApi();
    }
  };

  const likeHandler = () => {
    setLikes((prev) => {
      return isLike ? prev - 1 : prev + 1;
    });
    setIsLike((prev) => !prev);
  };

  return (
    <div className={cx("container")}>
      <div className={cx("post-wrapper")}>
        <div className={cx("post-top")}>
          <div className={cx("top-right")}>
            <img className={cx("profile-img")} src={post.avatar} alt="avatar" />
            <Link to={`/profile/${post.userId}`} className={cx("profile-name")}>
              {`${post.surname} `}
              {post.given_name ? post.given_name : ""}
            </Link>
            <span className={cx("time")}>{post.created}</span>
          </div>
          <div className={cx("top-left")}>
            <MoreVert />
          </div>
        </div>
        <div className={cx("post-center")}>
          <div className={cx("wrapper-text")}>
            <p className={cx("post-text")}>{post.writtenText}</p>
          </div>
          <div className={cx("wrapper-img")}>
            <img
              className={cx("post-img")}
              src={post.mediaLocation}
              alt="post-img"
            />
          </div>
        </div>

        <hr className={cx("line")} />
        <div className={cx("post-bottom")}>
          <div className={cx("bottom-left")}>
            <img
              className={cx("like-btn")}
              src="/assets/like.png"
              alt="like"
              onClick={likeHandler}
            />
            <img
              className={cx("like-btn")}
              src="/assets/heart.png"
              alt="like"
              onClick={likeHandler}
            />
            <span className={cx("counter-people")}>{like} people likes</span>
          </div>
          <div className={cx("bottom-right")}>
            <span className="counter-comments" onClick={hanldeOnOpenComment}>
              {post.comment} comments
            </span>
          </div>
        </div>
        <hr className={cx("line")} />
      </div>

      {isOpenComment && (
        <div className={cx("wrapper-comment")}>
          <div className={cx("wrapper-top")}>
            <img
              className={cx("profile-img")}
              src={currentUser.avatar}
              alt="ava"
            />
            <span className={cx("wrapper-input")}>
              <input
                className={cx("input-comment")}
                type="text"
                placeholder="Write comment"
                value={inputComment}
                onChange={(e) => setInputComment(e.target.value)}
              />
              <span onClick={handleSubmitComment}>
                <Send className={cx("icon")} />
              </span>
            </span>
          </div>
          <div className={cx("wrapper-bottom")}>
            <div className={cx("comments")}>
              {comments.map((comment, index) => {
                return <Comment key={index} comment={comment} />;
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
