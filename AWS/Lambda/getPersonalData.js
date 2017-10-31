var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    responseCode = 501;
    responseMessage = {'error':'something went wrong'};
    response = {
        statusCode: responseCode,
        body: JSON.stringify(responseMessage)
    };
    var UUID = event.requestContext.authorizer.claims.sub;
    var responseMessage = {"error": "Something wnet wrong in our servers"};
    var responseCode = 500;
    var params = {
        TableName : "IVF_DB_PERSONAL_DATA",
        KeyConditionExpression: "#user = :id",
        ExpressionAttributeNames:{
            "#user": "UUID"
        },
        ExpressionAttributeValues: {
            ":id":UUID
        }
    };
    dynamodb.query(params, function(err, data) {
        if (err) {
            responseCode = 500;
            responseMessage = {"error": err.message};
        } else {
            responseCode = 200;
            responseMessage = {"data": data};
        }
        response = {
            statusCode: responseCode,
            body: JSON.stringify(responseMessage)
        };
        callback(null, response);
        //context.succeed(response);
    });
};
