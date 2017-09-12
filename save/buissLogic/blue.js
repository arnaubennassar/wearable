/*@flow*/
import {heartProcessor} from './processors/heartProcessor';
import {temperatureProcessor} from './processors/temperatureProcessor';


export function recieveBT(BTData: object, timeStamp){
	var data: object = 	JSON.parse( BTData.data.slice(0, -1) );
	data.c += timeStamp;
	console.log(data);
  switch(data.t){
    case 'h':
      heartProcessor(BTData.data);
    break;
    case 't':
      temperatureProcessor(BTData.data);
    break;
    default:
    break;
  }
}


