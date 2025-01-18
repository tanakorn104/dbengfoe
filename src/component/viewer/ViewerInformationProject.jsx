import Header from "../Header"
import LinkPage from "../LinkPage"
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import Calendar from 'react-calendar';
import "react-multi-date-picker/styles/colors/teal.css"
import 'react-calendar/dist/Calendar.css';
import api from "../tool/AxiosInstance";
function ViewerInformationPorject() {
    const location = useLocation();
    const { datalocation } = location.state || {};
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState(
        {
            fiscalyear: null,
            type: null,
            organiz: null,
            title: null,
            projectvalue: null,
            actused:null,
            total:null,
            eventdate:null,
            comdocdate:null,
            status: null
            
        }

     


    );
    useEffect(()=>{
       if(!datalocation){
        navigate("/Dashboard");
       }
        setFormData( {
            fiscalyear: datalocation.fiscalyear,
            type: datalocation.type,
            organiz: datalocation.organiz,
            title: datalocation.title,
            softskilltype: datalocation.softskilltype,
            projectvalue: datalocation.projectvalue,
            actused:datalocation.actused,
            total:datalocation.total,
            eventdate:datalocation.eventdate,
            comdocdate:datalocation.comdocdate,
            status: "done"
        })
       
        // if (datalocation == 'none'||datalocation == undefined ||datalocation ==null || Object.values(dataset).includes(null)) {
        //     navigate("/dashboard");
            
        // }else{
        //     setFormData(dataset)
        // }

    },[])
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
    const timestmptostrdate = (timestmp) => {
        const date = new Date(timestmp);
        if (timestmp == null) {
            return 'ไม่มีข้อมูล'
        }
        const formatdadte = date.toLocaleDateString();
        return formatdadte;
    }
    const handleDateChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: timestmptostrdate(value),
        }));
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
    const handleNumberChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: Number(value),
        }));
    }
    function confirmAction() {
            navigate(-1,{replace:true});
    }

    const [Datepicker, setDatepicker] = useState([1726358400000, 1726963200000, 1727481600000]);
    const numberWithCommas = (number) => {
        if (number == null) {
            return 'ไม่มีข้อมูล'
        }
        const formattedNumber = number.toLocaleString('th-TH',{
            minimumFractionDigits:2,
            maximumFractionDigits:2,
        });

        return formattedNumber;
    };
    return (
        <>
            <Header />
            {/* {sessionStorage.getItem('role') == 'admin' ? <LinkPage /> : ''} */}
            <div className="w-full flex flex-col justify-center items-center p-10 ">
                <form className="flex flex-col justify-between p-10 max-w-screen-lg w-full  items-center border rounded-2xl border-green-500">
                    <div className="w-full flex flex-col md:flex-row justify-center items-center mb-5">
                        <p className="w-full md:w-1/3 h-12 flex justify-center md:justify-start  items-center  text-xl">โครงการ {formData.fiscalyear} </p>
                        <div className="flex flex-row md:flex-col w-full text-sm md:text-base md:w-2/3 justify-center items-end">
                            <p className="w-1/2 h-6 flex justify-end  items-center  md:font-normal">{formData.type}</p>
                            <p className="w-1/2 h-6 flex justify-end  items-center font-normal md:font-light">{formData.organiz}</p>
                        </div>
                    </div>
                    <div className="border-b flex  flex-col md:flex-row w-full items-center justify-between">
                        <div className="w-1/4 hidden md:block">
                            <p className="w-full h-12 flex justify-start truncate items-center ">ชื่อ</p>
                        </div>
                        <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-lg ml-5 truncate" >{formData.title}</p>
                    </div>


                    <div className="py-3 border-b flex flex-col md:flex-row w-full items-center  md:justify-between">
                        <p className="w-full md:w-1/4 h-12 flex justify-start font-light md:font-normal items-center ">วันที่จัดกิจกรรม</p>
                        <div className="w-full flex flex-col justify-center items-center  md:items-end ">
                            {(formData.eventdate != null && formData.eventdate != '') ? JSON.parse(formData.eventdate).map((timestamp, index) => {
                                return (
                                    <div key={uuidv4()}>
                                        <p className="text-lg">{(timestamp)}</p>
                                        <p className="mx-3"></p>
                                    </div>
                                )
                            }) : <p>ไม่มีข้อมูล</p>}
                        </div>
                    </div>

                    <div className="border-b flex flex-col md:flex-row w-full items-center justify-between">
                        <p className="w-full md:w-1/4 md:font-normal font-light h-12 flex justify-start  items-center ">วันที่ส่งเอกสาร</p>
                        <p name="title" className="  h-12 rounded-xl border-gray-600 flex items-center md:text-lg ml-5 " >{timestmptostrdate(formData.comdocdate)}</p>
                    </div>


                    <div className="border-b flex flex-col md:flex-row w-full items-center justify-between">
                        <p className="w-full md:w-1/4 md:font-normal font-light h-12 flex justify-start  items-center ">งบประมาณขั้นต้น</p>
                        <p name="title" className="  h-12 rounded-xl border-gray-600 flex items-center md:text-lg ml-5 " >{numberWithCommas(formData.projectvalue)}</p>
                    </div>

                    <div className="border-b flex flex-col md:flex-row w-full items-center justify-between">
                        <p className="w-full md:w-1/4 md:font-normal font-light h-12 flex justify-start  items-center ">งบประมาณที่ใช้จริง</p>
                        <p name="title" className="  h-12 rounded-xl border-gray-600 flex items-center md:text-lg ml-5 " >{numberWithCommas(formData.actused)}</p>
                    </div>

                    
                    <div className="border-b flex flex-col md:flex-row w-full items-center justify-between">
                        <p className="w-full md:w-1/4 md:font-normal font-light h-12 flex justify-start  items-center ">คงเหลือ</p>
                        <p name="title" className="  h-12 rounded-xl border-gray-600 flex items-center md:text-lg ml-5 text-red-700 " >{numberWithCommas(formData.total)}</p>
                    </div>

                    {/* <input  type="date"  name="fiscalyear" className="w-full h-12 rounded-xl border-gray-600 " placeholder="หากมีหลายวันให้คั่นด้วย ' , ' เช่น 10/10/2567,12/10/2567"   required /> */}
                    {/* <div className="w-full ">
                        <DatePicker
                            multiple
                            value={Datepicker}
                            onChange={handleDateChange}

                            style={{
                                width: "100%",
                                boxSizing: "border-box",
                                height: "3rem",
                                borderRadius: '0.75rem',
                                border: "solid 1px gray"
                            }}
                            containerStyle={{
                                width: "100%"
                            }}
                        />
                    </div> */}

                    <a onClick={confirmAction} className="cursor-pointer flex justify-center items-center w-full h-12 rounded-xl border mt-5 bg-blue-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">กลับ</a>

                </form>
            </div>

            </>
            )

}


            export default ViewerInformationPorject