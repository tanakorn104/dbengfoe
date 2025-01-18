import { useEffect, useState } from 'react';
import {
    createBrowserRouter,
    json,
    RouterProvider, useNavigate
} from "react-router-dom";
import Header from './Header';
import LinkPage from './LinkPage';
import axios from 'axios';
// import { useAuth } from './AuthContext';
import api from './tool/AxiosInstance';

const base_url = import.meta.Base_URL;




function Login() {
    // const [profile, setProfile] = useState(0);
    // const [acctoken, setToken] = useState('');
    const navigate = useNavigate();
    const [statuspage, setStatusPage] = useState({
        status: false,
        type: null,
        message: null
    })
    useEffect(() => {
        if (sessionStorage.getItem('profiledata')) {
            navigate("/Dashboard");
        }


    }, [])
    const [loadingpage, setLoadingpage] = useState(false);

    // const {login} = useAuth();
    const onSuccess = async (res) => {
        const requestData = {
            type: "Login",
            data: {
                datalogin: res
            },

        };
        const fetchlogin = api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        )
        Promise.all([fetchlogin]).then((result) => {

            // console.log(((result[0])))
            if (JSON.parse((result[0]).data).type == 'success') {
                sessionStorage.setItem('profiledata', JSON.stringify(res.profileObj));
                sessionStorage.setItem('acctoken', JSON.stringify(res.accessToken));
                // sessionStorage.setItem('res', JSON.stringify(res));
                sessionStorage.setItem('role', JSON.parse((result[0]).data).rank);
                window.location.href = '/Dashbord';
            } else {

                setStatusPage({
                    status: true,
                    type: 'fail',
                    message: 'คุณไม่ได้รับอนุญาติให้เข้าถึง'
                })
                setTimeout(() => {
                    setStatusPage({
                        status: false,
                        type: null,
                        message: null
                    })

                }, 3000)

            }

        }).catch((err) => {
            console.error(err.message);
        })











    };

    const onFailure = (res) => {
        console.log("failed", res);
    };

    // axios.get('http://localhost:8888/auth/google/callback')
    // .then(response => {
    //   console.log(response.data);
    // })
    // .catch(error => {
    //   console.error(error);
    // });
    return (
        <div className=" flex justify-center items-center flex-col ">
            <Header />
            {/* <LinkPage /> */}
            {statuspage.status == true ? (statuspage.type == 'success' ? <div className="fixed top-32 min-h-6 transition-opacity duration-500 ease-in-out bg-green-500  rounded-3xl px-10 flex flex-row items-center text-white">
                <p className='mr-2'>สำเร็จ!</p>
                <p>{statuspage.message}</p>
            </div> : <div className="fixed top-32 min-h-6 transition-opacity duration-500 ease-in-out bg-red-500  rounded-3xl px-10 flex flex-row items-center text-white">
                <p className='mr-2'>ผิดพลาด!</p>
                <p>{statuspage.message}</p>
            </div>) : ''}

            <div className="mt-10 mb-3"><p className='text-xl '>ยินดีต้อนรับ</p></div>
            <div className="flex flex-col justify-center  border  p-10 rounded-2xl h-48">
                <h3 className='mb-5 text-center'>โปรดเข้าสู่ระบบเพื่อใช้งาน</h3>

                <a href={`${import.meta.env.VITE_Base_SERVER_URL}/auth/google/login`} className="flex flex-row justify-center items-center shadow-md border border-gray-200 rounded-sm px-3 hover:bg-gray-50 hover:text-gray-800 hover:cursor-pointer">
                    <img className="w-6 h-6" src="/signinwithgooglelogo.png" alt="" />
                    <p className='py-2 pl-3'>Login with google</p>

                </a>

            </div>
            <div className="absolute bottom-10 flex flex-row">
                <img className="size-10" src="/englogo.png" alt="" />
                <div className="flex flex-col justify-end ml-3">
                    <p className='m-0 p-0  font-semibold leading-[1]'>คณะวิศวกรรมศาสตร์</p>
                    <p className='m-0 p-0  leading-[1] font-light' >กำแพงแสน</p>
                </div>

                </div>
        </div>

    )
}

export default Login;