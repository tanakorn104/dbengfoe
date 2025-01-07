import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {v4 as uuidv4} from 'uuid';
import { root_url } from "./config/config";
function DisplayData(props) {
    const [response, setResponse] = useState(null);
    const [filter,Setfilter]=useState({});
    const {acctoken,gmail}= props;
    // console.log(acctoken);
    // console.log(gmail);
    const sendPostRequest = () => {
        // ข้อมูลที่จะส่งไปใน body ของคำขอ POST
        // console.log("sendpost");
        var dataprofile = JSON.parse(sessionStorage.getItem('profiledata'));
        var acctoken = JSON.parse(sessionStorage.getItem('acctoken'));
        // console.log(Object.keys(dataprofile));
        const requestData = {
            gmail:dataprofile['email'],
            token:acctoken,
            filter:filter
        };

        axios.post("http://localhost:5543/",requestData,{
                headers:{
                    'Content-Type':'application/json'
                }
            }
        )
        .then(response => setResponse(response.data))
        .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด
    };
    useEffect(()=>{
        // console.log(filter);
        sendPostRequest();
        // console.log("hello");
    },[filter]);

    return (
        <div className="min-h-screen mt-24  w-full p-10 ">
            
            <div className="" alt='form'>
                <form action="">
                    <label htmlFor="">ปีการศึกษา</label>
                    <label htmlFor="">ปีงบประมาณ</label>
                    <label htmlFor="">ชั้นปี</label>
                    <label htmlFor="">ภาควิชา</label>
                    <label htmlFor="">ระดับ</label>
                    <label htmlFor="">แหล่งทุน</label>
                    <label htmlFor="">ประเภททุน</label>
                </form>
            </div>

            <table className='table-auto w-full '>
                {response?
                <>
                <thead>
                    <tr className='border-b my-2 border-gray-600'>
                        <th className='text-left pb-4'>รหัสนิสิต</th>
                        <th className='text-left pb-4'>คำนำหน้าชื่อ</th>
                        <th className='text-left pb-4'>ชื่อ</th>
                        <th className='text-left pb-4'>นามสกุล</th>
                        <th className='text-left pb-4'>ภาควิชา</th>
                        <th className='text-left pb-4'>ชั้นปี</th>
                    </tr>
                </thead>
                <tbody className='divide-y'>
                {
                    response.map(element=>{
                        return(
                            <tr key={uuidv4()} className='py-4 '>
                                <td className='py-4'>{element[0]}</td>
                                <td className='py-4'>{element[2]}</td>
                                <td className='py-4'>{element[3]}</td>
                                <td className='py-4'>{element[4]}</td>
                                <td className='py-4'>{element[5]}</td>
                                <td className='py-4'>{element[6]}</td>
                            </tr>
                        )
                    })
                }
                </tbody>
                </>
                :'No response value'}
            </table>
            {/* <button onClick={sendPostRequest}>click</button> */}
            <pre>{response ?'': 'No response value'}</pre>
        </div>
    );
}

export default DisplayData;
