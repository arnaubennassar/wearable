/*@flow*/

import * as dataTypes from '../dataTypes'

export function sleepProcessor(data){
  var response = [];
  for (var i = 0; i < data.length; i++) {
    var aux = data[i];
    var ans = [];
    var index = 0;
    ans[index] = {c: aux[0].c, v: aux[0].v, sleep: false, c_out: aux[0].c }
    for (var j = 1; j < aux.length; j++) {
      if(aux[j].c - ans[index].c > dataTypes.timeStep){
        ++index;
        ans[index] = {c: aux[j].c, v: aux[j].v, sleep: false, c_out: aux[j].c }
        ans[index -1].sleep = ans[index - 1].v / (ans[index - 1].c_out - ans[index - 1].c + 1) < dataTypes.tresHold;
      }
      else{
        ans[index].c_out = aux[j].c;
        ans[index].v += aux[j].v;
      }
    };
    ans[index].sleep = ans[index].v / (ans[index].c_out - ans[index].c + 1) < dataTypes.tresHold;
    response.push.apply(response, ans);
  };
  return response;
}

