import { createContext, useRef } from "react";

export const AudioContext = createContext();

const AudioProvider = (props) => {
  const playerRef = useRef();

  const play = async () => {
    await playerRef?.current?.audio?.current?.play();
  };

  const pause = async () => {
    await playerRef?.current?.audio?.current?.pause();
  };

  return (
    <AudioContext.Provider value={{
      playerRef,
      play,
      pause,
    }}>
      {props.children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;