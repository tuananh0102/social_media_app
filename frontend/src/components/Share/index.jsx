import classNames from "classnames/bind";
import {
  PermMedia,
  Label,
  LocationOn,
  Mood,
  SettingsBackupRestoreTwoTone,
} from "@material-ui/icons";

import sytles from "./Share.module.scss";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "~/contexts";
import { getUserById } from "~/apiServices/user/getUserById";
import Cookies from "universal-cookie";
import { createPost } from "~/apiServices/post/createPost";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(sytles);

function Share() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [currentUser, setCurrentUser] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [writtenText, setWrittenText] = useState("");
  const inputFileRef = useRef();

  const handleWrittenText = (e) => {
    setWrittenText(e.target.value);
  };

  const handleClickUploadFile = () => {
    inputFileRef.current.click();
  };

  const handleUploadImage = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmitPost = () => {
    const fetchPostApi = async (formData) => {
      const res = await createPost(formData);
      setSelectedImage(null);
      setWrittenText("");
    };
    const formData = new FormData();
    formData.append("formFile", selectedImage);
    formData.append("writtenText", writtenText);
    fetchPostApi(formData);
  };

  useEffect(() => {
    const fetchApi = async () => {
      const res = await getUserById(cookies.get("id"));
      setCurrentUser(res.data);
    };
    fetchApi();
  }, []);

  return (
    <div className={cx("container")}>
      <div className={cx("share-top")}>
        <img
          className={cx("person-image")}
          src={currentUser.avatar}
          alt="avatar"
        />
        <input
          className={cx("share-input")}
          type="text"
          placeholder={`What's in your mind ${currentUser.surname}?`}
          value={writtenText}
          onChange={(e) => handleWrittenText(e)}
        />
        <input
          ref={inputFileRef}
          type="file"
          hidden
          onChange={(e) => {
            handleUploadImage(e);
          }}
        />
      </div>

      <div className={cx("share-center")}>
        {selectedImage && (
          <img
            className={cx("upload-image")}
            alt="image"
            src={URL.createObjectURL(selectedImage)}
          />
        )}
      </div>

      <hr className={cx("line")} />

      <div className={cx("share-bottom")}>
        <div className={cx("option")}>
          <span className={cx("option-icon")}>
            <PermMedia htmlColor="tomato" />
          </span>
          <span
            className={cx(["option-name", "pointer"])}
            onClick={handleClickUploadFile}
          >
            Photo or Video
          </span>
        </div>
        <div className={cx("option")}>
          <span className={cx("option-icon")}>
            <Label htmlColor="blue" />
          </span>
          <span className={cx("option-name")}>Tag</span>
        </div>
        <div className={cx("option")}>
          <span className={cx("option-icon")}>
            <LocationOn htmlColor="green" />
          </span>
          <span className={cx("option-name")}>Location</span>
        </div>
        <div className={cx("option")}>
          <span className={cx("option-icon")}>
            <Mood htmlColor="goldenrod" />
          </span>
          <span className={cx("option-name")}>Feeling</span>
        </div>

        <button className={cx("share-btn")} onClick={handleSubmitPost}>
          Share
        </button>
      </div>
    </div>
  );
}

export default Share;
