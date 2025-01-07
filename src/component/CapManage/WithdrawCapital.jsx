
import Header from "../Header"
import LinkPage from "../LinkPage"
import { json, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import { data } from "autoprefixer";
import { root_url } from "../config/config";
function WithdrawCapital() {
    const location = useLocation();
    const { datalocation } = location.state || 'none';
    const [loadingpage, setLoadingpage] = useState(false);
    const [donthavedata, setdonthavedata] = useState(true);
    const navigate = useNavigate();
    const tempstdcoderef = useRef(null);
    const temptitleref = useRef(null);
    const tempnamecoderef = useRef(null);
    const templastnamecoderef = useRef(null);
    const tempmajorcoderef = useRef(null);
    const tempyearcoderef = useRef(null);
    const [majorshow, setMajorshow] = useState('AE');
    const [datatoadd, setdatatoadd] = useState({
        fiscalyear: null,
        type: null,
        doccode: null,
        title: null,
        amount: null,
        npayed: null
    })
    const [maindatastate, setmaindatastate] = useState({
        dataresdata: {

        },
        dataoverviewresdata: {
            fiscalyear: null,
            type: null
        },
    })

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
    const handleinsertSubmit = async (event) => {
        event.preventDefault(); // ป้องกันการรีเฟรชหน้า
        // เก็บข้อมูลฟอร์มใน state
        // console.log(datatoadd);
        // sessionStorage.setItem('statusInsertOrUpdateData','insert');
        // const requestData = {
        //     type:"insertexternaltcap",//sessionStorage.getItem('statusInsertOrUpdateData')
        //     data:datatoadd,
        //     token: sessionStorage.getItem('acctoken')
        // };
        // console.log((requestData));
        // await axios.post(root_url,JSON.stringify(requestData),{
        //         headers:{
        //             'Content-Type':'application/json'
        //         }
        //     }
        // )
        // .then(response => {
        //     setdatatoadd({
        //         fiscalyear:null,
        //         type:null,
        //     doccode:null,
        //     title:null,
        //     amount:null,
        //     npayed:null
        //     });
        // })
        // .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด
        // 
        // console.log('Form submitted with data:', formData);

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
    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formattedNumber;
    };
    const handledel = (key) => {
        let usercon = confirm("ต้องการลบ? จะไม่สามารถคืนค่าได้");
        if (usercon) {
            const dataupdate = { ...maindatastate.dataresdata };
            delete dataupdate[key];
            setmaindatastate((predata) => ({
                ...predata,
                dataresdata: dataupdate
            }))
        }
    }
    const handleadddata = (formdata) => {
        formdata.preventDefault();
        const dataupdate = { ...maindatastate.dataresdata };
        if (!Object.keys(dataupdate).includes(tempstdcoderef.current.value)) {
            Object.assign(dataupdate, {
                [tempstdcoderef.current.value]: {

                    fiscalyear: maindatastate.dataoverviewresdata.fiscalyear,
                    typecap: maindatastate.dataoverviewresdata.type,
                    stdcode: tempstdcoderef.current.value,
                    title: temptitleref.current.value,
                    name: tempnamecoderef.current.value,
                    lastname: templastnamecoderef.current.value,
                    major: tempmajorcoderef.current.value,
                    year: tempyearcoderef.current.value

                }
            })
            setmaindatastate((predata) => ({
                ...predata,
                dataresdata: dataupdate
            }))
            tempstdcoderef.current.value = '';
            temptitleref.current.value = '';
            tempnamecoderef.current.value = '';
            templastnamecoderef.current.value = '';
            tempmajorcoderef.current.value = '';
            tempyearcoderef.current.value = '';
        } else {
            alert(tempstdcoderef + 'ถูกเพิ่มเข้ามาแล้ว');
        }

        // console.log(dataupdate);
    }

    function filterByKey(data, key) {
        // if(key=='overviewexternalcap'){
        //    return Object.values(data)
        // }   
        // console.log(">>>",data);
        // console.log(major)
        return Object.values(data).filter(function (item) {
            // console.log(">>>",item.major === major);
            return item[key] === key;
        });
    }

    function filterByMajor(data, major) {
        // console.log(">>>",data);
        // console.log(major)
        return Object.values(data).filter(function (item) {
            // console.log(">>>",item.major === major);
            return item.major === major;
        });
    }


    useEffect(() => {
        setLoadingpage(true)
        if (!datalocation) {
            if (sessionStorage.getItem('role') != 'admin') {
                navigate("/Dashboard");
            } else {
                navigate("/manage")

            }
        }
        // setdatatoadd((predata)=>({
        //     ...predata,
        //     fiscalyear: datalocation.dataoverviewresdata.fiscalyear,
        //     type:datalocation.dataoverviewresdata.typecap  ,
        //     npayed:0


        // }))
        // const requestData = {
        //     type: "getallexternalcap",
        //     data: {
        //         fiscalyear: datalocation.dataoverviewresdata.fiscalyear,
        //         type:datalocation.dataoverviewresdata.typecap,
        //     },
        //     token: sessionStorage.getItem('acctoken')

        // };
        // const getallmaincapdata = axios.post(root_url, JSON.stringify(requestData), {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }
        // )
        // Promise.all([getallmaincapdata]).then((result) => {
        //     // console.log(">>>",Object.values(result[0].data.data))
        //     if(result[0].data.data){
        //         setdonthavedata(false)
        //         let justobj={};

        //         result[0].data.data.map((list)=>{
        //             // console.log(convertlisttoObj(result[0].data.headtable,list));
        //             justobj[list[3]]= convertlisttoObj(result[0].data.headtable,list)
        //         })
        //         console.log(justobj)
        //         setmaindatastate((predata) => ({
        //             ...predata,
        //             dataresdata: justobj,
        //             dataoverviewresdata:datalocation.dataoverviewresdata
        //         }))

        //     }else{
        //         setmaindatastate((predata) => ({
        //             ...predata,
        //             dataoverviewresdata:datalocation.dataoverviewresdata
        //         }))
        //         setdonthavedata(true)
        //     }

        // }).then(() => {
        //     setLoadingpage(false);
        // }).catch((err) => {
        //     console.error(err);
        // })
        setmaindatastate((predata) => ({
            ...predata,
            dataoverviewresdata: datalocation.dataoverviewresdata,
            dataresdata: datalocation.maindata
        }))
        setLoadingpage(false);
        setdonthavedata(false)
    }, [])

    const prevententersend = (event) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
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
    // if (donthavedata) {
    //     return (
    //         <>
    //             <Header />
    //             <LinkPage />
    //             <p className='w-full h-full flex justify-center items-center'>ยังไม่มีข้อมูลใดๆ</p>
    //         </>
    //     )
    // }

    return (
        <>
            <Header />
            <LinkPage />
            {/* {JSON.stringify(Object.keys(maindatastate.dataresdata))} */}
            {/* {JSON.stringify((maindatastate.dataresdata))} */}
            <div className="w-full flex flex-col justify-center items-center ">

                <div className="w-5/6    mt-4 flex flex-row justify-between">
                    <p className="w-1/2 text-start text-xl flex items-end justify-start truncate">เบิกจ่าย {maindatastate.dataoverviewresdata.typecap}  ปีงบประมาณ {maindatastate.dataoverviewresdata.fiscalyear}</p>
                    <p className="w-1/2 text-end   font-light flex items-end justify-end truncate">ณ วันที่{formattedDate}</p>
                </div>
                <div className="w-5/6 flex flex-row justify-between">
                    {/* <p className="font-light truncate">เบิกแล้ว {maindatastate.dataoverviewresdata.npayed} ครั้ง </p>
                    <p className="font-light truncate">รวม {maindatastate.dataoverviewresdata.fullamount} บาท คงเหลือ {maindatastate.dataoverviewresdata.total} บาท</p> */}
                </div>
                <div className="w-5/6 flex justify-center items-center ">
                    <div className="card w-full ">
                        <div className="flex flex-row h-10 justify-between bg-gray-200 px-3">
                            <p className="h-full flex justify-center items-center">รวมภาควิชา

                            </p>
                            {/* {JSON.stringify(Object.values(maindatastate.dataresdata))} */}
                            <p className=" flex items-center">เบิก {Object.keys(maindatastate.dataresdata).length} คน </p>
                        </div>
                        {/* <p>รายชื่อปัจจุบัน</p> */}
                        <div className="w-full">
                            <div className="flex flex-row mt-2">
                                <p className="h-9 border border-gray-600 w-1/3 flex justify-center items-center">เบิกครั้งที่<span className="text-lg sm:text-xl mx-2 text-blue-500">{maindatastate.dataoverviewresdata.npayed + 1}</span> </p>
                                <p className="h-9 border border-gray-600 w-1/3 flex justify-center items-center">จำนวน <span className="text-lg sm:text-xl  mx-2 text-green-500">{Object.keys(maindatastate.dataresdata).length}</span> คน</p>
                                <p className="h-9 border border-gray-600 w-1/3 flex justify-center items-center"><span className="text-lg sm:text-xl  mx-2 text-red-500">{numberWithCommas(maindatastate.dataoverviewresdata.amount * Object.keys(maindatastate.dataresdata).length)}</span> บาท</p>
                            </div>
                            <input type="month" name="" id="" className="w-full mt-2" />
                            <select name="" id=" " className="w-full mt-1">
                                <option value="">ภาคต้น</option>
                                <option value="">ภาคปลาย</option>
                            </select>
                        </div>
                        <form autoComplete="off" className="w-full p-0 m-0" onSubmit={handleadddata}>


                            <div className="w-full overflow-auto ">
                                {donthavedata == false ? Object.values(maindatastate.dataresdata).map((obj, index) => {
                                    return (
                                        <div className="w-full h-10  border-b  flex flex-row justify-between overflow-auto">
                                            <span className="w-2/6 sm:max-w-28 sm:text-sm text-xs font-light text-center flex items-center justify-start truncate ">{obj.stdcode}</span>
                                            <span className="w-4/6 grow  pl-3 flex flex-row justify-between">
                                                <span className="w-1/5 hidden sm:block ">
                                                    <span className="w-full h-full text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.title}</span>
                                                </span>
                                                <span className="w-1/5 text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.name}</span>
                                                <span className="w-1/5 text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.lastname}</span>
                                                <span className="w-1/5 text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.major}</span>
                                                <span className="w-1/5 text-xs sm:text-sm font-light text-center flex items-center justify-end truncate ">ปี {obj.year}</span>

                                            </span>
                                            {/* <span className="w-1/6 h-10 flex justify-center items-center font-normal text-red-500 cursor-pointer hover:text-red-400 ">
                                                    <a onClick={() => { handledel(obj.stdcode) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                                        </svg>
                                                    </a>

                                                </span> */}

                                        </div>

                                    )
                                }) : <p className="w-full flex justify-center items-center">ยังไม่มีข้อมูลใดๆ</p>}

                            </div>
                            {/* {donthavedata==false&&majorshow!="overviewexternalcap"?filterByKey(Object.values(maindatastate.dataresdata), majorshow).map((obj, index) => {
                                        return (
                                            <div className="w-full h-10 border-b  flex flex-row justify-between">
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.stdcode}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.title}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.name}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.lastname}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.major}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">ปี {obj.year}</span>
                                                <span className="w-1/6 h-10 flex justify-center items-center font-normal text-red-500 cursor-pointer hover:text-red-400 ">
                                                    <a >
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                                        </svg>
                                                    </a>

                                                </span>
                                                
                                            </div>
                                            
                                        )
                                    }):donthavedata==false&&majorshow=="overviewexternalcap"?filterByKey(Object.values(maindatastate.dataresdata), majorshow).map((obj, index) => {
                                        return (
                                            <div className="w-full h-10 border-b  flex flex-row justify-between">
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.doccode}</span>
                                                <span className="w-4/6 font-light text-center flex items-center justify-center truncate ">{obj.title}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{numberWithCommas(obj.amount)}</span>
                                                <span className="w-1/6 h-10 flex justify-center items-center font-normal text-green-500 cursor-pointer hover:text-green-400 ">
                                                    <a >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>

                                                    </a>

                                                </span>
                                                
                                            </div>
                                            
                                        )
                                    }):<p className="w-full flex justify-center items-center">ยังไม่มีข้อมูลใดๆ</p>}
 */}





                            {['ทุนฉุกเฉิน','ทุนภายนอก','ทุนบัณฑิต'].includes(maindatastate.dataoverviewresdata.typecap)?<div className="w-full flex flex-row h-10 border-b">
                                <div className="w-full flex flex-row bg-green-50">
                                    <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0 " placeholder="รหัสนิสิต" type="text" ref={tempstdcoderef} name="stdcode" id="" maxLength={10} required />
                                    {/* <input onKeyDown={prevententersend} className=" w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0 " placeholder="คำนำหน้า" type="text" ref={temptitleref} name="title" id="" maxLength={10} required /> */}
                                    <div className="w-1/6 border-b bg-green-50">
                                        <select type="text" onKeyDown={prevententersend} ref={temptitleref} name="title" className="bg-green-50 w-full border-none  h-10  focus:outline-none focus:border-none focus:ring-0  font-light flex justify-end text-center " style={{ borderBottom: "solid 1px", borderColor: "rgb(229,231,235)" }}>
                                            <option value="นาย">นาย</option>
                                            <option value="นาง">นาง</option>
                                            <option value="นางสาว">นางสาว</option>
                                        </select>
                                    </div>
                                    <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="ชื่อ" type="text" ref={tempnamecoderef} name="name" id="" required />
                                    <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="นามสกุล" type="text" ref={templastnamecoderef} name="lastname" id="" required />
                                    <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0 font-light" placeholder="" type="text" ref={tempmajorcoderef} name="major" id="" value={majorshow} readOnly required />
                                    <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="ชั้นปี" type="number" name="" ref={tempyearcoderef} id="year" maxLength={2} min={1} max={10} pattern="\d{1,1}" required />
                                    <button type="submit" className="w-1/6 flex justify-center items-center text-green-500 cursor-pointer hover:text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                        </svg>

                                    </button>
                                </div>
                            </div>:''}
                            <div className="w-full  flex justify-center items-center mt-5">
                                <a className="bg-red-500 w-5/6 flex justify-center hover:bg-white cursor-pointer transition-colors duration-300 text-white hover:text-black h-8 items-center">ยกเลิก</a>
                                <a className="bg-green-500 w-5/6 flex justify-center hover:bg-white cursor-pointer transition-colors duration-300 text-white hover:text-black h-8 items-center">ยืนยัน</a>
                            </div>
                            {/* {JSON.stringify(maindatastate.dataresdata)} */}
                        </form>
                    </div>
                </div>

                {/* {JSON.stringify(())} */}

            </div>

        </>
    )


}


export default WithdrawCapital