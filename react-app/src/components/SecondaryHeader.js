import { Link } from "react-router-dom";

const SecondaryHeader = ({
  entity,
  asset,
  dimension,
  imageUrl,
}) => {
  return (
    <header>
      <div className="secondary-banner flex-row">
        <Link to={`/${entity}s/${asset?.id}`}>
          <div
            style={{
              height: `${dimension}px`,
              minWidth: `${dimension}px`,
            }}
          >
            <img
              className="square preview white-bg"
              src={imageUrl}
              alt={asset?.title}
            />
          </div>
        </Link>
        <Link
          style={{ height: "fit-content" }}
          to={`/${entity}s/${asset?.id}`}
        >
          <h2>{asset?.title}</h2>
        </Link>
      </div>
    </header>
  );
};

export default SecondaryHeader;