/*@flow*/

import * as dataTypes from '../dataTypes'

export function sleepProcessor(data: Object, timeStamp, arduino_c){
  return processData(data);
}

function processData(data: Object){
  var ans = [];
  var index = 0;
  ans[index] = {c: data[0].c, v: sumActivity(data[0]), sleep: false, c_out: data[0].c }
  for (var i = 1; i < data.length - 1; i++) {
    if(data[i].c - ans[index].c > dataTypes.timeStep){
      console.log('time step elapsed.')
      ans[index].sleep = ans[index].v / (ans[index].c_out - ans[index].c + 1) < dataTypes.tresHold;
      if (index > 0 && ans[index].sleep == ans[index -1].sleep){
        console.log('same isSleep value, compacting')
        ans[index -1].v += ans[index].v;
        ans[index -1].c_out = ans[index].c_out;
      }
      else{
        console.log('different isSleep value, new sample')
        ++index;
      }
      ans[index] = {c: data[i].c, v: sumActivity(data[i]), sleep: false, c_out: data[i].c }
    }
    else {
      ans[index].c_out = data[i].c;
      ans[index].v += sumActivity(data[i]);
    }
  };  
  return ans;
}

function sumActivity(a){
  return a.aX + a.aY + a.aZ;
}