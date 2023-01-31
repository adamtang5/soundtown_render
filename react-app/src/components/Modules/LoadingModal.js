import { ImSpinner3 } from "react-icons/im"

const LoadingModal = ({ showModal }) => {
  return showModal && (
    <div id="loading-modal">
      <div id="loading-modal-bg" />
      <div id="loading-modal-content">
        <div className="loading">
          <ImSpinner3 className="spinning pinwheel" />
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;
