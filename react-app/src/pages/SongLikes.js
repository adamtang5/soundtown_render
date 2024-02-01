import { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSong } from "../store/song";
import SongSecondary from "../components/SongSecondary";
import ShowcaseSongLikes from "../components/ShowcaseSongLikes";

const SongLikes = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const song = useSelector(state => state.songs[id]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      await dispatch(getSong(id));
    })();
  }, [dispatch, id]);

  if (song && !song?.likes?.length) {
    history.push(`/songs/${song?.id}`);
  }

  return (
    <SongSecondary
      song={song}
      showcase={<ShowcaseSongLikes song={song} />}
    />
  );
};

export default SongLikes;