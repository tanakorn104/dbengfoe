import Header from "./Header"
import LinkPage from "./LinkPage"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import { root_url } from "./config/config";
function ManageCap() {
    const location = useLocation();
    const { datalocation } = location.state || 'none';
    const [loadingpage, setLoadingpage] = useState(true);
    const navigate = useNavigate();
    const [maindatastate, setmaindatastate] = useState({
        dataresdata: null,
        dataoverviewresdata: null,
        headtable:null
    })
    const [fiscalyearshow ,setfiscalyearshow] = useState(0);
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
        if(!datalocation){
            if(sessionStorage.getItem('role')!='admin'){
                navigate("/Dashboard");
            }else{
                navigate("/manage")

            }
        }
        setfiscalyearshow(datalocation.fiscalyear)
        const requestData = {
            type: "getallmaincap",
            data: {
                fiscalyear: fakedata.fiscalyear
            },
            token: sessionStorage.getItem('acctoken')

        };
        const getallmaincapdata = axios.post(root_url, JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
        Promise.all([getallmaincapdata]).then((result) => {
            setmaindatastate((predata) => ({
                ...predata,
                dataresdata: result[0].data.data,
                headtable:result[0].data.headtable
            }))
        }).then(() => {
            setLoadingpage(false);
        }).catch((err) => {
            console.error(err);
        })
    }, [])
    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH',{
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        });

        return formattedNumber;
    };
    const convertlisttoObj = (headtable,datasstable)=>{
        let objprelist = []
        for(let i =0;i<headtable.length;i++){
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
                <LinkPage />
                <p className='w-full h-full flex justify-center items-center'>loading</p>
            </>
        )
    }

    if (maindatastate.dataresdata == {} || maindatastate.dataresdata == null) {
        return (
            <>
                <Header />
                <LinkPage />
                <p className="w-full flex justify-center">เกิดข้อผิดพลาด</p>
                <a onClick={()=>{navigate(-1,{replace:true})}} className="w-full flex justify-center text-red-600 cursor-pointer hover:text-red-400">กลับ</a>
            </>
        )
    }

    return (
        <>
            {/* <p>{maindatastate.dataresdata}</p> */}
            <div className="w-full flex flex-col justify-center items-center ">
                <div className="w-5/6  border-b mb-3 mt-10 flex flex-row justify-between">
                    <p className="w-1/2 text-start text-xl flex items-end justify-start">ทุนปีงบประมาณ {fakedata.fiscalyear}</p>
                    <p className="w-1/2 text-end   font-light flex items-end justify-end">ณ วันที่{formattedDate}</p>
                </div>
                <table className="w-5/6">
                    <thead>
                        <tr className="w-full bg-gray-200 ">
                            <th className="font-normal w-1/5 text-end h-10">ประเภท</th>
                            {/* <th className="font-normal w-1/5 text-end h-10">คนละ(บาท)</th>
                            <th className="font-normal w-1/5 text-end h-10">เบิกได้(ครั้ง)</th> */}
                            <th className="font-normal w-1/5 text-end h-10">เบิกแล้ว(ครั้ง)</th>
                            <th className="font-normal w-1/5 text-end h-10">ทั้งหมด(บาท)</th>
                            <th className="font-normal w-1/5 text-end h-10">คงเหลือ(บาท)</th>
                            <th className="font-normal w-1/5 text-end h-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {maindatastate.dataresdata.map((list, index) => {
                            return (
                                <tr className="w-full ">
                                    <td className="font-light w-1/5 border-b text-end h-10">{(list[1])}</td>
                                    {/* <td className="font-light w-1/5 border-b text-end h-10">{numberWithCommas(list[2])}</td>
                                    <td className="font-light w-1/5 border-b text-end h-10">{(list[3])}</td> */}
                                    <td className="font-light w-1/5 border-b text-end h-10">{(list[4])}{(list[3]!=0)?'/'+list[3]:''}</td>
                                    <td className="font-light w-1/5 border-b text-end h-10">{numberWithCommas(list[13])}</td>
                                    <td className="font-light w-1/5  border-b text-end h-10">{numberWithCommas(list[15])}</td>
                                    <td className="font-light w-full border-b   h-10 cursor-pointer text-green-400 hover:text-green-200 flex justify-center  items-center ">
                                    {(((list[1]=='ทุนภายนอก'||list[1]=='ทุนบัณฑิต'||list[1]=='ทุนฉุกเฉิน')&&((list[15]>0)||list[1]=='ทุนภายนอก'))?
                                    <a onClick={()=>{navigate("/externalcapital",{state:{datalocation:convertlisttoObj(maindatastate.headtable,list)}})}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                      <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                      <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
                                      <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                                    </svg>
                                    </a>:((list[4]<list[3])&&(list[15]>0))?<a onClick={()=>{navigate("/currentcapital",{state:{datalocation:convertlisttoObj(maindatastate.headtable,list)}})}}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                      <path d="M12 7.5a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" />
                                      <path fillRule="evenodd" d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 0 1 1.5 14.625v-9.75ZM8.25 9.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM18.75 9a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V9.75a.75.75 0 0 0-.75-.75h-.008ZM4.5 9.75A.75.75 0 0 1 5.25 9h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H5.25a.75.75 0 0 1-.75-.75V9.75Z" clipRule="evenodd" />
                                      <path d="M2.25 18a.75.75 0 0 0 0 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 0 0-.75-.75H2.25Z" />
                                    </svg>
                                    </a>:'')}

                                    </td>
                                </tr>
                            )

                        })}
                    </tbody>

                </table>
            </div>
            <Header />
            <LinkPage />

        </>
    )

}

export default ManageCap