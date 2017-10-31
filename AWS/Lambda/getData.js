var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
  //  input = {db: "HEART"}
    var uuid = event.requestContext.authorizer.claims.sub;
    var DB = event.headers.db;
    next = null;
    if (event.headers.hasOwnProperty('next')){
        next = { 
            UUID: uuid,
            timeStamp: event.headers.next 
        };
    }
    
    var params = {
        TableName : "IVF_DB_" + DB,
        KeyConditionExpression: "#user = :id",
        ExpressionAttributeNames:{
            "#user": "UUID"
        },
        ExpressionAttributeValues: {
            ":id":uuid
        },
        Limit: 250,
        ExclusiveStartKey: next
    };

    dynamodb.query(params, function(err, data) {
        //console.log(data);
        if (err) {
            responseCode = 501;
            responseMessage = {'error': err.message, 'until' : 'here', 'mofinheaders': event.headers};
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
