import {AsyncStorage} from 'react-native';

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

var step = 0;

export default function initStorage (handler){
	step = 1;
	_initStorage('TEMPERATURE_TOTAL_SAMPLES', handler);
}