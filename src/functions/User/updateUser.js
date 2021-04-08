// TODO UPDATE USER 
// did not get working because the partition and sort key cant be changed
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = (event, context, callback) => {
    
    const params = {
        UpdateExpression: "set updated_by = :byUser, is_deleted = :boolValue",
        ExpressionAttributeValues: {
            ":byUser": "updateUser",
            ":boolValue": true
        },
        ReturnValues: "UPDATED_NEW",
        Key: {
            email: event.email
        },
        TableName: "Users"
    };
    
    docClient.update(params, function (err, data) {

        if (err) {
            callback(err, null);
        } else {
            callback(null, data);
        }
    })
};
