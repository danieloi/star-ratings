import * as AWS from "aws-sdk";
import handler from "./util/handler";
("");
import dynamoDb from "./util/dynamoDb";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const main = handler(
  async (
    event: APIGatewayProxyEventV2 & {
      requestContext: { connectionId?: string };
    }
  ) => {
    const params: AWS.DynamoDB.DocumentClient.DeleteItemInput = {
      TableName: process.env.connectionsTableName!,
      Key: {
        PK: "connection",
        SK: `connection#${event.requestContext.connectionId}`,
      },
    };

    await dynamoDb.delete(params);

    return { connected: false };
  }
);
