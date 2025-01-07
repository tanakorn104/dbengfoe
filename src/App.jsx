import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'

import Header from "./component/Header"
import DisplayData from "./component/DisplayData"
// import { useAuth } from './component/AuthContext'
import { Link } from "react-router-dom";
function App() {

  //  const {user}=useAuth()
  //  console.log(typeof(user));
  return (
    <div className='bg-gray-500'>
     <Link to="manage">manage</Link>
     {/* <h1>{sessionStorage.getItem('profiledata')}</h1> */}
     <h1>Hello</h1>
      
        {/* <DisplayData/> */}
    </div>
  )
 


     
             
          
                // <DisplayData acctoken={acctoken} gmail={gmail} />
                // <GoogleLogout
                //   clientId={clientId}
                //   buttonText='Logout'
                //   onLogoutSuccess={''}//logOut 
                //   className='h-15 flex justify-center drop-shadow-none !important'
                // />

           
  
}

export default App
