import Header from "./Header";
import LinkPage from "./LinkPage";
import { json, replace, useLocation,useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import DatePicker from "react-multi-date-picker";
import { useEffect, useState, } from "react";
import axios from "axios";
import { root_url } from "./config/config";
function AddProject() {

    const location = useLocation();
    const { datalocation,overviewdata } = location.state || {};
    // console.log(location.state);
    const [Datepicker, setDatepicker] = useState(null);
    const [partic, setPartic] = useState({});
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [formData, setFormData] = useState(
        {
            maindata:{
            fiscalyear: null,
            type: null,
            organiz: null,
            title: null,
            projectvalue: null,
            // used: "20",
            // total: "2480",
            eventdate:null ,
            // comdocdate:"2/10/2567",
            status: null,
            },
            overviewerdata:{
                total:null
            }
        }
     


    );
    useEffect(()=>{
        if(!datalocation||!overviewdata){
            if(sessionStorage.getItem('role')!='admin'){
                navigate("/Dashboard");
            }else{
                navigate(-1);
                
            }

        }else{
            setFormData(
        
                {
                    maindata:{
                        fiscalyear: datalocation[0],
                        type: datalocation[1],
                        organiz: datalocation[2],
                        title: "",
                        projectvalue: '',
                        // used: "20",
                        // total: "2480",
                        eventdate:Datepicker ,
                        // comdocdate:"2/10/2567",
                        softskilltype:'',
                        status: "wait"
                    },
                    overviewerdata:{
                        total:overviewdata[0][4]
                    }
                }
            )
        }
    },[])
    // console.log(datalocation);
    const handleNumberChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            maindata:{
                ...prevData.maindata,
                [name]: Number(value),

            }
        }));
        // console.log(formData.maindata)
    }
    const prevententersend = (event)=>{
        if(event.key =="Enter"){
            event.preventDefault();
        }
    }

    // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input fields
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            maindata:{
                ...prevData.maindata,
                [name]: (value),

            }
        }));
        // console.log(formData.maindata)
        // console.log(formData.maindata.fiscalyear)
    };
    const handleDateChange = (selectDate) => {
        setDatepicker(selectDate);
        setFormData((prevData) => ({
            ...prevData,
            maindata:{
                ...prevData.maindata,
                eventdate: JSON.stringify(selectDate),
            }
        }));
    };
    const handlewheel = (event) => {
        event.preventDefault();
    }

    // ฟังก์ชันจัดการการส่งฟอร์ม
    const handleSubmit = async (event) => {
        event.preventDefault(); // ป้องกันการรีเฟรชหน้า
        // เก็บข้อมูลฟอร์มใน state
        // sessionStorage.setItem('statusInsertOrUpdateData','insert');
        const requestData = {
            type: "insertproject",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: formData.maindata,
            token: sessionStorage.getItem('acctoken')
        };
        // console.log((requestData));
        await axios.post(root_url, JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
            .then(response => setResponse(response.data)).then(() => { navigate(-1,{replace:true},) })//{state:{datalocation:datalocation}}
            .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด

        // console.log('Form submitted with data:', formData);

    };
    const numberWithCommas = (number) => {
        let formattedNumber
        if(number!=null){
            formattedNumber = number.toLocaleString('th-TH',{
                minimumFractionDigits:2,
                maximumFractionDigits:2,
            });
        }else{
            formattedNumber = '';
        }

        return formattedNumber;
    };
    function confirmAction() {

        const useres = confirm("หากกด 'ตกลง' ข้อมูลจะไม่ได้รับการบันทึกใดๆ");
        if (useres) {
            navigate(-1,{replace:true});
        }
    }
        return (
            <>
                <Header />
                <LinkPage />
                <div className="w-full flex flex-col justify-center items-center p-10 ">
                    <form method="post" onSubmit={handleSubmit} className="flex flex-col justify-between p-10 max-w-screen-lg w-full  items-center border rounded-2xl border-green-500">
                        <div className="w-full flex flex-row justify-center items-center mb-5 cursor-default">
                            <p className="w-1/3 h-12 flex justify-start  items-center  text-xl">โครงการ {formData.maindata.fiscalyear} </p>
                            <div className="flex flex-col w-2/3 justify-center items-end">
                                <p className="w-1/2 h-6 flex justify-end  items-center  font-normal">{formData.maindata.type}</p>
                                <p className="w-1/2 h-6 flex justify-end  items-center  font-light">{formData.maindata.organiz}</p>
                            </div>
                        </div>
                        <input onChange={handleChange} type="text" name="title" className="w-full h-12 rounded-xl border-gray-600 " placeholder="ชื่อโครงการ" value={formData.maindata.title} required />
                        <p className="w-full h-12 flex justify-between  items-center  mb-2 cursor-default"><span>งบประมาณ</span><span className="font-light text-sm">คงเหลือ: {numberWithCommas(formData.overviewerdata.total)} บาท</span></p>
                        <input onChange={handleNumberChange} type="number" step={0.01} name="projectvalue" className="w-full h-12 rounded-xl border-gray-600 " value={formData.maindata.projectvalue} placeholder='ไม่เกินยอดคงเหลือ' max={formData.overviewerdata.total} min={0} required />
                        <p className="w-full h-12 flex justify-between  items-center  mb-2 cursor-default"><span>ซอฟต์สกิล</span></p>
                        <select onChange={handleChange}  name="softskilltype" id="" className="rounded-lg h-12  cursor-pointer text-center w-full border-none  focus:outline-none focus:ring-0 " style={{border:"solid 1px gray"}}>
                            <option value="ด้านการคิดและแก้ไขปัญหา">ด้านการคิดและแก้ไขปัญหา</option>
                            <option value="ด้านการบริหารจัดการตัวเอง">ด้านการบริหารจัดการตัวเอง</option>
                            <option value="ด้านการทำงานร่วมกับผู้อื่น">ด้านการทำงานร่วมกับผู้อื่น</option>
                            <option value="ด้านเทคโนโลยี">ด้านเทคโนโลยี</option>
                        </select>
                        <p className="w-full h-12 flex justify-start  items-center  mb-2 cursor-default">วันที่จัดกิจกรรม</p>
                        {/* <input  type="date"  name="fiscalyear" className="w-full h-12 rounded-xl border-gray-600 " placeholder="หากมีหลายวันให้คั่นด้วย ' , ' เช่น 10/10/2567,12/10/2567"   required /> */}
                        <div className="w-full ">
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
                        </div>

                        <button type="submit" className="w-full h-12 rounded-xl border mt-5 bg-green-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">เพิ่ม</button>
                        <button  onClick={confirmAction} className="w-full h-12 rounded-xl border mt-5 bg-blue-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">กลับ</button>

                    </form>
                </div>
            </>
        )
    }




export default AddProject




