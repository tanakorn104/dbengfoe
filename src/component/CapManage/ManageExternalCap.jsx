
import Header from "../Header"
import LinkPage from "../LinkPage"
import { json, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import LoadingObj from "../../assets/LoadingObj";
import api from "../tool/AxiosInstance";
function ManageExternalCap(){
    const location = useLocation();
    const { datalocation } = location.state || 'none';
    const [loadingpage, setLoadingpage] = useState(false);
    const [donthavedata,setdonthavedata] = useState(true);
    const navigate = useNavigate();
    const tempstdcoderef = useRef(null);
    const temptitleref = useRef(null);
    const tempnamecoderef = useRef(null);
    const templastnamecoderef = useRef(null);
    const tempmajorcoderef = useRef(null);
    const tempyearcoderef = useRef(null);
    const [forrerendercom, setforrerendercom] = useState(0);//refresh เมื่อกดปุ่มลบ
    const [dataexternalsumtotalnpayed, setdataexternalsumtotalnpayed]= useState({
         sumexternalcap : 0,
         totalexternalcap : 0,
         sumnpaydexternalcap : 0,

    })


    const [alreating, setalearting] = useState({
        status:false,
        type:'',
        message:'',
    });//refresh เมื่อกดปุ่มลบ
    const [someerror,setsomeerror]=useState(null)
    const [majorshow,setMajorshow] = useState('overviewexternalcap');
    const [datatoadd,setdatatoadd] = useState({
        fiscalyear:null,
        typecap:null,
    doccode:null,
    title:null,
    amount:null,
    total:null,
    npayed:null
    })
    const [maindatastate, setmaindatastate] = useState({
        dataresdata: {
           
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
    const handleinsertSubmit = async(event) => {
        event.preventDefault(); // ป้องกันการรีเฟรชหน้า
        setalearting({
            status:true,
            message:'กำลังเพิ่มข้อมูล',
            type:'working'
        })
        // เก็บข้อมูลฟอร์มใน state
        // console.log(datatoadd);
        sessionStorage.setItem('statusInsertOrUpdateData','insert');
        const requestData = {
            type:"insertexternaltcap",//sessionStorage.getItem('statusInsertOrUpdateData')
            data:datatoadd,
            token: sessionStorage.getItem('acctoken')
        };
        // console.log((requestData));
        await api.post("/",JSON.stringify(requestData),{
                headers:{
                    'Content-Type':'application/json'
                }
            }
        )
        .then(response => {
            if(response.data.type == 'success'){
                
                setmaindatastate((predata)=>({
                    ...predata,
                    dataresdata:{
                        ...predata.dataresdata,
                        [datatoadd.title]:datatoadd
                    }
                }))
                // let amount = 0;
                //     let total = 0;
                //     let npayed = 0
                //     Object.values({...maindatastate.dataresdata,[datatoadd.title]:datatoadd}).map((obj)=>{
                //         console.log('>>>>',obj.amount)

                //         amount+= (obj.amount)
                //         total+=(obj.total)
                //         npayed+=(obj.npayed)
                //     })
                //     console.log(amount)
                //     console.log(total)
                //     console.log(npayed)

                if(donthavedata){
                    setdonthavedata(!donthavedata);
                }
                setdatatoadd({
                    fiscalyear:'',
                    typecap:'',
                doccode:'',
                title:'',
                amount:'',
                total:'',
                npayed:''
                });
                setalearting({
                    status:true,
                    message:response.data.message,
                    type:response.data.type,
                })
                setTimeout(() => {
                    setalearting({
                        status:false,
                        
                    })
                }, 3000);
            }
            
        })
        .then(()=>{
            
        })
        .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด
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


    function filterByKey(data, key) {
        if(key=='overviewexternalcap'){
           return Object.values(data)
        }   
        // console.log(">>>",data);
        // console.log(major)
        return Object.values(data).filter(function (item) {
            // console.log(">>>",item.major === major);
            return item[key] === key;
        });
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
    
        setdatatoadd((predata)=>({
            ...predata,
            fiscalyear: datalocation.fiscalyear,
            typecap:datalocation.type  ,
            npayed:0


        }))
        const requestData = {
            type: "getallexternalcap",
            data: {
                fiscalyear: datalocation.fiscalyear,
                typecap:datalocation.type,
            },

        };
        const getallmaincapdata = api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials:true
        }
        )
        Promise.all([getallmaincapdata]).then((result) => {
            // console.log(">>>",(result[0].data.data))
            // console.log("....",result[0].data.message)
            if(result[0].data.type=='success'){
                if(result[0].data.data){
                    setdonthavedata(false)
                    let justobj={};
        
                    result[0].data.data.map((list)=>{
                        // console.log(convertlisttoObj(result[0].data.headtable,list));
                        justobj[list[3]]= convertlisttoObj(result[0].data.headtable,list)
                    })
                    // console.log((Object.values(justobj)))
                    // let amount = 0;
                    // let total = 0;
                    // let npayed = 0
                    // Object.values(justobj).map((obj)=>{
                    //     // console.log(obj.amount)

                    //     amount+= (obj.amount)
                    //     total+=(obj.total)
                    //     npayed+=(obj.npayed)
                    // })
                    // setdataexternalsumtotalnpayed({
                    //     sumexternalcap :amount,
                    //     totalexternalcap :total,
                    //     sumnpaydexternalcap :npayed,

                    // })
                    setmaindatastate((predata) => ({
                        ...predata,
                        dataresdata: Object.values(justobj),
                        dataoverviewresdata:datalocation
                    }))

    
                }else{
                    setmaindatastate((predata) => ({
                        ...predata,
                        dataoverviewresdata:datalocation
                    }))
                    setdonthavedata(true)
                }
            }else{
                // if(result[0].data.message!="ต้องมีจำนวนแถวในช่วงอย่างน้อย 1 แถว"){
                //     setsomeerror(result[0].data.message);
                // }
                setLoadingpage(false);
                
            }


        }).then(() => {
            setLoadingpage(false);
        }).catch((err) => {
            setLoadingpage(false);
            console.error(">>>>>",err);
        })
        setmaindatastate((predata) => ({
            ...predata,
            dataoverviewresdata:datalocation
        }))
        // setdonthavedata(true)
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
                {/* <LinkPage /> */}
                <LoadingObj/>
            </>
        )
    }
    if (someerror) {
        return (
            <>
                <Header />
                {/* <LinkPage /> */}
                <p className='w-full h-full flex justify-center items-center'>{someerror}</p>
            </>
        )
    }
    // if (donthavedata) {
    //     return (
    //         <>
    //             <Header />
                // <LinkPage />
    //             <p className='w-full h-full flex justify-center items-center'>ยังไม่มีข้อมูลใดๆ</p>
    //         </>
    //     )
    // }

    return(
        <>
        <Header/>
        <LinkPage/>
        {alreating.status||someerror?<div className={`flex h-8 justify-center items-center w-full fixed inset-0 top-28 text-white transition-all duration-500 ease-out transform ${alreating.type=='success'?'bg-green-500':alreating.type=='working'?'bg-blue-500':'bg-red-500'}  ${alreating.status?'opacity-100 translate-y-0':'opacity-0 translate-y-5'}`}>{alreating.message}</div>:""}
        <div className="w-full flex flex-col justify-center items-center pt-6">

                <div className="w-5/6    mt-4 flex flex-row justify-between">
                    <p className="w-1/2 text-start text-xl flex items-end justify-start truncate">{maindatastate.dataoverviewresdata.typecap}  ปีงบประมาณ {maindatastate.dataoverviewresdata.fiscalyear}</p>
                    <p className="w-1/2 text-end   font-light flex items-end justify-end truncate">ณ วันที่{formattedDate}</p>
                </div>
                <div className="w-5/6 flex flex-row justify-between">
                    <p className="font-light truncate">เบิกแล้ว {dataexternalsumtotalnpayed.sumnpaydexternalcap} ครั้ง </p>
                    <p className="font-light truncate">รวม {numberWithCommas(dataexternalsumtotalnpayed.sumexternalcap)} บาท คงเหลือ {numberWithCommas(dataexternalsumtotalnpayed.totalexternalcap)} บาท</p>
                </div>
                <div className="w-5/6">
                    <div className="card w-full ">
                        <div className="flex flex-row justify-between bg-gray-200 px-3">
                            <p className="">ภาควิชา 
                                <span>
                                    <select onChange={(e)=>(setMajorshow(e.target.value))} value={majorshow} name="" id="" className=" border-none bg-gray-200 focus:outline-none focus:border-none focus:ring-0  font-light truncate">
                                        {maindatastate.dataoverviewresdata.typecap=="ทุนภายนอก"?
                                        <option value="overviewexternalcap">ภาพรวมทุน</option>:""}
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
                            <p className=" flex items-center">ได้รับ {Object.keys(maindatastate.dataresdata).length} ทุน </p>
                        </div>
                        {/* <p>รายชื่อปัจจุบัน</p> */}
                        <form autoComplete="off" onSubmit={handleinsertSubmit}>
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
                                    {donthavedata==false&&majorshow!="overviewexternalcap"?filterByKey(Object.values(maindatastate.dataresdata), majorshow).map((obj, index) => {
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
                                                    <a onClick={()=>{navigate("/withdrawcapital",{state:{datalocation:datalocation,datacap:obj}})}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
</svg>

                                                    </a>

                                                </span>
                                                
                                            </div>
                                            
                                        )
                                    }):<p className="w-full flex justify-center items-center">ยังไม่มีข้อมูลใดๆ</p>}



                                </tbody>

                            </table>
                            
                            {(majorshow=="overviewexternalcap")?<div className="w-full flex flex-row h-10 border-b">
                                <div className="w-full flex flex-row bg-green-50">                                {/* <input onKeyDown={prevententersend} className=" w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0 " placeholder="คำนำหน้า" type="text" ref={temptitleref} name="title" id="" maxLength={10} required /> */}
                                <input onKeyDown={prevententersend} value={datatoadd.doccode} onChange={(e)=>{setdatatoadd((predata)=>({...predata,doccode:e.target.value}))}} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="รหัสรับเงิน" type="number" name="" ref={tempyearcoderef} id="year" required />
                    
                                <input onKeyDown={prevententersend} value={datatoadd.title} onChange={(e)=>{setdatatoadd((predata)=>({...predata,title:e.target.value}))}} className="bg-green-50 w-4/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-center p-0" placeholder="ชื่อทุน" type="text" ref={tempnamecoderef} name="name" id="" required />
                                <input onKeyDown={prevententersend} value={datatoadd.amount} onChange={(e)=>{setdatatoadd((predata)=>({...predata,amount:e.target.value,total:e.target.value}));}} className="bg-green-50 w-1/6 border-none    focus:outline-none focus:border-none focus:ring-0 text-end p-0" placeholder="จำนวนเงิน" type="number" name="" ref={tempyearcoderef} id="year" step={0.01}  min={1}  required />
                                <button type="submit" className="w-1/6 flex justify-center items-center text-green-500 cursor-pointer hover:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>


                                </button>
                                </div>
                            </div>:''}

                        </form>
                    </div>
                </div>

                {/* {JSON.stringify(())} */}

            </div>
        
        </>
    )


}


export default ManageExternalCap





