var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    var responseCode = 501;
    var responseMessage = {'error':'something went wrong'};
    var response = {
        statusCode: responseCode,
        body: JSON.stringify(responseMessage)
    };
    var UUID = event.requestContext.authorizer.claims.sub;
    var params = {
        TableName : "IVF_DB_NOTIFICATIONS",
        KeyConditionExpression: "#user = :id",
        ExpressionAttributeNames:{
            "#user": "UUID"
        },
        ExpressionAttributeValues: {
            ":id":UUID
        },
        ScanIndexForward: false
    };
    try{
        if (typeof event.headers.next == 'string'){
            params.ExclusiveStartKey = {"userID":UUID,"timeStamp":event.headers.next};
        }
    }
    catch(e){}
    dynamodb.query(params, function(err, data) {
        var responseCode = 501;
        var responseMessage = {'error': "unknown error"};
        if (err) {
            responseCode = 501;
            responseMessage = {'error': err.message};
        } else {
            responseCode = 200;
            if (typeof data.LastEvaluatedKey != "undefined") {
                responseMessage = {'data': data, 'next': data.LastEvaluatedKey.timeStamp};
            }
            else {
                responseMessage = {'data': data};
            }
            for(var i = 0; i < responseMessage.data.Items.length; i++) {
                delete responseMessage.data.Items[i]['UUID'];
            }
        }
        response = {
            statusCode: responseCode,
            body: JSON.stringify(responseMessage)
        };
        callback(null, response);
    });
};
