import React from "react";

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
              className={`fas fa-lg fa-star pr1 ${
                index + 1 <= rating ? "checked" : ""
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
