import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuth } from './AuthContext'

function Header(){
    // const {user}=useAuth();
    // console.log(user.email);
    // console.log(sessionStorage.getItem('profiledata'));
    // const {profile}= props;
    var user = JSON.parse(sessionStorage.getItem('profiledata'))?JSON.parse(sessionStorage.getItem('profiledata')):null;
    var token = JSON.parse(sessionStorage.getItem('acctoken'))?JSON.parse(sessionStorage.getItem('acctoken')):null;
    var res = JSON.parse(sessionStorage.getItem('res'))?JSON.parse(sessionStorage.getItem('res')):null;
    // console.log(res);
    const navigate = useNavigate();
    useEffect(()=>{
        if(user==null){
            navigate('/login');
        }
    },[user])
    return (
        user?<>
        <div className="z-50 w-full h-20  flex flex-row justify-between items-center p-6 drop-shadow-md fixed bg-white  inset-0">
                {/* <div className="bg-slate-200 w-full h-15 p-4 flex flex-row justify-between items-center "> */}
                  <h1 className='font-medium  md:text-2xl'>ระบบจัดการฐานข้อมูล</h1>
                  <div className="flex flex-col text-xs md:text-base">
                    <p>{user[Object.keys(user)[3]]}</p>
                    <p>{user[Object.keys(user)[2]]}</p>
                  </div>
                {/* </div> */}
              </div>
              </>:<>
              <div className="w-full h-20  flex flex-row justify-between items-center p-6 drop-shadow-md fixed bg-white  inset-0">
                {/* <div className="bg-slate-200 w-full h-15 p-4 flex flex-row justify-between items-center "> */}
                  <h1 className='font-medium  md:text-2xl'>ระบบจัดการฐานข้อมูล</h1>
                  <div className="flex flex-col">
                    <h2>กรุณาเข้าสู่ระบบ</h2>
                  </div>
                {/* </div> */}
              </div>
              </>
    )

}
export default Header