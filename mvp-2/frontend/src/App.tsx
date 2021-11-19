import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "./App.css";
import AddReviewButton from "./components/AddReviewButton";
import ReviewList from "./components/ReviewList";
import StarRating from "./components/StarRating";

type State = {
  reviews: any[];
  average: string;
};

const REVIEWS_URL = `${process.env.REACT_APP_URL}/reviews`;
const AVERAGE_URL = `${process.env.REACT_APP_URL}/reviews/average`;
const SOCKETS_URL = `${process.env.REACT_APP_SOCKET_URL}`;
const client = new W3CWebSocket(SOCKETS_URL);

function App() {
  const [state, setState] = useState<State>({ reviews: [], average: "0.0" });

  const loadData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = () => {
      loadData();
    };
    return () => {
      client.close();
    };
  }, [loadData]);

  return (
    <div className="measure center min-vh-100 ph3 ph0-ns">
      <h1 className="fw7 f3 f2-ns pt5 pb3 mt0 mb0 mb3-ns">
        The Minimalist Entrepreneur
      </h1>
      <div className="flex justify-between mb4 flex-wrap">
        <div className="flex items-center pv3 pv0-ns">
          <h2 className="f3 f2-ns pr3" id="rating">
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
