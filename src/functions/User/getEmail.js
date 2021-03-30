const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = (event, context, callback) => {
    // setting params with users email and calling to use Users table
    // asking for only the Email column values that have the selected email
    const params = {
       ExpressionAttributeValues: {
        ":registerKey": event.email
       },
       KeyConditionExpression: "Email = :registerKey",
       ProjectionExpression: "Email",
       TableName: "Users"
    };
    // querying params in Users Dynamo table
    docClient.query(params, function (err, data) {
        if (err) {
            callback(err, null);
        }
        else {
            callback(null, data);
        }
    })
};