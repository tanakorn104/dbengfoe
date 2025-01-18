import { useEffect, useRef, useState } from "react";
import Header from "../Header";
import LinkPage from "../LinkPage";
import axios from "axios";
import { json, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { LineChart, Line } from 'recharts';
import React, { PureComponent } from 'react';
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import api from "../tool/AxiosInstance";
function ViewerDashboard() {
    const location = useLocation();
    const { datalocation } = location.state || {};
    const [loadingpage, setLoadingpage] = useState(true);
    const navigate = useNavigate();
    const [iserror, setiserror] = useState(false)
    const fiscalyear = useRef([])
    const types = useRef([])
    const [fiscalyearshow, setfiscalyearshow] = useState(null)
    const [typeshow, settypeshow] = useState(null)
    const [majorshow, setMajorshow] = useState("วิศวกรรมเกษตร")
    const [specialmajorshow, setspecialsetMajorshow] = useState("วิศวกรรมเกษตร (พิเศษ)")
    const [oganizshow, setoganizshow] = useState("งานกิจการนิสิต")
    const [softskillyeardata, setsoftskillyeardata] = useState({})

    const [Projectfinanceoverviewshow, setProhectfinanceoverviewshow] = useState([
        { name: 'Group A', value: null },
        { name: 'Group B', value: null },
    ]);
    const [Softskillshow, setSoftskillshow] = useState([
        {
            subject: 'การคิดและแก้ไขปัญหา',
            A: 0,
            fullMark: 100,
        },
        {
            subject: 'การบริหารจัดการตัวเอง',
            A: 0,
            fullMark: 100,
        },
        {
            subject: 'การทำงานร่วมกับผู้อื่น',
            A: 0,
            fullMark: 100,
        },
        {
            subject: 'ด้านเทคโนโลยี',
            A: 0,
            fullMark: 100,
        },
    ]);

    // const projectdata = useRef([
    //     { name: 'Group A', value: 400 },
    //     { name: 'Group B', value: 600 },
    //     // { name: 'Group C', value: 300 },
    //     // { name: 'Group D', value: 200 },
    // ]);
    const [organizshow, setorganizshow] = useState(null)
    const [maindatastate, setmaindatastate] = useState({
        Overviewdata: {
            overviewdata: null,
            overviewheadtable: null
        },
        Projectdata: {
            projectdata: null,
            projectheadtable: null
        }

    })

    const makeyearoption = (lists) => {
        const year = [];
        lists.map((list, index) => {
            year.push(list[0]);
        })
        // console.log([...new Set(year)]);
        fiscalyear.current = [...new Set(year)];
        setfiscalyearshow(Math.max(...fiscalyear.current));
        return Math.max(...fiscalyear.current);

    }
    const maketypeoption = (lists) => {
        const typeslocal = [];
        lists.map((list, index) => {
            typeslocal.push(list[1]);
        })
        // console.log([...new Set(year)]);
        types.current = [...new Set(typeslocal)];
        settypeshow("ภาพรวม")
        // settypeshow("ภาพรวม")

    }
    const makeoverviewfinance = (year, data) => {
        let list = data.filter((list) => list[0] == year)
        let used = 0;
        let total = 0;
        let sum = 0;
        list.map((list, index) => {
            total += list[4];
            used += list[5];
        })
        sum = used + total;
        setProhectfinanceoverviewshow([
            { name: 'คงเหลือ', value: total },
            { name: 'จ่ายแล้ว', value: Math.abs(used) },
        ])
    }
    const makeradarskill = (year, data) => {
        let P = 0;
        let M = 0;
        let F = 0;
        let T = 0;
        let sum = 0;
        let softskillyearcount = {

            // งบพัฒนานิสิต:{
            //     งานกิจการนิสิต:{
            //         ด้าน1...234

            //     },
            //     งานบริการการศึกษส
            // }
        };
        if (data) {
            let list = data.filter((list) => list[0] == year)
            list.map((list, index) => {
                if (!softskillyearcount[list[1]]) {
                    softskillyearcount[list[1]] = {};
                }

                // ตรวจสอบว่า softskillyearcount[list[1]][list[2]] มีอยู่หรือยัง
                if (!softskillyearcount[list[1]][list[2]]) {
                    softskillyearcount[list[1]][list[2]] = {};
                }

                // ตรวจสอบว่า softskillyearcount[list[1]][list[2]][list[11]] มีอยู่หรือยัง
                if (softskillyearcount[list[1]][list[2]][list[11]] !== undefined) {
                    // ถ้ามีอยู่แล้ว ให้เพิ่มค่าทีละ 1
                    softskillyearcount[list[1]][list[2]][list[11]]++;
                } else {
                    // ถ้ายังไม่มี ให้กำหนดค่าเริ่มต้นเป็น 1
                    softskillyearcount[list[1]][list[2]][list[11]] = 1;
                }
                switch (list[11]) {
                    case "ด้านการคิดและแก้ไขปัญหา":
                        F++;
                        break;
                    case "ด้านการบริหารจัดการตัวเอง":
                        M++;
                        break;
                    case "ด้านการทำงานร่วมกับผู้อื่น":
                        P++;
                        break;
                    case "ด้านเทคโนโลยี":
                        T++;
                        break;
                }
                sum++;
            })
        }
        setsoftskillyeardata(softskillyearcount)
        setSoftskillshow([
            {
                subject: 'การคิดและแก้ไขปัญหา',
                A: F / sum * 100,
                fullMark: 100,
            },
            {
                subject: 'การบริหารจัดการตัวเอง',
                A: M / sum * 100,
                fullMark: 100,
            },
            {
                subject: 'การทำงานร่วมกับผู้อื่น',
                A: P / sum * 100,
                fullMark: 100,
            },
            {
                subject: 'ด้านเทคโนโลยี',
                A: T / sum * 100,
                fullMark: 100,
            },
        ])
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

        const requestDataOverview = {
            type: "getoverviewbyyear",
            data: {

            },
            token: sessionStorage.getItem('acctoken')

        };
        const getallmaincapdata = api.post("/", JSON.stringify(requestDataOverview), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials:true
        }
        )
        const requestDataProject = {
            type: "getprojectbyyear",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {

            },
            token: sessionStorage.getItem('acctoken')

        };
        const getallprojectdata = api.post("/", JSON.stringify(requestDataProject), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials:true
        }
        )
        const requestmaincap = {
            type: "getallmaincap",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {

            },
            token: sessionStorage.getItem('acctoken')

        };
        const getallmaincap = api.post("/", JSON.stringify(requestmaincap), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials:true
        }
        )
        const requestDatatempcap = {
            type: "getrecipientscurrentcap",//sessionStorage.getItem('statusInsertOrUpdateData')
            data: {

            },
            token: sessionStorage.getItem('acctoken')

        };
        const getallcurrentcap = api.post("/", JSON.stringify(requestDatatempcap), {
            headers: {
                'Content-Type': 'application/json'
            },
            withCredentials:true
        }
        )

        Promise.all([getallmaincapdata, getallprojectdata, getallmaincap, getallcurrentcap]).then((result) => {
            setmaindatastate((predata) => ({
                ...predata,
                Overviewdata: {
                    overviewdata: result[0].data.data,
                    overviewheadtable: result[0].data.headtable

                },
                Projectdata: {
                    projectdata: result[1].data.data,
                    projectheadtable: result[1].data.headtable
                }
                ,
                Maincapdata: {
                    maincapdata: result[2].data.data,
                    maincapheadtable: result[2].data.headtable
                }
                ,
                Currentcapdata: {
                    currentcapdata: result[3].data.data,
                    currentcapheadtable: result[3].data.headtable
                }
            }))
            let firstyear = makeyearoption(result[0].data.data);
            makeradarskill(firstyear, result[1].data.data)
            maketypeoption(result[0].data.data);
            makeoverviewfinance(firstyear, result[0].data.data);
        }).then(() => {
            setLoadingpage(false);
        }).catch((err) => {
            console.error(err);
            setLoadingpage(false);
            setiserror(true);
        })
    }, [])


    const numberWithCommas = (number) => {
        const formattedNumber = number.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
        return formattedNumber

    }

    const handleMorebtn = (list) => {
        navigate("/Dashboard-projects", { state: { datalocation: list } });
    }
    function filterByMajor(data, major) {
        // console.log(">>>",data);
        // console.log('s'+major)
        return Object.values(data).filter(function (item) {
            // console.log(">>>",item.major === major);
           
            return item.major === major || item.major === ('s' + major);
        });
    }



    const capitaldata = [
        { name: 'Group A', value: 400 },
        { name: 'Group B', value: 300 },
        // { name: 'Group C', value: 300 },
        // { name: 'Group D', value: 200 },
    ];

    const COLORS = ['#00C49F', '#FF8042'];//'#0088FE'//'#FFBB28'

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }

    function SampleNextArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "white", }}
                onClick={onClick}
            />
        );
    }

    function SamplePrevArrow(props) {
        const { className, style, onClick } = props;
        return (
            <div
                className={className}
                style={{ ...style, display: "block", background: "white" }}
                onClick={onClick}
            />
        );
    }
    //for card slider
    var settings = {
        dots: true,
        infinite: true,
        speed: 10,
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 0,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 1
                }
            },

        ]
    };


    if (loadingpage) {
        return (
            <>
                <Header />
                {sessionStorage.getItem('role') == 'admin' ? <LinkPage /> : ''}
                <p className='w-full h-full flex justify-center items-center'>loading</p>
            </>
        )
    }
    if (iserror) {
        return (
            <>
                <Header />
                {sessionStorage.getItem('role') == 'admin' ? <LinkPage /> : ''}
                <p className='w-full h-full flex justify-center items-center'>ยังไม่มีข้อมูลใด</p>
                <p className='w-full h-full flex justify-center items-center text-red-500'>กรุณา ติดต่อผู้ดูแลระบบ</p>
            </>
        )
    }

    return (
        <>
            <Header />

            {sessionStorage.getItem('role') == 'admin' ? <LinkPage /> : ''}

            <div className="w-full  flex flex-col justify-center items-center ">
                {/* {maindatastate.Overviewdata.overviewdata} */}
                <div className="w-5/6  flex flex-col justify-center items-center rounded-none text-white hover:bg-red-700 h-32" style={{ backgroundColor: '#800C1F' }}>
                    <div className="w-5/6 flex flex-row  border-grey-600">
                        <p className="w-1/2 flex justify-start text-xl items-center">ปีงบประมาณ</p>
                        <div className=" w-1/2 flex justify-end ">
                            <select onChange={(e) => { setfiscalyearshow(e.target.value); makeoverviewfinance(e.target.value, maindatastate.Overviewdata.overviewdata); makeradarskill(e.target.value, maindatastate.Projectdata.projectdata) }} value={fiscalyearshow} name="" id="" className="rounded-lg   cursor-pointer text-center w-full border-none  focus:outline-none focus:ring-0 " style={{ backgroundColor: '#800C1F' }}>
                                {([...fiscalyear.current]).map((year) => {
                                    return <option className="" key={uuidv4()} value={year}>{year}</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="w-full mt-3 rounded-none flex justify-center">
                        <select onChange={(e) => { settypeshow(e.target.value) }} value={typeshow} name="type" id="" className=" h-10 rounded-none cursor-pointer  text-center w-5/6 text-black border-none  focus:outline-none focus:ring-0 bg-gray-200" style={{ border: "none" }}>
                            <option key={uuidv4()} className="rounded-none" value={"ภาพรวม"}>ภาพรวม</option>
                            <option className="rounded-none" key={uuidv4()} value="องค์กร">หน่วยงาน</option>
                            <option className="rounded-none" key={uuidv4()} value="ภาควิชา">ภาควิชา</option>                        </select>
                    </div>
                </div>


                <div className="w-5/6 ">
                    {/* <p>งบพัฒนานิสิต</p> */}
                    {/* {typeshow != "ภาพรวม" && maindatastate.Overviewdata.overviewdata.filter((list) => list[0] == fiscalyearshow && list[1] == typeshow).map((list, index) => {
                        return <>
                        
                            <div className="border-b bg-gray-100 rounded-lg   my-3 flex flex-col p-5" >
                                <p>{list[2]}</p>
                                <div className="">
                                    <p className="font-light pl-3 flex justify-between border-b py-2"><span>ยอดเต็ม</span><span>{numberWithCommas(list[3])}</span></p>
                                    <p className="font-light pl-3 flex justify-between border-b py-2"><span>งบผูกพัน</span><span>{numberWithCommas(list[5])}</span></p>
                                    <p className="font-light pl-3 flex justify-between border-b py-2"><span>คงเหลือ</span><span>{numberWithCommas(list[4])}</span></p>
                                </div>
                                <a onClick={() => { handleMorebtn([list[0], list[1], list[2]]) }} className="w-full flex justify-center items-center mt-2 hover:text-gray-500 cursor-pointer">เพิ่มเติม</a>
                            </div>
                        </>
                    })} */}
                    {typeshow == 'องค์กร' ?
                        <div className="w-full">
                            <select onChange={(e) => (setoganizshow(e.target.value))} value={oganizshow} name="" id="" className=" border-none w-full focus:outline-none focus:border-none focus:ring-0  font-light truncate">
                                <option value="งานกิจการนิสิต">งานกิจการนิสิต</option>
                                <option value="งานบริการการศึกษา">งานบริการการศึกษา</option>
                                <option value="งานวิเทศน์">งานวิเทศน์</option>
                                <option value="สโมสรนิสิต">สโมสรนิสิต</option>
                            </select>

                            {/* {maindatastate.Overviewdata.overviewdata} */}
                        </div> : ''}
                    {typeshow == "องค์กร" && maindatastate.Overviewdata.overviewdata.filter((list) => list[0] == fiscalyearshow && list[1] == 'งบพัฒนานิสิต' && list[2] == oganizshow).map((list, index) => {
                        return <>
                            <div className="h-60">

                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="40%" outerRadius="60%" data={[
                                        {
                                            subject: 'ด้านการคิดและแก้ไขปัญหา' + "(" + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านการคิดและแก้ไขปัญหา'] ? softskillyeardata[list[1]][oganizshow]['ด้านการคิดและแก้ไขปัญหา'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                            A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านการคิดและแก้ไขปัญหา'] ? softskillyeardata[list[1]][oganizshow]['ด้านการคิดและแก้ไขปัญหา'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[oganizshow] ? (Object.values(softskillyeardata[list[1]][oganizshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                            fullMark: 10,
                                        },
                                        {
                                            subject: 'การบริหารจัดการตัวเอง(' + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านการบริหารจัดการตัวเอง'] ? softskillyeardata[list[1]][oganizshow]['ด้านการบริหารจัดการตัวเอง'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                            A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านการบริหารจัดการตัวเอง'] ? softskillyeardata[list[1]][oganizshow]['ด้านการบริหารจัดการตัวเอง'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[oganizshow] ? (Object.values(softskillyeardata[list[1]][oganizshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                            fullMark: 10,
                                        },
                                        {
                                            subject: 'การทำงานร่วมกับผู้อื่น(' + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านการทำงานร่วมกับผู้อื่น'] ? softskillyeardata[list[1]][oganizshow]['ด้านการทำงานร่วมกับผู้อื่น'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                            A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านการทำงานร่วมกับผู้อื่น'] ? softskillyeardata[list[1]][oganizshow]['ด้านการทำงานร่วมกับผู้อื่น'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[oganizshow] ? (Object.values(softskillyeardata[list[1]][oganizshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                            fullMark: 10,
                                        },
                                        {
                                            subject: 'เทคโนโลยี(' + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านเทคโนโลยี'] ? softskillyeardata[list[1]][oganizshow]['ด้านเทคโนโลยี'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                            A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[oganizshow] ? softskillyeardata[list[1]][oganizshow]?.['ด้านเทคโนโลยี'] ? softskillyeardata[list[1]][oganizshow]['ด้านเทคโนโลยี'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[oganizshow] ? (Object.values(softskillyeardata[list[1]][oganizshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                            fullMark: 10,
                                        },
                                    ]}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis />
                                        <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="my-3">
                                <div className="pl-3 h-10 flex flex-row justify-between items-center bg-gray-200 border-black">
                                    <span>
                                        {list[1]}
                                    </span>
                                    <span>
                                        <a onClick={() => { handleMorebtn([list[0], list[1], list[2]]) }} className=" w-full flex justify-center items-center mt-2 hover:text-gray-500 cursor-pointer pr-3">เพิ่มเติม</a>

                                    </span>
                                </div>
                                <div className="">
                                    <p className="font-light pl-3 flex justify-between border-b py-2"><span>ยอดเต็ม</span><span>{numberWithCommas(list[3])}</span></p>
                                    <p className="font-light pl-3 flex justify-between border-b py-2"><span>งบผูกพัน</span><span>{numberWithCommas(list[5])}</span></p>
                                    <p className="font-light pl-3 flex justify-between border-b py-2 text-red-500"><span>คงเหลือ</span><span>{numberWithCommas(list[4])}</span></p>

                                </div>

                            </div>
                        </>
                    })}




                    {typeshow == 'ภาควิชา' ?
                        <div className="w-full">
                            <select onChange={(e) => (setMajorshow(e.target.value))} value={majorshow} name="" id="" className=" border-none w-full focus:outline-none focus:border-none focus:ring-0  font-light truncate">
                                <option value="วิศวกรรมเกษตร">วิศวกรรมเกษตร</option>
                                <option value="วิศวกรรมชลประทาน">วิศวกรรมชลประทาน</option>
                                <option value="วิศวกรรมการอาหาร">วิศวกรรมการอาหาร</option>
                                <option value="วิศวกรรมโยธา">วิศวกรรมโยธา</option>
                                <option value="วิศวกรรมเครื่องกล">วิศวกรรมเครื่องกล</option>
                                <option value="วิศวกรรมคอมพิวเตอร์">วิศวกรรมคอมพิวเตอร์</option>
                                <option value="วิศวกรรมอุตสาหการ">วิศวกรรมอุตสาหการ</option>
                            </select>
                        </div> : ''}
                    {typeshow == "ภาควิชา" ?
                        <div className=" flex flex-col  ">
                            {/* {majorshow} */}
                            <div className="slider-container">
                                <Slider {...settings}>

                                    {maindatastate.Overviewdata.overviewdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == majorshow || list[2] == majorshow + ' (พิเศษ)')).map((list, index) => {
                                        return <><div className="w-full h-60  my-3">
                                            <p className="w-full pl-5">{list[1]}</p>
                                            <ResponsiveContainer width="90%" height="90%">
                                                <RadarChart cx="55%" cy="55%" outerRadius="60%" data={[
                                                    {
                                                        subject: 'ด้านการคิดและแก้ไขปัญหา' + "(" + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านการคิดและแก้ไขปัญหา'] ? softskillyeardata[list[1]][majorshow]['ด้านการคิดและแก้ไขปัญหา'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                                        A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านการคิดและแก้ไขปัญหา'] ? softskillyeardata[list[1]][majorshow]['ด้านการคิดและแก้ไขปัญหา'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[majorshow] ? (Object.values(softskillyeardata[list[1]][majorshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                                        fullMark: 10,
                                                    },
                                                    {
                                                        subject: 'การบริหารจัดการตัวเอง(' + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านการบริหารจัดการตัวเอง'] ? softskillyeardata[list[1]][majorshow]['ด้านการบริหารจัดการตัวเอง'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                                        A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านการบริหารจัดการตัวเอง'] ? softskillyeardata[list[1]][majorshow]['ด้านการบริหารจัดการตัวเอง'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[majorshow] ? (Object.values(softskillyeardata[list[1]][majorshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                                        fullMark: 10,
                                                    },
                                                    {
                                                        subject: 'การทำงานร่วมกับผู้อื่น(' + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านการทำงานร่วมกับผู้อื่น'] ? softskillyeardata[list[1]][majorshow]['ด้านการทำงานร่วมกับผู้อื่น'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                                        A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านการทำงานร่วมกับผู้อื่น'] ? softskillyeardata[list[1]][majorshow]['ด้านการทำงานร่วมกับผู้อื่น'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[majorshow] ? (Object.values(softskillyeardata[list[1]][majorshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                                        fullMark: 10,
                                                    },
                                                    {
                                                        subject: 'เทคโนโลยี(' + (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านเทคโนโลยี'] ? softskillyeardata[list[1]][majorshow]['ด้านเทคโนโลยี'] : 0 : 0 : "ไม่มีข้อมูล") + ")",
                                                        A: (softskillyeardata?.[list[1]] ? softskillyeardata[list[1]]?.[majorshow] ? softskillyeardata[list[1]][majorshow]?.['ด้านเทคโนโลยี'] ? softskillyeardata[list[1]][majorshow]['ด้านเทคโนโลยี'] : 0 : 0 : "ไม่มีข้อมูล") / (softskillyeardata[list[1]]?.[majorshow] ? (Object.values(softskillyeardata[list[1]][majorshow]).reduce((sum, current) => sum + current, 0)) : 0) * 100,
                                                        fullMark: 10,
                                                    },
                                                ]}>
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="subject" />
                                                    <PolarRadiusAxis />
                                                    <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        </>

                                    })}


                                </Slider>
                            </div>


                        </div> : ''}
                    {typeshow == "ภาควิชา" ?
                        <div className=" flex flex-col mt-5 ">
                            {maindatastate.Overviewdata.overviewdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == majorshow || list[2] == majorshow + ' (พิเศษ)')).map((list, index) => {

                                return <>
                                    <div className="my-3">
                                        <div className="pl-3 h-10 flex flex-row justify-between items-center bg-gray-300 border-black">
                                            <span>
                                                {list[1]}
                                            </span>
                                            <span>
                                                <a onClick={() => { handleMorebtn([list[0], list[1], list[2]]) }} className=" w-full flex justify-center items-center mt-2 hover:text-gray-500 cursor-pointer pr-3">เพิ่มเติม</a>

                                            </span>
                                        </div>
                                        <div className="">
                                            <p className="font-light pl-3 flex justify-between border-b py-2"><span>ยอดเต็ม</span><span>{numberWithCommas(list[3])}</span></p>
                                            <p className="font-light pl-3 flex justify-between border-b py-2"><span>งบผูกพัน</span><span>{numberWithCommas(list[5])}</span></p>
                                            <p className="font-light pl-3 flex justify-between border-b py-2 text-red-500"><span>คงเหลือ</span><span>{numberWithCommas(list[4])}</span></p>

                                        </div>

                                    </div>


                                </>

                            })}
                        </div> : ''}

                    {typeshow == 'ภาควิชา' ?
                        <>
                            {['ทุนเรียนดี', 'ทุนทำงาน', 'ทุนขัดสน'].map(typecapmap => {
                                return (
                                    <>
                                      {/* {filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecapmap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),(majorshow == 'วิศวกรรมเกษตร' ? 'AE' : majorshow == 'วิศวกรรมชลประทาน' ? 'IRRE' : majorshow == 'วิศวกรรมอาหาร' ? 'FE' : majorshow == 'วิศวกรรมโยธา' ? 'CE' : majorshow == 'วิศวกรรมเคลื่องกล' ? 'ME' : majorshow == 'วิศวกรรมคอมพิวเตอร์' ? 'CPE' : majorshow == 'วิศวกรรมอุตสาหการ' ? 'IE' : '')).map((obj) => { return <p className={obj.major[0]=='s'?'bg-green-400':''}>{(obj.major)}</p> })} */}

                                        <div className="flex flex-row h-10 justify-between bg-gray-300 px-3">
                                            <p className="h-full flex justify-center items-center">
                                                {typecapmap}
                                            </p>
                                            {/* {JSON.stringify(Object.values(maindatastate.dataresdata))} */}
                                            <p className=" flex items-center text-sm sm:text-base">เบิก {maindatastate.Currentcapdata.currentcapdata ? filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecapmap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),(majorshow == 'วิศวกรรมเกษตร' ? 'AE' : majorshow == 'วิศวกรรมชลประทาน' ? 'IRRE' : majorshow == 'วิศวกรรมอาหาร' ? 'FE' : majorshow == 'วิศวกรรมโยธา' ? 'CE' : majorshow == 'วิศวกรรมเคลื่องกล' ? 'ME' : majorshow == 'วิศวกรรมคอมพิวเตอร์' ? 'CPE' : majorshow == 'วิศวกรรมอุตสาหการ' ? 'IE' : '')).length : ''}/{convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecapmap)[0])['n' + (majorshow == 'วิศวกรรมเกษตร' ? 'AE' : majorshow == 'วิศวกรรมชลประทาน' ? 'IRRE' : majorshow == 'วิศวกรรมอาหาร' ? 'FE' : majorshow == 'วิศวกรรมโยธา' ? 'CE' : majorshow == 'วิศวกรรมเคลื่องกล' ? 'ME' : majorshow == 'วิศวกรรมคอมพิวเตอร์' ? 'CPE' : majorshow == 'วิศวกรรมอุตสาหการ' ? 'IE' : '')]} คน </p>
                                        </div>
                                        {
                                            maindatastate.Currentcapdata.currentcapdata && filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecapmap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),(majorshow == 'วิศวกรรมเกษตร' ? 'AE' : majorshow == 'วิศวกรรมชลประทาน' ? 'IRRE' : majorshow == 'วิศวกรรมอาหาร' ? 'FE' : majorshow == 'วิศวกรรมโยธา' ? 'CE' : majorshow == 'วิศวกรรมเคลื่องกล' ? 'ME' : majorshow == 'วิศวกรรมคอมพิวเตอร์' ? 'CPE' : majorshow == 'วิศวกรรมอุตสาหการ' ? 'IE' : '')).length>0?filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecapmap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),(majorshow == 'วิศวกรรมเกษตร' ? 'AE' : majorshow == 'วิศวกรรมชลประทาน' ? 'IRRE' : majorshow == 'วิศวกรรมอาหาร' ? 'FE' : majorshow == 'วิศวกรรมโยธา' ? 'CE' : majorshow == 'วิศวกรรมเคลื่องกล' ? 'ME' : majorshow == 'วิศวกรรมคอมพิวเตอร์' ? 'CPE' : majorshow == 'วิศวกรรมอุตสาหการ' ? 'IE' : '')).map((obj, index) => {
                                                // maindatastate.Currentcapdata.currentcapdata&& (maindatastate.Currentcapdata.currentcapdata).filter((list) => list[0] == fiscalyearshow && list[1] == typecapmap && list[6] == (majorshow == 'วิศวกรรมเกษตร' ? 'AE' : majorshow == 'วิศวกรรมชลประทาน' ? 'IRRE' : majorshow == 'วิศวกรรมอาหาร' ? 'FE' : majorshow == 'วิศวกรรมโยธา' ? 'CE' : majorshow == 'วิศวกรรมเคลื่องกล' ? 'ME' : majorshow == 'วิศวกรรมคอมพิวเตอร์' ? 'CPE' : majorshow == 'วิศวกรรมอุตสาหการ' ? 'IE' : '')).length!=0 ? (maindatastate.Currentcapdata.currentcapdata).filter((list) => list[0] == fiscalyearshow && list[1] == typecapmap && list[6] == (majorshow == 'วิศวกรรมเกษตร' ? 'AE' : majorshow == 'วิศวกรรมชลประทาน' ? 'IRRE' : majorshow == 'วิศวกรรมอาหาร' ? 'FE' : majorshow == 'วิศวกรรมโยธา' ? 'CE' : majorshow == 'วิศวกรรมเคลื่องกล' ? 'ME' : majorshow == 'วิศวกรรมคอมพิวเตอร์' ? 'CPE' : majorshow == 'วิศวกรรมอุตสาหการ' ? 'IE' : '')).map((list) => { return convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list) }).map((obj, index) => {
                                                return (
                                                    <>

                                                        <div className={`w-full h-10  border-b  flex flex-row justify-between overflow-auto ${obj.major[0]=='s'?'bg-sky-100':''}`}>
                                                            <span className="w-2/6 sm:max-w-28 sm:text-sm text-xs font-light text-center flex items-center justify-start truncate ">{obj.stdcode}</span>
                                                            <span className="w-4/6 grow  pl-3 flex flex-row justify-between">
                                                                <span className="w-1/5 hidden sm:block ">
                                                                    <span className="w-full h-full text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.title}</span>
                                                                </span>
                                                                <span className="w-1/5 text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.name}</span>
                                                                <span className="w-1/5 text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.lastname}</span>
                                                                <span className="w-1/5 text-xs sm:text-sm font-light text-end flex items-center justify-end truncate ">{obj.major}</span>
                                                                <span className="w-1/5 text-xs sm:text-sm font-light text-center flex items-center justify-end truncate ">ปี {obj.year}</span>

                                                            </span>
                                                            {/* <span className="w-1/6 h-10 flex justify-center items-center font-normal text-red-500 cursor-pointer hover:text-red-400 ">
                                                    <a onClick={() => { handledel(obj.stdcode) }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                                        </svg>
                                                    </a>

                                                </span>  */}

                                                        </div>
                                                    </>

                                                )
                                            }): <p className="w-full flex justify-center items-center">ยังไม่มีข้อมูลใดๆ</p>

                            }
                                    </>
                                )
                            }
                            )}
                        </> : ''}
                    
                    {typeshow == "ภาพรวม" ? (<>
                        <div className="flex mt-5 border-t flex-col">
                            <h1 className="w-full font-semibold text-lg mt-2">สรุปภาพรวม</h1>
                            <div className="z-0 flex flex-wrap">
                                { }
                                <div className=" mx-5 mt-5  grow sm:w-full md:w-full w-full   h-36  border-2 rounded-xl  bg-white flex-col">
                                    <div className="bg-white px-4 h-full flex flex-row justify-center   items-center">
                                        <div className="h-full w-1/2 text-xl  flex flex-col font-bold justify-center items-center">
                                            <div className="flex flex-row justify-center items-center">
                                                <p className="text-2xl">{maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow).length}</p>
                                                <p className="text-base font-normal ml-2">โครงการ</p>
                                            </div>
                                            <div className="flex flex-row justify-center items-center">
                                                <p className="text-green-500">{maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && list[9] == 'done').length}</p>
                                                <p className="text-base font-normal ml-2">สำเร็จ</p>
                                            </div>
                                        </div>
                                        <div className="h-full w-1/2 text-xl  flex flex-col font-bold justify-center items-center">
                                            <div className="flex flex-row justify-center items-center">
                                                <p className="text-2xl">{maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow).reduce((sum, item) => { return sum + item[12] }, 0)}</p>
                                                <p className="text-base font-normal ml-2">ทุน</p>
                                            </div>
                                            <div className="flex flex-row justify-center items-center">
                                                <p className="text-green-500">{maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow).length}</p>
                                                <p className="text-base font-normal ml-2">คน</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className=" m-5  grow sm:w-full md:max-w-[2*sm] basis-96  h-96 border-2 rounded-xl pt-6 bg-gray-100 flex-col">
                                    <div className="bg-gray-100  h-14 flex flex-col justify-between pr-5  items-center sm:flex-row sm:justify-start sm:items-starts ">
                                        <div className="w-full sm:w-1/3 h-full text-xl pb-2 flex   justify-start pl-5 items-start "><div className="text-lg sm:text-xl">โครงการ</div></div>
                                        <div className="flex h-full sm:w-2/3 flex-col w-full items-start pl-10   sm:justify-start sm:items-end">
                                            <div className="flex flex-row justify-center items-center "><div className="w-3 h-3 rounded-2xl flex justify-center items-center mr-2" style={{ backgroundColor: "#00C49F" }}></div><p className="text-sm md:text-base flex sm:justify-end">คงเหลือ {numberWithCommas(Projectfinanceoverviewshow[0].value)} บาท</p></div>
                                            <div className="flex flex-row justify-center items-center "><div className="w-3 h-3 rounded-2xl flex justify-center items-center mr-2" style={{ backgroundColor: "#FF8042" }}></div><p className="text-sm md:text-base flex sm:justify-end">จ่ายแล้ว {numberWithCommas(Projectfinanceoverviewshow[1].value)} บาท</p> </div>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height="70%">
                                        <PieChart width={500} height={500} >
                                            <Pie
                                                data={Projectfinanceoverviewshow}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                style={{ margin: 0, padding: 0 }}

                                            >
                                                {Projectfinanceoverviewshow.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* <a className="w-full flex justify-center items-center border-t-2  h-12 cursor-pointer hover:text-gray-400">เพิ่มเติม</a> */}


                                </div>
                                <div className=" m-5  grow sm:w-full md:max-w-[2*sm] basis-96 w-full   h-96 border-2 rounded-xl pt-6 bg-gray-100 flex-col">

                                    <div className="bg-gray-100 h-14 flex flex-row justify-between pr-5 right-4 items-center ">
                                        <div className="w-full h-full text-xl pl-6 flex justify-start items-start "><div className="">ผลสรุปซอฟต์สกิล</div></div>
                                        {/* <div className="flex h-full flex-col w-1/2 items-center md:flex md:flex-row md:justify-end md:items-start">
    </div> */}
                                    </div>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="40%" outerRadius="60%" data={Softskillshow}>
                                            <PolarGrid />
                                            <PolarAngleAxis dataKey="subject" />
                                            <PolarRadiusAxis />
                                            <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>

                                </div>

                                <div className=" m-5  grow sm:w-full md:max-w-[2*sm] basis-96  h-96 border-2 rounded-xl pt-6 bg-gray-100 flex-col justify-center items-center">
                                    <div className="bg-gray-100 h-14 flex flex-col justify-between pr-5 right-4 items-center sm:flex-row sm:justify-start sm:items-starts ">
                                        <div className="w-full  h-full text-xl pb-2 flex justify-start pl-5 items-start "><div className="text-lg sm:text-xl">การดำเนินการ หน่วยงาน</div></div>

                                    </div>
                                    <ResponsiveContainer width="90%" height="80%">
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={[
                                                {
                                                    name: 'กิจการนิสิต',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานกิจการนิสิต' && list[0] == fiscalyearshow).length - maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานกิจการนิสิต' && list[9] == 'done' && list[0] == fiscalyearshow).length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานกิจการนิสิต' && list[9] == 'done' && list[0] == fiscalyearshow).length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: '',
                                                    pending: 0,
                                                    done: 0,
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'งานบริการ',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานบริการการศึกษา' && list[0] == fiscalyearshow).length - maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานบริการการศึกษา' && list[9] == 'done' && list[0] == fiscalyearshow).length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานบริการการศึกษา' && list[9] == 'done' && list[0] == fiscalyearshow).length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: '',
                                                    pending: 0,
                                                    done: 0,
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'งานวิเทศน์',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานวิเทศน์' && list[0] == fiscalyearshow).length - maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานวิเทศน์' && list[9] == 'done' && list[0] == fiscalyearshow).length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'งานวิเทศน์' && list[9] == 'done' && list[0] == fiscalyearshow).length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: '',
                                                    pending: 0,
                                                    done: 0,
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'สโมสรนิสิต',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'สโมสรนิสิต' && list[0] == fiscalyearshow).length - maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'สโมสรนิสิต' && list[9] == 'done' && list[0] == fiscalyearshow).length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[2] == 'สโมสรนิสิต' && list[9] == 'done' && list[0] == fiscalyearshow).length,//done
                                                    amt: 0,
                                                },





                                            ]}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="done" stackId="a" fill="#60d394" />
                                            <Bar dataKey="pending" stackId="a" fill="#ee6055" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    {/* <a className="w-full flex justify-center items-center border-t-2  h-12 cursor-pointer hover:text-gray-400">เพิ่มเติม</a> */}

                                </div>
                                <div className=" m-5  grow sm:w-full md:max-w-[2*sm] basis-96  h-96 border-2 rounded-xl pt-6 bg-gray-100 flex-col justify-center items-center">

                                    <div className="bg-gray-100 h-14 flex flex-col justify-between pr-5 right-4 items-center sm:flex-row sm:justify-start sm:items-starts ">
                                        <div className="w-full  h-full text-xl pb-2 flex justify-start pl-5 items-start "><div className="text-lg sm:text-xl ">การดำเนินการ ภาควิชา</div></div>
                                        {/* <div className="flex h-full sm:w-2/3 flex-col w-full items-start pl-10   sm:justify-start sm:items-end">
                                            <div className="flex flex-row justify-center items-center "><div className="w-3 h-3 rounded-2xl flex justify-center items-center mr-2" style={{ backgroundColor: "#00C49F" }}></div><p className="text-sm md:text-base flex sm:justify-end">คงเหลือ 56443 บาท</p></div>
                                            <div className="flex flex-row justify-center items-center "><div className="w-3 h-3 rounded-2xl flex justify-center items-center mr-2" style={{ backgroundColor: "#FF8042" }}></div><p className="text-sm md:text-base flex sm:justify-end">จ่ายแล้ว 45053495 บาท</p> </div>
                                        </div> */}
                                    </div>
                                    <ResponsiveContainer width="90%" height="80%">
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={[
                                                {
                                                    name: 'AE',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมเกษตร' || list[2] == 'วิศวกรรมเกษตร (พิเศษ)')).length - maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมเกษตร' || list[2] == 'วิศวกรรมเกษตร (พิเศษ)')) && list[9] == 'done').length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมเกษตร' || list[2] == 'วิศวกรรมเกษตร (พิเศษ)')) && list[9] == 'done').length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'IRRE',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมชลประทาน' || list[2] == 'วิศวกรรมชลประทาน (พิเศษ)')).length - maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมชลประทาน' || list[2] == 'วิศวกรรมชลประทาน (พิเศษ)')) && list[9] == 'done').length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมชลประทาน' || list[2] == 'วิศวกรรมชลประทาน (พิเศษ)')) && list[9] == 'done').length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'FE',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมการอาหาร' || list[2] == 'วิศวกรรมการอาหาร (พิเศษ)')).length - maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมการอาหาร' || list[2] == 'วิศวกรรมการอาหาร (พิเศษ)')) && list[9] == 'done').length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมการอาหาร' || list[2] == 'วิศวกรรมการอาหาร (พิเศษ)')) && list[9] == 'done').length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'CE',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมโยธา' || list[2] == 'วิศวกรรมโยธา (พิเศษ)')).length - maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมโยธา' || list[2] == 'วิศวกรรมโยธา (พิเศษ)')) && list[9] == 'done').length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมโยธา' || list[2] == 'วิศวกรรมโยธา (พิเศษ)')) && list[9] == 'done').length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'ME',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมเครื่องกล' || list[2] == 'วิศวกรรมเครื่องกล (พิเศษ)')).length - maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมเครื่องกล' || list[2] == 'วิศวกรรมเครื่องกล (พิเศษ)')) && list[9] == 'done').length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมเครื่องกล' || list[2] == 'วิศวกรรมเครื่องกล (พิเศษ)')) && list[9] == 'done').length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'CPE',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมคอมพิวเตอร์' || list[2] == 'วิศวกรรมคอมพิวเตอร์ (พิเศษ)')).length - maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมคอมพิวเตอร์' || list[2] == 'วิศวกรรมคอมพิวเตอร์ (พิเศษ)')) && list[9] == 'done').length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมคอมพิวเตอร์' || list[2] == 'วิศวกรรมคอมพิวเตอร์ (พิเศษ)')) && list[9] == 'done').length,//done
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'IE',
                                                    pending: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && (list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมอุตสาหการ' || list[2] == 'วิศวกรรมอุตสาหการ (พิเศษ)')).length - maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมอุตสาหการ' || list[2] == 'วิศวกรรมอุตสาหการ (พิเศษ)')) && list[9] == 'done').length,//all
                                                    done: maindatastate.Projectdata.projectdata.filter((list) => list[0] == fiscalyearshow && ((list[1] == 'งบพัฒนานิสิตภาค' || list[1] == 'รายได้ภาควิชา' || list[1] == 'รายได้ภาควิชา (พิเศษ)') && (list[2] == 'วิศวกรรมอุตสาหการ' || list[2] == 'วิศวกรรมอุตสาหการ (พิเศษ)')) && list[9] == 'done').length,//done
                                                    amt: 0,
                                                },

                                            ]}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="done" stackId="a" fill="#60d394" />
                                            <Bar dataKey="pending" stackId="a" fill="#ee6055" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    {/* <a className="w-full flex justify-center items-center border-t-2  h-12 cursor-pointer hover:text-gray-400">เพิ่มเติม</a> */}

                                </div>


                                {/* {JSON.stringify(maindatastate.Projectdata.projectdata.filter((list)=>list[0]==fiscalyearshow).map((list)=>list[11]))} */}
                                <div className=" m-5  grow sm:w-full md:max-w-[2*sm] basis-96  h-96 border-2 rounded-xl pt-6 bg-gray-100 flex-col">
{/* {convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == 'ทุนเรียนดี')[0])['sum']} */}
                                    <div className="bg-gray-100 h-14 flex flex-col justify-between pr-5  items-center sm:flex-row sm:justify-start sm:items-starts ">
                                        <div className="w-full sm:w-1/3 h-full text-xl pb-2 flex   justify-start pl-5 items-start "><div className="text-lg sm:text-xl">ทุนการศึกษา</div></div>
                                        <div className="flex h-full sm:w-2/3 flex-col w-full items-start pl-10   sm:justify-start sm:items-end">
                                            <div className="flex flex-row justify-center items-center "><div className="w-3 h-3 rounded-2xl flex justify-center items-center mr-2" style={{ backgroundColor: "#00C49F" }}></div><p className="text-sm md:text-base flex sm:justify-end">ทุนเรียนดี</p></div>
                                            <div className="flex flex-row justify-center items-center "><div className="w-3 h-3 rounded-2xl flex justify-center items-center mr-2" style={{ backgroundColor: "#FF8042" }}></div><p className="text-sm md:text-base flex sm:justify-end"></p>ทุนทำงาน</div>
                                            <div className="flex flex-row justify-center items-center "><div className="w-3 h-3 rounded-2xl flex justify-center items-center mr-2" style={{ backgroundColor: "#0088FE" }}></div><p className="text-sm md:text-base flex sm:justify-end"></p>ทุนขัดสน</div>
                                        </div>
                                    </div>
                                    <ResponsiveContainer width="100%" height="70%">
                                        <PieChart width={500} height={500} >
                                            <Pie
                                                data={[
                                                    { name: 'Group A', value: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == 'ทุนเรียนดี')[0])['sumn'] },
                                                    { name: 'Group B', value: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == 'ทุนทำงาน')[0])['sumn'] },
                                                    { name: 'Group C', value: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == 'ทุนขัดสน')[0])['sumn'] },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={renderCustomizedLabel}
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                                style={{ margin: 0, padding: 0 }}

                                            >
                                                {[
                                                    { name: 'Group A', value: 10 },
                                                    { name: 'Group B', value: 20 },
                                                    { name: 'Group C', value: 30 },

                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={ ['#00C49F', '#FF8042','#0088FE','#FFBB28'][index % ['#00C49F', '#FF8042','#0088FE','#FFBB28'].length]} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <a className="w-full flex justify-center items-center border-t-2  h-12 cursor-pointer hover:text-gray-400 ">เพิ่มเติม</a>


                                </div>
{/* {maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == 'ทุนเรียนดี')} */}
                                {/* {convertlisttoObj(maindatastate.Maincapdata.maincapheadtable,maindatastate.Maincapdata.maincapdata.filter((list)=>list[0]==fiscalyearshow&&list[1]=='ทุนทำงาน')[0])['nCPE']} */}
                                {/* {(maindatastate.Currentcapdata.currentcapdata.filter((list)=>list[0]==fiscalyearshow&&list[1]=='ทุนทำงาน'&&list[6]=='AE').length)} */}
                                {['ทุนเรียนดี','ทุนทำงาน','ทุนขัดสน'].map((typecap)=>{
                                    return(
                                        <>
                                        {/* {JSON.stringify(filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'AE').length)} */}
                                            <div className=" m-5  grow sm:w-full md:max-w-[2*sm] basis-96  h-96 border-2 rounded-xl pt-6 bg-gray-100 flex-col justify-center items-center">
                                    <div className="bg-gray-100 h-14 flex flex-col justify-between pr-5 right-4 items-center sm:flex-row sm:justify-start sm:items-starts ">
                                        <div className="w-full  h-full text-xl pb-2 flex justify-start pl-5 items-start "><div className="text-lg sm:text-xl ">{typecap}</div></div>                                    </div>
                                    <ResponsiveContainer width="90%" height="80%">
                                        <BarChart
                                            width={500}
                                            height={300}
                                            data={[
                                                {
                                                    name: 'AE',
                                                    ready: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecap)[0])['nAE'] - filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'AE').length,//all
                                                    Active: filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'AE').length, //มีอยู่ สีเขียว
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'IRRE',
                                                    ready: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecap)[0])['nIRRE'] - filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'IRRE').length,//all
                                                    Active: filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'IRRE').length, //มีอยู่ สีเขียว
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'FE',
                                                    ready: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecap)[0])['nFE'] - filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'FE').length,//all
                                                    Active: filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'FE').length, //มีอยู่ สีเขียว
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'CE',
                                                    ready: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecap)[0])['nCE'] - filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'CE').length,//all
                                                    Active: filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'CE').length, //มีอยู่ สีเขียว
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'ME',
                                                    ready: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecap)[0])['nME'] - filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'ME').length,//all
                                                    Active: filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'ME').length, //มีอยู่ สีเขียว
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'CPE',
                                                    ready: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecap)[0])['nCPE'] - filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'CPE').length,//all
                                                    Active: filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'CPE').length, //มีอยู่ สีเขียว
                                                    amt: 0,
                                                },
                                                {
                                                    name: 'IE',
                                                    ready: convertlisttoObj(maindatastate.Maincapdata.maincapheadtable, maindatastate.Maincapdata.maincapdata.filter((list) => list[0] == fiscalyearshow && list[1] == typecap)[0])['nIE'] - filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'IE').length,//all
                                                    Active: filterByMajor((maindatastate.Currentcapdata.currentcapdata.filter((list) => list[0] == fiscalyearshow &&list[1]==typecap).map((list) => convertlisttoObj(maindatastate.Currentcapdata.currentcapheadtable, list))),'IE').length, //มีอยู่ สีเขียว
                                                    amt: 0,
                                                },

                                            ]}
                                            margin={{
                                                top: 20,
                                                right: 20,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Active" stackId="a" fill="#60d394" />
                                            <Bar dataKey="ready" stackId="a" fill="#ee6055" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                    {/* <a className="w-full flex justify-center items-center border-t-2  h-12 cursor-pointer hover:text-gray-400">เพิ่มเติม</a> */}

                                </div>
                                        </>
                                    )
                                })}



                            </div>


                        </div>

                    </>) : ''}

                </div>

            </div>
        </>
    );
}

export default ViewerDashboard