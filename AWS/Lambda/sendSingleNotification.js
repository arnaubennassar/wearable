var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    var d = new Date(); 
    var date = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " ";
    var hours = parseInt(d.getHours()) > 9 ? d.getHours() : '0' + d.getHours();
    var mins = parseInt(d.getMinutes()) > 9 ? d.getMinutes() : '0' + d.getMinutes();
    date = date + hours + ":" + mins;
    var input = JSON.parse(event.body);
    var responseCode = 501;
    var responseMessage = {'error':'something went wrong'};
    var response = {
        statusCode: responseCode,
        body: JSON.stringify(responseMessage)
    };
    
    var title = input.title;
    var body = input.body;
    var icon = input.icon;
    var data = input.data;
    var UUID = event.requestContext.authorizer.claims.sub;
    var message = { 
      app_id: "***************",
      headings: {"en": title},
      contents: {"en": body},
      include_player_ids: [],
      data:{"icon": icon, "data": data}
    };
    getOSIDnSend(UUID, message);
    storeNotification(UUID, message, date);
    responseCode = 200;
    responseMessage = {'success':'notification sent'};
    response = {
        statusCode: responseCode,
        body: JSON.stringify(responseMessage)
    };
    callback(null, response);    
};

var getOSIDnSend = function(UUID, message) {
    dynamodb.query({
        TableName : "IVF_DB_OSID",
        KeyConditionExpression: "#uuid = :id",
        Limit: 1,
        ExpressionAttributeNames:{
            "#uuid": "UUID"
        },
        ExpressionAttributeValues: {
            ":id":UUID
        }
    }, function(err, data) {
        if (err) {
            var responseCode = 501;
            var responseMessage = {"error": err.message};
            var response = {
                statusCode: responseCode,
                body: JSON.stringify(responseMessage)
            };
            callback(null, response);  
        } else {
            if (data.Items.length == 1){
                message.include_player_ids[0] = data.Items[0].OSID;
                sendNotification(message);
            }
        }
    });
};

var storeNotification = function(UUID, message, date) {
    dynamodb.put({
        "TableName": "IVF_DB_NOTIFICATIONS",
        "Item" : {
            "UUID": UUID ,
            "timeStamp": date,
            "notification": message
        }
    }, function(err, data) {
        if (err) {
            responseCode = 501;
            responseMessage = {"error": err.message};
            var response = {
                statusCode: responseCode,
                body: JSON.stringify(responseMessage)
            };
            callback(null, response);  
        }
    });
};

var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic ************"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options);
  req.write(JSON.stringify(data));
  req.end();
};

