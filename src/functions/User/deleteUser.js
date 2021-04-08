const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = (event, context, callback) => {
    // setting params with users email and calling to use Users table
    const params = {
        Key: {
            email: event.email
        },
        TableName: "Users"
    };
    // deleting params in Users Dynamo table
    docClient.delete(params, function (err, data) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    })
};