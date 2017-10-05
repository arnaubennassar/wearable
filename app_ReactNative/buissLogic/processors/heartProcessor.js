/*@flow*/
export function heartProcessor(data: Object, timeStamp, arduino_c){
  for (var i = 0; i < data.length; i++) {
    data[i].c = timeStamp - ((arduino_c - data[i].c)*1000); 
  //  console.log(new Date (data[i].c).getUTCDate());
  };
  return processData(data);
}

function processData(data: Object){
  return data;
}