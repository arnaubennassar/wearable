/*@flow*/
export function temperatureProcessor(data: Object, timeStamp){
  for (var i = 0; i < data.length; i++) {
    data[i].c += timeStamp; 
  };
  return processData(data);
}

function processData(data: Object){
  return data;
}
