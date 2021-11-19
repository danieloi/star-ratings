import React from "react";

type Props = {
  rating: number;
  handleRatingChange: (value: number) => void;
};

function renderHalfOrFullStar(index: number, rating: number) {
  if (Math.ceil(rating) !== rating) {
    // we're dealing with a fraction rating
    /**
     * rating is 3.5 because index 3 was hit once
     * therefore index 3 is supposed to be a half star
     */
    if (Math.floor(rating) === index) {
      return "fa-star-half-alt";
    }
    return "fa-star";
  }

  return "fa-star";
}

function renderCheckedOrUnCheckedStar(index: number, rating: number) {
  if (index + 1 <= Math.ceil(rating)) {
    return "checked";
  }
  return "";
}

export default function StarRatingInput({ rating, handleRatingChange }: Props) {
  return (
    <div>
      {Array.from(Array(5)).map((_, index) => {
        return (
          <button
            className="b--none bg-white pa0 pointer"
            onClick={() => handleRatingChange(index + 1)}
            key={index}
          >
            <i
              className={`w2 fas fa-lg ${renderHalfOrFullStar(
                index,
                rating
              )} ${renderCheckedOrUnCheckedStar(index, rating)}`}
            />
          </button>
        );
      })}
    </div>
  );
}
