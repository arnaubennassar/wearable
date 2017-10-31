var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    var response  = {
            "statusCode": 503,
            "body": JSON.stringify({"error": "incorrect input"}),
            "headers":{"Content-Type": "application/json"},
            "isBase64Encoded": false,
    };
    var input = JSON.parse(event.body);
    var UUID = event.requestContext.authorizer.claims.sub;
    if ( !Array.isArray(input.data) ){
        callback(null, response);
    }
    if (typeof input.DB != 'string'){
        callback(null, response);
    }
    if (typeof input.timeStamp != 'string'){
        callback(null, response);
    }
    dynamodb.put({
        "TableName": "IVF_DB_" + input.DB,
        "Item" : {
            "UUID": UUID ,
            "timeStamp": input.timeStamp,
            "data": input.data
        }
    }, function(err, data) {
        var responseCode = 200;
        var responseMessage;
        if (err) {
            responseCode = 501;
            responseMessage = {error: err.message};
        }
        else {
            responseMessage = {'success':'data stored succesfully'};
        }
        response = {
            "statusCode": responseCode,
            "body": JSON.stringify(responseMessage),
            "headers":{"Content-Type": "application/json"},
            "isBase64Encoded": false,
        };
        callback(null, response);
    });
};
