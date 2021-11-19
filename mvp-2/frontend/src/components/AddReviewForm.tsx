import axios from "axios";
import React, { useState } from "react";
import useToggle from "../hooks/useToggle";
import LoaderButton from "./LoaderButton";
import StarRatingInput from "./StarRatingInput";

type Props = {
  toggleIsDialogOpen: () => void;
};

const URL = `${process.env.REACT_APP_URL}/reviews`;

function updateRating(formerRating, clickedRating) {
  if (Math.ceil(formerRating) === clickedRating) {
    if (formerRating === clickedRating) {
      return clickedRating - 0.5;
    }
    return clickedRating;
  }
  return clickedRating - 0.5;
}

export default function AddReviewForm({ toggleIsDialogOpen }: Props) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { state: isSubmitting, toggleState: toggleIsLoading } = useToggle();

  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setReview(e.target.value);
  };

  const submitReview = async () => {
    try {
      toggleIsLoading();
      await axios.post(URL, { rating, review });

      toggleIsLoading();
      toggleIsDialogOpen();
    } catch (error) {
      toggleIsLoading();
      console.log(error);
    }
  };

  const handleRatingChange = (clickedRating) => {
    const newRating = updateRating(rating, clickedRating);
    setRating(newRating);
  };

  const isDisabled = !rating || !review || isSubmitting;

  return (
    <div className="ma3">
      <h2 id="title" className="fw7 f3 f2-ns pb4 mt0">
        What's your rating?
      </h2>
      <h3 className="f3 pb4 mt0">Rating</h3>
      <div className="pr3 pb4">
        <StarRatingInput
          rating={rating}
          handleRatingChange={handleRatingChange}
        />
      </div>
      <h3 className="f3 pb4 mt0">Review</h3>
      <input
        type="text"
        className="db pb4 custom-gray-input w-100"
        placeholder="Start typing..."
        required
        aria-required="true"
        onChange={handleInputChange}
      />
      <LoaderButton
        className={`bg-white b--moon-gray helvetica fw7 ph4 pv3 br2 ba pointer ${
          isDisabled ? "moon-gray" : "custom-gray-btn"
        }`}
        text="Submit review"
        loadingText="Loading..."
        disabled={isDisabled}
        isLoading={isSubmitting}
        onClick={submitReview}
      />
    </div>
  );
}
