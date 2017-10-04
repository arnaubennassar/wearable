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
    for (var i = 0; i < totalSamples; i++) {
            getData(dataType, i, i+1, (ans) => {
              var day = new Date(ans[0].c).getDate();
              var totOK = true;
              for (var j = 0; j < ans.length; j++) {
                _day = new Date(ans[j].c).getDate();
                //console.log(_day);
                if (_day != day){
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

export function storeData_multiSample(dataType, data: Object){
  if (dataType == 'b'){
    _storeData_multiSample_BBT(data, 0);
  }
  else {
    _storeData_multiSample(dataType, data, 0);
  }
}

function _storeData_multiSample(dataType, data: Object, current){
  if (current < data.length){
    storeData(dataType, data[current], () => {
      _storeData_multiSample(dataType, data, ++current);
    });
  }
  else (console.log('DONE wiz ' + dataType));
}

function _storeData_multiSample_BBT(data: Object, current){
  if (current < data.length){
    console.log('storing:')
    console.log(data[current])
    storeData_BBT(data[current], () => {
      _storeData_multiSample_BBT(data, ++current);
    });
  }
  else (console.log('DONE wiz BBT'));
}

      //BBT CASE!!!!
export function storeData_BBT (data, handler){
    AsyncStorage.getItem('b_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
  //  console.log('current storage position = ' + totalSamples)
    AsyncStorage.getItem('b' + totalSamples.toString()).then((lastSample)=>{
      console.log(lastSample);
      _lastSample = JSON.parse(lastSample);
      if (_lastSample == undefined){
        console.log(data);
        console.log('storing the first day: ' + new Date(data.c).getDate() );
        AsyncStorage.setItem( 'b' + '_TOTAL_SAMPLES', '0' ).then((aha) => { console.log(aha); handler(); });
        AsyncStorage.setItem( 'b' + (totalSamples).toString(), JSON.stringify(data) );
      }
      else if ( new Date(_lastSample.c).getDate() != new Date(data.c).getDate() ){
        console.log('storing a new day: ' + new Date(data.c).getDate() );
        AsyncStorage.setItem( 'b' + '_TOTAL_SAMPLES', (totalSamples + 1).toString() ).then(() => { handler(); });
        AsyncStorage.setItem( 'b' + (totalSamples + 1).toString(), JSON.stringify(data) );
      }
      else if (_lastSample.v > data.v){
        console.log('storing to the same day: ' + new Date(_lastSample.c).getDate());
        AsyncStorage.setItem( 'b' + totalSamples.toString(), JSON.stringify(data) ).then(() => { handler(); });
      }
    });
  });
}

export function storeData(dataType, data: Object, handler){
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
  //  console.log('current storage position = ' + totalSamples)
    AsyncStorage.getItem(dataType + totalSamples.toString()).then((lastSample)=>{
      _lastSample = JSON.parse(lastSample);
      if ( new Date(_lastSample[0].c).getDate() != new Date(data[0].c).getDate() ){
  //      console.log('storing a new day: ' + new Date(data[0].c).getDate() );
        AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', (totalSamples + 1).toString() ).then(() => { handler(); });
        AsyncStorage.setItem( dataType + (totalSamples).toString(), JSON.stringify(data) );
      }
      else {
  //      console.log('storing to the same day: ' + new Date(_lastSample[0].c).getDate());
        _lastSample.push.apply(_lastSample, data);
        AsyncStorage.setItem( dataType + totalSamples.toString(), JSON.stringify(_lastSample) ).then(() => { handler(); });
      }
    });
  });
}

export function storeData_i (dataType, data, i){
    AsyncStorage.setItem( dataType + i.toString(), JSON.stringify(data) );
}

export function storeData_i_last (dataType, data, i, handler){
    AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', (i + 1).toString() );
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
      ans.push.apply(ans, JSON.parse(sample) );
      --completed;
      if (completed == 0){
        handler(ans);
      }
    });
  }
}

// export function getData_c (dataType, from_c, to_c, handler) {
//   findIndex_c(dataType, from_c, (from_i) => {
//     console.log('index from = ' + from_i)
//     findIndex_c(dataType, to_c, (to_i) => {
//       console.log('index to = ' + to_i)
//       getData(dataType, from_i, to_i, (ans) => {
//         handler(ans);
//       });
//     });
//   });
// }

// function findIndex_c (dataType, c, handler){
//   AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((right)=>{
//     asyncBinSearch(dataType, 0, --right, c, handler);
//   });
// }

// function asyncBinSearch (dataType, L, R, c, handler){
//     const m = Math.floor((L + R)/2);
//   //  console.log('el den medio delo xixooo = ' + m)
//     AsyncStorage.getItem( dataType + ( m ).toString() ).then((sample)=>{
//       var current = JSON.parse(sample);
//       if (c < current[0].c){
//         L = m + 1;
//         asyncBinSearch(dataType, L, R, c, handler);
//       }
//       else if (c > current[current.length - 1].c){
//         R = m - 1;
//         asyncBinSearch(dataType, L, R, c, handler);
//       }
//       if (L > R){
//         handler( m );
//       }
//     });
// }

export function clearData (){
    AsyncStorage.setItem( 'a' + '_TOTAL_SAMPLES', '0' );
    AsyncStorage.setItem( 't' + '_TOTAL_SAMPLES', '0' );
    AsyncStorage.setItem( 'h' + '_TOTAL_SAMPLES', '0' );
}
