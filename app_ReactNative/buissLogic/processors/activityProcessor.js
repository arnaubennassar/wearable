/*@flow*/
export function activityProcessor(data){
 // console.log(data)
  var response = [];
  for (var i = 0; i < data.length; i++) {
    response[i] = [];
    for (var j = 0; j < data[i].length; j++) {
      response[i][j] = {
        aX: data[i][j].aX,
        aY: data[i][j].aY,
        aZ: data[i][j].aZ,
        gX: data[i][j].gX,
        gY: data[i][j].gY,
        gZ: data[i][j].gZ,
        v: data[i][j].aX + data[i][j].aY + data[i][j].aZ,
        c: data[i][j].c
      }
    };
  };
  return response;
}