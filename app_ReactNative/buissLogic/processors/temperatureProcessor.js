/*@flow*/
import {AsyncStorage} from 'react-native';
import {currentHeartBeat} from '../../redux/actions/heartData';
import { store } from '../../redux/store';
import { dispatch } from 'redux';

export function temperatureProcessor(data: Object){
  storeData( processData(data) );
}

function processData(data: Object){
  return data;
}

function storeData(data: Object){
  var newSamples : number = 1;    //unit samples!!!
  var totalSamples : number;
  AsyncStorage.getItem('TEMPERATURE_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    totalSamples += newSamples;
    AsyncStorage.setItem('TEMPERATURE_TOTAL_SAMPLES', totalSamples.toString());
   /* for (var i = 0; i < newSamples; i++) {*/ var i = 0;
      AsyncStorage.setItem('TMP_' + (i + totalSamples - newSamples).toString(), JSON.stringify(data));
   //}
   // store.dispatch(currentHeartBeat(data[newSamples - 1].bpm));
    console.log('temperature data stored, ' + newSamples + ' new samples, ' + totalSamples + ' total samples.');
  });
}

/*
export function getTemperatureData(data : Array<Object>){
  AsyncStorage.getItem('HEART_TOTAL_SAMPLES').then((storedNSamples)=>{
    var samples : number = parseInt(storedNSamples);
    if(samples == 0){return null;}
    var ite = data.length - 1;
    for (var i = data.length - 1; i < samples; i++) {
      AsyncStorage.getItem('HEART_SAMPLE_'+ i.toString()).then((item)=>{
        data[ite] = JSON.parse(item);
        ++ite;
        if (ite == samples - 1){
          store.dispatch(heartDataLoaded());
        }
      });
    }
  });
}

*/