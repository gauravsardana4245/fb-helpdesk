import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { ColorRing } from 'react-loader-spinner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');
  const [user,setUser] = useState({email: '', password:''});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(()=> {
    if(localStorage.getItem("token")!=null) {
      navigate('/home');
    }
  },[])

  const userLogin = async ()=> {
    try {
        const response =  await fetch(`https://fb-helpdesk-richpanel.onrender.com/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({'email': email, 'password': password })
        })
        const data = await response.json();
        if(data.success==false) {
          // alert(data.error);
          setError(data.error)
          return;
        }
        else {  
          console.log("loginRes: ", data);
          setUser(data);  
          localStorage.setItem("token", data.authtoken);
          console.log("data123: ", data);
          navigate('/home', {state: {userData: data}});
          // console.log("token: ", localStorage.getItem("token"));
        }
        }    
    catch(error) {
          console.log(error);
          alert("Not able to login now! Please try again later")
    }
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if(email.length===0) {
      setError("Please enter your email in order to login!");
      return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      setError("Entered email is not valid!");
      return;
    }
    if(password.length===0) {
      setError("Please enter password in order to login!");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(async ()=> {
      await userLogin();
      setLoading(false);
    },2000)
  };

  return (
    <div className="auth-screen container mt-5">
      <div className='auth-box' >
       
      <h2>Login to your account</h2>
      <form className='auth-form' action="" onSubmit={handleLogin}>
      <div className='input-div'>
        <label>Email:</label>
        <input required placeholder='example@email.com' className='search-field' name='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className='input-div'>
        <label>Password:</label>
        <input required placeholder='********' className='search-field' name='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
      <input type="checkbox" id="remembercheck" name="remembercheck" value="remembercheck" />
      <label htmlFor="remembercheck"> Remember me</label><br></br>
      </div>
      {error && <div className='errorText'> {error} </div>}
      <button className='auth-button' onClick={handleLogin}>
      {!loading? "Login":
                // <div>
                    <ColorRing
                        visible={true}
                        height="25"
                        width="80"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper"
                        colors={['white', 'white', 'white', 'white', 'white']}
                    />
                // </div>
                }
        </button>
      </form>
      <div className='redirect-div'>
        New to MyApp?
        <Link className='redirectLink' to='/register'>Sign up</Link>
      </div>
      </div>
    </div>
  );
};

export default Login;
