import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js';

window.onload = () => {
  const signinBtn = document.getElementById('signin-btn');
  signinBtn.addEventListener('click', (event) => {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });
    const userPool = new CognitoUserPool({
      UserPoolId: 'UserPoolId',
      ClientId: 'ClientId',
    });
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: userPool,
    });

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: () => {
        window.location.pathname = '/user';
      },
      onFailure: (err) => {
        alert(err);
      },
    });
  });
};

