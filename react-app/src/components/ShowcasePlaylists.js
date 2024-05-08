import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PlaylistTile from "./Tile/PlaylistTile"
import { getAllPlaylists } from "../store/playlist";

const ShowcasePlaylists = ({ playlists, h3 }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getAllPlaylists());
    })();
  }, [dispatch]);
  
  return (
    <>
      {h3 && <h3>{h3}</h3>}
      <div className="showcase-grid flex-row">
        {playlists?.map((pl, i) => (
          <PlaylistTile
            key={i}
            playlist={pl}
          />
        ))}
      </div>
    </>
  );
};

export default ShowcasePlaylists;
