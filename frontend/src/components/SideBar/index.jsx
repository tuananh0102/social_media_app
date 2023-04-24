import classNames from "classnames/bind";
import {
  RssFeed,
  Chat,
  PlayCircleOutline,
  Group,
  Bookmark,
  HelpOutline,
} from "@material-ui/icons";
import styles from "./SideBar.module.scss";
import CloseFriend from "../CloseFriend";
// import { Users } from "~/dummyData";
const cx = classNames.bind(styles);

function SideBar() {
  return (
    <div className={cx("container")}>
      <div className={cx("sidebar-wrapper")}>
        <ul className={cx("list-options")}>
          <li className={cx("option")}>
            <RssFeed />
            <span className={cx("option-name")}>Feed</span>
          </li>
          <li className={cx("option")}>
            <Chat />
            <span className={cx("option-name")}>Chats</span>
          </li>
          <li className={cx("option")}>
            <PlayCircleOutline />
            <span className={cx("option-name")}>Videos</span>
          </li>
          <li className={cx("option")}>
            <Group />
            <span className={cx("option-name")}>Groups</span>
          </li>
          <li className={cx("option")}>
            <Bookmark />
            <span className={cx("option-name")}>Bookmarks</span>
          </li>
          <li className={cx("option")}>
            <HelpOutline />
            <span className={cx("option-name")}>Questions</span>
          </li>
        </ul>
        <button className={cx("showmore")}>Show more</button>
        <hr className={cx("line")} />

        <ul className={cx("list-friends")}>
          {/* {Users.map((user) => {
            return (
              <li key={user.id} className={cx("friend")}>
                <CloseFriend user={user} />
              </li>
            );
          })} */}
        </ul>
      </div>
    </div>
  );
}

export default SideBar;
