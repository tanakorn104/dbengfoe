
import Header from "../Header"
import LinkPage from "../LinkPage"
import { json, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import { data } from "autoprefixer";
import LoadingObj from "../../assets/LoadingObj";
import api from "../tool/AxiosInstance";
import SendingObj from "../../assets/SendingObj";
import Aleart from "../Aleart";
function WithdrawCapital() {
    const location = useLocation();
    const { datalocation } = location.state || 'none';
    const [loadingpage, setLoadingpage] = useState(false);
    const [sendingpage, setSendingpage] = useState(false);
    const [donthavedata, setdonthavedata] = useState(true);
    const navigate = useNavigate();
    const [alreatingdata,setalreatingdata] = useState(null)
    const [datastdtopayment, setdatatoadd] = useState({
            headdata:{

            },
            stddata:{

            }
    })
    const [maindatastate, setmaindatastate] = useState({
        dataresdata: {

        },
        dataoverviewresdata: {
            fiscalyear: null,
            type: null
        },
        termpayment:null,
        monthpayment:null
    })
    
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
    

    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        return formattedNumber;
    };

    const handleadddata = (formdata) => {
        formdata.preventDefault();
        let confirm = window.confirm("คุณแน่ใจที่จะกดเบิก")
        if(!confirm){
            return;
        }
        
        const dataupdate = { ...maindatastate.dataresdata };
        if(!maindatastate.monthpayment||!maindatastate.termpayment){
            alert("กรุณาเลือกเดือนหรือภาคการศึกษาที่จะทำการเบิก")
            return;
        }
        setSendingpage(true)
       const requestData = {
            type: "insertpaymentlog",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {
                // fiscalyear: datalocation[0],
                // type: datalocation[1],
                // organiz: datalocation[2],
                primarykey:['fiscalyear','typecap','stdcode','month',],
                data:Object.values(maindatastate.dataresdata).map(item=>{return {...item,term:maindatastate.termpayment,month:maindatastate.monthpayment,amount:maindatastate.dataoverviewresdata.amount,dateinput:formattedDate}}),
                detail:{fiscalyear:maindatastate.dataoverviewresdata.fiscalyear,typecap:maindatastate.dataoverviewresdata.typecap}
            },

        };
        // console.log((requestData));
        const insertpamentlog = api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials:true
        }
        )
        Promise.all([insertpamentlog]).then((res)=>{
            console.log(res[0].data.type)
            setalreatingdata({data:res[0].data,key:uuidv4()})
            setSendingpage(false)
        }).catch((e)=>{
            console.log(e)
        })

    }
    //primarykey:['email']
    //   ,data:[
    //     {email:'ssdcosdm@gmail.com',rank:'test',refreshtoken:'wefkwopjioerfnw34nnjjfnifkweof'},
    //     {email:'ssdcowefsefedm@gmail.com',rank:'test',refreshtoken:'wefkwopjioerfnw34nnjjfnifkweof'},
    //     {email:'sdcodsdregm@gmail.com',rank:'test',refreshtoken:'wefkwopjioerfnw34nnjjfnifkweof'},
    //     {email:'sdcadcovfegersdm@gmail.com',rank:'test',refreshtoken:'wefkwopjioerfnw34nnjjfnifkweof'},
    //     {email:'sdcosdmr34weerg@gmail.com',rank:'test',refreshtoken:'wefkwopjioerfnw34nnjjfnifkweof'},
    //     {email:'sdcosdwesm@gmail.com',rank:'test',refreshtoken:'wefkwopjioerfnw34nnjjfnifkweof'},
    //     {email:'ssupranee.puy@ku.th',rank:'test',refreshtoken:'wefkwopjioerfnw34nnjjfnifkweof'},
    //       ]


    useEffect(() => {
        setLoadingpage(true)
        if (!datalocation) {
            if (sessionStorage.getItem('role') != 'admin') {
                navigate("/Dashboard");
            } else {
                navigate("/manage")

            }
        }
  
        setmaindatastate((predata) => ({
            ...predata,
            dataoverviewresdata: datalocation.dataoverviewresdata,
            dataresdata: datalocation.maindata,

        }))
        setLoadingpage(false);
        setdonthavedata(false)
    }, [])


    // return(<>
    // <SendingObj/>
    // </>)

    if (loadingpage) {
        return (
            <>
                <Header />
                {/* <LinkPage /> */}
                <LoadingObj/>
            </>
        )
    }

    if (sendingpage) {
        return (
            <>
                <Header />
                {/* <LinkPage /> */}
                <SendingObj/>
            </>
        )
    }


    return (
        <>
            <Header />
            <Aleart aleartingdatastate={alreatingdata} />
            <div className="w-full flex flex-col justify-center items-center ">

                <div className="w-5/6    mt-4 flex flex-row justify-between">
                    <p className="w-1/2 text-start text-xl flex items-end justify-start truncate">เบิกจ่าย {maindatastate.dataoverviewresdata.typecap}  ปีงบประมาณ {maindatastate.dataoverviewresdata.fiscalyear}</p>
                    <p className="w-1/2 text-end   font-light flex items-end justify-end truncate">ณ วันที่{formattedDate}</p>
                </div>
                <div className="w-5/6 flex flex-row justify-between">
                </div>
                <div className="w-5/6 flex justify-center items-center ">
                    <div className="card w-full ">
                        <div className="flex flex-row h-10 justify-between bg-gray-200 px-3">
                            <p className="h-full flex justify-center items-center">รวมภาควิชา

                            </p>
                            <p className=" flex items-center">เบิก {Object.keys(maindatastate.dataresdata).length} คน </p>
                        </div>
                        <div className="w-full">
                            <div className="flex flex-row mt-2">
                                <p className="h-9 border border-gray-600 w-1/3 flex justify-center items-center">เบิกครั้งที่<span className="text-lg sm:text-xl mx-2 text-blue-500">{maindatastate.dataoverviewresdata.npayed + 1}</span> </p>
                                <p className="h-9 border border-gray-600 w-1/3 flex justify-center items-center">จำนวน <span className="text-lg sm:text-xl  mx-2 text-green-500">{Object.keys(maindatastate.dataresdata).length}</span> คน</p>
                                <p className="h-9 border border-gray-600 w-1/3 flex justify-center items-center"><span className="text-lg sm:text-xl  mx-2 text-red-500">{numberWithCommas(maindatastate.dataoverviewresdata.amount * Object.keys(maindatastate.dataresdata).length)}</span> บาท</p>
                            </div>
                            <input required type="month" name="montht"  onChange={(event)=>{setmaindatastate(predata=>({...predata,monthpayment:event.target.value}))}} id="" className="w-full mt-2" />
                            <select required onChange={(event)=>{setmaindatastate(predata=>({...predata,termpayment:event.target.value}))}} name="term" id=" " className="w-full mt-1">
                                <option value="" selected disabled>กรุณาเลือกภาคการศึกษา</option>
                                <option value="ภาคต้น">ภาคต้น</option>
                                <option value="ภาคปลาย">ภาคปลาย</option>
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

                                        </div>

                                    )
                                }) : <p className="w-full flex justify-center items-center">ยังไม่มีข้อมูลใดๆ</p>}

                            </div>
                            {JSON.stringify()}
                            <div className="w-full  flex justify-center items-center mt-5">
                                <a onClick={()=>navigate(-1)} className="bg-red-500 w-5/6 flex justify-center hover:bg-white cursor-pointer transition-colors duration-300 text-white hover:text-black h-8 items-center">ยกเลิก</a>
                                <a onClick={handleadddata} className="bg-green-500 w-5/6 flex justify-center hover:bg-white cursor-pointer transition-colors duration-300 text-white hover:text-black h-8 items-center">ยืนยัน</a>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )


}


export default WithdrawCapital