import React from "react";
import { Item } from "../types";
import ReviewItem from "./ReviewItem";

type Props = {
  data: Item[];
};

export default function ReviewList({ data }: Props) {
  return (
    <div>
      {data.map((item, index) => (
        <ReviewItem item={item} key={index} />
      ))}
    </div>
  );
}
