import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { ColorRing } from 'react-loader-spinner';
// import { authActions } from '../../redux';

const Register = () => {
  const [user,setUser] = useState({});
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(()=> {
    if(localStorage.getItem("token")!=null) {
      navigate('/home');
    }
  },[])

  const registerUser = async ()=> {
    try {
      const response =  await fetch(`https://fb-helpdesk-richpanel.onrender.com/api/auth/register`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({'name': name, 'email': email, 'password': password })
      })
      const data = await response.json();
      if(data.status==false) {
        // alert(data.error);
        alert(data.error)
        setError(data.error)
        return;
      }
      else {  
        console.log("SignupRes: ", data);
        setUser(data);  
        localStorage.setItem("token", data.authtoken);
        console.log("data123: ", data);
        navigate('/home', {state: {userData: data}});
        setLoading(false);
        // console.log("token: ", localStorage.getItem("token"));
      }
      }    
    catch(error) {
          console.log(error);
          alert("Not able to signup right now! Please try again later")
    }
  }

  const handleRegister = (e) => {
    e.preventDefault();
    if(name.length===0) {
      setError("Please enter your name in order to sign up!");
      return;
    }
    if(email.length===0) {
      setError("Please enter your email in order to sign up!");
      return;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
      setError("Please enter a valid email!");
      return;
    }
    if(password.length===0) {
      setError("Please set a password in order to signup!");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(()=> {
      registerUser();
      setLoading(false);
    },2000)
  };

  return (
    <div className="auth-screen container mt-5">
      <div className='auth-box' >
      <h2>Create account</h2>
      <form className='auth-form' action="" onSubmit={handleRegister}>
      <div className='input-div'>
        <label>Name:</label>
        <input placeholder='John Adam' className='search-field' name='name' type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className='input-div'>
        <label>Email:</label>
        <input placeholder='example@email.com' className='search-field' name='email' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className='input-div'>
        <label>Password:</label>
        <input placeholder='********' className='search-field' name='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
      <input type="checkbox" id="remembercheck" name="remembercheck" value="remembercheck" />
      <label htmlFor="remembercheck"> Remember me</label><br></br>
      </div>
      {error && <div className='errorText'> {error} </div>}
      <button className='auth-button' onClick={handleRegister}>
      {!loading? "Sign Up":
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
        Already have an account?
        <Link className='redirectLink' to='/login'>Login</Link>
      </div>
      </div>
    </div>
  );
};

export default Register;
