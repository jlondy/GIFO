const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = (event, context, callback) => {
    // setting params with users email and hashed password and calling to use Users table
    const params = {
        Item: {
            Email: event.email,
            Password: event.password
        },
        TableName: "Users"
    };
    // putting params in Users Dynamo table
    docClient.put(params, function(err, data) {
        if(err){
            callback(err, null);
            return err;
        } 
        else {
            callback(null, data);
            return data;
        }
    })
    
};