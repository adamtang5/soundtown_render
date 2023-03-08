import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { editPlaylist } from "../../../store/playlist";

const EditPlaylistForm = ({ setShowModal, modalFunction }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[+id]);
  const sessionUser = useSelector(state => state.session.user);
  const [mode, setMode] = useState("info");
  const [errors, setErrors] = useState([]);
  const [title, setTitle] = useState(playlist?.title);
  const [description, setDescription] = useState(playlist?.description);
  const [imageUrl, setImageUrl] = useState(playlist?.image_url || '');
  const [newImage, setNewImage] = useState();
  const [imageLoading, setImageLoading] = useState(false);
  const previewId = "form-preview";

  const handleCancel = e => {
    e.preventDefault();
    e.stopPropagation();

    setErrors([]);
    setTitle(playlist?.title);
    setDescription(playlist?.description || "");
    setImageUrl(playlist?.image_url || "");
    setShowModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image_url", newImage || imageUrl);
    formData.append("id", +id);
    // formData.append("user_id", sessionUser.id);
    formData.append("title", title);
    formData.append("description", description);

    if (newImage) setImageLoading(true);

    const res = await dispatch(editPlaylist(+id, formData));
    if (res) {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        setImageLoading(false);
        setShowModal(false);
        history.push(`/playlists/${id}`);
      }
    } else {
      setImageLoading(false);
    }
  };

  const updateImageFile = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const fr = new FileReader();
      fr.readAsDataURL(file);
      setNewImage(file);
      const img = document.getElementById(previewId);
      fr.onload = () => img.src = fr.result;
    }
  };

  const navData = [
    {
      mode: 'info',
      label: 'Basic info',
    },
    {
      mode: 'tracks',
      label: 'Tracks',
    },
  ];

  return (
    <>
      <header>
        <nav>
          <ul className="nav-header flex-row">
            {navData.map((data, idx) => (
              <li
                key={idx}
                onClick={() => setMode(data.mode)}
                className={mode === data.mode ? "active" : "cursor-pointer"}
              >{data.label}</li>
            ))}
          </ul>
        </nav>
      </header>

      {/* <div className="flex-row AEP_conatiner">
        <div className="AEP_left">
          <img alt='' src={playlist.image_url} className="AEP_image" />
          <label>Playlist Image: </label>
          <input type="file" accept="image/*" onChange={updateImageFile} />
        </div>
        <div className="AEP_right">
          <form onSubmit={handleSubmit} className="flex-column">
            <label className="AEP_spacing">Title: </label>
            <input
              value={title}
              required
              type="text"
              className="AEP_spacing"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />

            <label className="AEP_spacing">Description: </label>
            <input
              className="AEP_spacing"
              value={description}
              type="description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
            {imageLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="flex-row">
                <button className="AEP_submit_button">Submit</button>
                <button
                  className="AEP_submit_button"
                  onClick={() => modalFunction(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div> */}
    </>
  );
};

export default EditPlaylistForm;
