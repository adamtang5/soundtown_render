import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSong } from "../store/song";
import SongSecondary from "../components/SongSecondary";
import ShowcaseSongPlaylists from "../components/ShowcaseSongPlaylists";

const SongPlaylists = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const song = useSelector(state => state.songs[id]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await dispatch(getSong(id));
    })();
  }, [dispatch, id]);

  if (song && !song?.playlists?.length) {
    history.push(`/songs/${song?.id}`);
  }
  
  return (
    <SongSecondary
      song={song}
      showcase={<ShowcaseSongPlaylists song={song} />}
    />
  );
};

export default SongPlaylists;