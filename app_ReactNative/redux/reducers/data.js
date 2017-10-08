/*@flow*/

let cloneObject = function (obj){
  return JSON.parse(JSON.stringify(obj));
}

export const dataDefault: DataState =
{
  data: {
    BBT:[],
    sleep: [], 
    dailyActivity: [],
    activityObjective: 100000,
    lastUpdate: 0
  }, 
};

type DataState = {
  data:{
    BBT:[{
      v: number,
      c: number
    }],
    sleep:[{
      v: number,
      c: number
    }],
    dailyActivity:[{
      v: number,
      c: number
    }],
    activityObjective: number,
    lastUpdate: number
  }
}

function getSleepTime(data){
  var ans = 0;
  for (var i = 0; i < data.length; i++) {
    ans += (data[i].sleep) ? (data[i].c_out - data[i].c) : 0;
  };
  return ans;
}

function getAcumulatedActivity(data){
  var ans = 0;
  for (var i = 0; i < data.length; i++) {
    ans += data[i].v;
  };
  return ans;
}

export const dataReducer = (state: DataState, action: Object) => {
  switch (action.type){
    case 'DATA_UPDATED':
      var newState: DataState = cloneObject(state);
//dailyActivity
      if (action.payload.activity != null){
        if(newState.data.dailyActivity.length === 0){//first sample
          for(var i = 0; i < action.payload.activity.length; ++i){
            newState.data.dailyActivity[i] = {c: action.payload.activity[i][0].c, v: getAcumulatedActivity(action.payload.activity[i])}
          }
        }
        else {
          var newActivityData = [];
          console.log('REDUCING ACTIVITY')
          console.log(new Date(newState.data.dailyActivity[newState.data.dailyActivity.length - 1].c).getDate())
          console.log(new Date(action.payload.activity[0][0].c).getDate())
          for(i = 0; i < action.payload.activity.length; ++i){
            var totalActivity = getAcumulatedActivity(action.payload.activity[i]);;
            if (i == 0 && new Date(newState.data.dailyActivity[newState.data.dailyActivity.length - 1].c).getDate() == new Date(action.payload.activity[0][0].c).getDate()){//sample from the same day
              newState.data.dailyActivity[newState.data.dailyActivity.length - 1].v += totalActivity;
            }
            else{
              newState.data.dailyActivity[newState.data.dailyActivity.length] = {c: action.payload.activity[i][0].c, v: totalActivity}
            }
          }
        }
      }
//BBT
      if (action.payload.BBT != null){
        console.log(action.payload.BBT)
        if(newState.data.BBT.length === 0){//First sample
          for (var i = 0; i < action.payload.BBT.length; i++) {
            newState.data.BBT[i] = action.payload.BBT[i][0];
          };
        }
        else {
          for (var i = 0; i < action.payload.BBT.length; i++) {
            if (i == 0 && new Date(newState.data.sleep[newState.data.sleep.length - 1].c).getDate() == new Date(action.payload.sleep[0][0].c).getDate()){//sample from the same day
              if ( newState.data.BBT[newState.data.BBT.length - 1].v > action.payload.BBT[0][0].v ){
                newState.data.BBT[newState.data.BBT.length - 1] = action.payload.BBT[0][0];
              }
            }
            else{
              newState.data.BBT[newState.data.BBT.length] = action.payload.BBT[i][0];
            }
          };
        }
      }
//SLEEP
      if (action.payload.sleep != null){
        console.log(action.payload.sleep)
        if(newState.data.sleep.length === 0){//first sample
          for(var i = 0; i < action.payload.sleep.length; ++i){
            newState.data.sleep[i] = {c: action.payload.sleep[i][0].c, v: getSleepTime(action.payload.sleep[i])}
          }
        }
        else {
          for (var i = 0; i < action.payload.sleep.length; i++) {
            if (i == 0 && new Date(newState.data.sleep[newState.data.sleep.length - 1].c).getDate() == new Date(action.payload.sleep[0][0].c).getDate()){//sample from the same day
              newState.data.sleep[newState.data.sleep.length - 1].v += getSleepTime(action.payload.sleep[0]);
            }
            else{
              newState.data.sleep[newState.data.sleep.length] = {c: action.payload.sleep[i][0].c, v: getSleepTime(action.payload.sleep[i])}
            }
          };
        }
      }
      if (action.payload.lastUpdate > newState.data.lastUpdate){
        newState.data.lastUpdate = action.payload.lastUpdate;
      }
      return newState;

    case "LOGOUT":
      return dataDefault;
    default:
      return state || dataDefault;

  }
}


