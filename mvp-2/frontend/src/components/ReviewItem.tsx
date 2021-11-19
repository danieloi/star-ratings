import React from "react";
import { Item } from "../types";
import StarRating from "./StarRating";

type Props = {
  item: Item;
};

export default function ReviewItem({ item }: Props) {
  return (
    <div className="flex mb4">
      <div className="pr2 flex-noshrink">
        <StarRating rating={item.rating} />
      </div>
      <p className="custom-gray truncate ">
        <span className="fw7 black">{item.rating}. </span>
        {item.review}
      </p>
    </div>
  );
}
