import React, { useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams, Link, Redirect, Switch } from "react-router-dom";
import { editUser, getUser } from "../store/user";
import DropdownButton from "../components/Buttons/DropdownButton";
import DynamicImage from "../components/DynamicImage";
import ConfirmDeleteModal from "../components/ConfirmModal/ConfirmDeleteModal";
import ShowcaseSongs from "../components/ShowcaseSongs";
import ShowcasePlaylists from "../components/ShowcasePlaylists";
import StickyNav from "../components/StickyNav";
import ProtectedRoute from "../utilities/ProtectedRoute";
import EditButton from "../components/Buttons/EditButton";
import EditUserForm from "../modals/EditUserForm";
import { getAllSongs } from "../store/song";
import { getAllPlaylists, getPlaylist } from "../store/playlist";
import SidebarCollection from "../components/SidebarModules/SidebarCollection";
import AssetCard from "../components/Modules/AssetCard";
import { sortKeyByLikesThenTitle } from "../util";
import Credits from "../components/SidebarModules/Credits";
import "./UserPage.css";
import { AudioContext } from "../context/AudioContext";
import { loadPlaylist } from "../store/player";
import { FaCirclePause, FaCirclePlay } from "react-icons/fa6";

const Header = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[id]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAvatarConfirmModal, setShowAvatarConfirmModal] = useState(false);
  const [showBannerConfirmModal, setShowBannerConfirmModal] = useState(false);
  const avatarInputId = "avatar-url";
  const bannerInputId = "banner-url";

  useEffect(() => {
    if (!showDropdown) return;

    const closeDropdown = () => {
      if (!showDropdown) return;
      setShowDropdown(false);
    };

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  const updateAvatar = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('avatar_url', file);
      formData.append('display_name', user?.display_name);
      await dispatch(editUser(id, formData));
    }
  };

  const deleteAvatarUrl = async (e) => {
    const formData = new FormData();
    formData.append('avatar_url', '');
    formData.append('display_name', user?.display_name);
    await dispatch(editUser(id, formData));
    setShowAvatarConfirmModal(false);
  };

  const deleteBannerUrl = async (e) => {
    const formData = new FormData();
    formData.append('banner_url', '');
    formData.append('display_name', user?.display_name);
    await dispatch(editUser(id, formData));
    setShowBannerConfirmModal(false);
  };

  const updateBannerUrl = async (e) => {
    const file = e.target.files[0];

    if (file) {
      const formData = new FormData();
      formData.append('display_name', user?.display_name);
      formData.append('banner_url', file);
      dispatch(editUser(id, formData));
    }
  };

  const handleImageButtonClick = e => {
    e.preventDefault();
    document.getElementById(bannerInputId).click();
  };

  const dropdownItems = [
    {
      onClick: handleImageButtonClick,
      label: "Replace header image",
    },
    {
      onClick: () => setShowBannerConfirmModal(true),
      label: "Delete header image",
    },
  ];

  const bannerStyle = {
    backgroundImage: `url(${user?.banner_url})`,
  };

  return (
    <header className="user-page-banner">
      <div
        className="banner-bg placeholder full-box"
        style={user?.banner_url ? bannerStyle : {}}
      />
      <div
        className="banner-content flex-row"
      >
        <div className="user-page-banner-left flex-row">
          <DynamicImage
            dimension={200}
            standalone={true}
            entity="user"
            imageUrl={user?.avatar_url}
            hiddenInput={
              <input
                type="file"
                accept="image/*"
                onChange={updateAvatar}
                name={avatarInputId}
                id={avatarInputId}
                hidden
              />
            }
            isAuthorized={sessionUser?.id === id}
            clickHidden={() => document.getElementById(avatarInputId).click()}
            styleClasses={['button-action', 'b1']}
            uploadLabel="Upload image"
            replaceLabel="Replace image"
            updateLabel="Update image"
            deleteLabel="Delete image"
            beforeLabel="camera-label"
            confirmDelete={() => setShowAvatarConfirmModal(true)}
          />
          <h2>{user?.display_name}</h2>
        </div>
        {sessionUser.id === id && (
          <div
            className="hover-animated"
            style={{ width: "200px", height: "200px" }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={updateBannerUrl}
              name={bannerInputId}
              id={bannerInputId}
              hidden
            />
            {user?.banner_url ? (
              <DropdownButton
                toggleLabel="Update header image"
                toggleClasses={['update-banner-button', 'button-action', 'b1']}
                beforeLabel="camera-label"
                showDropdown={showDropdown}
                setShowDropdown={setShowDropdown}
                dropdownUlClasses={['menu', 'update-banner-menu']}
                dropdownItems={dropdownItems}
              />
            ) : (
              <button
                className="cursor-pointer composite-button upload-banner-button button-action b1"
                onClick={handleImageButtonClick}
              >
                <div className="logo-before camera-label">Upload header image</div>
              </button>
            )}
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        showModal={showAvatarConfirmModal}
        setShowModal={setShowAvatarConfirmModal}
        handleDelete={deleteAvatarUrl}
        entity="image"
      />
      <ConfirmDeleteModal
        showModal={showBannerConfirmModal}
        setShowModal={setShowBannerConfirmModal}
        handleDelete={deleteBannerUrl}
        entity="image"
      />
    </header>
  );
};

const ButtonGroup = () => {
  const sessionUser = useSelector(state => state.session.user);
  const { id } = useParams();
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const baseClasses = ['cursor-pointer', 'composite-button'];
  const styleClasses = ['button-action', 'b2'];

  return (
    <div className="user-page-button-group flex-row">
      {sessionUser?.id === id ? (
        <EditButton
          showModal={showEditUserModal}
          setShowModal={setShowEditUserModal}
          buttonClasses={[...baseClasses, ...styleClasses]}
          modalForm={<EditUserForm setShowEditUserModal={setShowEditUserModal} />}
        />
      ) : (
        <>
          {/* TODO: FollowButton */}
        </>
      )}
    </div>
  );
};

const UserSongLikes = ({ user, likes }) => {
  return (
    <SidebarCollection
      collectionLink={`/users/${user?.id}/likes`}
      styleClasses={['heart-label']}
      h3={`${likes?.length} liked song${likes?.length > 1 ? "s" : ""}`}
      collection={
        <ul className="sidebar-list">
          {likes?.slice(0, 3)?.map(song => (
            <AssetCard
              key={song?.id}
              entity="song"
              asset={song}
              assetCover={
                <Link to={`/songs/${song?.id}`}>
                  <div className="sidebar-cover-bg">
                    <img
                      src={song?.image_url}
                      className="sidebar-cover"
                      alt={song?.title}
                    />
                  </div>
                </Link>
              }
              assetFooter={
                <footer className="flex-row">
                  {Object.values(song?.likes)?.length > 0 && (
                    <Link to={`/songs/${song?.id}/likes`}>
                      <div className="logo-before heart-label">
                        {Object.values(song?.likes)?.length}
                      </div>
                    </Link>
                  )}
                  {song?.comments_count > 0 && (
                    <Link to={`/songs/${song?.id}`}>
                      <div className="logo-before speech-bubble-label">
                        {song?.comments_count}
                      </div>
                    </Link>
                  )}
                </footer>
              }
              user={song?.user}
            />
          ))}
        </ul>
      }
    />
  );
};

const UserPlaylistLikes = ({ user, likes }) => {
  const { play, pause, isPlaying } = useContext(AudioContext);
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);

  const handlePlayPause = async (playlist) => {
    if (playlist?.id === player?.currPlaylistId) {
      if (isPlaying) {
        await pause();
      } else {
        await play();
      }
    } else {
      await dispatch(getPlaylist(playlist?.id));
      await dispatch(loadPlaylist(playlist));
    }
  };

  return (
    <SidebarCollection
      collectionLink={`/users/${user?.id}/likes`}
      styleClasses={['heart-label']}
      h3={`${likes?.length} liked playlist${likes?.length > 1 ? "s" : ""}`}
      collection={
        <ul className="sidebar-list">
          {likes?.slice(0, 3)?.map(pl => (
            <AssetCard
              key={pl?.id}
              entity="playlist"
              asset={pl}
              assetCover={
                <Link to={`/playlists/${pl?.id}`}>
                  <div className="sidebar-cover-bg">
                    <img
                      src={pl?.image_url || pl?.alt_image_url}
                      className="sidebar-cover"
                      alt={pl?.title}
                    />
                  </div>
                </Link>
              }
              assetFooter={
                <footer className="flex-row">
                  {Object.values(pl?.likes)?.length > 0 && (
                    <Link to={`/playlists/${pl?.id}/likes`}>
                      <div className="logo-before heart-label">
                        {Object.values(pl?.likes)?.length}
                      </div>
                    </Link>
                  )}
                </footer>
              }
              user={pl?.user}
              overlay={true}
              handlePlayPause={e => handlePlayPause(pl)}
              playPauseClasses={`asset-li-play ${pl?.id === player?.currPlaylistId && isPlaying ? "standout" : ""}`}
              playPauseIcon={pl?.id === player?.currPlaylistId && isPlaying ? (
                <FaCirclePause />
              ) : (
                <FaCirclePlay />
              )}
            />
          ))}
        </ul>
      }
    />
  );
};

const UserPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const [loaded, setLoaded] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[id]);
  const userSongs = useSelector(state => Object.values(state.songs)
    .filter(song => song?.user?.id === user?.id));
  const userPlaylists = useSelector(state => Object.values(state.playlists)
    .filter(pl => pl?.user?.id === user?.id));
  const userSongLikes = useSelector(state => user?.likes?.map(id => state.songs[id]));
  const userPlaylistLikes = useSelector(state => user?.pl_likes?.map(id => state.playlists[id]));

  userSongLikes?.sort((a, b) => {
    if (a?.comments_count < b?.comments_count) {
      return 1;
    } else if (a?.comments_count > b?.comments_count) {
      return -1;
    } else {
      return Object.keys(b?.likes)?.length - Object.keys(a?.likes)?.length;
    }
  });

  userPlaylistLikes?.sort(sortKeyByLikesThenTitle);

  useEffect(() => {
    (async () => {
      await dispatch(getUser(id));
      await dispatch(getAllSongs());
      await dispatch(getAllPlaylists());
      setLoaded(true);
    })();
  }, [dispatch, id]);

  const sortKey = (a, b) => {
    if (a?.title?.toLowerCase() < b?.title?.toLowerCase()) {
      return -1;
    } else if (a?.title?.toLowerCase() > b?.title?.toLowerCase()) {
      return 1;
    } else if (a?.description?.toLowerCase() !== b?.description?.toLowerCase()) {
      return a?.description?.toLowerCase() < b?.description?.toLowerCase() ? -1 : 1;
    } else {
      return 0;
    }    
  };

  userSongs?.sort(sortKey);
  userPlaylists?.sort(sortKey);

  if (history.location.pathname === `/users/${id}`) {
    history.push(`/users/${id}/songs`);
  }  

  const navData = [
    {
      to: `/users/${id}/songs`,
      label: "Songs",
    },
    {
      to: `/users/${id}/playlists`,
      label: "Playlists",
    },
  ];

  const routes = [
    {
      path: `/users/${id}/songs`,
      component: <ShowcaseSongs
        songs={userSongs}
        h3={sessionUser?.id === id ? "Songs you uploaded"
          : (user?.display_name ? `Check out ${user?.display_name}'s tracks!` : '')}
      />,
    },
    {
      path: `/users/${id}/playlists`,
      component: <ShowcasePlaylists
        playlists={userPlaylists}
        h3={sessionUser?.id === id ? "Your playlists"
          : (user?.display_name ? `Check out ${user?.display_name}'s playlists!` : '')}
      />,
    },
  ];

  document.title = `Stream ${user?.display_name} music | Listen to songs, playlists on Sound Town`;
  
  if (!loaded) return null;

  return (
    <>
      <Header />
      <div className="container">
        <StickyNav
          navData={navData}
          optComp={<ButtonGroup />}
        />
        <div className="asset-secondary flex-row">
          <main className="asset-main">
            <section className="showcase">
              <Switch>
                <ProtectedRoute path={`/users/${id}`} exact={true}>
                  <Redirect to={`/users/${id}/songs`} />
                </ProtectedRoute>
                {routes.map((route, idx) => (
                  <ProtectedRoute path={route.path} key={idx}>
                    {route.component}
                  </ProtectedRoute>
                ))}
              </Switch>
            </section>
          </main>
          <aside className="asset-sidebar">
            {/* TODO: Stats */}
            {userSongLikes?.length > 0 && (
              <UserSongLikes
                user={user}
                likes={userSongLikes}
              />
            )}
            {userPlaylistLikes?.length > 0 && (
              <UserPlaylistLikes
                user={user}
                likes={userPlaylistLikes}
              />
            )}
            {/* TODO: Following */}
            {/* TODO: Comments */}
            <Credits />
          </aside>
        </div>
      </div>
    </>
  );
};

export default UserPage;
