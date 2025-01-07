import { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login'
import {
    createBrowserRouter,
    json,
    RouterProvider, useNavigate
} from "react-router-dom";
import Header from './Header';
import LinkPage from './LinkPage';
import axios from 'axios';
import { root_url } from "./config/config";
// import { useAuth } from './AuthContext';


function Login() {
    // const [profile, setProfile] = useState(0);
    // const [acctoken, setToken] = useState('');
    const navigate = useNavigate();
    const [statuspage,setStatusPage] = useState({
        status:false,
        type:null,
        message:null
    })
    useEffect(()=>{
        if(sessionStorage.getItem('profiledata')){
            navigate("/Dashboard");
        }
    },[])
    const [loadingpage,setLoadingpage] = useState(false);

    // const {login} = useAuth();
    const onSuccess = async (res) => {
        const requestData = {
            type: "Login",
            data: {
                datalogin: res
            },
            token: JSON.stringify(res.accessToken)

        };
        const fetchlogin = axios.post(root_url, JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
        Promise.all([fetchlogin]).then((result) => {

            console.log(((result[0])))
            if(JSON.parse((result[0]).data).type=='success'){
                sessionStorage.setItem('profiledata', JSON.stringify(res.profileObj));
                sessionStorage.setItem('acctoken', JSON.stringify(res.accessToken));
                // sessionStorage.setItem('res', JSON.stringify(res));
                sessionStorage.setItem('role',JSON.parse((result[0]).data).rank);
                window.location.href = '/Dashbord';
            }else{
                
                setStatusPage({
                    status:true,
                    type:'fail',
                    message:'คุณไม่ได้รับอนุญาติให้เข้าถึง'
                })
                setTimeout(()=>{
                    setStatusPage({
                        status:false,
                        type:null,
                        message:null
                    })

                },3000)
              
            }
            
        }).catch((err) => {
            console.error(err);
        })








       


    };

    const onFailure = (res) => {
        console.log("failed", res);
    };


    return (
        <div className="flex justify-center items-center flex-col ">
            <Header />
            {/* <LinkPage /> */}
            {statuspage.status==true?(statuspage.type=='success'?<div className="fixed top-32 min-h-6 transition-opacity duration-500 ease-in-out bg-green-500  rounded-3xl px-10 flex flex-row items-center text-white">
            <p className='mr-2'>สำเร็จ!</p>
            <p>{statuspage.message}</p>
            </div>:<div className="fixed top-32 min-h-6 transition-opacity duration-500 ease-in-out bg-red-500  rounded-3xl px-10 flex flex-row items-center text-white">
            <p className='mr-2'>ผิดพลาด!</p>
            <p>{statuspage.message}</p>
            </div>):''}

            <div className="mt-10 mb-3"><p className='text-xl '>ยินดีต้อนรับ</p></div>
            <div className="flex flex-col justify-center  border p-10 rounded-2xl h-48">
            <h3 className='mb-5 text-center'>โปรดเข้าสู่ระบบเพื่อใช้งาน</h3>
            <GoogleLogin
                clientId={'706342397748-7raoid88ag74jg978oq0gogofh17t0mk.apps.googleusercontent.com'}
                buttonText="Sign in with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy='single_host_origin'
                access_type='offline&'
                prompt='consent'
                isSignedIn={false}
                // isSignedIn={true}
            scope='profile'

            />
            </div>
        </div>

    )
}

export default Login;