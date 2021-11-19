import * as AWS from "aws-sdk";
import { DynamoDBStreamEvent } from "aws-lambda";
import dynamoDb from "./util/dynamoDb";

export const main = async (event: DynamoDBStreamEvent) => {
  const TableName = process.env.connectionsTableName!;
  const socketApiUrl = process.env.socketApiUrl!;

  console.log({ socketApiUrl });

  const { eventName, eventSource, dynamodb } = event.Records[0];
  console.log({ eventName, eventSource }, dynamodb?.NewImage);
  let payload: {
    review?: string | undefined;
    rating?: string | undefined;
    SK?: string | undefined;
    numOfReviews?: string | undefined;
    sumOfRatings?: string | undefined;
  };
  if (eventName === "INSERT") {
    console.log("from insert branch");

    // send out the review that was just added excluding seeded
    // data from custom resource
    payload = {
      review: dynamodb?.NewImage?.review?.S,
      rating: dynamodb?.NewImage?.rating?.N,
      SK: dynamodb?.NewImage?.SK.S,
    };
    console.log({ payload });
    return { statusCode: 200 };
  }
  if (eventName === "MODIFY") {
    console.log("from modify branch");

    // sedd out the aggregated data
    payload = {
      numOfReviews: dynamodb?.NewImage?.numOfReviews.N,
      sumOfRatings: dynamodb?.NewImage?.sumOfRatings.N,
    };
    console.log({ payload });

    const params: AWS.DynamoDB.DocumentClient.QueryInput = {
      TableName,
      KeyConditionExpression: "PK = :connection",
      ExpressionAttributeValues: {
        ":connection": "connection",
      },
      ProjectionExpression: "SK",
    };

    const connections: any[] =
      (await (await dynamoDb.query(params)).Items) || [];

    const apiG = new AWS.ApiGatewayManagementApi({
      endpoint: socketApiUrl.replace("wss://", ""),
    });

    const postToConnection = async function ({ SK }: { SK: string }) {
      try {
        // Send the message to the given client
        await apiG
          .postToConnection({
            ConnectionId: SK.replace("connection#", ""),
            Data: JSON.stringify(payload),
          })
          .promise();
      } catch (e: any) {
        console.log(e);

        if (e.statusCode === 410) {
          // Remove stale connections
          await dynamoDb.delete({ TableName, Key: { PK: "connection", SK } });
        }
      }
    };

    // Iterate through all the connections
    await Promise.all(connections.map(postToConnection));
  }

  return { statusCode: 200 };
};
