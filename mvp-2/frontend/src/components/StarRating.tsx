import React from "react";
import { renderCheckedOrUnCheckedStar, renderHalfOrFullStar } from "../utils";

type Props = {
  rating: string;
};

function roundToNearestHalf(num: number) {
  return Math.round(num * 2) / 2;
}

export default function StarRating({ rating }: Props) {
  const ratingToNearestHalf = roundToNearestHalf(parseFloat(rating));

  return (
    <div>
      {Array.from(Array(5)).map((_, index) => (
        <i
          key={index}
          className={`w2 fas fa-lg ${renderHalfOrFullStar(
            index,
            ratingToNearestHalf
          )} ${renderCheckedOrUnCheckedStar(index, ratingToNearestHalf)}`}
        />
      ))}
    </div>
  );
}
