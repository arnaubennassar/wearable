var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    var input = JSON.parse(event.body);
    var UUID = event.requestContext.authorizer.claims.sub;
    var response = {
        statusCode: 500,
        body: JSON.stringify({"error":"incorrect arguments in body!"})
    };
    if (typeof input.OSID != 'string'){
        callback(null, response);
    }
    dynamodb.put({
        "TableName": "IVF_DB_OSID",
        "Item" : {
            "UUID": UUID ,
            "OSID": input.OSID
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
        var response = {
            statusCode: responseCode,
            body: JSON.stringify(responseMessage)
        };
        callback(null, response);
    });
};
