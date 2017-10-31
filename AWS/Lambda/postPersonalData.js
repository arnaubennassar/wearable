var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    var response = {
        statusCode: 500,
        body: JSON.stringify({"error":"incorrect arguments in body!"})
    };
//    callback(null, response);
//    return;
    
    
    
    
    var input = JSON.parse(event.body);
    var UUID = event.requestContext.authorizer.claims.sub;
    if (typeof input.weight != 'number'){
        callback(null, response);
    }
    if (typeof input.height != 'number'){
        callback(null, response);
    }
    if (typeof input.age != 'number'){
        callback(null, response);
    }
    dynamodb.put({
        "TableName": "IVF_DB_PERSONAL_DATA",
        "Item" : {
            "UUID": UUID ,
            "height": input.height,
            "weight": input.weight,
            "age": input.age,
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
            statusCode: responseCode,
            body: JSON.stringify(responseMessage)
        };
        callback(null, response);
    });
};
