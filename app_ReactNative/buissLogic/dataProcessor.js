/*@flow*/
import * as dataTypes from './dataTypes';
import {heartProcessor} from './processors/heartProcessor';
import {temperatureProcessor} from './processors/temperatureProcessor';
import {activityProcessor} from './processors/activityProcessor';

import {storeData, getData_c} from './storage'
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
export function processData(data, timeStamp, AWS, mail, pass, lastBBT){
  email = mail;
  password = pass;
//  console.log(data);
  var processedActivityData = {data: null, activityIncrement: null};
  var processedHeartData = null;
  var processedTemperatureData = null;
  var processedMinBBTData = null;
  var step = 0;
        //    ACTIVITY DATA     //
  if (data.hasOwnProperty(dataTypes.ACTIVITY)){
    processedActivityData = activityProcessor(data[dataTypes.ACTIVITY], timeStamp);
    storeData(dataTypes.ACTIVITY, processedActivityData.data);
    API.postData(processedActivityData.data, processedActivityData.data[processedActivityData.data.length - 1].c.toString(), AWS, 'ACTIVITY', handler);
    ++step;
  }
        //    HEART DATA        //
  if (data.hasOwnProperty(dataTypes.HEART)){
    processedHeartData = heartProcessor(data[dataTypes.HEART], timeStamp);
   // console.log(processedHeartData);
    storeData(dataTypes.HEART, processedHeartData);
    API.postData(processedHeartData, processedHeartData[processedHeartData.length - 1].c.toString(), AWS, 'HEART', handler);
    ++step;
  }
        //    TEMPERATURE DATA   //
  if (data.hasOwnProperty(dataTypes.TEMPERATURE)){
    processedTemperatureData = temperatureProcessor(data[dataTypes.TEMPERATURE], timeStamp);
    storeData(dataTypes.TEMPERATURE, processedTemperatureData);
    API.postData(processedTemperatureData, processedTemperatureData[processedTemperatureData.length - 1].c.toString(), AWS, 'TEMPERATURE', handler);
    ++step;
  }

  // MAKE ASYNC RESPECT TEMPERATURE DATA
        //    BBT DATA   //
  // if ( data.hasOwnProperty(dataTypes.TEMPERATURE) ) {
  //     //process from last to current 
  //   const currentBBT = processedTemperatureData[processedTemperatureData.length - 1].c;
  //   const count = Math.floor((currentBBT - lastBBT)/8640000);
  //   var countInner = 0;
  //   var minTemp = [];
  //   console.log('processing ' + count + ' minBBT days');
  //   console.log('currentBBT = ' +currentBBT+ '    lastBBT = '+ lastBBT);
  //   for (var i = lastBBT; i < currentBBT; i += 8640000 /*1 day*/) {
  //     if(currentBBT - i > 8640000){
  //       getData_c(dataTypes.TEMPERATURE, i, i + 8640000, (storedData) => {
  //         console.log('processing day: ' + countInner);
  //         var minimalTemperature = 50;
  //         var minPos;
  //         for (var i = 0; i < storeData.length; i++) {
  //           if (storedData[i].v < minimalTemperature){
  //             minimalTemperature = storedData[i].v;
  //             minPos = i;
  //           }
  //         };
  //         if (minimalTemperature < 50){
  //           minTemp.push(storedData[minPos]);
  //         }
  //           //DONE
  //         ++ countInner;
  //         if (countInner == count){
  //           store.dispatch(userActions.setLastBBT(minTemp[minTemp.length - 1].c));
  //           ++step;
  //           processedMinBBTData = minTemp;
  //           dispatchData(step, {
  //             activity: processedActivityData.data, 
  //             activityIncrement: processedActivityData.activityIncrement, 
  //             heart: processedHeartData, 
  //             temperature: processedTemperatureData,
  //             minBBT: processedMinBBTData,
  //           });
  //         }
  //       })
  //     }
  //   }
  // }
  //       //    DISPATCH DATA   //
  // else {
    dispatchData(step, {
      activity: processedActivityData.data, 
      activityIncrement: processedActivityData.activityIncrement, 
      heart: processedHeartData, 
      temperature: processedTemperatureData,
      minBBT: processedMinBBTData,
    });
 // }
  
}
function dispatchData (steps, data){
  if(steps == totalSteps){
    store.dispatch(dataActions.dataUpdated(data));
  }
}
function handler (response){
  if(response.status == 401){
      silentLogin(email, password, (token) => {
        store.dispatch(loginSuccess(token))
      } );
  }
}

