import { Link } from "react-router-dom";
import ToggleButton from "../../Buttons/ToggleButton";

const ExistingPlaylist = ({
  term,
  setTerm,
  playlists,
  song,
  handleDelist,
  handleEnlist,
}) => {
  const baseClasses = ['cursor-pointer', 'composite-button'];

  return (
    <main>
      <input
        className="playlist-modal-search full-width"
        value={term}
        placeholder="Filter playlist"
        onChange={(e) => setTerm(e.target.value.toLowerCase())}
      />
      <ul className="playlist-modal-results flex-column">
        {playlists.filter(pl => pl?.title.toLowerCase().includes(term))
          .map((pl, idx) => (
            <li key={idx} className="full-width flex-row">
              <img
                className="modal-results-left"
                src={pl?.image_url}
                alt={pl?.title}
              />
              <div className="modal-results-right flex-row full-width">
                <div className="modal-results-data flex-column">
                  <Link to={`/playlists/${pl?.id}`}>
                    {pl?.title}
                  </Link>
                  <Link
                    className="info-text l3"
                    to={`/playlists/${pl?.id}`}
                  >
                    <div className="logo-before flex-row waveform-label">
                      {pl?.songs.length}
                    </div>
                  </Link>
                </div>
                <div className="modal-results-action">
                  <ToggleButton
                    condition={pl?.songs.includes(song?.id)}
                    buttonClasses={[...baseClasses, 'b2']}
                    handleOff={() => handleDelist(pl?.id, song?.id)}
                    onLabel="Added"
                    handleOn={() => handleEnlist(pl?.id, song?.id)}
                    offLabel="Add to playlist"
                  />
                </div>
              </div>
            </li>
          ))}
      </ul>
    </main>
  );
};

export default ExistingPlaylist;
