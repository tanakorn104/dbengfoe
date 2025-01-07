import Header from "./Header"
import LinkPage from "./LinkPage"
import { json, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import html2pdf from 'html2pdf.js';
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import DatePicker from "react-multi-date-picker";
import Calendar from 'react-calendar';
import "react-multi-date-picker/styles/colors/teal.css"
import 'react-calendar/dist/Calendar.css';
import { data } from "autoprefixer";

function ConfirmProjectdone() {
    const location = useLocation();
    const { datalocation } = location.state || {};
    const navigate = useNavigate();
    const [formData, setFormData] = useState(
        {   fiscalyear: '',
            type: '',
            organiz: '',
            title: '',
            projectvalue: '',
            actused:'',
            comdocdate:'',
            status: ""  }
    );
    useEffect(()=>{
        if(sessionStorage.getItem('role')!='admin'){
            navigate("/Dashboard");
        }
        if (datalocation == 'none'||datalocation == undefined ||datalocation ==null) {
            navigate("/dashboard");
            
        }else{
            setFormData({
                fiscalyear: datalocation.fiscalyear,
                type: datalocation.type,
                organiz: datalocation.organiz,
                title: datalocation.title,
                eventdate:datalocation.eventdate,
                projectvalue: datalocation.projectvalue,
                actused:'',
                comdocdate:'',
                status: "done"  
            })
        }

    },[])

    const handleSubmit = async (event) => {
        event.preventDefault(); // ป้องกันการรีเฟรชหน้า
        // เก็บข้อมูลฟอร์มใน state
        // sessionStorage.setItem('statusInsertOrUpdateData','insert');
        const requestData = {
            type: "updatedoneproject",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: formData,
            token: sessionStorage.getItem('acctoken')
        };
        // console.log((requestData));
        await axios.post(root_url, JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )   
            .then(() => { navigate('/manageproject',{replace:true,state:{datalocation:[datalocation.fiscalyear,datalocation.type,datalocation.organiz]}}) })
            .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด

        // console.log('Form submitted with data:', formData);

    };

   
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

        const useres = confirm("หากกด 'ตกลง' ข้อมูลจะไม่ได้รับการบันทึกใดๆ");
        if (useres) {
            navigate(-1);
        }
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
                <form  method="post" onSubmit={handleSubmit} className="flex flex-col justify-between p-10 max-w-screen-lg w-full  items-center border rounded-2xl border-green-500">
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
                   <p className="w-1/4 h-12 flex justify-start  items-center ">งบประมาณขั้นต้น</p>
                   <p name="title" className=" h-12 rounded-xl border-gray-600 flex items-center text-lg ml-5" >{numberWithCommas(formData.projectvalue)}</p>
                   </div>
                   <div className="mt-5 border-b flex flex-row w-full items-start  justify-between">
                   <p className="w-1/4 h-12 flex justify-start  items-start ">วันที่จัดกิจกรรม</p>
                    <div className="flex flex-col ">
                    {(formData.eventdate!=null&&formData.eventdate!='')?JSON.parse(formData.eventdate).map((timestamp,index)=>{
                        return (
                            <div key={uuidv4()}>
                            <p>{timestmptostrdate(timestamp)}</p>
                            <p className="mx-3"></p>
                            </div>
                        )
                    }):<p>ไม่มีข้อมูล</p>}
                    </div>
                   </div>
                    <p className="w-full h-12 flex justify-start  items-center  mb-2">งบประมาณที่ใช้จริง</p>
                        <input onChange={handleNumberChange} type="number" name="actused" className="w-full h-12 rounded-xl border-gray-600 " value={formData.actused} required min={0} max={formData.projectvalue} />
                    <p className="w-full h-12 flex justify-start  items-center  mb-2">วันที่ส่งเอกสาร</p>
                        <input onChange={handleChange} type="date" name="comdocdate" className="w-full h-12 rounded-xl border-gray-600 " value={formData.comdocdate} required />



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

                    <button type="submit" className="w-full h-12 rounded-xl border mt-5 bg-green-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">ยืนยัน</button>
                    <a  onClick={confirmAction}  className="flex justify-center items-center w-full h-12 rounded-xl border mt-5 bg-blue-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">กลับ</a>

                </form>
                </div>

            </>
            )

}


            export default ConfirmProjectdone