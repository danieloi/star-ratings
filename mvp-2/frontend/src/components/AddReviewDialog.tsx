import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

type Props = {
  isOpen: boolean;
  children?: React.ReactNode;
  onRequestClose: Modal.Props["onRequestClose"];
};

const cssClasses = {
  overlay:
    "fixed top-0 bottom-0 right-0 left-0 z-9999 bg-black-10 flex justify-center items-center",
  content: " bg-white br4 measure-wide ph4 pv4 w-100 mb4 mb6-l",
};

export default function AddReviewDialog({
  isOpen,
  children,
  onRequestClose,
}: Props) {
  return (
    <Modal
      isOpen={isOpen}
      contentLabel="New Post Creation Dialog"
      className={cssClasses.content}
      overlayClassName={cssClasses.overlay}
      onRequestClose={onRequestClose}
    >
      {children}
    </Modal>
  );
}
