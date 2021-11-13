import React from "react";

type Props = {
  rating: string;
};

export default function StarRating({ rating }: Props) {
  const significantStarRating = parseFloat(parseFloat(rating).toFixed());

  return (
    <div>
      {Array.from(Array(5)).map((_, index) => {
        if (index + 1 <= significantStarRating) {
          return <i className="fas fa-lg fa-star pr1 checked" key={index} />;
        } else {
          return <i className="fas fa-lg fa-star pr1 " key={index} />;
        }
      })}
    </div>
  );
}
