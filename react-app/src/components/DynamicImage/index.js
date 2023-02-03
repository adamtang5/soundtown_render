import React, { useState, useEffect } from "react";
import DropdownButton from '../Buttons/DropdownButton';
import './DynamicImage.css';

/*
DynamicImage Module - the most versatile and complex module designed
to be used across the app.

Criteria:
* authorized vs. unauthorized:
  authorized can only occur in standalone scenario, since unauthorized
  user cannot access update form. Unauthorized user can only access
  static image, with none of the dynamic controls.

* standalone vs. in a form:
  Examples of standalone module:
  - On UserPage, single button to handle uploading of avatar and banner
    images, dropdown menu to handle updating (replacing or deleting) of
    avatar and banner images. When deleting, use ConfirmModal.
  - On SingleSongPage or SinglePlaylistPage, single button to handle
    uploading and replacing of image because the module here is set to
    not nullable.
  Examples of form module:
  - On SongForm, single button to handle uploading and replacing of
    images, because the module is set to not nullable. There is a
    preview image to stage the file for upload. There is a tooltip at
    the bottom to show filename being staged.

* has file vs. no file:
  When there is no existing file or staged file, the label should contain
  "upload".
  When there is existing file or staged file:
  - If image is nullable (e.g. on UserPage), then use DropdownButton
    containing replace and delete options.
  - If not nullable, then use only single button with replace option.

* nullable vs. not nullable:
  If nullable, use DropdownButton containing replace and delete options.
  If not nullable, use single button with only replace option.
*/

const DynamicImage = ({
  dimension = 200,
  standalone = false,
  entity,
  imageUrl,
  stagedFile,
  previewId,
  hiddenInput,
  isAuthorized,
  clickHidden,
  styleClasses,
  uploadLabel,
  replaceLabel,
  updateLabel,
  deleteLabel,
  beforeLabel,
  confirmDelete,
  handleDelete,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!showDropdown) return;

    const closeDropdown = () => {
      if (!showDropdown) return;
      setShowDropdown(false);
    };

    document.addEventListener("click", closeDropdown);

    return () => document.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  const entities = {
    'user': {
      nullable: true,
      styleClasses: ['circle'],
    },
    'song': {
      nullable: false,
      styleClasses: ['square'],
    },
    'playlist': {
      nullable: false,
      styleClasses: ['square'],
    }
  };

  const baseClasses = ['cursor-pointer', 'composite-button'];

  const dropdownItems = [
    {
      onClick: clickHidden,
      label: replaceLabel,
    },
    {
      onClick: standalone ? confirmDelete : handleDelete,
      label: deleteLabel,
    },
  ]
  return !entities[entity] ? (
    <p>Invalid Entity</p>
  ) : (
    <>
      <div
        style={{
          height: `${dimension}px`,
          minWidth: `${dimension}px`,
        }}
      >
        <div
          className={[...entities[entity].styleClasses, "placeholder"].join(' ')}
          style={{ position: "relative" }}
        >
          {standalone ? (
            <img
              alt=""
              className={`${[...entities[entity].styleClasses, "preview"].join(' ')}${imageUrl ? ' white-bg' : ''}`}
              src={imageUrl}
            />
          ) : (
            <>
              {(imageUrl || stagedFile) && <img
                id={previewId}
                alt=""
                className={`${[...entities[entity].styleClasses, "preview"].join(' ')}${imageUrl ? ' white-bg' : ''}`}
                src={imageUrl}
              />}
            </>
          )}
          {isAuthorized && <div
            className={`overlay flex-column-rev${standalone && entities[entity].nullable ? ' hover-animated' : ''}`}
          >
            {hiddenInput}
            {imageUrl || stagedFile ? (
              <>
                {entities[entity].nullable ? (
                  <DropdownButton
                    toggleLabel={updateLabel}
                    toggleClasses={styleClasses}
                    beforeLabel={beforeLabel}
                    showDropdown={showDropdown}
                    setShowDropdown={setShowDropdown}
                    dropdownUlClasses={['menu', 'update-image-menu']}
                    dropdownItems={dropdownItems}
                  />
                ) : (
                  <button
                    className={[...baseClasses, ...styleClasses].join(' ')}
                    onClick={clickHidden}
                  >
                    <div className={['logo-before', beforeLabel].join(' ')}>{replaceLabel}</div>
                  </button>
                )}
              </>
            ) : (
              <button
                className={[...baseClasses, ...styleClasses, 'flex-row'].join(' ')}
                onClick={clickHidden}
              >
                <div className={['logo-before', beforeLabel].join(' ')}>{uploadLabel}</div>
              </button>
            )}
          </div>}
        </div>
      </div>
      {!standalone && stagedFile &&
        <div className="info-text">{stagedFile.name}</div>
      }
    </>
  );
};

export default DynamicImage;
