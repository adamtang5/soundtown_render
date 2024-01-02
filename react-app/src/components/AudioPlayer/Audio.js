import { useState, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import { AudioContext } from "../../context/AudioContext";
import { queueAdvance, historyStepBack } from "../../store/player";
import errorFile from "../../static/audio/buzz.mp3";
import QueueBox from "./QueueBox";
import { ReactComponent as QueueIcon } from "../../static/svgs/queue.svg";
import "react-h5-audio-player/lib/styles.css";
import "./Audio.css";

const Audio = () => {
  const { playerRef } = useContext(AudioContext);
  const dispatch = useDispatch();
  const player = useSelector(state => state.player);
  const currSong = useSelector(state => state.songs[player?.playingId]);
  const [queueMenu, setQueueMenu] = useState(false);

  const playNextInQueue = async (e) => {
    if (player?.queue?.length) {
      await dispatch(queueAdvance());
    } else {
      await dispatch(queueAdvance());
    }
  };

  const playLastInHistory = async (e) => {
    if (player?.playHistory?.length) {
      await dispatch(historyStepBack());
    }
  };

  return currSong ? (
    <footer className="player">
      <div className="player songinfo">
        <img
          className="songImg"
          src={currSong?.image_url}
          onError={(e) => (e.target.src = "../../static/images/log")}
          height="50px"
          alt=""
        />
        <NavLink className="black" to={`/songs/${currSong?.id}`}>
          {" "}
          {currSong?.title}
        </NavLink>
        <AudioPlayer
          ref={playerRef}
          className="songPlayer"
          customAdditionalControls={[]}
          layout="horizontal-reverse"
          src={currSong?.audio_url}
          onClickNext={playNextInQueue}
          onClickPrevious={playLastInHistory}
          onEnded={playNextInQueue}
          showSkipControls={true}
          volume={0.25}
          autoPlay={true}
        />
        <div className="queue_icon" onClick={() => setQueueMenu(!queueMenu)}>
          {queueMenu && <QueueBox />}
          <QueueIcon />
        </div>
      </div>
      <audio id="error-sound">
        <source src={errorFile} type="audio/mp3" />
      </audio>
    </footer>
  ) : (
    <footer className="player">
      <div className="player songinfo">
        <AudioPlayer
          ref={playerRef}
          className="songPlayer"
          customAdditionalControls={[]}
          layout="horizontal-reverse"
          src={null}
          onClickPrevious={playLastInHistory}
          showSkipControls={true}
          volume={0.25}
          autoPlay={true}
        />
      </div>
    </footer>
  );
};

export default Audio;
