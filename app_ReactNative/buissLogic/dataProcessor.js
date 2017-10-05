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
  var step = 0;

        //    ACTIVITY DATA     //
  if (data.hasOwnProperty(dataTypes.ACTIVITY) && data[dataTypes.ACTIVITY].length > 0){
    if (isNew){
      processedActivityData = activityProcessor(data[dataTypes.ACTIVITY], timeStamp, arduino_c).data;
    }
    else{
      processedActivityData = data[dataTypes.ACTIVITY];
    }
  //  _storeData(dataTypes.ACTIVITY, processedActivityData, isNew, AWS, 'ACTIVITY');
    ++step;
  }      

  //       //    HEART DATA     //
  // if (data.hasOwnProperty(dataTypes.HEART) && data[dataTypes.HEART].length > 0){
  //   if (isNew){
  //     processedHeartData = heartProcessor(data[dataTypes.HEART], timeStamp, arduino_c);
  //   }
  //   else{
  //     processedHeartData = data[dataTypes.HEART];
  //   }
  //   _storeData(dataTypes.HEART, processedHeartData, isNew, AWS, 'HEART');
  //   ++step;
  // }  

  //       //    TEMPERATURE DATA     //
  // if (data.hasOwnProperty(dataTypes.TEMPERATURE) && data[dataTypes.TEMPERATURE].length > 0){
  //   if (isNew){
  //     processedTemperatureData = temperatureProcessor(data[dataTypes.TEMPERATURE], timeStamp, arduino_c);
  //   }
  //   else{
  //     processedTemperatureData = data[dataTypes.TEMPERATURE];
  //   }
  //   _storeData(dataTypes.TEMPERATURE, processedTemperatureData, isNew, AWS, 'TEMPERATURE');
  //   ++step;
  // }

  //       //    BBT DATA   //
  // if ( isNew && data.hasOwnProperty(dataTypes.TEMPERATURE) && data[dataTypes.TEMPERATURE].length > 0 ) {
  //   console.log('is new');
  //   processedBBTData = BBTProcessor(data[dataTypes.TEMPERATURE], timeStamp, arduino_c);
  //   _storeData(dataTypes.BBT, processedBBTData, isNew, AWS, 'BBT');
  //   ++step;
  // }
  // else if ( data.hasOwnProperty(dataTypes.BBT) && data[dataTypes.BBT].length > 0 ) {
  //   processedBBTData = data[dataTypes.BBT];
  //   _storeData(dataTypes.BBT, processedBBTData, isNew, AWS, 'SLEEP');
  //   ++step;
  // }

          // SLEEP DATA   //
  if ( isNew && data.hasOwnProperty(dataTypes.ACTIVITY) && data[dataTypes.ACTIVITY].length > 0) {
    console.log('is new');
    processedSleepData = sleepProcessor(data[dataTypes.ACTIVITY], timeStamp, arduino_c);
    _storeData(dataTypes.SLEEP, processedSleepData, isNew, AWS, 'SLEEP');
    ++step;
  }
  else if ( data.hasOwnProperty(dataTypes.SLEEP) && data[dataTypes.SLEEP].length > 0 ) {
    processedSleepData = data[dataTypes.SLEEP];
    _storeData(dataTypes.SLEEP, processedSleepData, isNew, AWS, 'SLEEP');
    ++step;
  }
}

function _storeData (dataType, data, isNew, AWS, endPoint){
    var last = 0;
    var pos  = 0;
    var days = [];
  //SPLIT BY DAYS
    console.log(dataType + ' : ' );
    console.log(data);
    if (dataType != 'b'){
      for (var i = 0; i < data.length - 1; i++) {
        if ( new Date(data[i].c).getDate() != new Date(data[i + 1].c).getDate() ){
          //another day
          days[pos] = data.slice(last, i + 1);
          ++pos;
          last = i + 1;
        }
      };
    }
    if(last == 0){
      aux = [];
      aux[0] = data;
      days = aux;
    }
    storeData_multiSample(dataType, days);
    if(isNew){
      console.log('uploading data to cloud')
    //  API.postData(data, data[data.length -1].c, AWS, endPoint, handler);
    }
} 

function dispatchData (steps, data){
  if(steps == totalSteps){
    store.dispatch(dataActions.dataUpdated(data));
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

