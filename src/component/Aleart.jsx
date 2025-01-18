import { useContext, useEffect, useRef, useState } from "react";
// import { DataContext } from "./Datacontext";
import { data } from "autoprefixer";
import { v4 as uuidv4 } from "uuid";

// function RedAleart({message}){
//     return(
//         <div className="w-full flex justify-center "><p className="flex  bg-red-500 px-10 rounded-3xl text-white h-8 items-center">{message}</p></div>
//     )

// }
// function GreenAleart({message}){
//     return(
//         <div className="w-full flex justify-center "><p className="flex  bg-green-500 px-10 rounded-3xl text-white h-8 items-center">{message}</p></div>
//     )

// }

// function BlueAleart({message}){
//     return(
//         <div className="w-full flex justify-center "><p className="flex  bg-blue-500 px-10 rounded-3xl text-white h-8 items-center">{message}</p></div>
//     )

// }

// function Aleart(){
//     const {datastatus,setStatusPage} = useContext(DataContext);
//     const showaleart =useRef(true);
//     useEffect(()=>{
//         const timer = setTimeout(()=>{
//             showaleart.current=false;
//         },3000)
//         return ()=>{clearTimeout(timer);showaleart.current=true;};
//     },[datastatus])
// //datastatus!=null && datastatus.statuspage!=''&& datastatus.message!=''
//     if(showaleart==true){
//         if(datastatus.statuspage=='succeed'){
//             return <GreenAleart message={datastatus.message}/>
//         }else if(datastatus.statuspage=='fail'){
//             return <RedAleart message={datastatus.message}/>
//         }else{
//             return <BlueAleart message={datastatus.message}/>
//         }
//     }else{
//         console.log(showaleart)
//         console.log('close')
//         return null;
//     }
// }

function Aleart({aleartingdatastate}){
    const [statusaleart,setsatusaleart] = useState(true);
    
    useEffect(()=>{
        setsatusaleart(true)
    },[statusaleart])

return (
    <>

    {/* {JSON.stringify(aleartingdatastate)} */}
    {aleartingdatastate&&statusaleart?
    <div className=" absolute bottom-10 z-[999]">
        <div className="w-screen flex flex-row justify-center md:justify-end md:pr-6">
        <div  key={aleartingdatastate.key} className={`max-w-[80%]  text-black truncate alearting rounded-lg  p-2 ${aleartingdatastate.data.type=='success'?'bg-green-600':aleartingdatastate.data.type=='fail'?'bg-red-500':'to-blue-500'}`}>
        {(aleartingdatastate.data.message)}
        </div>
        </div>
    </div>:''}
    </>
)
}


export default Aleart;