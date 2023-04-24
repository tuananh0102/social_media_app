import className from "classnames/bind";
import Cookies from "universal-cookie";
import { useContext, useEffect, useRef, useState } from "react";
import { CheckCircleOutline, HighlightOff, Person } from "@material-ui/icons";

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

import styles from "./Notification.module.scss";

import { Link, useNavigate } from "react-router-dom";
import { RequestAddFriendNotifyContext } from "~/contexts";
import { acceptRequestAddFriend } from "~/apiServices/user/acceptRequestAddFriend";
import { deleteRequestAddFriend } from "~/apiServices/user/deleteRequestAddFriend";

const cx = className.bind(styles);

function NotificationAddFriend() {
  const cookies = new Cookies();
  const navigator = useNavigate();
  const { requestAddFriend, setRequestAddFriend } = useContext(
    RequestAddFriendNotifyContext
  );

  const [isOpen, setIsOpen] = useState(false);

  const handleAcceptRequest = (id) => {
    const fetchAcceptApi = async () => {
      await acceptRequestAddFriend(id);
      setRequestAddFriend((prev) =>
        prev.filter((friend) => {
          return friend.requestId !== id;
        })
      );
    };

    fetchAcceptApi();
  };

  const handleRemoveRequest = (id) => {
    const fetchRemoveApi = async () => {
      await deleteRequestAddFriend(id);
      setRequestAddFriend((prev) =>
        prev.filter((friend) => {
          return friend.requestId !== id;
        })
      );
    };

    fetchRemoveApi();
  };

  const { x, y, refs, strategy, context } = useFloating({
    placement: "bottom-end",
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset({
        mainAxis: 10,
        crossAxis: 80,
      }),
      flip({ fallbackAxisSideDirection: "end" }),
      shift({ padding: 10 }),
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
      <div
        className={cx("topbar-icon-item")}
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <Person />
        <span className={cx("topbar-icon-badge")}>
          {requestAddFriend.length > 0 ? requestAddFriend.length : ""}
        </span>
      </div>

      {isOpen && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            className={cx("expand-request-addfriend")}
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
            aria-labelledby={headingId}
            {...getFloatingProps()}
          >
            <h3 className={cx("title")}>Request Add Friend</h3>
            <div className={cx("wrapper-requests")}>
              {requestAddFriend.map((request, index) => {
                return (
                  <div key={index} className={cx("request")}>
                    <img
                      className={cx("avatar")}
                      src={request.avatar}
                      alt="img"
                    />
                    <span className={"notification"}>
                      <b>{`${request.surname} `}</b>
                      sent request add friend for you
                    </span>

                    <div className={cx("icons")}>
                      <span
                        onClick={() => handleAcceptRequest(request.requestId)}
                      >
                        <CheckCircleOutline className={cx("yes")} />
                      </span>
                      <span
                        onClick={() => handleRemoveRequest(request.requestId)}
                      >
                        <HighlightOff className={cx("no")} />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

export default NotificationAddFriend;
