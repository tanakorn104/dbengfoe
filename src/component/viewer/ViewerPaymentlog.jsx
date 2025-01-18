
import { useEffect, useState } from "react"
import Header from "../Header"
import LoadingObj from "../../assets/LoadingObj"
import { useLocation, useNavigate } from "react-router-dom";
import api from "../tool/AxiosInstance";
import { v4 as uuidv4 } from 'uuid';

function ViewerPaymentlog() {

    const [isloading, setisloading] = useState(true)
    const [typecapfilter, settypecapfilter] = useState(true)
    const [maindatastate, setmaindatastate] = useState({
        paymentdata: null,
        paymenttable: null,
        objdatapaymentafterfilter: null,
        objAlldatapayment: null
    })

    const location = useLocation();
    const { datalocation } = location.state || {};
    const navigate = useNavigate();

    const monthTHfullyear = [
        "มกราคม",
        "กุมภาพันธ์",
        "มีนาคม",
        "เมษายน",
        "พฤษภาคม",
        "มิถุนายน",
        "กรกฎาคม",
        "สิงหาคม",
        "กันยายน",
        "ตุลาคม",
        "พฤศจิกายน",
        "ธันวาคม",
    ]

    const objforget_THtoEN_Major = {
        "วิศวกรรมเกษตร": 'AE',
        "วิศวกรรมชลประทาน": 'IRRE',
        "วิศวกรรมการอาหาร": 'FE',
        "วิศวกรรมโยธา": 'CE',
        "วิศวกรรมเครื่องกล": 'ME',
        "วิศวกรรมคอมพิวเตอร์": 'CPE',
        "วิศวกรรมอุตสาหการ": 'IE',
    }
    const convertlisttoObj = (headtable, datasstable) => {
        let objprelist = []

        for (let i = 0; i < headtable.length; i++) {
            let prelist = [];
            prelist.push(headtable[i]);
            prelist.push(datasstable[i]);
            objprelist.push(prelist);


        }
        const objdata = Object.fromEntries(objprelist);
        return objdata;
    }

    useEffect(() => {
        if (!datalocation) {
            navigate('/')
            return;
        }
        settypecapfilter(datalocation.typecapmap)
        const requestData = {
            type: "getpaymentlogbyyearandtypecap",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {
                fiscalyear: datalocation.fiscalyearshow,
            },

        };
        api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then((res) => {
            if (res.data.type == 'success') {
                const fulldatapayment = res.data.data.map(item => convertlisttoObj(res.data.headtable, item))
                // console.log(fulldatapayment)
                setmaindatastate(pre => ({
                    ...pre,
                    paymentdata: res.data.data,
                    paymenttable: res.data.headtable,
                    objAlldatapayment: fulldatapayment,
                    objdatapaymentafterfilter: fulldatapayment.filter(item => item.typecap == datalocation.typecapmap && (item.major == objforget_THtoEN_Major[datalocation.majorshow] || item.major == `s${objforget_THtoEN_Major[datalocation.majorshow]}`))

                }))
                // console.log(res.data.data.map(item=>convertlisttoObj(res.data.headtable,item)).filter(item=>item.typecap==datalocation.typecapmap))
            } else {
                setmaindatastate(pre => ({
                    ...pre,
                    paymentdata: null,
                    paymenttable: null,
                    objdatapaymentafterfilter: null,
                    objAlldatapayment: null
                }))
            }
        }).then(() => { setisloading(false) })
    }, [])

    if (isloading) {
        return <>
            <Header />
            <LoadingObj />
        </>
    }
    if (!maindatastate.paymentdata || !maindatastate.paymenttable) {
        return <>
            <Header />
            {/* {JSON.stringify(maindatastate.objAlldatapayment)} */}
            <div className="w-full flex justify-center ">
            <div className="flex justify-center flex-col items-center">
                <p className="mt-3 text-red-500">ยังไม่มีข้อมูลใดๆ</p>
                <a className="underline hover:cursor-pointer text-red-700" onClick={()=>{navigate(-1)} }>กลับ</a>
            </div>
            </div>
        </>
    }
    return <div>
        <Header />
        {/* {JSON.stringify(datalocation)} */}
        {/* {JSON.stringify(maindatastate.paymentdata.map(item=>convertlisttoObj(maindatastate.paymenttable,item)))} */}
        {/* {maindatastate.objdatapaymentafterfilter&&JSON.stringify(maindatastate.objdatapaymentafterfilter)} */}
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-5/6">

                <select value={typecapfilter} onChange={(e) => { settypecapfilter(e.target.value); setmaindatastate(pre => ({ ...pre, objdatapaymentafterfilter: pre.objAlldatapayment.filter(item => item.typecap == e.target.value && (item.major == objforget_THtoEN_Major[datalocation.majorshow] || item.major == `s${objforget_THtoEN_Major[datalocation.majorshow]}`)) })) }} name="" id="" className="w-full focus:ring-0 focus:outline-none border-gray rounded-lg focus:border-gray-500">
                    {[...new Set(maindatastate.objAlldatapayment.map(obj => obj.typecap))].map(typecap =>
                        <option key={uuidv4()} value={typecap}>{typecap}</option>
                    )}
                </select></div>
            {/* {JSON.stringify(maindatastate)} */}
            {/* {datalocation.fiscalyearshow} */}
            <div className="w-5/6 flex justify-start flex-col mt-4 border-b-2">
                <p className="text-lg">ปีงบประมาณ {datalocation.fiscalyearshow}</p>
                <p>ประเภท {typecapfilter}</p>
                <p>ภาควิชา {datalocation.majorshow} ({objforget_THtoEN_Major[datalocation.majorshow]})</p>
            </div>

            {([...new Set(maindatastate.objdatapaymentafterfilter.map(item => item.month))].length > 0 ? [...new Set(maindatastate.objdatapaymentafterfilter.map(item => item.month))].map(month =>
                <div className="w-5/6 mt-3">
                    <div className="">
                        {/* <p>{typecapfilter}</p> */}
                    </div>
                    <div key={uuidv4()} className="bg-gray-400  px-3 h-10 flex items-center rounded-lg">{Intl.DateTimeFormat("th-TH", { month: "long", year: 'numeric' }).format(new Date(month))}</div>

                    {maindatastate.objdatapaymentafterfilter.filter(obj => obj.month == month).length > 0 ? maindatastate.objdatapaymentafterfilter.filter(obj => obj.month == month).map(itemobj =>
                        <div key={uuidv4()} className={`border-l-8 ${itemobj.major[0] == 's' ? 'bg-blue-100' : ''} ${itemobj.ispayment ? 'border-green-500' : 'border-red-500'}  rounded-lg`}>
                            <div className="border my-2 rounded-e-lg">
                                <div className="flex flex-row justify-between p-3">
                                    <div className="flex flex-row">
                                        <p>{itemobj.name}</p>
                                        <p className="ml-2">{itemobj.lastname}</p>
                                    </div>
                                    <p className="text-sm">{itemobj.stdcode}</p>
                                </div>
                                <div className="flex flex-row justify-between px-3 pb-3">
                                <p>{itemobj.major}</p>
                                
                                <p className={`${itemobj.ispayment?'bg-gray-200':'bg-red-500'} px-2 rounded-lg`}>{itemobj.ispayment?'จ่ายแล้ว':'ยังไม่จ่าย'}</p>
                            </div>
                            </div>
                        </div>
                    ) : <p>ยังไม่มีข้อมูลใด</p>
                    }

                    {/* maindatastate.objdatapaymentafterfilter.filter(obj=>obj.month==month)).map(item=>
                <div>
                    {JSON.stringify(item)}
                </div> */}
                </div>
            ):<p className="mt-3 text-red-500">ยังไม่มีข้อมูลใดๆ</p>
        )}





        </div>
        {/* {JSON.stringify([...new Set(maindatastate.objdatapaymentafterfilter.map(obj=>Intl.DateTimeFormat('th-TH',{month:'long',year:"numeric"}).format(new Date(obj.month))))].map(month=>maindatastate.objdatapaymentafterfilter.filter(obj=>new Date(Intl.DateTimeFormat('th-TH',{month:'long',year:"numeric"}).format(obj.month)).toISOString()==new Date(month).toISOString())))} */}
        {/* {JSON.stringify(maindatastate.objdatapaymentafterfilter)} */}


    </div>

}


export default ViewerPaymentlog