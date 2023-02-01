import './DynamicImage.css';

const DynamicImage = ({
  standalone = false,
  entity,
  imageUrl,
  stagedFile,
  hiddenInput,
  isAuthorized = true,
  clickHidden,
  styleClasses,
  uploadLabel,
  replaceLabel,
  beforeLabel,
}) => {
  const baseClasses = ['cursor-pointer', 'composite-button'];
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

  return !entities[entity] ? (
    <p>Invalid Entity</p>
  ) : (
    <div
      className={[...entities[entity].styleClasses, "placeholder"].join(' ')}
      style={{ position: "relative" }}
    >
      <img
        id="preview"
        alt="preview"
        className={`${entities[entity].styleClasses.join(' ')}${imageUrl ? ' white-bg' : ''}`}
        src={imageUrl}
      />
      <div
        className="overlay flex-column-rev"
      >
        {hiddenInput}
        {stagedFile || imageUrl ? (
          <button
            className={[...baseClasses, ...styleClasses].join(' ')}
            onClick={clickHidden}
          >
            <div className={beforeLabel}>{replaceLabel}</div>
          </button>
        ) : (
          <button
            className={[...baseClasses, ...styleClasses, 'flex-row'].join(' ')}
            onClick={clickHidden}
          >
            <div className={beforeLabel}>{uploadLabel}</div>
          </button>
        )}
      </div>
    </div>
  );
};

export default DynamicImage;
