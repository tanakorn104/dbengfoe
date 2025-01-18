import Header from "./Header"
import LinkPage from "./LinkPage"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import LoadingObj from "../assets/LoadingObj";
import api from "./tool/AxiosInstance";
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';

function ManageCap() {
    const location = useLocation();
    const { datalocation } = location.state || 'none';
    const [loadingpage, setLoadingpage] = useState(true);
    const navigate = useNavigate();
    const [maindatastate, setmaindatastate] = useState({
        dataresdata: null,
        dataoverviewresdata: null,
        headtable: null
    })
    const [fiscalyearshow, setfiscalyearshow] = useState(0);
    const [forrerenderpage, setforrerenderpage] = useState(0);

    const now = new Date();
    const options = {
        year: 'numeric',
        month: 'long',   // หรือใช้ '2-digit', 'numeric', 'short'
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false    // ถ้าอยากได้รูปแบบ 24 ชั่วโมง
    };

    // การใช้ Intl.DateTimeFormat
    const formattedDate = new Intl.DateTimeFormat('th-TH', options).format(now);

    useEffect(() => {
        if (!datalocation) {
            if (sessionStorage.getItem('role') != 'admin') {
                navigate("/Dashboard");
            } else {
                navigate("/manage")

            }
        }
        setfiscalyearshow(datalocation.fiscalyear)
        const requestData = {
            type: "getallmaincap",
            data: {
                fiscalyear: datalocation.fiscalyear
            },


        };
        const getallmaincapdata = api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        )
        Promise.all([getallmaincapdata]).then((result) => {
            setmaindatastate((predata) => ({
                ...predata,
                dataresdata: result[0].data.data,
                headtable: result[0].data.headtable
            }))
        }).then(() => {
            setLoadingpage(false);
        }).catch((err) => {
            console.error(err);
        })
    }, [])
    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formattedNumber;
    };
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

    if (loadingpage) {
        return (
            <>
                <Header />
                {/* <LinkPage /> */}
                <LoadingObj />
            </>
        )
    }

    if (maindatastate.dataresdata == {} || maindatastate.dataresdata == null) {
        return (
            <>
                <Header />
                {/* <LinkPage /> */}
                <p className="w-full flex justify-center">เกิดข้อผิดพลาด</p>
                <a onClick={() => { navigate(-1, { replace: true }) }} className="w-full flex justify-center text-red-600 cursor-pointer hover:text-red-400">กลับ</a>
            </>
        )
    }


    const data = [
        { name: 'Group A', value: 1 },
        { name: 'Group B', value: 1 },
        { name: 'Group C', value: 1 },
        { name: 'Group D', value: 1 },
        { name: 'Group D', value: 1 },
        { name: 'Group D', value: 1 },
    ];
    const COLORS = ['#FF8042'];// '#00C49F'

    return (
        <>
            {/* <p>{maindatastate.dataresdata}</p> */}
            <div className="w-full flex flex-col justify-center items-center ">
                <div className="w-5/6  border-b mb-3 mt-10 flex flex-col md:flex-row justify-between">
                    <p className="w-full md:w-1/2 text-start text-xl flex items-end    justify-center md:justify-start">ทุนปีงบประมาณ {fiscalyearshow}</p>
                    <p className="w-full md:w-1/2 text-end  text-sm md:text-base font-light flex items-end justify-center md:justify-end">ณ วันที่{formattedDate}</p>
                </div>

                {/* <div className="w-5/6 flex  justify-center items-center">
                    <PieChart width={800} height={400} >
                        <Pie
                            data={data}
                            cx={390}
                            cy={220}
                            startAngle={180}
                            endAngle={0}
                            innerRadius={140}
                            outerRadius={160}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                    <div className="absolute self-center ">
                        <p className="text-xl">0/5ครั้ง</p>
                    </div>

                </div> */}



                <div className="w-5/6">
                    <div>
                        <div className="w-full flex flex-row justify-between items-center bg-gray-200 ">
                            <div className="font-normal text-sm flex items-center justify-center  w-2/5 md:w-1/5 text-start h-10">ประเภท</div>
                            <div className="font-normal text-sm flex items-center justify-center md:justify-center w-2/5 md:w-1/5 text-end h-10">เบิกแล้ว(ครั้ง)</div>
                            <div className="font-normal text-sm  w-1/3 md:w-1/5 hidden md:block text-end h-10"><div className="flex items-center h-full justify-end">ทั้งหมด(บาท)</div></div>
                            <div className="font-normal text-sm   hidden md:block w-1/3 md:w-1/5 text-end h-10"><div className="flex items-center h-full justify-end ">คงเหลือ(บาท)</div></div>
                            <div className="font-normal text-sm flex items-center w-1/5 md:w-1/5 text-end h-10"></div>
                        </div>
                    </div>
                    <div>
                        {maindatastate.dataresdata.map((list, index) => {
                            return (
                                <div className="w-full flex flex-row justify-between ">
                                    <div className="font-light text-sm flex justify-start pl-5 items-center w-2/5 md:w-1/5 border-b text-start h-10"><a className="hover:cursor-pointer hover:text-gray-600" onClick={() => { navigate("/managelogpayment", { state: { datalocation: convertlisttoObj(maindatastate.headtable, list) } }) }}>{(list[1])}</a></div>
                                    <div className="font-light text-sm flex justify-center md:justify-center md:pr-5  items-center w-2/5 md:w-1/5 border-b text-end h-10">{(list[4])}{(list[3] != 0) ? '/' + list[3] : ''}</div>
                                    <div className="font-light text-sm  w-1/3 md:w-1/5 hidden md:block border-b text-end h-10"><div className="flex h-full items-center justify-end">{numberWithCommas(list[13])}</div></div>
                                    <div className="font-light text-sm  w-1/3 md:w-1/5 hidden md:block border-b text-end h-10"><div className="flex h-full items-center justify-end">{numberWithCommas(list[15])}</div></div>
                                    <div className="font-light w-1/5 border-b   h-10 cursor-pointer text-green-400 hover:text-green-200 flex justify-center    items-center ">
                                        {(((list[1] == 'ทุนภายนอก' || list[1] == 'ทุนบัณฑิต' || list[1] == 'ทุนฉุกเฉิน') && ((list[15] > 0) || list[1] == 'ทุนภายนอก')) ?
                                            <a onClick={() => { navigate("/externalcapital", { state: { datalocation: convertlisttoObj(maindatastate.headtable, list) } }) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                                    <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
                                                    <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                                                </svg>
                                            </a> : ((list[4] < list[3]) && (list[15] > 0)) ? <a onClick={() => { navigate("/currentcapital", { state: { datalocation: convertlisttoObj(maindatastate.headtable, list) } }) }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                    <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                                    <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
                                                    <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                                                </svg>
                                            </a> : '')}

                                    </div>
                                </div>
                            )

                        })}
                    </div>

                </div>
            </div>
            <Header />
            {/* <LinkPage /> */}

        </>
    )

}

export default ManageCap