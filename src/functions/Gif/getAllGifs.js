const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = (event, context, callback) => {
    // setting params with users email and calling to use Gifs table
    // asking for only the Gif column values that have the selected email
    const params = {
       ExpressionAttributeValues: {
        ":currentUser": event.email
       },
       KeyConditionExpression: "Email = :currentUser",
       ProjectionExpression: "Gif",
       TableName: "Gifs"
    };
    // querying params in Gifs Dynamo table
    docClient.query(params, function(err, data) {
         if (err) {
            callback(err, null);
        }
        else {
            callback(null, data);
        }
    })
};