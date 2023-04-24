import classNames from "classnames/bind";
import { useNavigate } from "react-router-dom";
import styles from "./Feed.module.scss";

import Share from "~/components/Share";
import Post from "~/components/Post";

// import { Posts } from "~/dummyData";
import { useEffect, useState } from "react";

import Cookies from "universal-cookie";

const cx = classNames.bind(styles);

const cookies = new Cookies();

function Feed({ share = true, posts = [] }) {
  return (
    <div className={cx("container")}>
      <div className={cx("feed-wrapper")}>
        {share && <Share />}
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
