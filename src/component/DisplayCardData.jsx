import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import LoadingObj from '../assets/LoadingObj';
import api from './tool/AxiosInstance';



function DisplayCardData() {
    const [forrerendercom, setforrerendercom] = useState(0);//refresh เมื่อกดปุ่มลบ
    const [loadingpage, setLoadingpage] = useState(true);
    const navigate = useNavigate();
    const [headtableresdata, setHeadtableresdata] = useState([]);
    const [dataresdata, setDataresdata] = useState([]);

    const convertlisttoObj = (headtable, datasstable) => {
        let objprelist = []
        for (let i = 0; i < headtable.length; i++) {
            let prelist = [];
            prelist.push(headtable[i]);
            prelist.push(datasstable[i]);
            objprelist.push(prelist);


        }
        // console.log('headtableresdata')
        // console.log(headtableresdata)
        // console.log('dataresdata')
        // console.log(dataresdata[index])
        const objdata = Object.fromEntries(objprelist);
        return objdata;
    }
    const selectupdatehandle = (index) => {
        // let objprelist = []
        // for(let i =0;i<headtableresdata.length;i++){
        //     let prelist = [];
        //     prelist.push(headtableresdata[i]);
        //     prelist.push(dataresdata[index][i]);
        //     objprelist.push(prelist);


        // }
        // // console.log('headtableresdata')
        // // console.log(headtableresdata)
        // // console.log('dataresdata')
        // // console.log(dataresdata[index])
        // const objdata = Object.fromEntries(objprelist);
        let objdata = convertlisttoObj(headtableresdata, dataresdata[index])
        navigate('/update', { state: { datalocation: objdata } });

    }

    //testdata
    // {
    //     fiscalyear: 1,
    //     SAD: 72,
    //     amountgdstd: 3,
    //     amountwork: 4,
    //     amountfinstrap: 5,
    //     ngdstd: 6,
    //     nwork: 7,
    //     nfinstrap: 8,
    //     AEninschlagdstd: 9,
    //     AEninschlawork: 10,
    //     AEninschlafinstrap: 11,
    //     IRREninschlagdstd: 12,
    //     IRREninschlawork: 13,
    //     IRREninschlafinstrap: 14,
    //     FEninschlagdstd: 15,
    //     FEninschlawork: 16,
    //     FEninschlafinstrap: 17,
    //     CEninschlagdstd: 18,
    //     CEninschlawork: 19,
    //     CEninschlafinstrap: 20,
    //     MEninschlagdstd: 21,
    //     MEninschlawork: 22,
    //     MEninschlafinstrap: 23,
    //     CPEninschlagdstd: 24,
    //     CPEninschlawork: 25,
    //     CPEninschlafinstrap: 26,
    //     IEninschlagdstd: 27,
    //     IEninschlawork: 28,
    //     IEninschlafinstrap: 29,
    //     amountsmo: 30,
    //     amounteduwork: 31,
    //     amountforeign: 32,
    //     AEstddev: 33,
    //     IRREstddev: 34,
    //     FEstddev: 35,
    //     CEstddev: 36,
    //     MEstddev: 37,
    //     CPEstddev: 38,
    //     IEstddev: 39,
    //     AEincome: 40,
    //     IRREincome: 41,
    //     FEincome: 42,
    //     CEincome: 43,
    //     MEincome: 44,
    //     CPEincome: 45,
    //     IEincome: 46,
    //     spAEincome: 47,
    //     spCEincome: 48,
    //     spMEincome: 49
    //   }

    // console.log('lll');

    useEffect(() => {
        if (sessionStorage.getItem('role') != 'admin') {
            navigate("/Dashboard");
        }

        setLoadingpage(true);
        // เก็บข้อมูลฟอร์มใน state
        // sessionStorage.setItem('statusInsertOrUpdateData','insert');
        const requestData = {
            type: "getallmain",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {
                
            },

        };
        // console.log((requestData));
        api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        )
            .then(response => { setHeadtableresdata(response.data.headtable); setDataresdata(response.data.data); setLoadingpage(false); })
            .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด



    }, [forrerendercom])

    const handledel = async (primary) => {
        const delconfirm = confirm("คุณต้องการลบใช่ไหม");
        if (delconfirm) {
            const requestData = {
                type: "deldatamain",//sessionStorage.getItem('statusInsertOrUpdateData')
                data: {
                    primarykey: primary
                },

            };
            console.log((requestData));
            await api.post("/", JSON.stringify(requestData), {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
            )
                .then(response => { setforrerendercom(forrerendercom + 1); console.log(response) })
                .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด

            console.log('Form submitted with data:',);
        }


    }
    const handleMorebtn = (index) => {
        navigate("/overview", { state: { datalocation: index } })
    }

    if (loadingpage) {
        return (
            <>
                {/* <p className='w-full h-full flex justify-center items-center'>loading</p> */}
                <LoadingObj />

            </>
        )
    }
    if (dataresdata == null) {
        return (
            <>
                <p className="w-full flex justify-center ">ยังไม่มีข้อมูลปีงบประมาณใด</p>
                <Link to="/adddata" className=' fixed bg-green-400  bottom-28 right-16 rounded-full h-11 w-32 flex justify-center items-center text-white hover:bg-green-500 cursor-pointer'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 ">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                    </svg>
                    เพิ่มข้อมูล</Link>
            </>
        )
    }
    return (
        <div className=' felx flex-col justify-center items-center pt-10'>
            <div className="   h-full flex flex-col justify-center items-center  ">
                <div className="mb-5 border-b">ข้อมูลทั้งหมด</div>
                {dataresdata.map((obj, index) => (
                    <div key={uuidv4()} className="max-w-screen-lg  card h-32 md:h-14 w-3/4 bg-white p-5 my-2  border-2 rounded-3xl flex flex-col md:flex-row justify-between items-center">
                        <p className='font-bold w-full flex justify-center md:justify-start'>{obj[0]}</p>
                        <div className=" flex flex-row h-6 max-w-screen-sm   w-full justify-around md:justify-end">
                            <a onClick={() => { handleMorebtn(obj[0]) }} className='text-sm md:text-base cursor-pointer w-1/3 md:w-1/3 h-full  bg-blue-300 hover:bg-blue-400 ml-3 flex justify-center items-center rounded-md'>ดูเพิ่มเติม</a>
                            <a onClick={() => selectupdatehandle(index)} className='text-sm md:text-base cursor-pointer w-1/3 md:w-1/3 h-full  bg-yellow-300 hover:bg-yellow-400 ml-3 flex justify-center items-center rounded-md'>แก้ไข</a>
                            <a onClick={() => handledel(obj[0])} className='text-sm md:text-base cursor-pointer w-1/3 md:w-1/3 h-full  bg-red-300 hover:bg-red-400 ml-3 flex justify-center items-center rounded-md'>ลบ</a>
                        </div>
                    </div>
                ))}


            </div>
            <Link to="/adddata" className=' fixed bg-green-400  bottom-28 right-16 rounded-full h-11 w-32 flex justify-center items-center text-white hover:bg-green-500 cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5 ">
                    <path fillRule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>
                เพิ่มข้อมูล</Link>
        </div>
    )
}


export default DisplayCardData;