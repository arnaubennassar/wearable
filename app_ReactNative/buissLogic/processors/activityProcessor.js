/*@flow*/
export function activityProcessor(data: Object, timeStamp){
  for (var i = 0; i < data.length; i++) {
    data[i].c += timeStamp; 
  };
  return processData(data);
}

function processData(data: Object){
	var sum = 0;
	for (var i = 0; i < data.length; i++) {
		sum += data[i].aX + data[i].aY + data[i].aZ;
	};
  	return {data: data, activityIncrement: sum};
}