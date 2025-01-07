import Header from "../Header"
import LinkPage from "../LinkPage"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import { data } from "autoprefixer";
import { root_url } from "../config/config";
function ViewerProject() {
    const location = useLocation();
    const { datalocation } = location.state || '';
//    return(<></>)
    const [loadingpage, setLoadingpage] = useState(true);
    const navigate = useNavigate();
    // const [headtableresdata, setHeadtableresdata] = useState([]);
    const [maindatastate,setmaindatastate] = useState({
        dataresdata:null,
        dataoverviewresdata:null,
    })
    // const [dataresdata, setDataresdata] = useState([]);
    // const [headoverviewtableresdata, setHeadOverviewtableresdata] = useState([]);
    // const [dataoverviewresdata, setDataOverviewresdata] = useState([]);
    // const [countsuccessproject, setcountsuccessproject] = useState(0);
    // const [countwaitproject, setcountwaitproject] = useState(0);
    // const [countrunningproject, setcountrunningproject] = useState(0);
    const countsuccessproject = useRef(0);
    const countwaitproject = useRef(0);
    const countrunningproject = useRef(0);
    const [forrerenderpage, setforrerenderpage] = useState(0);


    const contentRef = useRef(); // ใช้ useRef เพื่ออ้างถึงเนื้อหาที่ต้องการแปลงเป็น PDF

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
    
    const handleExport = () => {
        // เลือก element ที่ต้องการแปลงเป็น PDF โดยใช้ ref
        const element = contentRef.current;

        // ตั้งค่าการดาวน์โหลด PDF
        const options = {
            margin: [0.5, 0.5], // ขอบหน้า (top, left, bottom, right)
            filename: 'สรุปภาพรวมปี' + datalocation + '-' + formattedDate + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true }, // เพิ่ม logging เพื่อการดีบัก
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } // ขนาด A4
        };

        // สร้างและดาวน์โหลด PDF
        html2pdf().from(element).set(options).save();
    };
    const countproject = (data) => {
        let succ = 0;
        let wait = 0;
        let running = 0;
        data.map((list, index) => {
            // console.log(list);
            if (list[9] == 'done') {
                succ += 1;
            } else if (list[9] == 'wait') {
                wait += 1;
            } else {
                running += 1;
            }
        })
        // console.log(succ);
        // console.log(wait);
        // console.log(running);
        // console.log(">"+countsuccessproject.current);
        // console.log(">>"+countrunningproject.current);
        // console.log(">>>"+countwaitproject.current);
        countsuccessproject.current=succ;
        countwaitproject.current=wait;
        countrunningproject.current=running;
        console.log(">>>>>>>>"+forrerenderpage);
        // setcountsuccessproject(succ);
        // setcountwaitproject(wait)
        // setcountrunningproject(running);

    }
    const timestmptostrdate = (timestmp) => {
        const date = new Date(timestmp);
        if (timestmp == null) {
            return 'ไม่มีข้อมูล'
        }
        const formatdadte = date.toLocaleDateString();
        return formatdadte;
    }

    const setdatedata = (data) => {
        let fulllistforpust = [];

    }
    

    useEffect(() => {

        if(!datalocation){
            navigate("/Dashboard")
        }
        // countsuccessproject.current = 0; //รีเว็ทตัวนับจำนวนโครงการ
        // countwaitproject.current = 0;
        // countrunningproject.current = 0;
        // const getalldata = () => {
            setLoadingpage(true);
            // เก็บข้อมูลฟอร์มใน state
            // sessionStorage.setItem('statusInsertOrUpdateData','insert');
            const requestData = {
                type: "getprojectbyyear",//sessionStorage.getItem('statusInsertOrUpdateData')
                data: {
                    fiscalyear: datalocation[0],
                    type: datalocation[1],
                    organiz: datalocation[2],
                },
                token: sessionStorage.getItem('acctoken')

            };
            // console.log((requestData));
            const getalldata = axios.post(root_url, JSON.stringify(requestData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
                // .then(response => { countproject(response.data.data);console.log(response.data.data) })
                // .then(response=>response.data.data)
                // .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด

            // console.log('Form submitted with data:',);
        // };
        // const getoverviewdataforeachorganiz = () => {
            // เก็บข้อมูลฟอร์มใน state
            // sessionStorage.setItem('statusInsertOrUpdateData','insert');
            const requestData2 = {
                type: "getoverviewdataforeachorganiz",//sessionStorage.getItem('statusInsertOrUpdateData')
                data: {
                    fiscalyear: datalocation[0],
                    type: datalocation[1],
                    organiz: datalocation[2],
                },
                token: sessionStorage.getItem('acctoken')

            };
            // console.log((requestData));
            const getoverviewdataforeachorganiz = axios.post(root_url, JSON.stringify(requestData2), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
                // .then(response => response.data.data)//setHeadOverviewtableresdata(response.data.headtable); setDataOverviewresdata(response.data.data); setLoadingpage(false); countproject(response.data.data)
                // .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด

            // console.log('Form submitted with data:',);
        // };
        

        if (datalocation == 'none'||datalocation == undefined ||datalocation ==null) {
            navigate(-1);
        } else {
            // getalldata()
            // getoverviewdataforeachorganiz()
            Promise.all([getalldata,getoverviewdataforeachorganiz])
            .then((resmaindata)=>{
                setmaindatastate({
                    dataresdata:resmaindata[0].data.data,
                    dataoverviewresdata:resmaindata[1].data.data,
                })
                if(resmaindata[0].data.data!=null&&resmaindata[0].data.data!={}&&resmaindata[0].data.data!=undefined){
                    countproject(resmaindata[0].data.data);

                }
                // console.log(">>>"+(JSON.stringify(resmaindata[0].data.data)));
            }).then(()=>{setLoadingpage(false)}).catch((err)=>{
                console.error('Errfetchdata',err)
            })

        }
    }, [forrerenderpage])

    // const handleMorebtn = (arr)=>{
    //     navigate("/overview",{state:{datalocation:{}}})
    // }

    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH',{
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        });

        return formattedNumber;
    };





    
    const handleinformationproject = (data)=>{
        navigate("/Dashboard-project",{state: { datalocation: data } });
        
        
    }

    if (loadingpage) {
        return (
            <>
                <Header />
                {sessionStorage.getItem('role') == 'admin' ? <LinkPage /> : ''}
                <p className='w-full h-full flex justify-center items-center'>loading</p>
            </>
        )
    }
    if (maindatastate.dataresdata == {} || maindatastate.dataresdata == null) {
        return (
            <>
                <Header />
                {sessionStorage.getItem('role') == 'admin' ? <LinkPage /> : ''}
                <p className="w-full flex justify-center">ยังไม่มีข้อมูลโครงการ</p>
                <a onClick={()=>{navigate(-1)}} className="w-full flex justify-center text-red-500 hover:text-red-300 cursor-pointer">กลับ</a>
    
            </>
        )
    }
    return (
        <>
            <Header />
            {sessionStorage.getItem('role') == 'admin' ? <LinkPage /> : ''}
            <div className="w-full flex flex-col justify-center items-center ">
                <div className="w-5/6 flex flex-row items-end justify-between mt-5 border-b pb-2">
                    <div className="flex flex-col ">
                        <p className="text-xl">ปีงบประมาณ {datalocation[0]}</p>
                        <div className="flex flex-row">
                            <p className="mr-4">ประเภท: <span className="font-light">{datalocation[1]}</span></p>
                            <p className="mr-4">องค์กร: <span className="font-light">{datalocation[2]}</span></p>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end">
                        <p className="mr-4">สำเร็จ: <span className="text-green-400 font-light ">{countsuccessproject.current}</span></p>
                        <p className="mr-4">รอ: <span className="font-light text-red-400 ">{countwaitproject.current}</span></p>
                        <p className="mr-4">กำลังดำเนินการ: <span className="font-light text-blue-400" >{countrunningproject.current}</span></p>
                        <p className="mr-4">รวม: <span className="font-light ">{countsuccessproject.current + countwaitproject.current + countrunningproject.current}</span></p>
                    </div>
                </div>
                <div className="w-5/6 h-6 flex flex-row justify-between">
                <p className="w-2/3 h-6 text-sm font-light  flex justify-start items-center truncate" >ณ วันที่ {formattedDate}</p>
                <p className="w-full h-6 text-sm font-light  flex justify-end items-center truncate" >ทั้งหมด {numberWithCommas(maindatastate.dataoverviewresdata[0][3])} บาท   คงเหลือ {numberWithCommas(maindatastate.dataoverviewresdata[0][4])} บาท</p>                    
                </div>
                <table className="w-5/6  bg-blue-200 flex flex-col">
                    <thead>
                        <tr className="w-full h-10  bg-gray-200 flex flex-row justify-between">
                            <th className="font-normal w-1/2 mr-0  text-end pl-4 flex flex-row  items-center">ชื่อโครงการ</th>
                            <div className="w-1/2  flex flex-row justify-end items-center">
                                <th className="font-normal w-1/3 mr-0  text-end pl-4 flex flex-row justify-end items-center">งบประมาณ</th>
                                <th className="font-normal w-1/3 mr-0  text-end pl-4 flex flex-row justify-end items-center">วันที่จัด</th>
                                <th className="font-normal w-1/3 mr-0  text-end pl-4 flex flex-row justify-end items-center"></th>
                            </div>
                        </tr>
                    </thead>
                    <tbody>
                        {maindatastate.dataresdata.map((list, index) => {
                            if (list[9] == 'done') {

                                return (
                                    <tr key={uuidv4()} className="w-full   flex flex-row justify-between bg-white  border-l-8 border-lime-400 ">
                                        <td className="w-1/2 min-h-10 font-light   text-start pl-6 flex flex-row  items-center border-b "><span className="truncate">{list[3]}</span></td>
                                        <div className="w-1/2  flex flex-row justify-end items-center">
                                            <td className="font-light w-1/3  h-full border-b  text-start pl-4  flex justify-end items-center truncate ">{numberWithCommas(list[5]!=null||list[5]!=''?list[5]:list[4])}</td>
                                            <td className="font-light w-1/3 min-h-10 border-b  text-start pl-4  flex justify-end items-center truncate ">
                                            <details className="w-full">
                                                <summary className=" flex cursor-pointer justify-end  w-full items-center  hover:text-gray-500">
                                                {
                                                (list[7]!=null && list[7]!=''&&list[7] !=undefined)?(
                                                   
                                                        <p>{timestmptostrdate(JSON.parse(list[7])[0])}</p>
                                                    
                                                
                                                ):(timestmptostrdate(null))
                                
                            
                                                    
                                                }
                                               </summary>
                                                
                                                {
                                                (list[7]!=null && list[7]!=''&&list[7] !=undefined)?(
                                                    JSON.parse(list[7]).slice(1).map((date,index)=>{
                                                        return <p className=" flex  justify-end  w-full items-center">{timestmptostrdate(date)}</p>
                                                    })
                                                
                                                ):''
                                
                            
                                                    
                                            }
                                            </details>
                                            </td>
                                            <div className="flex h-full flex-row justify-center w-1/3 items-center">
                                                <td className="font-light min-h-10 w-full h-full border-b  text-start pl-4 flex justify-center items-center  text-black hover:text-gray-500 cursor-pointer">
                                                <a onClick={()=>{handleinformationproject({ fiscalyear: datalocation[0], type: datalocation[1], organiz: datalocation[2], title: list[3], projectvalue: (list[4]), eventdate: list[7],actused:list[5],total:list[6],comdocdate:list[8],disbursement:list[10],softskilltype:list[11]})}}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                    </svg>       
                                                </a>                            
                                                </td>
                                              
                                            </div>
                                        </div>
                                    </tr>
                                )
                            } else if (list[9] == 'wait') {

                                return (

                                    <tr key={uuidv4()} className="w-full   flex flex-row justify-between bg-white  border-l-8 border-red-400">
                                        <td className="min-h-10 w-1/2 font-light   text-start pl-6 border-b flex flex-row   items-center "><span className="truncate">{list[3]}</span></td>
                                        <div className="w-1/2  flex flex-row justify-center items-center">
                                            <td className="font-light w-1/3 h-full  border-b  text-start pl-4 flex justify-end items-center truncate">{numberWithCommas(list[4])}</td>
                                            <td className="font-light min-h-10 w-1/3  border-b   pl-4 flex  flex-col justify-center items-center truncate">
                                            <details className="w-full ">
                                                <summary className=" flex cursor-pointer justify-end  w-full items-center  hover:text-gray-500">
                                                {
                                                (list[7]!=null && list[7]!=''&&list[7] !=undefined)?(
                                                   
                                                        <p>{timestmptostrdate(JSON.parse(list[7])[0])}</p>
                                                    
                                                
                                                ):(timestmptostrdate(null))
                                
                            
                                                    
                                                }
                                               </summary>
                                                
                                                {
                                                (list[7]!=null && list[7]!=''&&list[7] !=undefined)?(
                                                    JSON.parse(list[7]).slice(1).map((date,index)=>{
                                                        return <p className=" flex  justify-end  w-full items-center">{timestmptostrdate(date)}</p>
                                                    })
                                                
                                                ):''
                                
                            
                                                    
                                            }
                                            </details>
                                            </td>
                                            <div className=" h-full flex flex-row justify-between w-1/3 border-b ">
                                               
                                            </div>
                                        </div>
                                    </tr>
                                )
                            } else {

                                return (

                                    <tr key={uuidv4()} className="w-full  flex flex-row justify-between bg-white  border-l-8 border-blue-400">
                                        <td className="w-1/2 min-h-10 font-light   text-start pl-6 border-b flex flex-row   items-center "><span className="truncate">{list[3]}</span></td>
                                        <div className="w-1/2  flex flex-row justify-center items-center">
                                            <td className="font-light w-1/3 h-full border-b  text-start pl-4 flex justify-end items-center truncate">{numberWithCommas(list[4])}</td>
                                            <td className="font-light w-1/3 min-h-10 border-b  text-start pl-4 flex justify-end items-center truncate">
                                            <details className="w-full">
                                                <summary className=" flex cursor-pointer justify-end  w-full items-center   hover:text-gray-500">
                                                {
                                                (list[7]!=null && list[7]!=''&&list[7] !=undefined)?(
                                                   
                                                        <p>{timestmptostrdate(JSON.parse(list[7])[0])}</p>
                                                    
                                                
                                                ):(timestmptostrdate(null))
                                
                            
                                                    
                                                }
                                               </summary>
                                                
                                                {
                                                (list[7]!=null && list[7]!='' && list[7]!=undefined)?(
                                                    JSON.parse(list[7]).slice(1).map((date,index)=>{
                                                        return <p className=" flex  justify-end  w-full items-center">{timestmptostrdate(date)}</p>
                                                    })
                                                
                                                ):''
                                
                            
                                                    
                                            }
                                            </details>
                                            </td>
                                            <div className="h-full flex felx-row justify-center w-1/3 border-b ">
                                            </div>
                                        </div>
                                    </tr>
                                )

                            }

                        })}

                    </tbody>


                </table>

            </div>
        </>
    )
}




export default ViewerProject




