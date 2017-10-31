import {AsyncStorage} from 'react-native';
import * as dataTypes from './dataTypes';

var step = 0;

export function initStorage (handler){
  step = dataTypes.dataTypes.length;
  for (i = 0; i < dataTypes.dataTypes.length; ++i){
    _initStorage(dataTypes.dataTypes[i] +'_TOTAL_SAMPLES', handler);
  }
}

function _initStorage (dataType: string, returnFunction){
  AsyncStorage.getItem(dataType).then((settingsStr)=>{
    totalSamples = parseInt(settingsStr);
    if ( isNaN(totalSamples) ){
      AsyncStorage.setItem(dataType, '0').then( () => {
      	--step;
	    if (step == 0){
	    	returnFunction();
	    }
	  });
    }
    else --step;
    if (step == 0){
    	returnFunction();
    }
  });
}

export function checkDay(dataType){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    for (var i = 0; i < totalSamples + 1; i++) {
        getData(dataType, i, i+1, (ans) => {
          var day = new Date(ans[0].c).getDate();
          var totOK = true;
          for (var j = 0; j < ans.length; j++) {
            _day = new Date(ans[j].c).getDate();
            if (_day != day){
        //      console.log('not same day: ' + day + ' vs ' + _day);
              totOK = false;
            }
          };
          if (totOK){
        //    console.log('CORRECT DAY ' + day);
          }
        });
    };
  });
}

export function storeData_multiSample(dataType, data){
    _storeData_multiSample(dataType, data, 0);
}

function _storeData_multiSample(dataType, data, current){
  if (current < data.length){
    storeData(dataType, data[current], () => {
      _storeData_multiSample(dataType, data, ++current);
    });
  }
}

export function storeData(dataType, data: Object, handler){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    AsyncStorage.getItem(dataType + totalSamples.toString()).then((lastSample)=>{
      var _lastSample;
      if( lastSample == 'damm'){
        var _lastSample = undefined;
      }
      else {
        _lastSample = JSON.parse(lastSample);
      }
  //FIRST DAY      
      if (_lastSample == undefined){
        AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', '0' )
        AsyncStorage.setItem( dataType + (totalSamples).toString(), JSON.stringify(data) ).then(() => { handler(); });
      }
  //NEW DAY
      else if ( new Date(_lastSample[0].c).getDate() != new Date(data[0].c).getDate() ){
        AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', (totalSamples + 1).toString() ).then(() => { handler(); });
        AsyncStorage.setItem( dataType + (totalSamples + 1).toString(), JSON.stringify(data) );
      }
  //SAME DAY
      else {
      //BBT
        if (dataType == 'b'){
          if(  _lastSample[0].v > data[0].v){
            AsyncStorage.setItem( dataType + totalSamples.toString(), JSON.stringify(data) ).then(() => { handler(); });
          }
          else{
            handler();
          }
        }
      //DEFAULT
        else{
          _lastSample.push.apply(_lastSample, data);
          AsyncStorage.setItem( dataType + totalSamples.toString(), JSON.stringify(_lastSample) ).then(() => { handler(); });
        }
      }
    });
  });
}

export function getAllData (dataType, handler){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    getData(dataType, 0, Math.max(totalSamples, 1), (ans) => {
        handler(ans);
    });
  });
}

export function getData_from (dataType, from_c, handler) {
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = Math.max(parseInt(storedNSamples), 1);
    findIndex_c(dataType, from_c, 0, totalSamples, (from_i) => {
      if(from_i === false){ handler(false) }
      else{
        var ans = [];
        var completed = totalSamples - from_i;
        for (var i = from_i; i < totalSamples; i++) {
        //  console.log('getin data')
          AsyncStorage.getItem(dataType + i.toString()).then((sample)=>{
            ans[i - completed - from_i] = JSON.parse(sample);
            --completed;
            if (completed === 0){
              handler(ans);
            }
          });
        }
      }
    });
  })
}

function findIndex_c (dataType, c, i, total, handler){
  AsyncStorage.getItem(dataType + i.toString()).then( (_sample)=>{
    sample = JSON.parse(_sample);
    if (i > total){
      handler(false);
    }
    else if(sample[0].c > c){
      handler(i);
    }
    else{
      findIndex_c (dataType, c, ++i, total, handler)
    }
  });
}

function getData (dataType, from, to, handler) {
  var ans = [];
  var completed = to - from;
  for (var i = from; i < to; i++) {
    AsyncStorage.getItem(dataType + i.toString()).then((sample)=>{
      ans.push.apply(ans, JSON.parse(sample) );
      --completed;
      if (completed < 0){
        handler(ans);
      }
    });
  }
}

export function clearData (){
    for (i = 0; i < dataTypes.dataTypes.length; ++i){
      AsyncStorage.setItem(dataTypes.dataTypes[i] + '_TOTAL_SAMPLES', '0');
      AsyncStorage.setItem(dataTypes.dataTypes[i] + '0', 'damm');
    }
}
