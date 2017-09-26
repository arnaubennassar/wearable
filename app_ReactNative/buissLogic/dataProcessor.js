/*@flow*/
import * as dataTypes from './dataTypes';
import {heartProcessor} from './processors/heartProcessor';
import {temperatureProcessor} from './processors/temperatureProcessor';
import {activityProcessor} from './processors/activityProcessor';

import {storeData} from './storage'
import * as API from './api'
import {silentLogin} from './AWSLogin'

import * as actions from '../redux/actions/data';
import {loginSuccess} from '../redux/actions/user';
import { store } from '../redux/store';
import { dispatch } from 'redux';

var email = '';
var password = '';

export function processData(data, timeStamp, AWS, mail, pass){
  email = mail;
  password = pass;
//  console.log(data);
  var processedActivityData = {data: null, activityIncrement: null};
  var processedHeartData = null;
  var processedTemperatureData = null;
        //    ACTIVITY DATA     //
  if (data.hasOwnProperty(dataTypes.ACTIVITY)){
    processedActivityData = activityProcessor(data[dataTypes.ACTIVITY], timeStamp);
    storeData(dataTypes.ACTIVITY, processedActivityData.data);
    API.postData(processedActivityData.data, processedActivityData.data[processedActivityData.data.length - 1].c.toString(), AWS, 'ACTIVITY', handler);
  }
        //    HEART DATA        //
  if (data.hasOwnProperty(dataTypes.HEART)){
    processedHeartData = heartProcessor(data[dataTypes.HEART], timeStamp);
   // console.log(processedHeartData);
    storeData(dataTypes.HEART, processedHeartData);
    API.postData(processedHeartData, processedHeartData[processedHeartData.length - 1].c.toString(), AWS, 'HEART', handler);
  }
        //    TEMPERATURE DATA   //
  if (data.hasOwnProperty(dataTypes.TEMPERATURE)){
    processedTemperatureData = temperatureProcessor(data[dataTypes.TEMPERATURE], timeStamp);
    storeData(dataTypes.TEMPERATURE, processedTemperatureData);
    API.postData(processedTemperatureData, processedTemperatureData[processedTemperatureData.length - 1].c.toString(), AWS, 'TEMPERATURE', handler);
  }
  store.dispatch(actions.dataUpdated({
    activity: processedActivityData.data, 
    activityIncrement: processedActivityData.activityIncrement, 
    heart: processedHeartData, 
    temperature: processedTemperatureData
  }));
}

function handler (response){
  if(response.status == 401){
      silentLogin(email, password, (token) => {
        store.dispatch(loginSuccess(token))
      } );
  }
}

