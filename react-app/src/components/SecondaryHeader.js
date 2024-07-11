import { Link } from "react-router-dom";
import StickyNav from "./StickyNav";

const SecondaryHeader = ({
  entity,
  asset,
  dimension,
  imageUrl,
  navData,
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
              className="square full-box white-bg"
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
      <StickyNav navData={navData} />
    </header>
  );
};

export default SecondaryHeader;