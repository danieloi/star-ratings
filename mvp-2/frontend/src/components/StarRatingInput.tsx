import React from "react";
import { renderCheckedOrUnCheckedStar, renderHalfOrFullStar } from "../utils";

type Props = {
  rating: number;
  handleRatingChange: (value: number) => void;
};

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
