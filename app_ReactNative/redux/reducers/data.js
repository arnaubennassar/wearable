/*@flow*/
import {sendNotification} from '../../buissLogic/api'
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
    lastUpdate: 0,
    lastFertility: 0
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
    lastUpdate: number,
    lastFertility: number
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
        //  console.log(new Date(newState.data.dailyActivity[newState.data.dailyActivity.length - 1].c).getDate())
        //  console.log(new Date(action.payload.activity[0][0].c).getDate())
          for(i = 0; i < action.payload.activity.length; ++i){
            var totalActivity = getAcumulatedActivity(action.payload.activity[i]);;
            if (i == 0 && new Date(newState.data.dailyActivity[newState.data.dailyActivity.length - 1].c).getDate() == new Date(action.payload.activity[0][0].c).getDate()){//sample from the same day
              newState.data.dailyActivity[newState.data.dailyActivity.length - 1].v += totalActivity;
            }
            else{
              newState.data.dailyActivity[newState.data.dailyActivity.length] = {c: action.payload.activity[i][0].c, v: totalActivity}
            }
          }
          if(newState.data.dailyActivity[newState.data.dailyActivity.length -1].v > newState.data.activityObjective && action.payload.token !== false){
            newState.data.activityObjective = newState.data.dailyActivity[newState.data.dailyActivity.length -1].v * 1.2;
            sendNotification ('Activity', 
              'New activity objective completed!', 
              'runner', 
              {fullDescription: 'You have completed the current daily activity objective, congratulations. Since it seems easy to you, we have increased the dificulty of the daily activity objective'}, 
              action.payload.token, 
              (ans) =>{}
            );
          }
        }
      }
//BBT
      if (action.payload.BBT != null){
        if(newState.data.BBT.length === 0){//First sample
          for (var i = 0; i < action.payload.BBT.length; i++) {
            newState.data.BBT[i] = action.payload.BBT[i][0];
          };
        }
        else {
          for (var i = 0; i < action.payload.BBT.length; i++) {
            // console.log(newState.data.BBT)
            // console.log( new Date(newState.data.BBT[newState.data.BBT.length - 1].c).getDate())
            // console.log(new Date(action.payload.BBT[0][0].c).getDate())
            if (i == 0 && new Date(newState.data.BBT[newState.data.BBT.length - 1].c).getDate() == new Date(action.payload.BBT[0][0].c).getDate()){//sample from the same day
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
      //  console.log(action.payload.sleep)
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
    case "DATA_FERTILITY":
      var newState: DataState = cloneObject(state);
        var len = newState.data.BBT.length;
        if(len > 2 && newState.data.BBT[len - 2].c > newState.data.lastFertility){
          if(newState.data.BBT[len - 3].v > newState.data.BBT[len - 2].v && newState.data.BBT[len - 1].v > newState.data.BBT[len - 2].v){
            newState.data.lastFertility = newState.data.BBT[len - 2].c;
            sendNotification ('High fertility', 
              'We have detected a high fertility state', 
              'heart', 
              {fullDescription: 'Based on the analisis of the data we have been colecting, we estimate that you are on high fertility period.'}, 
              action.payload.token, 
              (ans) => {}
            );
          }
        }
        
      return newState;
    case "LOGOUT":
      return dataDefault;
    default:
      return state || dataDefault;

  }
}


