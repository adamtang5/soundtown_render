import AudioPlayer from "react-h5-audio-player";
import { useSelector, useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { queueAdvance, historyStepBack } from "../../store/player";
import errorFile from "../../static/audio/buzz.mp3";
import "react-h5-audio-player/lib/styles.css";
import "./Audio.css";

import { ReactComponent as QueueIcon } from "../../static/svgs/queue.svg";
import { useState } from "react";
import QueueBox from "./QueueBox";

const Audio = () => {
  const dispatch = useDispatch();
  const playerState = useSelector(state => state.player);
  const currSong = useSelector(state => state.songs[playerState.playingId]);

  const [queueMenu, setQueueMenu] = useState(false);

  const playNextInQueue = () => {
    if (playerState.queue.length) {
      dispatch(queueAdvance());
    } else {
      dispatch(queueAdvance());
    }
  };

  const playLastInHistory = () => {
    if (playerState.playHistory.length) {
      dispatch(historyStepBack());
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
