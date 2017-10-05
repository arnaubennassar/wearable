/*@flow*/
export function temperatureProcessor(data: Object, timeStamp, arduino_c){
  for (var i = 0; i < data.length; i++) {
  //	console.log('--timeStamp: '+timeStamp+' --arduino_c ' + arduino_c + 'data[i]' + data[i].c)
    data[i].c = timeStamp - ((arduino_c - data[i].c)*1000); 
 // 	console.log('--data: '+new Date(timeStamp - ((arduino_c - data[i].c)*1000)).getUTCDate())
 //   console.log(new Date (data[i].c).getUTCDate());
  };
  return processData(data);
}

function processData(data: Object){
  return data;
}
