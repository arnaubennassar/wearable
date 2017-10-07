/*@flow*/
import * as dataTypes from './dataTypes';
import {activityProcessor} from './processors/activityProcessor';
import {heartProcessor} from './processors/heartProcessor';
import {temperatureProcessor} from './processors/temperatureProcessor';
import {BBTProcessor} from './processors/BBTProcessor';
import {sleepProcessor} from './processors/sleepProcessor';

import {storeData_array, storeData_object, storeData_multiSample} from './storage'

import * as dataActions from '../redux/actions/data';
import { store } from '../redux/store';
import { dispatch } from 'redux';

var email = '';
var password = '';
const totalSteps = 4;
export function processData(data, timeStamp, isNew){
  var arduino_c = 0;
  if (isNew){
    arduino_c = data.c;
  }
  //isNew = true;
  console.log(data);
  var processedActivityData = null;
  var processedHeartData = null;
  var processedTemperatureData = null;
  var processedBBTData = null;
  var processedSleepData = null;
  var maxTime = 0;

//    ACTIVITY DATA     //
  if (data.hasOwnProperty(dataTypes.ACTIVITY) && data[dataTypes.ACTIVITY].length > 0){
    if (isNew){
      processedActivityData = activityProcessor( splitByDays(data[dataTypes.ACTIVITY], timeStamp, arduino_c) );
      maxTime = (maxTime < processedActivityData[processedActivityData.length - 1][0].c) ? processedActivityData[processedActivityData.length - 1][0].c : maxTime;
  //SLEEP NEW DATA//
      processedSleepData = sleepProcessor( processedActivityData );
      storeData_multiSample(dataTypes.SLEEP, processedSleepData);
    }
    else{
      processedActivityData = data[dataTypes.ACTIVITY];
    }
    storeData_multiSample(dataTypes.ACTIVITY, processedActivityData);
  }      
  //SLEEP OLD DATA//
  if ( data.hasOwnProperty(dataTypes.SLEEP) && data[dataTypes.SLEEP].length > 0 ) {
    processedSleepData = data[dataTypes.SLEEP];
    storeData_multiSample(dataTypes.SLEEP, processedSleepData);
  }
//____________________//
//    HEART DATA     //
  if (data.hasOwnProperty(dataTypes.HEART) && data[dataTypes.HEART].length > 0){
    if (isNew){
      processedHeartData = heartProcessor( splitByDays(data[dataTypes.HEART], timeStamp, arduino_c) );
      maxTime = (maxTime < processedHeartData[processedHeartData.length - 1][0].c) ? processedHeartData[processedHeartData.length - 1][0].c : maxTime;
    }
    else{
      processedHeartData = data[dataTypes.HEART];
    }
    storeData_multiSample(dataTypes.HEART, processedHeartData);
  }  
//____________________//
//    TEMPERATURE DATA     //
  if (data.hasOwnProperty(dataTypes.TEMPERATURE) && data[dataTypes.TEMPERATURE].length > 0){
    if (isNew){
      splitedTemperatureData = splitByDays( data[dataTypes.TEMPERATURE], timeStamp, arduino_c )
      processedTemperatureData = temperatureProcessor( splitedTemperatureData );
      maxTime = (maxTime < processedTemperatureData[processedTemperatureData.length - 1][0].c) ? processedTemperatureData[processedTemperatureData.length - 1][0].c : maxTime;
  //BBT NEW DATA//
      processedBBTData = BBTProcessor( splitedTemperatureData );
      storeData_multiSample(dataTypes.BBT, processedBBTData);
    }
    else{
      processedTemperatureData = data[dataTypes.TEMPERATURE];
    }
    storeData_multiSample(dataTypes.TEMPERATURE, processedTemperatureData);
  }
  //BBT OLD DATA//
  if ( data.hasOwnProperty(dataTypes.BBT) && data[dataTypes.BBT].length > 0 ) {
    processedBBTData = data[dataTypes.BBT];
    storeData_multiSample(dataTypes.BBT, processedBBTData);
  }
//____________________//

  console.log('processedBBTData:')
  console.log(processedBBTData)
  store.dispatch(dataActions.dataUpdated({
    activity: processedActivityData,
    BBT: processedBBTData,
    sleep: processedSleepData,
    lastUpdate: null
  }));
  return maxTime;
}

function splitByDays(data, timeStamp, arduino_c){
  var ans = [];
  var last = 0;
  var index = 0;
  for (var i = 0; i < data.length - 1; i++) {
    data[i].c = timeStamp - ((arduino_c - data[i].c)*1000); 
    nextDay = timeStamp - ((arduino_c - data[i + 1].c)*1000);
    if(new Date(data[i].c).getDate() != new Date(nextDay).getDate()){
      ans[index] = data.slice(last, i + 1);
      ++index;
      last = i + 1;
    }
  };
  data[data.length - 1].c = timeStamp - ((arduino_c - data[data.length - 1].c)*1000); 
  ans[index] = data.slice(last, data.length);
  return ans;
}