import { useEffect, useState } from 'react';
import Header from './Header';
import {
    createBrowserRouter,
    json,
    Navigate,
    RouterProvider, useNavigate
} from "react-router-dom";





function GuestUserOut() {
    const [timeleft, setTimeleft] = useState(5);
    const navigate = useNavigate();

    useEffect(()=>{
        const interval = setInterval(() => {
            setTimeleft((time) => {
                if (time <= 1) {
                    clearInterval(interval);
                    navigate("/login"); 
                }
                return time - 1;
            });
        }, 1000);
        return () => clearInterval(interval);

        
    },[])
 
    return(
        <>
        <div className="flex  justify-center items-center flex-col ">
            <Header />
            <div className="w-full flex flex-col justify-center items-center">
            <div className=""><p className='text-xl '>คุณยังไม่มีสิทธิใช้งาน กรุณาเข้าสู่ระบบใหม่</p></div>
            <div className=""><p className='text-base '>กำลังเปลี่ยนเส้นทาง ภายใน <span className='text-red-700'>{timeleft}</span> วินาที</p></div>
           <a href="/logout" className='bg-red-500 w-16 mt-4 flex justify-center items-center text-white rounded-lg hover:bg-red-700 '>OK</a>
            </div>
        </div>
        </>
    )




       

}


   

export default GuestUserOut;