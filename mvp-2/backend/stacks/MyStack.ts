import * as sst from "@serverless-stack/resources";
import * as cr from "@aws-cdk/custom-resources";

export default class MyStack extends sst.Stack {
  reviewsTable: sst.Table;
  api: sst.Api;

  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
    // Create the DynamoDB tables
    this.reviewsTable = new sst.Table(this, "reviews-1", {
      fields: {
        PK: sst.TableFieldType.STRING,
        /**
         *  this has info on each review
         * the PK prefix is 'review#`
         * the PK suffix is the actual reviewId
         * we don't need user info since that's outside
         * the scope of this challenge
         */
        rating: sst.TableFieldType.NUMBER,
        review: sst.TableFieldType.STRING,
        /**
         * below has information on the tally
         * the PK is 'tally'
         */
        numOfReviews: sst.TableFieldType.NUMBER,
        sumOfRatings: sst.TableFieldType.NUMBER,
      },
      primaryIndex: { partitionKey: "PK", sortKey: "SK" },
    });

    // Seed table with data
    new cr.AwsCustomResource(this, "initTable", {
      onCreate: {
        service: "DynamoDB",
        /**
         * for whatever reason, transactWrites didn't work
         * perhaps it's because the race conditions they solve are
         * a non-issue with this initialization step since, it happens
         * immediately after creation
         */
        action: "batchWriteItem",
        parameters: {
          RequestItems: {
            [this.reviewsTable.tableName]: [
              {
                PutRequest: {
                  Item: {
                    PK: { S: "tally" },
                    SK: { S: "tally" },
                    numOfReviews: { N: "3" },
                    sumOfRatings: { N: "11" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "reviews" },
                    SK: { S: "review#16368441" },
                    rating: { N: "4" },
                    review: { S: "book was amazing" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "reviews" },
                    SK: { S: "review#163684410" },
                    rating: { N: "3" },
                    review: { S: "book was fluff" },
                  },
                },
              },
              {
                PutRequest: {
                  Item: {
                    PK: { S: "reviews" },
                    SK: { S: "review#1636844100" },
                    rating: { N: "4" },
                    review: { S: "book was full of fluff" },
                  },
                },
              },
            ],
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          this.reviewsTable.tableName + "_initialization"
        ),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [this.reviewsTable.tableArn],
      }),
    });

    // Create a HTTP API
    this.api = new sst.Api(this, "Api", {
      defaultFunctionProps: {
        timeout: 20,
        environment: {
          REVIEWS_TABLE_NAME: this.reviewsTable.tableName,
        },
      },
      routes: {
        "GET /reviews": "src/list.main",
        "GET /reviews/average": "src/get.main",
        "POST /reviews": "src/create.main",
        $connect: "src/connect.main",
        $disconnect: "src/disconnect.main",
        sendmessage: "src/sendMessage.main",
      },
    });

    // Allow the API to access the table
    this.api.attachPermissions([this.reviewsTable]);

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: this.api.url,
    });
  }
}
