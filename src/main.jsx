import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import React from 'react'
import {
  createBrowserRouter,
  RouterProvider, useNavigate, BrowserRouter
} from "react-router-dom";
import axios from "axios";
import ViewerDashboard from './component/viewer/ViewerDashboard.jsx';
import App from './App.jsx';
import Manage from './component/Managedata.jsx';
import Header from './component/Header.jsx';
// import { useContext ,useState,useNavigate} from 'react';
import Login from './component/Login.jsx';
import Adddata from './component/Adddata.jsx';
// import { AuthProvider } from './component/AuthContext.jsx';
import { gapi } from 'gapi-script'
import LinkPage from './component/LinkPage.jsx';
import { useEffect, useState, useContext } from 'react';
import { AuthandDataContextProvider } from './component/AuthContext.jsx';
import UpdateData from './component/Updatedata.jsx';
import Overview from './component/Overview.jsx';
import ManageProject from './component/ManageProject.jsx';
import ConfirmProjectdone from './component/ConfirmProjectdone.jsx';
import AddProject from './component/AddProject.jsx';
import InformationPage from './component/InformationProject.jsx';
import ManageCap from './component/ManageCap.jsx';
import ManageCurrentCap from './component/CapManage/ManageCurrentCap.jsx';
import ViewerProject from './component/viewer/ViewerProject.jsx';
import ViewerInformationPorject from './component/viewer/ViewerInformationProject.jsx';
import ManageExternalCap from './component/CapManage/ManageExternalCap.jsx';
import WithdrawCapital from './component/CapManage/WithdrawCapital.jsx';
import AuthLogin from './component/AuthLogin.jsx';
import Logout from './component/Logout.jsx';
import TimeOut from './component/TimeOut.jsx';
import GuestUserOut from './component/GuestUserOut.jsx';
import ManageLogpayment from './component/CapManage/ManageLogpayment.jsx';
import Fisnpayment from './component/FisnManage/FisnManagepayment.jsx';
import ViewerPaymentlog from './component/viewer/ViewerPaymentlog.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <><Login /></>,
  },
  {
    path: "/Dashboard",
    element: <><ViewerDashboard /></>,
  },
  {
    path: "/Dashboard-projects",
    element: <><ViewerProject /></>,
  },
  {
    path: "/Dashboard-project",
    element: <><ViewerInformationPorject /></>,
  },
  {
    path: "/Paymentlog",
    element: <><ViewerPaymentlog /></>,
  },
  {
    path: "/manage",
    element: <><Manage /></>,
  },
  {
    path: "/login",
    element: <><Login /></>,
  },
  {
    path: "/adddata",
    element: <><Adddata /></>,
  },
  {
    path: "/addproject",
    element: <><AddProject /></>,
  },
  {
    path: "/confirmprojectdone",
    element: <><ConfirmProjectdone /></>,
  },
  {
    path: "/projectinformation",
    element: <><InformationPage /></>,
  },
  {
    path: "/update",
    element: <><UpdateData /></>,
  },
  {
    path: "/overview",
    element: <><Overview /></>,
  },
  {
    path: "/manageproject",
    element: <><ManageProject /></>,
  },
  {
    path: "/managecapital",
    element: <><ManageCap /></>,
  },
  {
    path: "/currentcapital",
    element: <><ManageCurrentCap /></>,
  },
  {
    path: "/externalcapital",
    element: <><ManageExternalCap /></>,
  },
  {
    path: "/withdrawcapital",
    element: <><WithdrawCapital /></>,
  },
  {
    path: "/managelogpayment",
    element: <><ManageLogpayment /></>,
  },
  {
    path: "/fisnpayment",
    element: <><Fisnpayment/></>,
  },
  {
    path: "/AuthLogin",
    element: <><AuthLogin /></>,
  },
  {
    path: "/Logout",
    element: <><Logout/></>,
  },
  {
    path: "/TimeOut",
    element: <><TimeOut/></>,
  },
  {
    path: "/GuestUserOut",
    element: <><GuestUserOut/></>,
  },

  {
    path: "*",
    element: <><Login /></>,
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


function Root() {
  // useEffect(()=>{
    // if (sessionStorage.getItem('profiledata')) {
    //   const rechecktoken = setInterval(async () => {
    //     try {
    //       const response = await axios.get("http://localhost:8888/auth/refreshtoken", { withCredentials: true });
    //       console.log('Token refreshed:', response.data);
    //     } catch (e) {
    //       // console.error('Token refresh failed:', e.response?.data?.error || e.message);
    //       // เปลี่ยนเส้นทางเมื่อโทเค็นหมดอายุ
    //       window.location.href = "/TimeOut";
    //     }
    //   }, 20000); // ตั้งค่าความถี่ที่เหมาะสม
  
    //   // คืนค่า clearInterval เพื่อหยุด interval เมื่อ component ถูก unmount
    //   return () => {if(rechecktoken){clearInterval(rechecktoken)}};
    // }
  // },[])
  return (
    <>
      <AuthandDataContextProvider>

      <div className="my-32 p-0">
        <div> 
          <RouterProvider router={router} />
      
         </div>
      </div> 
</AuthandDataContextProvider>
    </>
  );
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
);