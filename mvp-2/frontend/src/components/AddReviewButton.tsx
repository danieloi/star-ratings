import React from "react";
import useToggle from "../hooks/useToggle";
import AddReviewDialog from "./AddReviewDialog";
import AddReviewForm from "./AddReviewForm";

const className =
  "bg-white b--moon-gray helvetica fw7 pa3 br2 custom-gray-btn ba pointer ";

export default function AddReviewButton() {
  const { state: isDialogOpen, toggleState: toggleIsDialogOpen } = useToggle();

  return (
    <>
      <button className={className} onClick={toggleIsDialogOpen}>
        Add review
      </button>
      <AddReviewDialog
        isOpen={isDialogOpen}
        onRequestClose={toggleIsDialogOpen}
      >
        <AddReviewForm toggleIsDialogOpen={toggleIsDialogOpen} />
      </AddReviewDialog>
    </>
  );
}
