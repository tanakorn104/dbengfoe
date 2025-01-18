import React,{useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import LinkPage from "./LinkPage";
import api from "./tool/AxiosInstance";
function Adddata(){
    const navigate = useNavigate();
    const [response, setResponse] = useState(null);
    const [formData,setFormData] = useState(
        {
    fiscalyear:2024,
    SAD:56780,
    amountemergcap:45000,
    amountgdstd:3000,
    amountwork:2000,
    amountfinstrap:2000,
    ngdstd:1,
    nwork:6,
    nfinstrap:6,
    AEninschlagdstd:2,
    AEninschlawork:1,
    AEninschlafinstrap:3,
    IRREninschlagdstd:2,
    IRREninschlawork:3,
    IRREninschlafinstrap:2,
    FEninschlagdstd:3,
    FEninschlawork:1,
    FEninschlafinstrap:2,
    CEninschlagdstd:1,
    CEninschlawork:3,
    CEninschlafinstrap:2,
    MEninschlagdstd:3,
    MEninschlawork:2,
    MEninschlafinstrap:2,
    CPEninschlagdstd:1,
    CPEninschlawork:2,
    CPEninschlafinstrap:3,
    IEninschlagdstd:1,
    IEninschlawork:2,
    IEninschlafinstrap:1,
    amountsmo:28500,
    amounteduwork:29500,
    grduatcap:2000000,
    amountforeign:30500,
    AEstddev:31500,
    IRREstddev:32500,
    FEstddev:33500,
    CEstddev:34500,
    MEstddev:35500,
    CPEstddev:36500,
    IEstddev:37500,
    AEincome:38500,
    IRREincome:39500,
    FEincome:40500,
    CEincome:41500,
    MEincome:42500,
    CPEincome:43500,
    IEincome:44500,
    spAEincome:45500,
    spCEincome:46500,
    spMEincome:47500
            // fiscalyear: null,
            // SAD: null,
            // amountgdstd: null,
            // amountwork: null,
            // amountfinstrap: null,
            // ngdstd: null,
            // nwork: null,
            // nfinstrap: null,
            // AEninschlagdstd: null,
            // AEninschlawork: null,
            // AEninschlafinstrap: null,
            // IRREninschlagdstd: null,
            // IRREninschlawork: null,
            // IRREninschlafinstrap: null,
            // FEninschlagdstd: null,
            // FEninschlawork: null,
            // FEninschlafinstrap: null,
            // CEninschlagdstd: null,
            // CEninschlawork: null,
            // CEninschlafinstrap: null,
            // MEninschlagdstd: null,
            // MEninschlawork: null,
            // MEninschlafinstrap: null,
            // CPEninschlagdstd: null,
            // CPEninschlawork: null,
            // CPEninschlafinstrap: null,
            // IEninschlagdstd: null,
            // IEninschlawork: null,
            // IEninschlafinstrap: null,
            // amountsmo: null,
            // amounteduwork: null,
            // amountforeign: null,
            // AEstddev: null,
            // IRREstddev: null,
            // FEstddev: null,
            // CEstddev: null,
            // MEstddev: null,
            // CPEstddev: null,
            // IEstddev: null,
            // AEincome: null,
            // IRREincome: null,
            // FEincome: null,
            // CEincome: null,
            // MEincome: null,
            // CPEincome: null,
            // IEincome: null,
            // spAEincome: null,
            // spCEincome: null,
            // spMEincome: null
          }
          
          
          
      );

const prevententersend = (event)=>{
    if(event.key =="Enter"){
        event.preventDefault();
    }
}
    // ฟังก์ชันจัดการการเปลี่ยนแปลงของ input step={0.01} fields
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: Number(value),
    }));
  };
  const handlewheel = (event)=>{
    event.preventDefault();
  }

  // ฟังก์ชันจัดการการส่งฟอร์ม
  const handleSubmit = async(event) => {
    event.preventDefault(); // ป้องกันการรีเฟรชหน้า
    // เก็บข้อมูลฟอร์มใน state
    // sessionStorage.setItem('statusInsertOrUpdateData','insert');
    const requestData = {
        type:"insertmain",//sessionStorage.getItem('statusInsertOrUpdateData')
        data:formData,
        token: sessionStorage.getItem('acctoken')
    };
    // console.log((requestData));
    await api.post("/",JSON.stringify(requestData),{
            headers:{
                'Content-Type':'application/json'
            }
        }
    )
    .then(response => setResponse(response.data)).then(()=>{navigate(-1);})
    .catch(err => console.error('Error posting data', err)); // จัดการข้อผิดพลาด

    // console.log('Form submitted with data:', formData);
    
  };

  useEffect(()=>{
    if(sessionStorage.getItem('role')!='admin'){
        navigate("/Dashboard");
    }
  },[])

  
  function confirmAction(){
    const useres = confirm("หากกด 'ตกลง' ข้อมูลจะไม่ได้รับการบันทึกใดๆ");
    if(useres){
        navigate(-1,{replace:true});
    }
  
  }
    return(
        <>
        <Header/>
        <LinkPage/>
        <div className="flex flex-row justify-center items-center p-10">
        <form onSubmit={handleSubmit} method="post" className="flex flex-col justify-between p-10 max-w-screen-lg w-full items-center border rounded-2xl border-green-500">
            <b  className="w-full h-12 flex justify-start  items-center  border-b mb-5" >ปีงบประมาณ :</b>
            <input  type="number"  name="fiscalyear" value={formData.fiscalyear}  onKeyDown={prevententersend} onChange={handleChange} onWheel={handlewheel} className="w-full h-12 rounded-xl border-gray-600 "min={0} required />
            <b  className="w-full h-12 flex justify-start  items-center  mt-5" >งบพัฒนานิสิต :</b>
            <div className="w-full border-t " >
                <p  className="w-full h-12 flex justify-start  items-center  " >งานกิจ :  ไม่รวมทุนการศึกษา</p>
                <input step={0.01} type="number" name="SAD" value={formData.SAD}  onKeyDown={prevententersend} onChange={handleChange} id="" className="w-full h-12 rounded-xl  " min={0} required />
                <p  className="w-full h-12 flex justify-start  items-center pl-10  " >ทุนภายใน :</p>
                <p  className="w-full h-12 flex justify-start  items-center pl-16  " >ฉุกเฉิน</p>
                <div className="w-full flex justify-end items-center pl-16">
                    <input step={0.01} type="number" name="amountemergcap" value={formData.amountemergcap}  onKeyDown={prevententersend} onChange={handleChange} id="" className="w-full h-12 rounded-xl  " min={0} required />

                </div>
                <div className="flex flex-row justify-between w-full p-0 m-0  pt-5">
                    <div className="flex flex-col flex-wrap pl-16 m-0 w-2/5 ">
            
                        <p className="h-12 flex flex-row justify-start items-center mb-5 ">ภาควิชา</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">ทุนละ (บาท)</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">จำนวนครั้ง (เดือน)</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเกษตร</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมชลประทาน</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมการอาหาร</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมโยธา</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเครื่องกล</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมคอมพิวเตอร์</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมอุตสาหการ</p>
                       
                        
                    </div>
                    <div className=" p-0 m-0  w-3/5 flex flex-col ">
                        <div className=" flex w-full flex-row justify-around h-12 p-0 m-0 mb-5 items-center">
                            <p>ทุนเรียนดี</p>
                            <p>ทุนทำงาน</p>
                            <p>ทุนขัดสน</p>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="amountgdstd"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.amountgdstd} id="" className="w-1/4 rounded-xl text-center " min={0}   />
                            <input step={0.01} type="number" name="amountwork"       onKeyDown={prevententersend} onChange={handleChange}  value={formData.amountwork} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                            <input step={0.01} type="number" name="amountfinstrap"   onKeyDown={prevententersend} onChange={handleChange}  value={formData.amountfinstrap} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="ngdstd"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.ngdstd} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                            <input  type="number" name="nwork"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.nwork} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                            <input  type="number" name="nfinstrap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.nfinstrap} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="AEninschlagdstd"    onKeyDown={prevententersend} onChange={handleChange}  value={formData.AEninschlagdstd} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                            <input  type="number" name="AEninschlawork"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.AEninschlawork} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                            <input  type="number" name="AEninschlafinstrap" onKeyDown={prevententersend} onChange={handleChange}  value={formData.AEninschlafinstrap} id="" className="w-1/4 rounded-xl text-center " min={0}  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="IRREninschlagdstd"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.IRREninschlagdstd} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="IRREninschlawork"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.IRREninschlawork} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="IRREninschlafinstrap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.IRREninschlafinstrap} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="FEninschlagdstd"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.FEninschlagdstd} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="FEninschlawork"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.FEninschlawork} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="FEninschlafinstrap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.FEninschlafinstrap} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="CEninschlagdstd"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.CEninschlagdstd} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="CEninschlawork"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.CEninschlawork} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="CEninschlafinstrap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.CEninschlafinstrap} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="MEninschlagdstd"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.MEninschlagdstd} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="MEninschlawork"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.MEninschlawork} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="MEninschlafinstrap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.MEninschlafinstrap} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="CPEninschlagdstd"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.CPEninschlagdstd} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="CPEninschlawork"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.CPEninschlawork} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="CPEninschlafinstrap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.CPEninschlafinstrap} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input  type="number" name="IEninschlagdstd"     onKeyDown={prevententersend} onChange={handleChange}  value={formData.IEninschlagdstd} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="IEninschlawork"      onKeyDown={prevententersend} onChange={handleChange}  value={formData.IEninschlawork} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                            <input  type="number" name="IEninschlafinstrap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.IEninschlafinstrap} id="" className="w-1/4 rounded-xl text-center"min={0}/>
                        </div>
                    </div>
                </div>
                
                <div className="p-0 ">
                    <p  className="w-full h-12 flex justify-start  items-center  " >สโมสร :</p>
                    <input step={0.01} type="number" name="amountsmo"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.amountsmo} id="year" className="w-full h-12 rounded-xl "min={0} required />
                    <p  className="w-full h-12 flex justify-start  items-center  " >งานบริการการศึกษา :</p>
                    <input step={0.01} type="number" name="amounteduwork"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.amounteduwork} id="" className="w-full h-12 rounded-xl " min={0} required />
                    <div className="w-full  h-12 my-6 flex flex-row pl-10 ">
                        <p  className="w-2/5 h-12 flex items-center justify-start " >ทุนบัณฑิต :</p>
                        <input step={0.01} type="number" name="grduatcap"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.grduatcap} id="" className="w-3/5 h-12 rounded-xl  text-center" min={0} required />
                    </div>
                    <p  className="w-full h-12 flex justify-start  items-center  " >งานวิเทศ :</p>
                    <input step={0.01} type="number" name="amountforeign"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.amountforeign} id="" className="w-full h-12 rounded-xl "min={0} required />
                </div>

                <div className="flex flex-row justify-between w-full pl-10 m-0 border-t pt-5">
                    <div className="flex flex-col flex-wrap  m-0 w-2/5 ">
            
                        <p className="h-12 flex flex-row justify-start items-center mb-5">ภาควิชา</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเกษตร</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมชลประทาน</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมการอาหาร</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมโยธา</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเครื่องกล</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมคอมพิวเตอร์</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมอุตสาหการ</p>
                       
                        
                    </div>
                    <div className=" p-0 m-0  w-3/5 flex flex-col ">
                        <div className=" flex w-full flex-row justify-center h-12 p-0 m-0 mb-5 items-center">
                            <p>จำนวนเงิน</p>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="AEstddev"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.AEstddev} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="IRREstddev"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.IRREstddev} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="FEstddev"  onKeyDown={prevententersend} onChange={handleChange}   value={formData.FEstddev} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="CEstddev"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.CEstddev} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="MEstddev"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.MEstddev} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="CPEstddev"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.CPEstddev} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="IEstddev"  onKeyDown={prevententersend} onChange={handleChange}  value={formData.IEstddev} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        
                    </div>
                </div>

            </div>

            <b  className="w-full h-12 flex justify-start  items-center  mt-5" >เงินรายได้ภาค :</b>
            <div className="flex flex-row justify-between w-full p-0 m-0 border-t pt-5">
                    <div className="flex flex-col flex-wrap  m-0 w-2/5 ">
            
                        <p className="h-12 flex flex-row justify-start items-center mb-5">ภาควิชา</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเกษตร</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมชลประทาน</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมการอาหาร</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมโยธา</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเครื่องกล</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมคอมพิวเตอร์</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมอุตสาหการ</p>
                       
                        
                    </div>
                    <div className=" p-0 m-0  w-3/5 flex flex-col ">
                        <div className=" flex w-full flex-row justify-center h-12 p-0 m-0 mb-5 items-center">
                            <p>จำนวนเงิน</p>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="AEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.AEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="IRREincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.IRREincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="FEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.FEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="CEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.CEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="MEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.MEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="CPEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.CPEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="IEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.IEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        
                    </div>
                </div>
            <b  className="w-full h-12 flex justify-start  items-center  mt-5" >เงินรายได้ภาคพิเศษ :</b>
            <div className="flex flex-row justify-between w-full p-0 m-0 border-y pt-5">
                    <div className="flex flex-col flex-wrap  m-0 w-2/5 ">
            
                        <p className="h-12 flex flex-row justify-start items-center mb-5">ภาควิชา</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเกษตร (พิเศษ)</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมโยธา (พิเศษ)</p>
                        <p className="h-12 flex flex-row justify-start items-center mb-5">วิศวกรรมเครื่องกล (พิเศษ)</p>
                       
                        
                    </div>
                    <div className=" p-0 m-0  w-3/5 flex flex-col ">
                        <div className=" flex w-full flex-row justify-center h-12 p-0 m-0 mb-5 items-center">
                            <p>จำนวนเงิน</p>
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="spAEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.spAEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="spCEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.spCEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        <div className=" flex w-full flex-row justify-around  h-12 mb-5">
                            <input step={0.01} type="number" name="spMEincome" onKeyDown={prevententersend} onChange={handleChange}  value={formData.spMEincome} id="" className="w-full rounded-xl text-center "min={0}required  />
                        </div>
                        
                        
                    </div>


                </div>
                <button type="submit" className="w-full h-12 rounded-xl border mt-5 bg-green-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">เพิ่ม</button>
                <button  onClick={confirmAction} className="w-full h-12 rounded-xl border mt-5 bg-blue-500 text-white  transition-colors duration-300 hover:bg-white hover:text-black">กลับ</button>
        </form>
        </div>
        </>
    )
}

export default Adddata;