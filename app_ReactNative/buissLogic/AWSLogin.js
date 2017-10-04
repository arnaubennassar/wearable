/*@flow*/
import {
  Config,
  CognitoIdentityCredentials
} from 'aws-sdk/dist/aws-sdk-react-native';

import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute
} from 'react-native-aws-cognito-js';

var validator = require("email-validator");

const appConfig = {
  region: 'ap-northeast-1',
  IdentityPoolId: 'ap-northeast-1_EZgTRML85',
  UserPoolId: 'ap-northeast-1_EZgTRML85',
  ClientId: '1nthl81tk7nb4f9t4r76be3vif',
}

const poolData = {
  UserPoolId: appConfig.UserPoolId,
  ClientId: appConfig.ClientId
};

Config.region = appConfig.region;

//cognitoUser.signOut();

export function login(email: string, password: string, handler ){
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: email,
    Pool: userPool
  };
  var cognitoUser;
  try{
    cognitoUser = new CognitoUser(userData);
  }
  catch(e){
    console.log(e);
    handler ( { 'success': false, message: e.message } );
    return;
  }
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      Config.credentials = new CognitoIdentityCredentials({
        IdentityPoolId: appConfig.IdentityPoolId,
        Logins: {
          [`cognito-idp.${appConfig.region}.amazonaws.com/${appConfig.UserPoolId}`]: result.getIdToken().getJwtToken()
        }
      });
      handler ( { 'success': true, message: result.getIdToken().getJwtToken() } );
    },
    onFailure: (err) => {
      console.log(err)
        handler ( { 'success': false, message: err.message } );
    },
  });
}

export function silentLogin(email: string, password: string, handler){
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);

  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: email,
    Pool: userPool
  };
  const cognitoUser = new CognitoUser(userData);
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      Config.credentials = new CognitoIdentityCredentials({
        IdentityPoolId: appConfig.IdentityPoolId,
        Logins: {
          [`cognito-idp.${appConfig.region}.amazonaws.com/${appConfig.UserPoolId}`]: result.getIdToken().getJwtToken()
        }
      });
      handler( result.getIdToken().getJwtToken()  );
    },
    onFailure: (err) => {
      console.log( err );
    },
  });
}

export function register(userName: string, email: string, password: string, handler){
  if (!validator.validate(email)){
        handler ( { 'success': false, message: 'invalid email' } );
        return;
  }
  console.log(  validator.validate(email)  )
  const userPool = new CognitoUserPool(poolData);
  var attributeList = [];
  var dataEmail = {
        Name : 'email',
        Value : email
  };
  var doctorValidated = {
        Name : 'custom:have_doctor',
        Value : 'no'
  };
  var attributeEmail = new CognitoUserAttribute(dataEmail);
  var attributeDocVal = new CognitoUserAttribute(doctorValidated);
  attributeList.push(attributeEmail);
  attributeList.push(attributeDocVal);
  userPool.signUp(userName, password, attributeList, null, function(err, result){
    if (err) {
        handler ( { 'success': false, message: err.message } );
        return;
    }
    cognitoUser = result.user;
    handler ( { 'success': true } );
  });
}

export function verify(email: string, code: string, handler){
  const userPool = new CognitoUserPool(poolData);
  const userData = {
    Username: email,
    Pool: userPool
  };
  const cognitoUser = new CognitoUser(userData);
  cognitoUser.confirmRegistration(code, true, function(err, result) {
      if (err) {
        handler ( { 'success': false, message: err.message } );
        return;
      } else {
        handler ( { 'success': true } );
      }
  });
}



/*
cognitoUser.getAttributeVerificationCode('email', {
        onSuccess: function (result) {
            console.log('call result: ' + result);
        },
        onFailure: function(err) {
            alert(err);
        },
        inputVerificationCode: function() {
            var verificationCode = prompt('Please input verification code: ' ,'');
            cognitoUser.verifyAttribute('email', verificationCode, this);
        }
    });

*/
