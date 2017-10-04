/*@flow*/

const tresHold = 20; // activity/second

export function sleepProcessor(data: Object, timeStamp, arduino_c){
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    data[i].c = timeStamp - (arduino_c - data[i].c)*1000; 
  };
  return processData(data);
}

function processData(data: Object){
  var ans = [];
  var index = 0;
  var lastIsSleep = (data[0].v + data[1].v) / (data[1].c - data[0].c) < tresHold;
  ans[0] = {c: data[0].c, v: sumActivity(data[0]) + sumActivity(data[1]), sleep: lastIsSleep, c_out: data[1].c }
  for (var i = 1; i < data.length - 1; i++) {
    var currentIsSleep = (ans[index].v + sumActivity(data[i])) / ((data[i].c - ans[index].c)/1000) < tresHold;
    if (currentIsSleep != lastIsSleep){
      ++index;
      ans[index] = {c: data[i].c, v: 0, c_out: data[i].c }
      lastIsSleep = currentIsSleep;
      console.log('new day')
    }
    ans[index] = {c: ans[index].c, v: ans[index].v + sumActivity(data[i]), sleep: lastIsSleep, c_out: data[i].c}
  };  
  console.log(ans)
  return ans;
}

function sumActivity(a){
  return a.aX + a.aY + a.aZ;
}