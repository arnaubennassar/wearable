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
 // console.log('initializing: ' + dataType);
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
    console.log('checking stored days of ' + dataType +'. totalsamples = ' + storedNSamples)
    for (var i = 0; i < totalSamples + 1; i++) {
        getData(dataType, i, i+1, (ans) => {
          var day = new Date(ans[0].c).getDate();
          var totOK = true;
          for (var j = 0; j < ans.length; j++) {
            _day = new Date(ans[j].c).getDate();
            //console.log(_day);
            if (_day != day){
              console.log('datatype: : ' +dataType);
              console.log('not same day: ' + day + ' vs ' + _day);
              totOK = false;
            }
          };
          if (totOK){
            console.log('CORRECT DAY ' + day);
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
  else (console.log('DONE wiz ' + dataType));
}

export function storeData(dataType, data: Object, handler){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    AsyncStorage.getItem(dataType + totalSamples.toString()).then((lastSample)=>{
      console.log('current storage position = ' + totalSamples + 'dataType = ' + dataType)
      var _lastSample;
      if( lastSample == 'damm'){
        var _lastSample = undefined;
      }
      else {
        _lastSample = JSON.parse(lastSample);
      }
  //FIRST DAY      
      if (_lastSample == undefined){
        console.log('storing the very first sample, day: ' + new Date(data[0].c).getDate() );
        AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', '0' )
        AsyncStorage.setItem( dataType + (totalSamples).toString(), JSON.stringify(data) ).then(() => { handler(); });
      }
  //NEW DAY
      else if ( new Date(_lastSample[0].c).getDate() != new Date(data[0].c).getDate() ){
        console.log(dataType + ' storing a new day: ' + new Date(data[0].c).getDate() );
        AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', (totalSamples + 1).toString() ).then(() => { handler(); });
        AsyncStorage.setItem( dataType + (totalSamples + 1).toString(), JSON.stringify(data) );
      }
  //SAME DAY
      else {
        console.log(dataType + ' storing to the same day: ' + new Date(_lastSample[0].c).getDate());
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
    console.log('geting data, total samples to get = ' + totalSamples);
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
        console.log('from_i = ' + from_i + '  , completed = ' + completed + '  , ')
        for (var i = from_i; i < totalSamples; i++) {
            console.log(dataType)
          console.log('adding new sample')
          AsyncStorage.getItem(dataType + i.toString()).then((sample)=>{
            console.log(sample)
            console.log(dataType)
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
    // console.log('sample = ' + sample[0].c + ' , ' +  new Date(sample[0].c).toString())
    // console.log('c = ' + c + ' , ' +  new Date(c).toString())
    // console.log('i: '+i+' , total: ' + total)
    // console.log('i > total? ' + i > total)
    // console.log('sample[0].c > c? ' + (sample[0].c > c))
    // console.log(sample[0].c - c)
    if (i > total){
      console.log('nein')
      handler(false);
    }
    else if(sample[0].c > c){
      console.log('suuuuuuuu')
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
        console.log(ans);
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
