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
	//	console.log(response)
	});
}

export function sendNotification (title, body, icon, data, AWS, handler){
	fetch(baseURL + 'sendNotification', {  
	  method: 'POST',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS
	  },
	  body: JSON.stringify({
	    title: title,
	    body: body,
	    icon: icon,
	    data: data
	  })
	}).then(function (response){
		handler(response);
	});
}

export function getNotifications(AWS, next, handler){
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
		    'next' : next,
		}
	}
	fetch(baseURL + 'getNotifications', {  
	  method: 'GET',
	  headers: head,
	}).then(function (response){
		//console.log(response);
		if(response.status == 401){
			handler({'error':401})
			return;
		}
		else if (response.status != 200){
			handler({'error':'unknown'})
			return;
		}
		return response.json();
    }).then(function (responseData){
		 handler(responseData);
    });
}

export function postData (data, timeStamp, AWS: string, endPoint: string, handler){
	fetch(baseURL + 'postData', {  
	  method: 'POST',
	  headers: {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS
	  },
	  body: JSON.stringify({
	    timeStamp: timeStamp,
	    data: data,
	    DB: endPoint
	  })
	}).then(function (response){
		handler(response);
	});
}

export function getAllData (AWS: string, endPoint: string, next: string, handler){
	getData(AWS, endPoint, next, [], (data) => {handler(data)});
}

function getAllData_handler(AWS, endPoint, next, data, handler){
//	console.log(data.length)
	if (next != undefined){
	//	console.log('lets get more')
		getData (AWS, endPoint, next, data, handler);
	}
	else{ 
	//	console.log('thats enoz')
		handler(data) 
	}
}

export function getData (AWS: string, endPoint: string, next: string, data, handler){
	//console.log('endpoint: ' + endPoint)
	var head = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json',
	    'Authorization' : AWS,
	    'db': endPoint
	  }
	if(next != null){
	  	head = {
		    'Accept': 'application/json',
		    'Content-Type': 'application/json',
		    'Authorization' : AWS,
		    'next' : next,
		    'db': endPoint
		  }
	  }
	fetch(baseURL + 'getData', {  
	  method: 'GET',
	  headers: head,
	}).then(function (response){
	//	console.log(response);
		if(response.status == 401){
			handler({'error':401})
			return;
		}
		else if (response.status != 200){
			handler({'error': response})
			return;
		}
		return response.json();
    }).then(function (responseData){
    	data.push.apply(data, responseData.data.Items);
		getAllData_handler(AWS, endPoint, responseData.next, data, handler);
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
	//	console.log(response);
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
	//	console.log(response);
		if(response.status == 401){
			unauthHandle('getPersonalData');
			return;
		}
		else if (response.status != 200){
			return;
		}
		return response.json();
	}).then(function (responseData){
		 // console.log("inside responsejson");
		 // console.log('response object:',responseData);
		 // console.log('HANDLE DATAAAA');
		 handler(responseData);
    });
}

function unauthHandle (actionName: string, params: object){
	//console.log('!!!!!AUTH FAIL!!!!')
	// store.dispatch( refreshToken() );
	// store.dispatch( pendingAction( {'function': actionName, 'params': params} ) );
}

