import { useEffect, useState } from "react"
import Header from "../Header"
import api from "../tool/AxiosInstance";
import LoadingObj from "../../assets/LoadingObj";
import { v4 as uuidv4 } from 'uuid';
import SendingObj from "../../assets/SendingObj";
import Aleart from "../Aleart";


function Fisnpayment() {
    const [maindata, setmaindata] = useState()
    const [objAfterfilterYear, setobjAfterfilterYear] = useState()
    const [isLoadingpage, setLoadingpage] = useState(true)
    const [pageshow, setpageshow] = useState("main")
    const [yearshow, setyearshow] = useState()

    useEffect(() => {
        const requestData = {
            type: "getpaymentlogbyyearandtypecap",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {
            },

        };
        setLoadingpage(true)
        api.post("/", JSON.stringify(requestData), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials: true
        }).then(res => {
            let baseobj = res.data.data.map(item => convertlisttoObj(res.data.headtable, item))
            let filterfiscalyear = [...new Set(baseobj.map(item => item.fiscalyear))]
            setmaindata({
                ...res.data,
                objdata: baseobj,
                listfiscalyearforfilter: filterfiscalyear,
            })
            // setfiscalyearfilter(Math.max(...filterfiscalyear))
            setyearshow(Math.max(...filterfiscalyear))
            setobjAfterfilterYear(baseobj.filter(item => item.fiscalyear == Math.max(...filterfiscalyear)))
        }).then(() => { setLoadingpage(false) })

    }, [])
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

    if (isLoadingpage) {
        return (<>
            <Header />
            <LoadingObj />
        </>)
    }

    return (<>
        {pageshow == 'main' &&(<>

            <Header />
            <div className="w-full flex flex-col justify-center items-center">
                <div className="w-5/6">
                    <div className="w-full my-2">
                        <p className="w-full text-center text-xl my-4">จัดการสถานะการโอนเงิน</p>

                        <select className="w-full rounded-lg focus:outline-none focus:ring-0  border-2" name="" id="" value={yearshow} onChange={(e) => { setyearshow(e.target.value) }} >
                            {maindata.listfiscalyearforfilter.map(year => <option key={uuidv4}>{year}</option>)}
                        </select>

                    </div>
                    {([... new Set(objAfterfilterYear.map(item => item.term))].map(term =>
                        <div key={uuidv4()} className="w-full border-2 flex flex-col justify-center items-center rounded-lg py-3 my-5">
                            <p>{term}</p>

                            {[...new Set(objAfterfilterYear.filter(item => item.term == term).map(item => item.typecap))].map(typecap =>
                                <div key={uuidv4()} className="w-5/6 border-b-2 h-10 flex justify-between items-center px-3 ">
                                    <p>{typecap}</p>
                                    <a className="hover:cursor-pointer px-2 bg-blue-500 rounded-lg ">จัดการ</a>
                                </div>)}

                        </div>))}
                </div>
            </div>





        </>
        )
            }
    </>)
}

export default Fisnpayment