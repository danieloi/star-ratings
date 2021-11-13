import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import AddReviewButton from "./components/AddReviewButton";
import ReviewList from "./components/ReviewList";
import StarRating from "./components/StarRating";

type State = {
  reviews: any[];
  average: string;
};

const REVIEWS_URL =
  "https://ez7slnv65l.execute-api.us-east-1.amazonaws.com/reviews";
const AVERAGE_URL =
  "https://ez7slnv65l.execute-api.us-east-1.amazonaws.com/reviews/average";

function App() {
  const [state, setState] = useState<State>({ reviews: [], average: "0.0" });

  useEffect(() => {
    (async () => {
      const [{ data: reviews }, { data: averages }] = await Promise.all([
        axios.get(REVIEWS_URL),
        axios.get(AVERAGE_URL),
      ]);
      const [stats] = averages;

      const average = (stats.sumOfRatings / stats.numOfReviews).toFixed(1);
      setState({
        average,
        reviews,
      });
    })();
  }, []);

  return (
    <div className="measure center min-vh-100">
      <h1 className="fw7 f2 pt5 pb3 mt0 mb3">The Minimalist Entrepreneur</h1>
      <div className="flex justify-between mb4">
        <div className="flex items-center">
          <h2 className="f2 pr3" id="rating">
            {state.average}
          </h2>
          <StarRating rating={state.average} />
        </div>
        <AddReviewButton />
      </div>
      <Divider />
      <h2 className="fw7 pt4 mb4 f3">Reviews</h2>
      <ReviewList data={state.reviews} />
    </div>
  );
}

function Divider() {
  return <div className="custom-h1 custom-bg-gray w-100" />;
}

export default App;
