/*@flow*/
// import { store } from '../redux/store';
// import { dispatch } from 'redux';
// import { pendingAction, refreshToken } from '../redux/actions/user';
// import { login } from './AWSLogin'


const baseURL : string = 'https://amdnxfot21.execute-api.ap-southeast-1.amazonaws.com/Dev/';

export function postOSID (AWS: string, OS: string){
	fetch(baseURL + 'postOSID', {  
	  method: 'POST',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS
	  },
	  body: JSON.stringify({
	    OSID: OS,
	  })
	}).then(function (response){
		console.log(response);
		if(response.status == 401){
			unauthHandle('postOSID', {'OS': OS});
			return;
		}
	});
}

export function postHeartData (AWS: string, timeStamp: string, value: number){
	fetch(baseURL + 'storeHeart', {  
	  method: 'POST',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS
	  },
	  body: JSON.stringify({
	    timeStamp: timeStamp,
	    value: value
	  })
	}).then(function (response){
		console.log(response);
		if(response.status == 401){
			unauthHandle('postHeartData', {'timeStamp': timeStamp, 'value': value});
			return;
		}
	});
}

export function getHeartData (AWS: string, next: string){
	var head = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS
	  }
	if(next != null){
	  	head = {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Authorization' : AWS,
		    'next' : next
		  }
	  }

	fetch(baseURL + 'getHeartData', {  
	  method: 'GET',
	  headers: head,
	}).then(function (response){
		console.log(response);
		if(response.status == 401){
			unauthHandle('getHeartData', {'next': next});
			return;
		}
		else if (response.status != 200){
			return;
		}
		return response.json();
	}).then(function (responseData){
		 console.log("inside responsejson");
		 console.log('response object:',responseData);
		 console.log('HANDLE DATAAAA');
    });
}

export function postPersonalData (AWS: string, height: number, weight: number, age: number){
	fetch(baseURL + 'postPersonalData', {  
	  method: 'POST',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS
	  },
	  body: JSON.stringify({
	    height: height,
	    weight: weight,
	    age: age
	  })
	}).then(function (response){
		console.log(response);
		if(response.status == 401){
			unauthHandle('postPersonalData', { height: height, weight: weight,  age: age});
			return;
		}
	});
}

export function getPersonalData(AWS: string, handler){
	var head = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS
	  }
	fetch(baseURL + 'getPersonalData', {  
	  method: 'GET',
	  headers: head,
	}).then(function (response){
		console.log(response);
		if(response.status == 401){
			unauthHandle('getPersonalData');
			return;
		}
		else if (response.status != 200){
			return;
		}
		return response.json();
	}).then(function (responseData){
		 console.log("inside responsejson");
		 console.log('response object:',responseData);
		 console.log('HANDLE DATAAAA');
		 handler(responseData);
    });
}

function unauthHandle (actionName: string, params: object){
	console.log('!!!!!AUTH FAIL!!!!')
	// store.dispatch( refreshToken() );
	// store.dispatch( pendingAction( {'function': actionName, 'params': params} ) );
}

