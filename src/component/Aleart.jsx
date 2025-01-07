import { useContext, useEffect, useRef, useState } from "react";
// import { DataContext } from "./Datacontext";
import { data } from "autoprefixer";


function RedAleart({message}){
    return(
        <div className="w-full flex justify-center "><p className="flex  bg-red-500 px-10 rounded-3xl text-white h-8 items-center">{message}</p></div>
    )

}
function GreenAleart({message}){
    return(
        <div className="w-full flex justify-center "><p className="flex  bg-green-500 px-10 rounded-3xl text-white h-8 items-center">{message}</p></div>
    )

}

function BlueAleart({message}){
    return(
        <div className="w-full flex justify-center "><p className="flex  bg-blue-500 px-10 rounded-3xl text-white h-8 items-center">{message}</p></div>
    )

}

function Aleart(){
    const {datastatus,setStatusPage} = useContext(DataContext);
    const showaleart =useRef(true);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            showaleart.current=false;
        },3000)
        return ()=>{clearTimeout(timer);showaleart.current=true;};
    },[datastatus])
//datastatus!=null && datastatus.statuspage!=''&& datastatus.message!=''
    if(showaleart==true){
        if(datastatus.statuspage=='succeed'){
            return <GreenAleart message={datastatus.message}/>
        }else if(datastatus.statuspage=='fail'){
            return <RedAleart message={datastatus.message}/>
        }else{
            return <BlueAleart message={datastatus.message}/>
        }
    }else{
        console.log(showaleart)
        console.log('close')
        return null;
    }
}

export default Aleart;