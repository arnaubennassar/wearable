/*@flow*/
export function BBTProcessor(data){
  var response = [];
  for (var i = 0; i < data.length; i++) {
  	response[i] = [];
    response[i][0] = {c: data[i][0].c, v: 50};
    for (var j = 0; j < data[i].length; j++) {
    //	console.log('i '+i+' j '+j)
      response[i][0].v = (response[i][0].v > data[i][j].v) ? data[i][j].v : response[i][0].v;
    };
  };
  return response;
}

 