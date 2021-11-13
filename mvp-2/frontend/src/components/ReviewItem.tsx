import React from "react";
import { Item } from "../types";
import StarRating from "./StarRating";

type Props = {
  item: Item;
};

export default function ReviewItem({ item }: Props) {
  return (
    <div className="flex mb4">
      <div className="pr3">
        <StarRating rating={item.rating} />
      </div>
      <div>
        <p className="custom-gray">
          <span className="fw7 black">{item.rating}. </span>
          {item.review}
        </p>
      </div>
    </div>
  );
}
