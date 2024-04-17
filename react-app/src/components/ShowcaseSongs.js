import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getAllSongs } from '../store/song';
import SongTile from './Tile/SongTile';

const ShowcaseSongs = ({ songs, h3, setShowModal, likeDisabled=false }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(getAllSongs());
    })();
  }, [dispatch]);

  return (
    <>
      <h3>{h3}</h3>
      <div className="showcase-grid flex-row">
        {songs?.map(song => (
          <SongTile
            likeDisabled={likeDisabled}
            song={song}
            setShowModal={setShowModal}
            key={song?.id}
          />
        ))}
      </div>
    </>
  );
};

export default ShowcaseSongs;
