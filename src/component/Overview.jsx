import Header from "./Header"
import LinkPage from "./LinkPage"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { root_url } from "./config/config";
function Overview() {
    const location = useLocation();
    const { datalocation } = location.state || {};
    const [loadingpage, setLoadingpage] = useState(true);
    const navigate = useNavigate();
    const [headtableresdata, setHeadtableresdata] = useState([]);
    const [dataresdata, setDataresdata] = useState([]);


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
    useEffect(() => {
        if(sessionStorage.getItem('role')!='admin'){
            navigate("/Dashboard");
        }
        const getalldata = () => {
            setLoadingpage(true);
            // เก็บข้อมูลฟอร์มใน state
            // sessionStorage.setItem('statusInsertOrUpdateData','insert');
            const requestData = {
                type: "getoverviewbyyear",//sessionStorage.getItem('statusInsertOrUpdateData')
                data: {
                    fiscalyear: datalocation,
                },
                token: sessionStorage.getItem('acctoken')

            };
            // console.log((requestData));
            axios.post(root_url, JSON.stringify(requestData), {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            )
                .then(response => { setHeadtableresdata(response.data.headtable); setDataresdata(response.data.data); setLoadingpage(false) })
                .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด

            console.log('Form submitted with data:',);
        };
        if (datalocation == null) {
            navigate(-1);
        } else {
            getalldata()

        }
    }, [])

    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH',{
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        });
        return formattedNumber

    }
    const handleMorebtn = (list)=>{
        navigate("/manageproject",{state:{datalocation:list}});
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

    if(dataresdata==null){
        return (
            <>
                <Header />
                <LinkPage />
                <p className="w-full flex justify-center ">ข้อมูลองค์กรเกิดข้อมูลพลาด ขออภัย</p>
                <a onClick={()=>{navigate(-1)}} className="w-full flex justify-center text-red-500 cursor-pointer hover:text-red-300">กลับ</a>
            </>
        )
    }
    return (
        <>
            <Header />
            <LinkPage />
            {/* <p>{headtableresdata}</p> */}
            {/* <p>{dataresdata}</p> */}
            <div className="w-full flex flex-row justify-center">
                <div className="w-5/6 flex flex-row justify-around">
                <div className="w-1/2  "><a onClick={()=>{navigate("/managecapital",{state:{datalocation:{fiscalyear:dataresdata[0][0]}}})}} className="border-b felx felx-row items-center justify-start cursor-pointer text-start  font-light hover:text-gray-500 text-green-500">จัดการทุนการศึกษา</a></div>
                <a className="w-1/2 felx felx-row items-center justify-end cursor-pointer text-end font-light hover:text-gray-500 " onClick={handleExport}>Download as PDF</a>
                </div>
            </div>
            <div className="w-full flex flex-col justify-center items-center" ref={contentRef} id="content-to-export">
                <div className="w-5/6 flex flex-row justify-around mt-7">
                    <p className="w-full text-start text-2xl  flex items-end">ข้อมูลประจำปีงบประมาณ {dataresdata[0][0]}</p>
                    
                    <p className="w-full text-end font-light  flex justify-end items-center" >ณ วันที่ {formattedDate}</p>

                </div>
                <p className="text-start w-5/6 font-bold my-5">งบพัฒนานิสิต</p>
                <table className="w-5/6  bg-blue-200 flex flex-col">
                    <thead >
                        <tr className="w-full h-10  bg-gray-200 flex flex-row justify-between">
                            <th className="w-1/2 font-normal   text-start pl-6 flex flex-row  items-center">หน่วยงาน</th>
                            <div className="w-1/2  flex flex-row justify-end items-center">
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">ยอดเต็ม</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">เงินผูกพัน</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">คงเหลือจริง</th>
                                {/* <th className="font-normal w-1/3 mr-3  text-end pl-6">เพิ่มเติม</th> */}
                            </div>
                        </tr>
                    </thead>
                    <tbody>
                        {dataresdata.map((items, index) => {
                            if (items[1] == 'งบพัฒนานิสิต') {
                                return (
                                    // <tr key={uuidv4()} className="w-full h-10  bg-white border-b">
                                    //     <th className="font-normal w-1/4 text-start pl-6">{items[2]}</th>
                                    //     <th className="font-normal w-1/4 text-start pl-6">{items[3]}</th>
                                    //     <th className="font-normal w-1/4 text-start pl-6">{items[4]}</th>
                                    //     <th className="font-normal w-1/4 text-start pl-6">more</th>
                                    // </tr>
                                    <tr  key={uuidv4()} className="w-full h-10  flex flex-row justify-between bg-white border-b">
                                    <a onClick={()=>{handleMorebtn([items[0],items[1],items[2]])}} className="w-1/2 font-light   text-start pl-10 flex flex-row  items-center cursor-pointer hover:text-gray-400">{items[2]}</a>
                                    <div className="w-1/2  flex flex-row justify-end items-center">
                                        <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[3])}</td>
                                        <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[5])}</td>
                                        <td className="font-light w-1/3 mr-2  text-end pl-6">{numberWithCommas(items[4])}</td>
                                        {/* <a  className="font-light w-1/3 mr-3  text-end pl-6 cursor-pointer">more</a> */}
                                    </div>
                                </tr>
                                )
                            }
                        })}

                    </tbody>
                    
                    <thead >
                        <tr className="w-full h-10  bg-gray-200 flex flex-row justify-between">
                            <th className="w-1/2 font-normal   text-start pl-6 flex flex-row  items-center">ภาควิชา</th>
                            <div className="w-1/2  flex flex-row justify-end items-center">
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">ยอดเต็ม</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">เงินผูกพัน</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">คงเหลือ</th>
                                {/* <th className="font-normal w-1/3 mr-3  text-end pl-6">เพิ่มเติม</th> */}
                            </div>
                        </tr>
                    </thead>
                    <tbody>
                    {dataresdata.map((items, index) => {
                            if (items[1] == 'งบพัฒนานิสิตภาค') {
                                return (
                                    <tr  key={uuidv4()} className="w-full h-10  flex flex-row justify-between bg-white border-b">
                                    <a onClick={()=>{handleMorebtn([items[0],items[1],items[2]])}} className="w-1/2 font-light   text-start pl-10 flex flex-row  items-center cursor-pointer hover:text-gray-400">{items[2]}</a>
                                    <div className="w-1/2  flex flex-row justify-end items-center">
                                    <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[3])}</td>
                                        <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[5])}</td>
                                        <td className="font-light w-1/3 mr-2  text-end pl-6">{numberWithCommas(items[4])}</td>
                                        {/* <td className="font-light w-1/3 mr-3  text-end pl-6">more</td> */}
                                    </div>
                                </tr>
                                )
                            }
                        })}
                    </tbody>

                </table>
                <p className="text-start w-5/6 font-bold my-5">เงินรายได้ภาค</p>
                <table className="w-5/6  bg-blue-200 flex flex-col">
                <thead >
                        <tr className="w-full h-10  bg-gray-200 flex flex-row justify-between">
                            <th className="w-1/2 font-normal   text-start pl-6 flex flex-row  items-center">ภาควิชา</th>
                            <div className="w-1/2  flex flex-row justify-end items-center">
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">ยอดเต็ม</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">เงินผูกพัน</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">คงเหลือ</th>
                                {/* <th className="font-normal w-1/3 mr-3  text-end pl-6">เพิ่มเติม</th> */}
                            </div>
                        </tr>
                    </thead>
                    <tbody>
                        {dataresdata.map((items, index) => {
                            if (items[1] == 'รายได้ภาควิชา') {
                                return (
                                    <tr  key={uuidv4()} className="w-full h-10  flex flex-row justify-between bg-white border-b">
                                    <a onClick={()=>{handleMorebtn([items[0],items[1],items[2]])}} className="w-1/2 font-light   text-start pl-10 flex flex-row  items-center cursor-pointer hover:text-gray-400">{items[2]}</a>
                                    <div className="w-1/2  flex flex-row justify-end items-center">
                                    <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[3])}</td>
                                        <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[5])}</td>
                                        <td className="font-light w-1/3 mr-2  text-end pl-6">{numberWithCommas(items[4])}</td>
                                        {/* <td className="font-light w-1/3 mr-3  text-end pl-6">more</td> */}
                                    </div>
                                </tr>
                                )
                            }
                        })}
                    </tbody>

                </table>
                <p className="text-start w-5/6 font-bold my-5">เงินรายได้ภาคพิเศษ</p>
                <table className="w-5/6  bg-blue-200 flex flex-col">
                    <thead>
                    <tr className="w-full h-10  bg-gray-200 flex flex-row justify-between">
                            <th className="w-1/2 font-normal   text-start pl-6 flex flex-row  items-center">ภาควิชา</th>
                            <div className="w-1/2  flex flex-row justify-end items-center">
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">ยอดเต็ม</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">เงินผูกพัน</th>
                                <th className="font-normal w-1/3 mr-3  text-end pl-6">คงเหลือ</th>
                                {/* <th className="font-normal w-1/3 mr-3  text-end pl-6">เพิ่มเติม</th> */}
                            </div>
                        </tr>
                    </thead>
                    <tbody>
                        {dataresdata.map((items, index) => {
                            if (items[1] == 'รายได้ภาควิชา (พิเศษ)') {
                                return (
                                    <tr  key={uuidv4()} className="w-full h-10  flex flex-row justify-between bg-white border-b">
                                    <a onClick={()=>{handleMorebtn([items[0],items[1],items[2]])}} className="w-1/2 font-light   text-start pl-10 flex flex-row  items-center cursor-pointer hover:text-gray-400">{items[2]}</a>
                                    <div className="w-1/2  flex flex-row justify-end items-center">
                                    <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[3])}</td>
                                        <td  className="font-light w-1/3 mr-2  text-end pl-6 ">{numberWithCommas(items[5])}</td>
                                        <td className="font-light w-1/3 mr-2  text-end pl-6">{numberWithCommas(items[4])}</td>
                                        {/* <td className="font-light w-1/3 mr-3  text-end pl-6">more</td> */}
                                    </div>
                                </tr>
                                )
                            }
                        })}
                    </tbody>


                </table>

            </div>







            {/*             
            <div className="flex flex-col  justify-center items-center ">
                <div className="flex flex-col  w-5/6  justify-center items-center ">
                    <p className="font-bold w-full mb-4">งบพัฒนานิสิต</p>
                    <div className=" flex flex-row w-full border-t justify-center items-center">
                        <div className="w-1/4 ">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">หน่วยงาน</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">งานกิจการนิสิต</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">งานบริหารการศึกษา</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">งานวิเทศน์</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">สโมสรนิสิต</p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b  h-10 w-full pl-6 flex items-center bg-gray-200">ยอดเต็ม</p>
                            <p className="border-b  h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b  h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b  h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b  h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">คงเหลือ</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">รายละเอียด</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                    </div>
                    <div className=" flex flex-row w-full border-t justify-center items-center">
                        <div className="w-1/4 ">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">ภาควิชา</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมเกษตร</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมชลประทาน</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมการอาหาร</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมโยธา</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมเครื่องกล</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมคอมพิวเตอร์</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมอุตสาหการ</p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b  h-10 w-full pl-6 flex items-center bg-gray-200">ยอดเต็ม</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">คงเหลือ</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">รายละเอียด</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                    </div>

                    <p className="font-bold w-full my-4">เงินรายได้ภาค</p>
                    <div className=" flex flex-row w-full border-t justify-center items-center">
                        <div className="w-1/4 ">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">ภาควิชา</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมเกษตร</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมชลประทาน</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมการอาหาร</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมโยธา</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมเครื่องกล</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมคอมพิวเตอร์</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมอุตสาหการ</p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b  h-10 w-full pl-6 flex items-center bg-gray-200">ยอดเต็ม</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">คงเหลือ</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">รายละเอียด</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                    </div>
                    <p className="font-bold w-full my-4">เงินรายได้ภาคพิเศษ</p>
                    <div className=" flex flex-row w-full border-t justify-center items-center">
                        <div className="w-1/4 ">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">ภาควิชา</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมเกษตร (พิเศษ)</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมโยธา (พิเศษ)</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center">วิศวกรรมเครื่องกล (พิเศษ)</p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b  h-10 w-full pl-6 flex items-center bg-gray-200">ยอดเต็ม</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">คงเหลือ</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                        <div className="w-1/4">
                            <p className="border-b h-10 w-full pl-6 flex items-center bg-gray-200">รายละเอียด</p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                            <p className="border-b h-10 w-full pl-6 flex items-center"></p>
                        </div>
                    </div>
                </div>
            </div> */}


        </>

    )
}


export default Overview