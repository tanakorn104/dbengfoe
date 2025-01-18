import { useEffect, useState,useContext } from 'react';
import {
    createBrowserRouter,
    json,
    RouterProvider, useNavigate
} from "react-router-dom";
import Header from './Header';
import LinkPage from './LinkPage';
import axios from 'axios';
// import { useAuth } from './AuthContext';

import { AuthandDataContext } from './AuthContext';
const base_url = import.meta.Base_URL;




function Logout() {
    const [status, setStatus] = useState('กำลังออกจากระบบ');
    const navigate = useNavigate();
    const {clearRefreshTokenInterval} = useContext(AuthandDataContext)

    useEffect(()=>{
        if(sessionStorage.getItem('profiledata')){
            axios.get(`${import.meta.env.VITE_Base_SERVER_URL}/auth/google/logout`,{withCredentials:true})
                .then(response => {
                  sessionStorage.removeItem('profiledata');
                  sessionStorage.removeItem('role');
                }).then(()=>{
                    setStatus('ออกจากระบบสำเร็จ')
                    clearRefreshTokenInterval()
                    // setIntervalrefreshtokenID((intervalId) => {
                    //     if (intervalId) {
                    //         clearInterval(intervalId);
                    //     }
                    //     return null; // รีเซ็ต Context
                    // });
                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                }).catch(e=>{
                    setStatus('ออกจากระบบไม่สำเร็จ เกิดข้อผิดพลาด'+e.message)
                    setTimeout(() => {
                        navigate("/");
                    }, 3000);

                })
        }else{
            setTimeout(() => {
                setStatus('กรุณาเข้าสู่ระบบก่อน')
            }, 3000);
            navigate("/Login");

        }

        
    },[])
 
    return(
        <>
        <div className="flex justify-center items-center flex-col ">
            <Header />
            <div className="mt-10 mb-3"><p className='text-xl '>{status}</p></div>
           
        </div>
        </>
    )




       

}

    // axios.get('http://localhost:8888/auth/google/callback')
    // .then(response => {
    //   console.log(response.data);
    // })
    // .catch(error => {
    //   console.error(error);
    // });
   

export default Logout;