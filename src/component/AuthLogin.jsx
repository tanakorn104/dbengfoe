import { useContext, useEffect, useRef, useState } from "react";
// import { DataContext } from "./Datacontext";
import { data } from "autoprefixer";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthandDataContext } from "./AuthContext";
import axios from "axios";


function AuthLogin() {
    const {userdata,setUserData,setisLogin,setIntervalrefreshtokenID} = useContext(AuthandDataContext)
    const navigate = useNavigate();
    const startchecktoken = ()=>{
        const id = setInterval(async()=>{
        try{
            const response = await axios.get(`${import.meta.env.VITE_Base_SERVER_URL}/auth/refreshtoken`, { withCredentials: true });
        //   console.log('Token refreshed:', response.data);

        }catch(e){
            window.location.href = "/TimeOut"
        }

        },1000*60*25)

        return(id)
    }

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const encodedPayload = params.get('dataslogin');

        try{
            if (encodedPayload) {
                // แปลงข้อมูลกลับเป็น JSON
                const payload = JSON.parse(decodeURIComponent(encodedPayload));
                // console.log(payload);
                if (payload.rank == 'guest') {
                    window.location.href = '/GuestUserOut';
                    return;
                }
                sessionStorage.setItem('profiledata', JSON.stringify(payload.profile));
                // sessionStorage.setItem('res', JSON.stringify(res));
                sessionStorage.setItem('role', payload.rank);
                const intervalId = startchecktoken();
                setIntervalrefreshtokenID(intervalId);
                // console.log("setinterveled")
                setUserData({
                    profile:payload.profile,
                    rank:payload.rank
                })
                // console.log(userdata);
                navigate('/Dashboard');
            }
        }catch(e){
            console.error("ข้อผิดพลาดในการแปลงข้อมูล:", e);
            navigate("/login");
        }
    }, [])
    return null
}

export default AuthLogin;