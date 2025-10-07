import React, { useState,useEffect} from 'react';
// import    '../style/botstyle.css';
import { useNavigate  } from 'react-router-dom';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'; 
import { Host_Ip } from '../utility/Host';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();
  const navigate = useNavigate();
  const [csrf_token,setCsrfToken]= useState('')

  const onback = () =>{
       navigate('/')
}
useEffect( () => {
  // Fetch the CSRF token when the component mounts
  try{
   const res =  fetch(`${Host_Ip}csrf_token`,{
   method: 'GET'}
   )
   .then((response) => {
    if (!response.ok) {
      throw new Error('token failed');
    }
    return response.json();
  })
  .then((data) => {
    const tokencsrf = data.csrfToken;
    setCsrfToken(tokencsrf);
    localStorage.setItem('csrf',tokencsrf)
  })
  }
  
  catch (error) {
    setError('Invalid username or password');
    console.error('Login error:', error);
  }

    
    
}, []); 
 



  

  const handleSubmit = async (e) => {
     e.preventDefault();
    
    
    try {
      const response = await fetch(`${Host_Ip}login`, {
        
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken':csrf_token

         
          
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }
      const data = await response.json()
      const token = data.message.token
      const expiry = data.message.expiry
      const id = data.id
      console.log('Login successful');
      
      
        
      localStorage.setItem('token',token)
      localStorage.setItem('expiry',expiry)
      localStorage.setItem('id',id)



           

      history('/home');

      
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login error:', error);
    }



    // Reset the form after submission
    


    setUsername('');
    setPassword('');
  };
   

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>
      <form className="mt-8 space-y-6" >
        <input type="hidden" name="remember" defaultValue="true" />
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label className='text-black'>
              Email address
            </label>
            <input
              onChange={(e)=>setUsername(e.target.value)}
              value={username}
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 bg-zinc-950 border border-gray-300 placeholder-gray-500 text-white rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Username"
            />
          </div>
          <div>
            <label >
              Password
            </label>
            <input
            
              name="password"
              type="password"
              onChange={(e)=>setPassword(e.target.value)}
              value={password}
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border bg-zinc-950 border-gray-300 placeholder-gray-500 text-white rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

        <div>
          <button
          onClick={(e)=>handleSubmit(e)}
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  </div>
   

  );
 
  
};

 

export default LoginPage;

