import { createContext, useRef } from "react";

export const AudioContext = createContext();

const AudioProvider = (props) => {
  const playerRef = useRef();

  return (
    <AudioContext.Provider value={{ playerRef }}>
      {props.children}
    </AudioContext.Provider>
  );
};

export default AudioProvider;