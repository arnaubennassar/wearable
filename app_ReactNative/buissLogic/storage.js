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

export function storeData(dataType, data: Object){
 // console.log('storing: ' + dataType);
  AsyncStorage.getItem(dataType + '_TOTAL_SAMPLES').then((storedNSamples)=>{
    totalSamples = parseInt(storedNSamples);
    AsyncStorage.setItem( dataType + totalSamples.toString, JSON.stringify(data) );
    AsyncStorage.setItem( dataType + '_TOTAL_SAMPLES', (totalSamples + 1).toString() );
  //  console.log('A NEW TOTAL OF ' + totalSamples + dataType);
  });
}
