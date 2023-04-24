import className from "classnames/bind";
import Cookies from "universal-cookie";
import { useContext, useEffect, useRef, useState } from "react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useDismiss,
  useRole,
  useInteractions,
  FloatingFocusManager,
  useId,
  useClick,
} from "@floating-ui/react";

import styles from "./ExpandAvatar.module.scss";
import { AccountCircle } from "@material-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "~/contexts";

const cx = className.bind(styles);

function ExpandAvatar() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const cookies = new Cookies();
  const navigator = useNavigate();

  const handleLogout = () => {
    cookies.remove("token");
    cookies.remove("id");
    console.log(cookies.get("id"));
    navigator("/login");
  };

  const [isOpen, setIsOpen] = useState(false);

  const { x, y, refs, strategy, context } = useFloating({
    placement: "bottom-start",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift({ padding: 5 }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const headingId = useId();

  return (
    <>
      <div ref={refs.setReference} {...getReferenceProps()}>
        <img src={currentUser.avatar} alt="" className={cx("topbar-img")} />
      </div>
      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={cx("wrapper-options")}
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <div className={cx("list-options")}>
              <Link className={cx("option")} to={`/profile`}>
                <span className={cx("icon")}>
                  <AccountCircle />
                </span>
                <span className={cx("name-option")}>Profile</span>
              </Link>
              <div className={cx("option")}>
                <span className={cx("icon")}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M16 17v-3H9v-4h7V7l5 5l-5 5M14 2a2 2 0 0 1 2 2v2h-2V4H5v16h9v-2h2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9Z"
                    />
                  </svg>
                </span>
                <div
                  className={cx("name-option")}
                  to={`/login`}
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

export default ExpandAvatar;
