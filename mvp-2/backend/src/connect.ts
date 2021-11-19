import * as AWS from "aws-sdk";
import handler from "./util/handler";
import dynamoDb from "./util/dynamoDb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(
  async (
    event: APIGatewayProxyEventV2 & {
      requestContext: { connectionId?: string };
    }
  ) => {
    const params: AWS.DynamoDB.DocumentClient.PutItemInput = {
      TableName: process.env.connectionsTableName!,
      Item: {
        PK: "connection",
        SK: `connection#${event.requestContext.connectionId}`,
      },
    };

    await dynamoDb.put(params);

    return { connected: true };
  }
);
