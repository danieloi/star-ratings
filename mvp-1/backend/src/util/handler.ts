import { APIGatewayProxyEventV2, Context } from "aws-lambda";

const handler = (lambda: {
  (event: APIGatewayProxyEventV2, context: Context): Promise<any>;
}) => {
  return async function (event: APIGatewayProxyEventV2, context: Context) {
    let body, statusCode;

    try {
      // Run the Lambda
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e: any) {
      console.error(e);
      body = { error: e.message };
      statusCode = 500;
    }

    // Return HTTP response
    return {
      statusCode,
      body: JSON.stringify(body),
    };
  };
};

export default handler;
