/*@flow*/
import * as dataTypes from './dataTypes';
import {heartProcessor} from './processors/heartProcessor';
import {temperatureProcessor} from './processors/temperatureProcessor';
import {activityProcessor} from './processors/activityProcessor';

import {storeData} from './storage'

import * as actions from '../redux/actions/data';
import { store } from '../redux/store';
import { dispatch } from 'redux';

export function processData(data, timeStamp){
  console.log(data);
  var processedActivityData = null;
  var processedHeartData = null;
  var processedTemperatureData = null;
  if (data.hasOwnProperty(dataTypes.ACTIVITY)){
    processedActivityData = activityProcessor(data[dataTypes.ACTIVITY], timeStamp);
    storeData(dataTypes.ACTIVITY, processedActivityData);
  }
  if (data.hasOwnProperty(dataTypes.HEART)){
    processedHeartData = heartProcessor(data[dataTypes.HEART], timeStamp);
    storeData(dataTypes.HEART, processedHeartData);
  }
  if (data.hasOwnProperty(dataTypes.TEMPERATURE)){
    processedTemperatureData = temperatureProcessor(data[dataTypes.TEMPERATURE], timeStamp);
    storeData(dataTypes.TEMPERATURE, processedTemperatureData);
  }
  store.dispatch(actions.dataUpdated({
    activity: processedActivityData, 
    heart: processedHeartData, 
    temperature: processedTemperatureData
  }));
    // switch(data.t){
    // case dataTypes.HEART:
    //   heartProcessor(BTData.data);
    // break;
    // case dataTypes.TEMPERATURE:
    //   temperatureProcessor(BTData.data);
    // break;
    // default:
    // break;
  }

	// var data: object = 	JSON.parse( BTData.data.slice(0, -1) );
	// data.c += timeStamp;
	// console.log(data);
 //  switch(data.t){
 //    case dataTypes.HEART:
 //      heartProcessor(BTData.data);
 //    break;
 //    case dataTypes.TEMPERATURE:
 //      temperatureProcessor(BTData.data);
 //    break;
 //    default:
 //    break;
 //  }
//}


