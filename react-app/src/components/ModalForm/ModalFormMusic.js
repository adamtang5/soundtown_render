const ModalFormMusic = ({
  audioUrl,
  updateAudioFile,
  newAudio,
  handleAudioButtonClick,
  audioMissing,
}) => {
  return (
    <>
      <label className="label-required">Music</label>
      <input
        type="file"
        accept="audio/*"
        onChange={updateAudioFile}
        name="audio-url"
        id="audio-url"
        hidden
      />
      <button
        className={`cursor-pointer audio-button ${newAudio || audioUrl ? "replace-audio-button" : "upload-audio-button flex-row"}`}
        onClick={handleAudioButtonClick}
      >
        {newAudio || audioUrl ? (
          <span>Replace Music File</span>
        ) : (
          <>
            <div className="upload-audio-note" />
            <span>Upload Music</span>
          </>
        )}
      </button>
      {newAudio && <div className="info-text">{newAudio.name}</div>}
      {audioMissing && <div className="error-text">Music file is required</div>}
    </>
  );
};

export default ModalFormMusic;
