import React, { useContext, useRef, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IoCloseOutline } from "react-icons/io5";
import "./Modal.css";

const ModalContext = React.createContext();

export function ModalProvider({ children }) {
  const modalRef = useRef();
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(modalRef.current);
  }, []);

  return (
    <>
      <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
      <div ref={modalRef} />
    </>
  );
}

export function Modal({
  onClose,
  position,
  paddingTop = 100,
  children,
}) {
  const modalNode = useContext(ModalContext);
  if (!modalNode) return null;
  const classes = {
    'top': ['modal-top', 'sharp-corners'],
    'center': ['modal-center', 'rounded-corners'],
  }

  return ReactDOM.createPortal(
    <div
      id="modal"
      className={classes[position][0]}
      style={{ paddingTop: `${paddingTop}px` }}
    >
      <div
        id="modal-background"
        onClick={onClose}
      />

      <div
        id="modal-content"
        className={classes[position][1]}
      >
        {position === 'top' && (
          <IoCloseOutline
            className="close-icon cursor-pointer"
            onClick={onClose}
          />
        )}
        {children}
      </div>
    </div>,
    modalNode
  );
}
