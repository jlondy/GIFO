const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region: "us-east-1"});

exports.handler = (event, context, callback) => {
    // setting params with users email and selected gif id and calling to use Gifs table
    const params = {
        Item: {
            Email: event.email,
            Gif: event.gif
        },
        TableName: "Gifs"
    };
    // putting params in Gifs Dynamo table
    docClient.put(params, function(err, data) {
        if(err){
            callback(err, null);
        } 
        else {
            callback(null, data);
        }
    })
};