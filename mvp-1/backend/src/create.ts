import * as AWS from "aws-sdk";
import * as uuid from "uuid";
import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  // Request body is passed in as a JSON encoded string in 'event.body'
  const data = JSON.parse(event.body!);

  const newReviewId = uuid.v1();
  const newItem = {
    PK: `reviews`,
    SK: `review#${newReviewId}`,
    rating: data.rating,
    review: data.review,
  };

  const params: AWS.DynamoDB.DocumentClient.TransactWriteItemsInput = {
    TransactItems: [
      {
        Put: {
          TableName: process.env.REVIEWS_TABLE_NAME!,
          Item: newItem,
        },
      },
      {
        Update: {
          TableName: process.env.REVIEWS_TABLE_NAME!,
          Key: {
            PK: "tally",
            SK: "tally",
          },
          UpdateExpression:
            "SET numOfReviews = numOfReviews + :numOfReviewsDelta",
          ExpressionAttributeValues: {
            ":numOfReviewsDelta": 1,
          },
        },
      },
      {
        Update: {
          TableName: process.env.REVIEWS_TABLE_NAME!,
          Key: {
            PK: "tally",
            SK: "tally",
          },
          UpdateExpression:
            "SET sumOfRatings = sumOfRatings + :sumOfRatingsDelta",
          ExpressionAttributeValues: {
            ":sumOfRatingsDelta": data.rating,
          },
        },
      },
    ],
  };

  await dynamoDb.transactWrite(params);

  return newItem;
});
