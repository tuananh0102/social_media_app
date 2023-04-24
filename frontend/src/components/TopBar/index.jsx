import className from "classnames/bind";
import { Chat, Notifications, Person } from "@material-ui/icons";
import styles from "./TopBar.module.scss";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import SearchInput from "~/components/Search";
import { useContext, useEffect, useState } from "react";
import { RequestAddFriendNotifyContext, UserContext } from "~/contexts";
import ExpandAvatar from "../ExpandAvatar";
import { getUserById } from "~/apiServices/user/getUserById";
import NotificationAddFriend from "../NotificationAddFriend";

const cx = className.bind(styles);

function TopBar() {
  const cookies = new Cookies();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const res = await getUserById(cookies.get("id"));
        setCurrentUser(res.data);
      } catch (e) {
        navigate("/login");
      }
    };
    fetchApi();
  }, []);

  return (
    <div className={cx("container")}>
      <div className={cx("topbar-left")}>
        <Link to="/" className={cx("logo")}>
          Tanhsocial
        </Link>
      </div>

      <div className={cx("topbar-center")}>
        <SearchInput />
      </div>

      <div className={cx("topbar-right")}>
        <div className={cx("topbar-links")}>
          <span className={cx("link")}>Homepage</span>
          <span className={cx("link")}>Timeline</span>
        </div>
        <div className={cx("topbar-icons")}>
          {/* <div className={cx("topbar-icon-item")}>
            <Person />
            <span className={cx("topbar-icon-badge")}></span>
          </div> */}
          <NotificationAddFriend />

          <div className={cx("topbar-icon-item")}>
            <Chat />
            <span className={cx("topbar-icon-badge")}></span>
          </div>
          <div className={cx("topbar-icon-item")}>
            <Notifications />
            <span className={cx("topbar-icon-badge")}></span>
          </div>
        </div>

        <ExpandAvatar currentUser={currentUser} />
      </div>
    </div>
  );
}

export default TopBar;
