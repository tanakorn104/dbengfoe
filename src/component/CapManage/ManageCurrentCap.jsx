import Header from "../Header"
import LinkPage from "../LinkPage"
import { json, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import { root_url } from "../config/config";
function ManageCurrentCap() {
    const location = useLocation();
    const { datalocation } = location.state || 'none';
    const [loadingpage, setLoadingpage] = useState(false);
    const [donthavecurrentcapdata,setdonthavecurrentcapdata] = useState(true);

    const navigate = useNavigate();
    const tempstdcoderef = useRef(null);
    const temptitleref = useRef(null);
    const tempnamecoderef = useRef(null);
    const templastnamecoderef = useRef(null);
    const tempmajorcoderef = useRef(null);
    const tempyearcoderef = useRef(null);
    const [majorshow,setMajorshow] = useState('AE');
    const [maindatastate, setmaindatastate] = useState({
        dataresdata: {
            // 672053033: {
            //         fiscalyear: 2027,
            //         typecap: 'ทุนขัดสน',
            //         stdcode: 6720530033,
            //         title:'นาย',
            //         name: 'ธนกร',
            //         lastname: 'พรมล็ก',
            //         major: 'CPE',
            //         year: 1
            // },
            // 672053034: {
            //         fiscalyear: 2027,
            //         typecap: 'ทุนทำงาน',
            //         stdcode: 6720530234,
            //         title:'นาย',
            //         name: 'อัศนี',
            //         lastname: 'ชัยอานนท์',
            //         major: 'IE',
            //         year: 3
            // },
            // 672053035: {
            //         fiscalyear: 2027,
            //         typecap: 'ทุนทำงาน',
            //         stdcode: 6720530735,
            //         title:'นาย',
            //         name: 'กา',
            //         lastname: 'ชัยอานนท์',
            //         major: 'IE',
            //         year: 3
            // }
        },
        dataoverviewresdata: {
            fiscalyear:null,
            typecap:null
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
    const handleSubmit = async(event) => {
        event.preventDefault(); // ป้องกันการรีเฟรชหน้า
        // เก็บข้อมูลฟอร์มใน state
        // sessionStorage.setItem('statusInsertOrUpdateData','insert');
        const requestData = {
            type:"insertrecipientscurrentcap",//sessionStorage.getItem('statusInsertOrUpdateData')
            data:maindatastate.dataresdata,
            token: sessionStorage.getItem('acctoken')
        };
        // console.log((requestData));
        await axios.post(root_url,JSON.stringify(requestData),{
                headers:{
                    'Content-Type':'application/json'
                }
            }
        )
        .then(response => {})
        .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด
    
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
    useEffect(() => {
        setLoadingpage(true)
        if(!datalocation){
            if(sessionStorage.getItem('role')!='admin'){
                navigate("/Dashboard");
            }else{
                navigate("/manage")

            }
        }
        // console.log(datalocation)
        const requestData = {
            type: "getrecipientscurrentcap",
            data: {
                fiscalyear: datalocation.fiscalyear,
                typecap:datalocation.typecap
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
            // console.log(">>>",Object.values(result[0].data.data))
            if(result[0].data.data){
                setdonthavecurrentcapdata(false)
                let justobj={};
    
                result[0].data.data.map((list)=>{
                    // console.log(convertlisttoObj(result[0].data.headtable,list));
                    justobj[list[2]]= convertlisttoObj(result[0].data.headtable,list)
                })
                // console.log(justobj)
                setmaindatastate((predata) => ({
                    ...predata,
                    dataresdata: justobj,
                    dataoverviewresdata:datalocation
                }))

            }else{
                setmaindatastate((predata) => ({
                    ...predata,
                    dataoverviewresdata:datalocation
                }))
                setdonthavecurrentcapdata(true)
            }

        }).then(() => {
            setLoadingpage(false);
        }).catch((err) => {
            console.error(err);
        })
    }, [])
    // useEffect(()=>{
        
    // },[])
    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formattedNumber;
    };


    function filterByMajor(data, major) {
        // console.log(">>>",data);
        // console.log(major)
        return Object.values(data).filter(function (item) {
            // console.log(">>>",item.major === major);
            return item.major === major||item.major === 's'+major;
        });
    }



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
    const prevententersend = (event) => {
        if (event.key == "Enter") {
            event.preventDefault();
        }
    }
    const handleadddata = (formdata) => {
        formdata.preventDefault();
        const dataupdate = { ...maindatastate.dataresdata };
        if (!Object.keys(dataupdate).includes(tempstdcoderef.current.value)) {
            Object.assign(dataupdate, {
                [tempstdcoderef.current.value]: {
                   
                        fiscalyear: maindatastate.dataoverviewresdata.fiscalyear,
                        typecap: maindatastate.dataoverviewresdata.typecap,
                        stdcode: tempstdcoderef.current.value,
                        title:temptitleref.current.value,
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
    // const handlemajorshowchange = (e)=>{
    //     setMajorshow(e.target.value);
    // }


    if (loadingpage) {
        return (
            <>
                <Header />
                <LinkPage />
                <p className='w-full h-full flex justify-center items-center'>loading</p>
            </>
        )
    }

    // if (maindatastate.dataresdata == {} || maindatastate.dataresdata == null) {
    //     return (
    //         <>
    //             <Header />
    //             <LinkPage />
    //             <p className="w-full flex justify-center">เกิดข้อผิดพลาด</p>
    //             <a onClick={()=>{navigate(-1,{replace:true})}} className="w-full flex justify-center text-red-600 cursor-pointer hover:text-red-400">กลับ</a>
    //         </>
    //     )
    // }


    return (
        <>
            {/* <p>{JSON.stringify(datalocation)}</p> */}
            <div className="w-full flex flex-col justify-center items-center ">

                <div className="w-5/6 flex flex-row justify-end">
                    <a onClick={handleSubmit} className="bg-yellow-500 w-24  px-6 rounded-lg text-white h-8  text-start text-base flex items-center justify-center ml-3 truncate hover:bg-white hover:text-black transition-colors duration-500 cursor-pointer hover:border-b-2">อัพเดต</a>
                    <a onClick={()=>{navigate("/withdrawcapital",{state:{datalocation:{maindata:maindatastate.dataresdata,dataoverviewresdata:datalocation}}})}} className="bg-green-500  w-24  px-6 rounded-lg text-white h-8  text-start text-base flex items-center justify-center ml-3 truncate hover:bg-white hover:text-black transition-colors duration-500 cursor-pointer hover:border-b-2">เบิก</a>
                </div>
                <div className="w-5/6    mt-4 flex flex-row justify-between">
                    <p className="w-1/2 text-start text-xl flex items-end justify-start truncate">{maindatastate.dataoverviewresdata.typecap}  ปีงบประมาณ {maindatastate.dataoverviewresdata.fiscalyear}</p>
                    <p className="w-1/2 text-end   font-light flex items-end justify-end truncate">ณ วันที่{formattedDate}</p>
                </div>
                <div className="w-5/6 flex flex-row justify-between">
                    <p className="font-light truncate">เบิกได้ {maindatastate.dataoverviewresdata.npay} ครั้ง เบิกแล้ว {maindatastate.dataoverviewresdata.npayed} ครั้ง โควต้า {Object.keys(maindatastate.dataresdata).length} / {maindatastate.dataoverviewresdata.sumn} คน</p>
                    <p className="font-light truncate">คนละ {maindatastate.dataoverviewresdata.amount} บาท รวม {maindatastate.dataoverviewresdata.fullamount} บาท คงเหลือ {maindatastate.dataoverviewresdata.total} บาท</p>
                </div>
                <div className="w-5/6">
                    <div className="card w-full ">
                        <div className="flex flex-row justify-between bg-gray-200 px-3">
                            <p className="">ภาควิชา 
                                <span>
                                    <select onChange={(e)=>(setMajorshow(e.target.value))} name="" id="" className=" border-none bg-gray-200 focus:outline-none focus:border-none focus:ring-0  font-light truncate">
                                        <option value="AE">วิศวกรรมเกษตร</option>
                                        <option value="IRRE">วิศวกรรมชลประทาน</option>
                                        <option value="FE">วิศวกรรมการอาหาร</option>
                                        <option value="CE">วิศวกรรมโยธา</option>
                                        <option value="ME">วิศวกรรมเครื่องกล</option>
                                        <option value="CPE">วิศวกรรมคอมพิวเตอร์</option>
                                        <option value="IE">วิศวกรรมอุตสาหการ</option>
                                    </select>
                                </span>
                            </p>
                            {/* {JSON.stringify(Object.values(maindatastate.dataresdata))} */}
                            <p className=" flex items-center">ได้รับ {maindatastate.dataoverviewresdata['n'+majorshow]} ทุน ปัจจุบัน {filterByMajor(Object.values(maindatastate.dataresdata), majorshow).length} คน</p>
                        </div>
                        {/* <p>รายชื่อปัจจุบัน</p> */}
                        <form onSubmit={handleadddata} autoComplete="off">
                            <table className="w-full">
                                {/* <thead>
                                    <tr className="w-full h-10 bg-gray-400">
                                        <th className="w-1/6 font-normal text-end ">รหัสนิสิต</th>
                                        <th className="w-1/6 font-normal text-end ">คำนำหน้า</th>
                                        <th className="w-1/6 font-normal text-end ">ชื่อ</th>
                                        <th className="w-1/6 font-normal text-end ">นามสกุล</th>
                                        <th className="w-1/6 font-normal text-end ">ภาควิชา</th>
                                        <th className="w-1/6 font-normal text-end ">ชั้นปี</th>
                                        <th className="w-1/6 font-normal text-end "></th>
                                    </tr>
                                </thead> */}
                                <tbody>
                                    {donthavecurrentcapdata==false?filterByMajor(Object.values(maindatastate.dataresdata), majorshow).map((obj, index) => {
                                        return (
                                            <div className="w-full h-10 border-b  flex flex-row justify-between">
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.stdcode}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.title}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.name}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.lastname}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">{obj.major}</span>
                                                <span className="w-1/6 font-light text-end flex items-center justify-end truncate ">ปี {obj.year}</span>
                                                <span className="w-1/6 h-10 flex justify-center items-center font-normal text-red-500 cursor-pointer hover:text-red-400 ">
                                                    <a onClick={() => { handledel(obj.stdcode) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                                        </svg>
                                                    </a>

                                                </span>
                                                
                                            </div>
                                            
                                        )
                                    }):<p className="w-full flex justify-center items-center">ยังไม่มีข้อมูลใดๆ</p>}



                                </tbody>

                            </table>
                            
                            {(maindatastate.dataoverviewresdata['n'+majorshow]>filterByMajor(Object.values(maindatastate.dataresdata), majorshow).length)?<div className="w-full flex flex-row h-10 border-b">
                                <div className="w-full flex flex-row bg-green-50">
                                <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0 " placeholder="รหัสนิสิต" type="text" ref={tempstdcoderef} name="stdcode" id="" maxLength={10} required />
                                {/* <input onKeyDown={prevententersend} className=" w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0 " placeholder="คำนำหน้า" type="text" ref={temptitleref} name="title" id="" maxLength={10} required /> */}
                                <div className="w-1/6 border-b bg-green-50">
                                <select type="text" onKeyDown={prevententersend} ref={temptitleref} name="title" className="bg-green-50 w-full border-none  h-10  focus:outline-none focus:border-none focus:ring-0  font-light flex justify-end text-center " style={{borderBottom:"solid 1px",borderColor:"rgb(229,231,235)"}}>
                                    <option value="นาย">นาย</option>
                                    <option value="นาง">นาง</option>
                                    <option value="นางสาว">นางสาว</option>
                                </select>
                                </div>
                                <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="ชื่อ" type="text" ref={tempnamecoderef} name="name" id="" required />
                                <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="นามสกุล" type="text" ref={templastnamecoderef} name="lastname" id="" required />
                                {/* <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0 font-light" placeholder="" type="text" ref={tempmajorcoderef} name="major" id="" value={majorshow} readOnly required /> */}
                                <div className="w-1/6 border-b bg-green-50 text-end">
                                <select type="text" onKeyDown={prevententersend} ref={tempmajorcoderef} name="title" className="bg-green-50 w-full border-none  h-10  focus:outline-none focus:border-none focus:ring-0  font-light flex justify-end text-center " style={{borderBottom:"solid 1px",borderColor:"rgb(229,231,235)"}}>
                                    <option value={majorshow}>{majorshow}</option>
                                    <option value={'s'+majorshow}>s{majorshow}</option>

                                </select>
                                </div>
                                
                                <input onKeyDown={prevententersend} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="ชั้นปี" type="number" name="" ref={tempyearcoderef} id="year" maxLength={2} min={1} max={10} pattern="\d{1,1}" required />
                                <button type="submit" className="w-1/6 flex justify-center items-center text-green-500 cursor-pointer hover:text-green-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                    </svg>

                                </button>
                                </div>
                            </div>:''}

                        </form>
                    </div>
                </div>

                {/* {JSON.stringify(())} */}

            </div>

            <Header />
            <LinkPage />

        </>
    )

}

export default ManageCurrentCap