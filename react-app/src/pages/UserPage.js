import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Redirect, useHistory, Switch } from "react-router-dom";
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
import "./UserPage.css";

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

const UserPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const sessionUser = useSelector(state => state.session.user);
  const user = useSelector(state => state.users[id]);

  useEffect(() => {
    (async () => {
      await dispatch(getUser(id));
    })();
  }, [dispatch]);

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

  const userSongs = user?.songs?.toSorted(sortKey);
  const userPlaylists = user?.playlists?.toSorted(sortKey);

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
        h3={sessionUser.id === id ? "Songs you uploaded"
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

  return (
    <>
      <Header />
      <div className="container flex-row">
        <main className="user-page-main full-width">
          <StickyNav
            navData={navData}
            optComp={<ButtonGroup />}
          />
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
        <aside className="user-page-summary">
          {/* TODO: Stats */}
          {/* TODO: Likes */}
          {/* TODO: Following */}
          {/* TODO: Comments */}
          {/* TODO: Legal */}
        </aside>
      </div>
    </>
  );
};

export default UserPage;
