import * as AWS from "aws-sdk";
import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(async (event: APIGatewayProxyEventV2) => {
  const params: AWS.DynamoDB.DocumentClient.QueryInput = {
    TableName: process.env.reviewsTableName!,
    KeyConditionExpression: "PK = :tally",
    ExpressionAttributeValues: {
      ":tally": "tally",
    },
    ProjectionExpression: "PK, numOfReviews, sumOfRatings",
  };

  const result = await dynamoDb.query(params);
  return result.Items;
});
