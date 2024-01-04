import React from "react";
import { useSelector } from "react-redux";
import SingleSong from "./SingleSong";

const QueueBox = () => {
  const player = useSelector(state => state.player);

  return (
    <div className="queue_box_container">
      {player?.playHistory?.map((songId, idx) => (
        <SingleSong key={idx} songId={songId} view={"queue_history"} />
      ))}
      <SingleSong songId={player?.currSongId} view={"queue_playing"} />
      {player?.queue?.map((songId, idx) => (
        <SingleSong key={idx} songId={songId} view={""} />
      ))}
    </div>
  );
};

export default QueueBox;
