import { useState, useRef, useEffect, useContext } from "react";
import { ProfileContext } from "../../../contexts/context-create";
import defaultProfileImage from "../../../assets/profilePict/profile-picture.png";
import imageCompression from "browser-image-compression";

function EditDialog({ setIsOpen }) {
  const { author, loading } = useContext(ProfileContext);
  const saveButton = useRef();
  const [fullName, setFullName] = useState("");
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const imageInputRef = useRef(null);
  const [bio, setBio] = useState("");
  const [prevName, setPrevName] = useState("");
  const [prevBio, setPrevBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const isDisabled =
    fullName.length > 30 ||
    bio.length > 160 ||
    fullName.length <= 0 ||
    (fullName === prevName && bio === prevBio && previewImage === prevImage);
  useEffect(() => {
    if (!loading) {
      setFullName(author.fullName || author.username);
      setPrevName(author.fullName || author.username);
      setBio(author.biography || "");
      setPreviewImage(author.profilePicture || defaultProfileImage);
      setPrevImage(author.profilePicture || defaultProfileImage);
      setPrevBio(author.biography || "");
    }
  }, [loading, author]);

  function handleNameChange(e) {
    setFullName(e.target.value);
  }

  function handleBioChange(e) {
    setBio(e.target.value);
  }

  function handleImageClick() {
    imageInputRef.current.click();
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      const options = {
        maxSizeMB: 5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(file, options);
      setImage(compressedFile);
      setPreviewImage(URL.createObjectURL(compressedFile));
    }
  }
  function handleRemoveImage(e) {
    e.preventDefault();
    setPreviewImage(defaultProfileImage);
    setImage(null);
  }
  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("biography", bio);
    formData.append("userId", author.id);

    if (image) {
      formData.append("profilePicture", image);
    }
    if (!image && previewImage === defaultProfileImage) {
      formData.append("removeProfilePicture", "true");
    }
    try {
      setUploading(true);
      const response = await fetch(
        "https://nodes-blog-api-production.up.railway.app/user/profile/update",
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      setUploading(false);
      setIsOpen(false);
      if (!response.ok) {
        setUploading(false);
        console.log(response.status);
      }
      window.location.reload();
    } catch (error) {
      setUploading(false);
      console.log(error);
    }

    return;
  }

  return (
    <div className="form-container">
      <p className="form-title">Profile information</p>
      <form action="" className="profile-form-input">
        <label htmlFor="" className="photo-label">
          Photo
        </label>
        <div className="pp-ctr">
          <button
            type="button"
            className="pp-btn"
            onClick={(e) => {
              e.preventDefault();
              handleImageClick();
            }}
          >
            <img src={previewImage} alt="" className="pp" />
          </button>
          <div className="pp-right-div">
            <div className="pp-update-btn-ctr">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleImageClick();
                }}
                className="update-pp-btn"
              >
                Update
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  handleRemoveImage(e);
                  setPreviewImage(defaultProfileImage);
                }}
                className="remove-pp-btn"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        <input
          type="file"
          ref={imageInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageChange}
        />
        <div>&nbsp;</div>
        <label htmlFor="full-name">Full name</label>
        <input
          type="text"
          // placeholder=""
          id="full-name"
          name="fullName"
          className="full-name"
          value={fullName}
          onChange={(e) => {
            handleNameChange(e);
          }}
        />
        <div className="full-name-length length-indicator">
          <span>{fullName.length}</span>
          <span className="max-length">/30</span>
        </div>
        <label htmlFor="bio">Bio</label>
        <textarea
          type="text"
          placeholder=""
          id="bio"
          name="biography"
          className="biography"
          value={bio}
          onChange={(e) => {
            handleBioChange(e);
          }}
        />
        <div className="biography-length length-indicator">
          <span>{bio.length}</span>
          <span className="max-length">/160</span>
        </div>

        <div className="form-btn-ctr">
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsOpen(false);
            }}
            className="cancel-update-btn"
          >
            Cancel
          </button>
          <button
            ref={saveButton}
            onClick={(e) => handleSubmit(e)}
            disabled={uploading || isDisabled}
            style={{
              opacity: uploading || isDisabled ? 0.5 : 1,
            }}
            className="save-update-btn"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditDialog;
