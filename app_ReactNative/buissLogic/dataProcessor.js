/*@flow*/
import * as dataTypes from './dataTypes';
import {activityProcessor} from './processors/activityProcessor';
import {heartProcessor} from './processors/heartProcessor';
import {temperatureProcessor} from './processors/temperatureProcessor';
import {BBTProcessor} from './processors/BBTProcessor';
import {sleepProcessor} from './processors/sleepProcessor';

import {storeData_array, storeData_object, storeData_multiSample} from './storage'
import * as API from './api'
import {silentLogin} from './AWSLogin'

import * as dataActions from '../redux/actions/data';
import * as userActions from '../redux/actions/user';
import {loginSuccess} from '../redux/actions/user';
import { store } from '../redux/store';
import { dispatch } from 'redux';

var email = '';
var password = '';
const totalSteps = 4;
export function processData(data, timeStamp, AWS, isNew){
  // email = mail;
  // password = pass;
  var arduino_c = 0;
  if (isNew){
    arduino_c = data.c;
  }
  //isNew = true;
  console.log(data);
  var processedActivityData = {data: null, activityIncrement: null};
  var processedHeartData = null;
  var processedTemperatureData = null;
  var processedBBTData = null;
  var processedSleepData = null;

//    ACTIVITY DATA     //
  if (data.hasOwnProperty(dataTypes.ACTIVITY) && data[dataTypes.ACTIVITY].length > 0){
    if (isNew){
      processedActivityData = activityProcessor( splitByDays(data[dataTypes.ACTIVITY], timeStamp, arduino_c) );
  //SLEEP NEW DATA//
      processedSleepData = sleepProcessor( processedActivityData );
      _storeData(dataTypes.SLEEP, processedSleepData, isNew, AWS, 'SLEEP');
    }
    else{
      processedActivityData = data[dataTypes.ACTIVITY];
    }
    _storeData(dataTypes.ACTIVITY, processedActivityData, isNew, AWS, 'ACTIVITY');
  }      
  //SLEEP OLD DATA//
  if ( data.hasOwnProperty(dataTypes.SLEEP) && data[dataTypes.SLEEP].length > 0 ) {
    processedSleepData = data[dataTypes.SLEEP];
    _storeData(dataTypes.SLEEP, processedSleepData, isNew, AWS, 'SLEEP');
  }
//____________________//
//    HEART DATA     //
  if (data.hasOwnProperty(dataTypes.HEART) && data[dataTypes.HEART].length > 0){
    if (isNew){
      processedHeartData = heartProcessor( splitByDays(data[dataTypes.HEART], timeStamp, arduino_c) );
    }
    else{
      processedHeartData = data[dataTypes.HEART];
    }
    _storeData(dataTypes.HEART, processedHeartData, isNew, AWS, 'HEART');
  }  
//____________________//
//    TEMPERATURE DATA     //
  if (data.hasOwnProperty(dataTypes.TEMPERATURE) && data[dataTypes.TEMPERATURE].length > 0){
    if (isNew){
      splitedTemperatureData = splitByDays( data[dataTypes.TEMPERATURE], timeStamp, arduino_c )
      processedTemperatureData = temperatureProcessor( splitedTemperatureData );
  //BBT NEW DATA//
      processedBBTData = BBTProcessor( splitedTemperatureData );
      _storeData(dataTypes.BBT, processedBBTData, isNew, AWS, 'BBT');
    }
    else{
      processedTemperatureData = data[dataTypes.TEMPERATURE];
    }
    _storeData(dataTypes.TEMPERATURE, processedTemperatureData, isNew, AWS, 'TEMPERATURE');
  }
  //BBT OLD DATA//
  if ( data.hasOwnProperty(dataTypes.BBT) && data[dataTypes.BBT].length > 0 ) {
    processedBBTData = data[dataTypes.BBT];
    _storeData(dataTypes.BBT, processedBBTData, isNew, AWS, 'BBT');
  }
//____________________//

  store.dispatch(dataActions.dataUpdated({
    activity: processedActivityData,
    BBT: processedBBTData,
    sleep: processedSleepData
  }));
}

function splitByDays(data, timeStamp, arduino_c){
  var ans = [];
  var last = 0;
  var index = 0;
  for (var i = 0; i < data.length - 1; i++) {
    data[i].c = timeStamp - ((arduino_c - data[i].c)*1000); 
    if(new Date(data[i].c).getDate() != new Date(data[i + 1].c){
      ans[index] = data.slice(last, i + 1);
      ++index;
      last = i + 1;
    }
  };
  ans[index] = data.slice(last, data.length);
  return ans;
}

function _storeData (dataType, data, isNew, AWS, endPoint){
    storeData_multiSample(dataType, data);
    if(isNew){
      console.log('uploading data to cloud')
    //  API.postData(data, data[data.length -1].c, AWS, endPoint, handler);
    }
} 

function handler (response){
  // if(response.status == 401){
  //     silentLogin(email, password, (token) => {
  //       store.dispatch(loginSuccess(token))
  //     } );
  // }
}

export function downloadData(AWS){

}

