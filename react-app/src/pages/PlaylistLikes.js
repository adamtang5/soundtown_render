import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylist } from "../store/playlist";
import PlaylistSecondary from "../components/PlaylistSecondary";
import ShowcaseAssetLikes from "../components/ShowcaseAssetLikes";

const PlaylistLikes = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const playlist = useSelector(state => state.playlists[id]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await dispatch(getPlaylist(id));
    })();
  }, [dispatch, id]);

  if (playlist && !playlist?.likes?.length) {
    history.push(`/playlists/${playlist?.id}`);
  }

  return (
    <PlaylistSecondary
      playlist={playlist}
      showcase={<ShowcaseAssetLikes entity="playlist" asset={playlist} />}
    />
  );
};

export default PlaylistLikes;