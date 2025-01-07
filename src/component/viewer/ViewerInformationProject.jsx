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
import { root_url } from "../config/config";
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
    const timestmptostrdate = (timestmp) => {
        const date = new Date(timestmp);
        if (timestmp == null) {
            return 'ไม่มีข้อมูล'
        }
        const formatdadte = date.toLocaleDateString();
        return formatdadte;
    }
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
            <LinkPage />
            <div className="w-full flex flex-col justify-center items-center p-10 ">
                <form   className="flex flex-col justify-between p-10 max-w-screen-lg w-full  items-center border rounded-2xl border-green-500">
                    <div className="w-full flex flex-row justify-center items-center mb-5">
                        <p className="w-1/3 h-12 flex justify-start  items-center  text-xl">โครงการ {formData.fiscalyear} </p>
                        <div className="flex flex-col w-2/3 justify-center items-end">
                            <p className="w-1/2 h-6 flex justify-end  items-center  font-normal">{formData.type}</p>
                            <p className="w-1/2 h-6 flex justify-end  items-center  font-light">{formData.organiz}</p>
                        </div>
                    </div>
                   <div className="border-b flex flex-fow w-full items-center justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-center ">ชื่อ</p>
                   <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-lg ml-5 truncate" >{formData.title}</p>
                   </div>
                   <div className="border-b flex flex-fow w-full items-center justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-center ">ซอฟต์สกิล</p>
                   <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-base ml-5 truncate" >{formData.softskilltype}</p>
                   </div>

                   
                   <div className="mt-5 border-b flex flex-row w-full items-start  justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-start ">วันที่จัดกิจกรรม</p>
                    <div className="flex flex-col ">
                    {(formData.eventdate!=null&&formData.eventdate!='')?JSON.parse(formData.eventdate).map((timestamp,index)=>{
                        return (
                            <div key={uuidv4()}>
                            <p className="text-lg">{timestmptostrdate(timestamp)}</p>
                            <p className="mx-3"></p>
                            </div>
                        )
                    }):<p>ไม่มีข้อมูล</p>}
                    </div>
                   </div>
                   <div className="border-b flex flex-fow w-full items-center justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-center ">วันที่ส่งเอกสาร</p>
                   <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-lg ml-5 " >{timestmptostrdate(formData.comdocdate)}</p>
                   </div>
                   <div className="border-b flex flex-fow w-full items-center justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-center ">งบประมาณขั้นต้น</p>
                   <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-lg ml-5" >{numberWithCommas(formData.projectvalue)}</p>
                   </div>
                   <div className="border-b flex flex-fow w-full items-center justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-center ">งบประมาณที่ใช้จริง</p>
                   <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-lg ml-5" >{numberWithCommas(formData.actused)}</p>
                   </div>
                   <div className="border-b flex flex-fow w-full items-center justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-center ">คงเหลือ</p>
                   <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-lg ml-5 text-red-700" >{numberWithCommas(formData.total)}</p>
                   </div>


                  

                    <a  onClick={confirmAction}  className="cursor-pointer flex justify-center items-center w-full h-12 rounded-xl border mt-5 bg-blue-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">กลับ</a>

                </form>
                </div>

            </>
            )

}


            export default ViewerInformationPorject