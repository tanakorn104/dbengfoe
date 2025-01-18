import Header from "../Header"
import LinkPage from "../LinkPage"
import { json, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Link } from "react-router-dom";
import LoadingObj from "../../assets/LoadingObj";
import api from "../tool/AxiosInstance";
import Aleart from "../Aleart";
import SendingObj from "../../assets/SendingObj";
function ManageLogpayment() {
    const navigate = useNavigate()
    const location = useLocation();
    const { datalocation } = location.state || 'none';
    const [loadingpage, setLoadingpage] = useState(true);
    const [donthavepaymentlogdata, setdonthavepaymentlogdata] = useState(false);
    const [alreatingdata, setalreatingdata] = useState(null)
    const [isselectobjstatus, setisselectobjstatus] = useState(false)
    const [isSendingdataStatus, setisSendingdataStatus] = useState(false)

    const [maindatastate, setmaindatastate] = useState({
        paymentdata: "",
        paymentheadtable: "",
        paymentobjdata: '',
        afterfilterpaymentlogdata: ''
    })
    const [filterobj, setfilterobj] = useState({
        termfilter: '',
        majorfilter: '',
        monthfilter: ''
    })
    const convertlistheadtableandlistdata_toObj = (headtable, listdata) => {
        let objprelist = []

        for (let i = 0; i < headtable.length; i++) {
            let prelist = [];
            prelist.push(headtable[i]);
            prelist.push(listdata[i]);
            objprelist.push(prelist);


        }
        const objdata = Object.fromEntries(objprelist);
        return objdata;
    }
    const makelistofObjformListsAndheadtable = (headtable, datalists) => {
        let finallist = []
        datalists.map(list => { finallist.push(convertlistheadtableandlistdata_toObj(headtable, list)) })
        return finallist
    }
    useEffect(() => {
        if (!datalocation) {
            navigate('/')
            return;
        }
        const requestData = {
            type: "getpaymentlogbyyearandtypecap",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {
                fiscalyear: datalocation.fiscalyear,
                typecap: datalocation.typecap,
            },

        };
        api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }
        ).then((res) => {
            // console.log(res.data.type)
            if (res.data.type == "success") {
                let objpaymentdata = makelistofObjformListsAndheadtable(res.data.headtable, res.data.data)
                setmaindatastate(predata => ({
                    ...predata,
                    paymentdata: res.data.data,
                    paymentheadtable: res.data.headtable,
                    paymentobjdata: objpaymentdata,
                    afterfilterpaymentlogdata: makelistofObjformListsAndheadtable(res.data.headtable, res.data.data),

                }))
                let defaultfilter = {
                    termfilter: 'ภาคปลาย',
                    majorfilter: 'AE',
                    monthfilter: [...new Set(makelistofObjformListsAndheadtable(res.data.headtable, res.data.data).map(obj => obj.month))][0]
                }
                setfilterobj(defaultfilter)
                setmaindatastate(pre => (
                    {
                        ...pre,
                        afterfilterpaymentlogdata: objpaymentdata.filter(obj => { if (obj.term == defaultfilter.termfilter && obj.major == defaultfilter.majorfilter && obj.month == defaultfilter.monthfilter) { return { ...obj, isselect: false } } })
                    }
                ))
            } else {
                setmaindatastate(predata => ({
                    ...predata,
                    afterfilterpaymentlogdata: null,

                }))
                setdonthavepaymentlogdata(true)
            }
        }).then(() => {
            setLoadingpage(false)
        })
    }, [])
    // useEffect(()=>{
    //     if(filterobj){
    //         console.log(maindatastate.paymentobjdata.filter(obj=>obj.term==filterobj.termfilter && obj.major==filterobj.majorfilter && obj.month==filterobj.monthfilter))

    //     }
    // },[filterobj])

    const handleupdatepaymentlog = (objlistselected,statuspaymentupdateto) => {
        
        if (objlistselected.length < 1) {
            setalreatingdata({ data: { type: 'fail', message: 'กรุณาเลือกก่อนบันทึก' }, key: uuidv4() })
            return;
        }
        setisSendingdataStatus(true)
        let editeobj = objlistselected.map(item => { return { ...item, ispayment: statuspaymentupdateto } })
        // console.log(editeobj)
        const requestData = {
            type: "editispaymentlogdatawithprimarykey",
            data: {
                primarykey: ['fiscalyear', 'typecap', 'stdcode', 'term','month'],
                keyEditdata: ['ispayment'],
                data: editeobj
            },

        };
        // console.log("send")
        // console.log(requestData)
        api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then(res => {
            if (res.data.type == 'success') {
                setmaindatastate(pre => ({
                    ...pre, afterfilterpaymentlogdata: pre.afterfilterpaymentlogdata.map(
                        obj => {
                            let flag = true;
                            let keys = Object.keys(obj)
                            for (let i = 0; i < objlistselected.length; i++) {
                                flag = true;
                                for (let j = 0; j < keys.length; j++) {
                                    flag = flag && (obj[keys[j]] != objlistselected[i][keys[j]] ? false : true);
                                    if (!flag) {
                                        break
                                    }
                                }
                                if (flag) {
                                    break;
                                }
                            }
                            if (flag) {
                                return { ...obj, ispayment: statuspaymentupdateto, isselect: false }
                            } else {
                                return obj
                            }
                        }
                    )
                })
                )
                setisselectobjstatus(false)
            }
            setisSendingdataStatus(false)
            return res
        }
        ).then((res) => {
            setalreatingdata({ data: { ...res.data, message: res.data.type=='success'?"อัพเดตสำเร็จ":'ล้มเหลว' }, key: uuidv4() })
        }).catch(e => { console.log(e) })
    }

    const onfilterchange = () => {
        // console.log(pre.paymentobjdata.filter((obj)=>obj.term==filterobj.termfilter&&obj.major==filterobj.majorfilter&&obj.month==filterobj.month))
        // maindatastate.paymentobjdata.filter(obj=>obj.term==filterobj.termfilter && obj.major==filterobj.majorfilter && obj.month==filterobj.monthfilter)
        // setmaindatastate((pre)=>({
        //     ...pre,
        //     afterfilterpaymentlogdata:pre.paymentobjdata.filter(obj=>obj.term==filterobj.termfilter && obj.major==filterobj.majorfilter && obj.month==filterobj.monthfilter)
        // }))
        // console.log('----------------')
        // console.log(filterobj)
        console.log(maindatastate.paymentobjdata.filter(obj => obj.term == filterobj.termfilter && obj.major == filterobj.majorfilter && obj.month == filterobj.monthfilter))
    }
    const handlefilterobjChange = (name, value) => {
        setfilterobj(pre => ({ ...pre, [name]: value }))
        let newfilterobj = {
            ...filterobj,
            [name]: value
        }
        // console.log(maindatastate.paymentobjdata.filter(obj=>obj.term==newfilterobj.termfilter && obj.major==newfilterobj.majorfilter && obj.month==newfilterobj.monthfilter))
        setmaindatastate(pre => (
            {
                ...pre,
                afterfilterpaymentlogdata: maindatastate.paymentobjdata.filter(obj => obj.term == newfilterobj.termfilter && obj.major == newfilterobj.majorfilter && obj.month == newfilterobj.monthfilter)
            }
        ))

    }

    if (loadingpage || !datalocation) {
        return (
            <>
                <Header />
                <LoadingObj />
            </>
        )
    }
    if (donthavepaymentlogdata) {
        return (
            <>
                <Header />
                <div className="w-full flex justify-center items-center">ขออภัย ยังไม่มีข้อมูลใดๆ</div>
                <div className="w-full flex flex-row justify-center items-center">
                    <a className="w-20 flex justify-center items-center bg-red-500 rounded-lg text-white hover:bg-red-800 hover:cursor-pointer" onClick={() => { navigate(-1) }}>กลับ</a>
                </div>
            </>
        )
    }

    return (
        <>
            <Header />
            <Aleart aleartingdatastate={alreatingdata} />
            {/* <a onClick={()=>{setalreatingdata({data:{type:"fail",message:"test"},key:uuidv4()})}} className=" mx-3 bg-red-600 px-2 rounded-md hover:cursor-pointer">setfail</a> */}
            {/* <a onClick={()=>{setalreatingdata({data:{type:"success",message:"testsuccesstestfaildadjfirgjspvjpifjiwjfajpjsiwjofpjwefijifii"},key:uuidv4()})}} className=" mx-3 bg-green-600 px-2 rounded-md hover:cursor-pointer">setsuccess</a> */}
            {/* {(`${datalocation.typecap} ${datalocation.fiscalyear}`)} */}
            <div className="px-10 flex flex-row text-xl font-bold">
                <p className="">{datalocation.fiscalyear}</p>
                <p className="ml-2">{datalocation.typecap}</p>
            </div>
            <div className="px-10 ">
                <select name="termfilter" value={filterobj.termfilter} onChange={(e) => { handlefilterobjChange("termfilter", e.target.value) }} id="" className="rounded-lg   cursor-pointer text-center w-1/2 md:w-1/4 border-none  focus:outline-none focus:ring-0 ">
                    <option value="ภาคต้น">ภาคต้น</option>
                    <option value="ภาคปลาย">ภาคปลาย</option>
                </select>
                <select name="majorfilter" value={filterobj.majorfilter} onChange={(e) => { handlefilterobjChange("majorfilter", e.target.value) }} id="" className="rounded-lg   cursor-pointer text-center w-1/2 md:w-1/4 border-none  focus:outline-none focus:ring-0 ">
                    <option value="AE">AE</option>
                    <option value="FE">FE</option>
                    <option value="IRRE">IRRE</option>
                    <option value="CE">CE</option>
                    <option value="ME">ME</option>
                    <option value="CPE">CPE</option>
                    <option value="IE">IE</option>
                </select>
            </div>
            <div className="border-b-2 px-10 ">
                <select name="monthfilter" value={filterobj.monthfilter} onChange={(e) => { handlefilterobjChange("monthfilter", e.target.value) }} id="" className="rounded-lg text-center  cursor-pointer  w-1/2 md:w-1/4 border-none  focus:outline-none focus:ring-0 ">
                    {[...new Set(maindatastate.paymentobjdata.map(obj => obj.month))].map(datetime => {
                        return (<option key={uuidv4()} value={datetime}>{new Date(datetime).getMonth() + 1}</option>)

                    })}
                </select>

            </div>
            <div className="w-full">
                <div className="mt-4 w-full flex justify-between px-10 items-end ">
                    <div className="flex flex-row justify-end items-end">
                        <input checked={isselectobjstatus} onChange={(e) => { setisselectobjstatus(e.target.checked); e.target.checked == false ? setmaindatastate(pre => ({ ...pre, afterfilterpaymentlogdata: pre.afterfilterpaymentlogdata.map((item => ({ ...item, isselect: false }))) })) : '' }} className=" size-5 rounded-md bg-white border-2 border-blue-500 focus:outline-none focus:ring-0" type="checkbox" name="" id="" />
                        <p className="ml-3 flex justify-end items-end">เลือก</p>

                    </div>
                    <div className="underline text-green-900 hover:cursor-pointer">
                        {isselectobjstatus ? <a className="hover:cursor-pointer" onClick={() => confirm('บันทึกข้อมูล')?handleupdatepaymentlog(maindatastate.afterfilterpaymentlogdata.filter((item) => item.isselect == true),true):''}>บันทึกการจ่ายเงิน</a> : ''}
                    </div>
                </div>
            </div>
            <div className="">
                {/* <div className="">{JSON.stringify(filterobj)}</div> */}
                {!maindatastate.afterfilterpaymentlogdata || maindatastate.afterfilterpaymentlogdata.length == 0 ? <div className="w-full flex justify-center pt-5">ไม่มีข้อมูลใดๆ</div> :
                    isSendingdataStatus?<SendingObj/>:
                    maindatastate.afterfilterpaymentlogdata.map((obj, index) => {
                        return (
                            <div className="w-full px-10 md:px-0 " key={uuidv4()}>

                                {/* <div className="">{JSON.stringify()}</div> */}
                                <a onClick={() => { isselectobjstatus && setmaindatastate((predata) => ({ ...predata, afterfilterpaymentlogdata: predata.afterfilterpaymentlogdata.map((objitem, i) => i == index ? { ...obj, isselect: !obj.isselect } : objitem) })) }} className={`${obj.isselect ? 'bg-blue-200' : 'bg-white'} text-xs md:text-sm flex flex-col  md:flex-row w-full justify-between my-2  px-5 md:px-20 border rounded-lg md:border-none`}>

                                    <div className="w-full flex md:flex-row flex-col">
                                        <div className="w-full  flex flex-row">
                                            {/* <div className="w-1/2 flex items-center justify-start  py-3 md:border-b text-base">{obj.stdcode}</div> */}
                                            <div className="w-1/2 flex items-center justify-start  py-3 md:border-b text-base">xxxxxxxxxx</div>
                                            <div className="flex flex-row w-1/2 ">
                                                {/* <div className="flex items-center justify-start w-full py-3 md:border-b ">{obj.name + " " + obj.lastname}</div> */}
                                                <div className="flex items-center justify-start w-full py-3 md:border-b ">xxxxx  xxxxxx</div>

                                            </div>
                                        </div>

                                        <div className="w-full flex flex-row">

                                            <div className="flex flex-row w-2/3 ">
                                                <div className="flex items-center  justify-start w-full py-3 md:border-b ">สาขา {obj.major}</div>
                                                <div className="flex items-center  justify-start w-full py-3 md:border-b ">ชั้นปี {obj.year}</div>
                                                <div className="flex items-center  justify-start w-full py-3 md:border-b ">{obj.ispayment ? <p className="text-green-600 underline">{obj.ispayment}</p> : <p className="text-red-600 underline">ยังไม่จ่าย</p>}</div>
                                            </div>

                                            <div className="hidden md:block w-1/3  ">
                                                <div className="w-full h-full flex flex-row justify-end items-center ml-2 md:ml-0 md:mr-3 md:border-b ">
                                                    {obj.ispayment || obj.ispayment == 'true' ? <>
                                                        <div className="flex flex-row  bg-gray-300 px-3 py-1 rounded-lg hover:cursor-default" >
                                                            <p className="truncate">จ่ายแล้ว</p>
                                                        </div>
                                                    </> :
                                                        <>
                                                            <div className="flex flex-row  bg-green-500 hover:bg-green-700 px-3 py-1 rounded-lg hover:cursor-pointer" >
                                                                <p className="truncate">จ่ายเงิน</p>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                                </svg> </div>
                                                        </>
                                                    }

                                                </div>
                                            </div>

                                            <div className="w-1/3 md:hidden ">
                                                <div className="w-full flex flex-row justify-end items-center h-full">
                                                    <div className="h-full  flex justify-center items-center ">
                                                        {obj.ispayment || obj.ispayment == 'true' ? <a className="hover:cursor-pointer flex flex-row  justify-center items-center  text-white px-2 bg-red-500 hover:bg-red-700  md:rounded-sm md:h-[80%] rounded-lg" >
                                                            <a onClick={() => confirm(`ยืนยันการยกเลิกการจ่ายเงินของ ${obj.name} ${obj.lastname}`)?handleupdatepaymentlog([obj],false):''} className="truncate">ยกเลิกจ่าย</a>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-white  ">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                            </svg>

                                                        </a> : <a className="hover:cursor-pointer flex flex-row  justify-center items-center  text-white px-2 bg-red-500 hover:bg-red-700  md:rounded-sm md:h-[80%] rounded-lg" >
                                                            <p className="truncate">ลบข้อมูล</p>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-white  ">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                            </svg>

                                                        </a>}
                                                    </div>

                                                </div>
                                            </div>

                                        </div>

                                    </div>


                                    <div className="hidden   md:block">
                                        <div className=" w-20 border-b h-full  flex justify-center items-center" >
                                            {obj.ispayment || obj.ispayment == 'true' ? <a className="hover:cursor-pointer   w-full flex flex-row mx-1 justify-center items-center   bg-red-500 hover:bg-red-700  md:rounded-md ">
                                                <p className="text-white   py-1">ยกเลิก</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-white  ">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </a> : <a className="hover:cursor-pointer   w-full flex flex-row mx-1 justify-center items-center   bg-red-500 hover:bg-red-700  md:rounded-md ">
                                                <p className="text-white   py-1">ลบข้อมูล</p>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 text-white  ">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                            </a>}


                                        </div>

                                    </div>


                                    <div className="md:hidden w-full">
                                        <div className="w-full pb-2 flex flex-row justify-end items-center   ">
                                            {obj.ispayment || obj.ispayment == 'true' ? <>
                                                <div className="flex flex-row  justify-center items-center hover:cursor-default text-white w-full bg-gray-300 px-3 py-1 rounded-lg" >
                                                    <p className="truncate">จ่ายแล้ว</p>
                                                </div>
                                            </> :
                                                <>
                                                    <div className="flex flex-row justify-center items-center text-white  w-full bg-green-500 hover:bg-green-700 px-3 py-1 rounded-lg hover:cursor-pointer" >
                                                        <p className="truncate">จ่ายเงิน {obj.amount}</p>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                        </svg> </div>
                                                </>
                                            }

                                        </div>
                                    </div>
                                </a>
                            </div>
                        )
                    })
                }

            </div>
            {/* {maindatastate.paymentobjdata.map(obj=>{
            
            return <div className="">
                {JSON.stringify(obj)}
            </div>
        })} */}
            {/* {JSON.stringify(maindatastate.paymentheadtable)} */}
            {/* {JSON.stringify(convertlisttoObj(maindatastate.paymentheadtable,maindatastate.paymentdata[0]))} */}

        </>
    )


}

export default ManageLogpayment