import { Link } from "react-router-dom";

const SidebarCollection = ({
  collectionLink,
  styleClasses,
  h3,
  collection,
  ...props
}) => {
  const baseClasses = ['logo-before', 'no-animation'];

  return (
    <article {...props} >
      <header>
        <Link
          className="sidebar-header flex-row"
          to={collectionLink}
        >
          <h3
            className={[...baseClasses, ...styleClasses].join(' ')}
          >{h3}</h3>
          <div className="hover-animation">View all</div>
        </Link>
      </header>
      {collection}
    </article>
  );
};

export default SidebarCollection;
