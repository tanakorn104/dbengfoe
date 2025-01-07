import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,useNavigate,BrowserRouter
} from "react-router-dom";
import ViewerDashboard from './component/viewer/ViewerDashboard.jsx';
import App from './App.jsx';
import Manage from './component/Managedata.jsx';
import Header from './component/Header.jsx';
// import { useContext ,useState,useNavigate} from 'react';
import Login from './component/login.jsx';
import Adddata from './component/Adddata.jsx';
// import { AuthProvider } from './component/AuthContext.jsx';
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import { gapi } from 'gapi-script'
import DisplayData from './component/DisplayData.jsx';
import LinkPage from './component/LinkPage.jsx';
import  { useEffect, useState , useContext} from 'react';
import {DataContextProvider} from './component/AuthContext.jsx';
import UpdateData from './component/Updatedata.jsx';
import Overview from './component/Overview.jsx';
import ManageProject from './component/ManageProject.jsx';
import AddProject from './component/Addproject.jsx';
import ConfirmProjectdone from './component/ConfirmProjectdone.jsx';
import InformationPage from './component/informationProject.jsx';
import ManageCap from './component/ManageCap.jsx';
import ManageCurrentCap from './component/CapManage/ManageCurrentCap.jsx';
import ViewerProject from './component/viewer/ViewerProject.jsx';
import ViewerInformationPorject from './component/viewer/ViewerInformationProject.jsx';
import ManageExternalCap from './component/CapManage/ManageExternalCap.jsx';
import WithdrawCapital from './component/CapManage/WithdrawCapital.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <><ViewerDashboard/></>,
  },
  {
    path: "/Dashboard",
    element: <><ViewerDashboard/></>,
  },
  {
    path: "/Dashboard-projects",
    element: <><ViewerProject/></>,
  },
  {
    path: "/Dashboard-project",
    element: <><ViewerInformationPorject/></>,
  },
  {
    path: "/manage",
    element: <><Manage/></>,
  },
  {
    path: "/login",
    element: <><Login/></>,
  },
  {
    path: "/adddata",
    element: <><Adddata/></>,
  },
  {
    path: "/addproject",
    element: <><AddProject/></>,
  },
  {
    path: "/confirmprojectdone",
    element: <><ConfirmProjectdone/></>,
  },
  {
    path: "/projectinformation",
    element: <><InformationPage/></>,
  },
  {
    path: "/update",
    element: <><UpdateData/></>,
  },
  {
    path: "/overview",
    element: <><Overview/></>,
  },
  {
    path: "/manageproject",
    element: <><ManageProject/></>,
  },
  {
    path: "/managecapital",
    element: <><ManageCap/></>,
  },
  {
    path: "/currentcapital",
    element: <><ManageCurrentCap/></>,
  },
  {
    path: "/externalcapital",
    element: <><ManageExternalCap/></>,
  },
  {
    path: "/withdrawcapital",
    element: <><WithdrawCapital/></>,
  },
  {
    path: "*",
    element: <><Login/></>,
  },
]);


// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     {/* <AuthProvider> */}
//       <Header/>
//       <div className="mt-20 p-0">
//       {(sessionStorage.getItem('profiledata')!=null)
//       ?<div>
//         <RouterProvider router={router} />
//         <GoogleLogout
//         clientId={'706342397748-7raoid88ag74jg978oq0gogofh17t0mk.apps.googleusercontent.com'}
//         buttonText='Logout'
//         onLogoutSuccess={()=>{sessionStorage.removeItem('profiledata');window.location.href='/';}}//logOut 
//         className='w-screen justify-center fixed inset-x-0 bottom-0 !important '
//         />
//       </div>
//       :<BrowserRouter><Login/></BrowserRouter>}
//       </div>
      
//       {/* <div className="mt-20"><RouterProvider router={router}/></div> */}
//       {/* // <DisplayData acctoken={acctoken} gmail={gmail} /> */}
      
//     {/* </AuthProvider> */}
//   </StrictMode>,
// )


function Root(){
  return (
    <>
      {/* <DataContextProvider> */}
      
      
      <div className="my-32 p-0">
        
          <div>
            
            <RouterProvider router={router} />
            {sessionStorage.getItem("profiledata")?
            <GoogleLogout
              clientId={'706342397748-7raoid88ag74jg978oq0gogofh17t0mk.apps.googleusercontent.com'}
              buttonText='Logout'
              onLogoutSuccess={() => {
                sessionStorage.removeItem('profiledata');
                sessionStorage.removeItem('acctoken');
                sessionStorage.removeItem('role');
                window.location.href = '/';
              }} // logOut 
              className=' justify-center fixed inset-x-0 bottom-0 !important'
            />
            :''}
          </div>

      </div>

      {/* </DataContextProvider> */}

      
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);