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

export function storeData(dataType, data: Object, handler){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', (totalSamples + 1).toString() );
    AsyncStorage.setItem( dataType + totalSamples.toString(), JSON.stringify(data) );
  //  console.log('A NEW TOTAL OF ' + totalSamples + dataType);
  });
}

export function storeData_i (dataType, data, i){
    AsyncStorage.setItem( dataType + i.toString(), JSON.stringify(data) );
}

export function storeData_i_last (dataType, data, i, handler){
    AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', i.toString() );
    AsyncStorage.setItem( dataType + i.toString(), JSON.stringify(data) ).then(() => handler());
}

export function getAllData (dataType, handler){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    console.log('geting data, total samples to get = ' + totalSamples)
    if (totalSamples < 1){
      handler([]);
    }
    getData(dataType, 0, totalSamples, (ans) => {
        handler(ans);
    });
  });
}

export function getData (dataType, from, to, handler) {
  var ans = [];
  var completed = to - from;
  for (var i = from; i < to; i++) {
    AsyncStorage.getItem(dataType + i.toString()).then((sample)=>{
    //  console.log(JSON.parse(sample));
      ans.push.apply(ans, JSON.parse(sample).data );
      --completed;
      if (completed == 0){
        handler(ans);
      }
    });
  }
}

export function getData_c (dataType, from_c, to_c, handler) {
  findIndex_c(dataType, from_c, (from_i) => {
    console.log('index from = ' + from_i)
    findIndex_c(dataType, to_c, (to_i) => {
      console.log('index to = ' + to_i)
      getData(dataType, from_i, to_i, (ans) => {
        handler(ans);
      });
    });
  });
}

function findIndex_c (dataType, c, handler){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((right)=>{
    asyncBinSearch(dataType, 0, --right, c, handler);
  });
}

function asyncBinSearch (dataType, L, R, c, handler){
    const m = Math.floor((L + R)/2);
  //  console.log('el den medio delo xixooo = ' + m)
    AsyncStorage.getItem( dataType + ( m ).toString() ).then((sample)=>{
      var current = JSON.parse(sample);
      if (c < current[0].c){
        L = m + 1;
        asyncBinSearch(dataType, L, R, c, handler);
      }
      else if (c > current[current.length - 1].c){
        R = m - 1;
        asyncBinSearch(dataType, L, R, c, handler);
      }
      if (L > R){
        handler( m );
      }
    });
}

export function clearData (){
    AsyncStorage.setItem( 'a' + '_TOTAL_SAMPLES', '0' );
    AsyncStorage.setItem( 't' + '_TOTAL_SAMPLES', '0' );
    AsyncStorage.setItem( 'h' + '_TOTAL_SAMPLES', '0' );
}
