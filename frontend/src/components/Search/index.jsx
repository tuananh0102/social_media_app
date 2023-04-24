import className from "classnames/bind";
import { useEffect, useRef, useState } from "react";
import {
  size,
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
  FloatingPortal,
} from "@floating-ui/react";

import styles from "./Search.module.scss";
import { getUserByName } from "~/apiServices/user/getUserByName";
import useDebound from "~/hooks/useDebound";
import { Search } from "@material-ui/icons";
import SearchItem from "../SearchItem";

const cx = className.bind(styles);

function SearchInput() {
  const inputRef = useRef();
  const [inputText, setInputText] = useState("");
  const [isClose, setIsClose] = useState(false);
  const [users, setUsers] = useState([]);

  const searchClassname = ["topbar-center"];

  const debounded = useDebound(inputText.trim(), 500);

  const [isOpen, setIsOpen] = useState(false);
  const { x, y, refs, strategy, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      offset(10),
      flip({ fallbackAxisSideDirection: "end" }),
      shift(),
      size({
        apply({ rects, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            width: `${rects.reference.width}px`,
            maxHeight: `${availableHeight}px`,
          });
        },
        // padding: 10,
      }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getReferenceProps, getFloatingProps } = useInteractions([
    role,
    dismiss,
  ]);

  const headingId = useId();

  if (isOpen === true) {
    if (searchClassname[searchClassname.length - 1] !== "border-radius-top")
      searchClassname.push("border-radius-top");
  } else {
    if (searchClassname[searchClassname.length - 1] === "border-radius-top")
      searchClassname.pop();
  }

  useEffect(() => {
    if (inputText.trim() != "") {
      const fetchUserApi = async () => {
        const res = await getUserByName(debounded);
        if (res.data.length > 0) {
          setIsOpen(true);
        } else {
          setIsOpen(false);
        }
        setUsers(res.data);
      };
      fetchUserApi();
    } else {
      if (searchClassname[searchClassname.length - 1] === "border-radius-top")
        searchClassname.pop();
      setIsOpen(false);
    }
  }, [debounded]);

  return (
    <div className={cx("container")}>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={cx(searchClassname)}
      >
        <span className={cx("search-icon")}>
          <Search />
        </span>
        <input
          ref={inputRef}
          className={cx("search-input")}
          placeholder="Search for friend, post or video"
          value={inputText}
          onChange={(e) => {
            setInputText(e.target.value);
            if (e.target.value.trim() === "") setIsClose(false);
            else setIsClose(true);
          }}
        />
        {isClose && (
          <span
            className={cx("close")}
            onClick={() => {
              setInputText("");
              setIsClose(false);
              setIsOpen(false);
            }}
          >
            X
          </span>
        )}
      </div>
      <FloatingPortal>
        {isOpen && (
          <FloatingFocusManager context={context} initialFocus={-1}>
            <div
              className={cx("wrapper-results")}
              ref={refs.setFloating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: "max-content",
              }}
              aria-labelledby={headingId}
              {...getFloatingProps()}
            >
              {users.map((user) => {
                return (
                  <SearchItem
                    user={user}
                    onClick={() => {
                      setIsOpen(false);
                      setInputText("");
                      setIsClose(false);
                    }}
                  />
                );
              })}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </div>
  );
}

export default SearchInput;
