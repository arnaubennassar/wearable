var AWS = require('aws-sdk');
var dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
    getUsers((user) => {
        if(user !== false){
            for(i = 0; i < user.length; ++i){
                getLastUpdate(user[i].UUID, user[i].OSID, handleSendNotification); 
            }
        }
    });
};

var handleSendNotification = function (ans){
    if (ans !== false && Date.parse(new Date()) - parseInt(ans.timeStamp) > 86400000 ){
        var d = new Date(); 
        var date = d.getDate()  + "-" + (d.getMonth()+1) + "-" + d.getFullYear() + " ";
        var hours = parseInt(d.getHours()) > 9 ? d.getHours() : '0' + d.getHours();
        var mins = parseInt(d.getMinutes()) > 9 ? d.getMinutes() : '0' + d.getMinutes();
        date = date + hours + ":" + mins;
        var notification = { 
          app_id: "*************",
          headings: {"en": "Connect to the wearable"},
          contents: {"en": "We have not recieved any health data from you for a while."},
          include_player_ids: [ans.OSID],
          data:{
              "icon": 'bluetooth', 
              "data": {"fullDescription": "We have not recieved any health data from you for a while. Remember to connect to the Womba wearable, so we can track your data."}
          }
        };  
        sendNotification(notification);
        storeNotification(ans.UUID, notification, date);
    }
};

var getUsers = function(handler){
    dynamodb.scan({
        TableName : "IVF_DB_OSID",
    }, function(err, data) {
        if (err) {
            console.log(err);
            handler(false);
        } else {
            if ( data.length === 0){
                handler(false);
            }
            else{
                handler(data.Items);
            }
        }
    });
};
var getLastUpdate = function(UUID, OSID, handler) {
    dynamodb.query({
        TableName : "IVF_DB_ACTIVITY",
        KeyConditionExpression: "#uuid = :id",
        Limit: 1,
        ExpressionAttributeNames:{
            "#uuid": "UUID"
        },
        ExpressionAttributeValues: {
            ":id":UUID
        },
        ScanIndexForward: false
    }, function(err, data) {
        if (err) {
            console.log(err);
            handler(false);
        } else {
            if (data.Items.length > 0){
                handler( {UUID: UUID, OSID: OSID, timeStamp: data.Items[0].timeStamp} );
            }
            else{
                handler( {UUID: UUID, OSID: OSID, timeStamp: new Date() - 100000000 } );
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
    "Authorization": "Basic ***********"
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

