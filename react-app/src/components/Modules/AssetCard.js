import { Link } from "react-router-dom";

const AssetCard = ({
  entity,
  asset,
  assetCover,
  assetFooter,
  user,
  buttonGroupData = [],
}) => {
  return (
    <li className="flex-row full-width">
      <div className="asset-li-left">
        {assetCover}
      </div>
      <div className="asset-li-right full-width flex-row">
        <div className="asset-li-details flex-column">
          <Link to={`/users/${user?.id}`}>
            <h3>{user?.display_name}</h3>
          </Link>
          <Link to={`/${entity}s/${asset?.id}`}>
            {asset?.title}
          </Link>
          <Link to={`/${entity}s/${asset?.id}`}>
            {assetFooter}
          </Link>
        </div>
        <ul className="asset-li-actions flex-row">
          {buttonGroupData.map((data, idx) => (
            <li
              key={idx}
              onClick={data.onClick}
            >
              {data.label}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default AssetCard;
