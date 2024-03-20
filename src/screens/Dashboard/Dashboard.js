import React, { useEffect, useState } from 'react';
import { FacebookProvider, LoginButton } from 'react-facebook';
// import { FacebookProvider, useLogin } from 'react-facebook';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'
// import FacebookLogin from 'react-facebook-login';
import FacebookLogin from '@greatsumini/react-facebook-login'
import { BeatLoader, PulseLoader } from 'react-spinners';

const Dashboard = () => {
  const navigate = useNavigate();
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [token,setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const backendHost = "https://fb-helpdesk-richpanel.onrender.com";
  // const { login, status, isLoading, error} = useLogin();

  useEffect(()=> {
    const authToken = localStorage.getItem("token");
    if(!authToken) {
      navigate('/login');
    }
    setToken(authToken);
  },[])


  // async function handleLogin() {
  //   try {
  //     const response = await login({
  //       scope: 'email',
  //     });

  //     console.log(response.status);
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }


  useEffect(() => {
    if (window.FB) {
      setSdkLoaded(true);
    } else {
      window.fbAsyncInit = function () {
        console.log("fbAsyncInit123 called");
        window.FB.init({
          appId: '702731295383684',
          // channelUrl : 'https://010b-2401-4900-1c69-6de6-5cdf-272b-1117-ecd4.ngrok-free.app',
          status: true,
          cookie: true,
          // autoLogAppEvents: true,
          xfbml: true,
          // oauth: true,
          version: 'v10.0',
        });

        setSdkLoaded(true);

        console.log("fbAsyncInit123 ended123");
      };

      // window.fbAsyncInit();
      console.log("fbAsyncInit123 ended");
    }
  }, []);


  const handleResponse = async (data) => {
    console.log('Facebook login response:', data);
    try {

    if (data) {
      // const { accessToken,userID } = data.authResponse;
      const { accessToken,userID } = data;
      console.log("1234data1234: ", data);
      setLoading(true);
      
      const res = await fetch(`${backendHost}/api/facebook/connect-facebook`, 
      { method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },

        body: JSON.stringify({
          'accessToken': accessToken
        })
      }
      );
      setLoading(false);
      navigate('/connect-facebook', { state: {userAccessToken: accessToken, userFacebookId: userID} });
    }
  }
  catch(error) {
    console.error(error);
  }
  };

  return (
    <div className="dashboardScreen container mt-5">
      {loading && (
        <div className="loading-overlay">
         <div className='actionText'> Connecting to your facebook account </div>
          {/* <div className="circular-loader"></div> */}
          
        <BeatLoader color="#004e96" />
        </div>
      )}
      {/* {!sdkLoaded ? ( */}
        <div className='fbLoginBox'>
        {/* <FacebookProvider appId="702731295383684">
          <LoginButton
            scope="email"
            onSuccess={handleResponse}
            onError={(error) => console.error('Facebook login error:', error)}
          >
            <span>Login with Facebook</span>
          </LoginButton>
          
        </FacebookProvider> */}

{/* <FacebookProvider appId="702731295383684">

<button onClick={handleLogin} disabled={isLoading}>
      Login via Facebook
    </button>
    </FacebookProvider>  */}

<FacebookLogin
  appId="702731295383684"
  onSuccess={handleResponse}
  onFail={(error) => {
    alert("Could not connect to facebook at the moment! Please Contact the app owner.")
    console.log('Login Failed!', error);
  }}

  onProfileSuccess={(response) => {
    console.log('Get Profile Success!', response);
  }}

  initParams={{
    version: 'v16.0',
    xfbml: true,
  }}

  loginOptions={{
    return_scopes: true,
  }}
/>

    

    {/* <div className="fb-login-button" data-width="200" data-size="" data-button-type="" data-layout="" data-auto-logout-link="true" data-use-continue-as="true"></div>         */}
    </div>
      {/* ) :
      (<div className='fbLoginBox'> Facebook SDK not initialized <br /> Contact the app owner! </div>)
      } */}
    </div>
  );
};

export default Dashboard;
