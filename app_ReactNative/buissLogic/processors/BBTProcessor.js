/*@flow*/
export function BBTProcessor(data: Object, timeStamp, arduino_c){
  console.log(data);
  for (var i = 0; i < data.length; i++) {
  //  data[i].c = timeStamp - (arduino_c - data[i].c)*1000; 
  };
  return processData(data);
}

function processData(data: Object){
  var ans = [];
  ans[0] = data[0];
  var index = 0;
  for (var i = 0; i < data.length; i++) {
    if (new Date(data[i].c).getDate() != new Date(ans[index].c).getDate() ){
      ++index;
      ans[index] = data[i];
      console.log('new day')
    }
    if (data[i].v < ans[index].v){
      ans[index] = data[i];
    }
  };  
  console.log(ans)
  return ans;
}

 