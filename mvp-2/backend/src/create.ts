import * as AWS from "aws-sdk";
import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  // Request body is passed in as a JSON encoded string in 'event.body'

  const data = JSON.parse(event.body!);

  const newItem = {
    PK: `reviews`,
    SK: `review#${new Date().getTime()}`,
    rating: data.rating,
    review: data.review,
  };

  const params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.reviewsTableName!,
          Item: newItem,
        },
      },
      {
        Update: {
          TableName: process.env.reviewsTableName!,
          Key: {
            PK: "tally",
            SK: "tally",
          },
          UpdateExpression:
            "SET numOfReviews = numOfReviews + :numOfReviewsDelta, sumOfRatings = sumOfRatings + :sumOfRatingsDelta",
          ExpressionAttributeValues: {
            ":numOfReviewsDelta": 1,
            ":sumOfRatingsDelta": data.rating,
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return newItem;
});
