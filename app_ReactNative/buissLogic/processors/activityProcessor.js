/*@flow*/
export function activityProcessor(data: Object, timeStamp){
  for (var i = 0; i < data.length; i++) {
    data[i].c += timeStamp; 
  };
  return processData(data);
}

function processData(data: Object){
  return data;
}

// function storeData(data: Object){
//   var newSamples : number = data.length;
//   var totalSamples : number;
//   AsyncStorage.getItem('HEART_TOTAL_SAMPLES').then((storedNSamples)=>{
//     totalSamples = parseInt(storedNSamples);
//     totalSamples += newSamples;
//     AsyncStorage.setItem('HEART_TOTAL_SAMPLES', totalSamples.toString());
//     for (var i = 0; i < newSamples; i++) {
//       AsyncStorage.setItem('HEART_SAMPLE_' + (i + totalSamples - newSamples).toString(), JSON.stringify(data[i]));
//     }
//     store.dispatch(currentHeartBeat(data[newSamples - 1].bpm));
//     console.log('heart data stored, ' + newSamples + ' new samples, ' + totalSamples + ' total samples.');
//   });
// }
