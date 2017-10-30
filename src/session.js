import AWS from 'aws-sdk';
import {} from 'amazon-cognito-js';
import {
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import {} from './facebook-sdk.js'

AWS.config.region = 'aws_config_region';
const userPool = new CognitoUserPool({
  UserPoolId: 'UserPoolId',
  ClientId: 'ClientId',
});
const cognitoUser = userPool.getCurrentUser();

if (cognitoUser != null) {
  cognitoUser.getSession((sessionErr, sessionResult) => {
    if (sessionResult) {
      cognitoUser.getUserAttributes((getAttrErr) => {
        if (getAttrErr) {
          alert(getAttrErr);
          return;
        }
        document.getElementById('login-user-name').innerText = cognitoUser.username;

        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
          IdentityPoolId: 'IdentityPoolId',
          Logins: {
            UserPoolARN: sessionResult.getIdToken().getJwtToken(),
          },
        });

        AWS.config.credentials.get((credentialErr) => {
          if (credentialErr) {
            window.console.log(credentialErr);
          }
          window.console.log(AWS.config.credentials.sessionToken);
        });
      });
    } else {
      window.location.pathname = '/';
    }
  });
} else {
  window.fbAsyncInit = () => {
    FB.init({
      appId: 'facebookAppId',
      cookie: true,
      xfbml: true,
      version: 'v2.10'
    });
    FB.AppEvents.logPageView();
    FB.getLoginStatus((loginResponse) => {
      if (loginResponse.status === 'connected') {
        window.console.log(loginResponse.authResponse);
        const { accessToken } = loginResponse.authResponse.accessToken;
        FB.api('/me', (response) => {
          window.console.log(response);
          document.getElementById('login-user-name').innerText = response.name;
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'IdentityPoolId',
            Logins: {
              'graph.facebook.com': accessToken,
            },
          });

          AWS.config.credentials.get(() => {
            window.console.log(AWS.config.credentials.data.IdentityId);
            const cognitoIdentity = new AWS.CognitoIdentity();
            cognitoIdentity.getOpenIdToken({
              IdentityId: AWS.config.credentials.data.IdentityId,
              Logins: {
                'graph.facebook.com': accessToken,
              },
            }, (err, data) => {
              window.console.log(data);
            });
          });
        });
      } else {
        window.location.pathname = '/';
      }
    });
  };
}

