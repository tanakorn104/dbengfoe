import Header from './Header'
import { createContext, useContext ,useEffect,useState} from 'react';
// import { useAuth } from './AuthContext'
import LinkPage from './LinkPage';
import { Link, useNavigate } from "react-router-dom";
import Adddata from './Adddata';
import Aleart from './Aleart';
import DisplayCardData from './DisplayCardData';
import { root_url } from "./config/config";
function Managedata(){

    const navigate = useNavigate();
    useEffect(()=>{
        if(sessionStorage.getItem('role')!='admin'){
            navigate("/Dashboard");
        }
    },[])
    return (
        <>  
        <Header />
        <LinkPage/>
        <DisplayCardData/>
        {/* <Aleart/> */}
            
            

        

            {/* <p>Hello {user[Object.keys(user)[3]]}</p> */}
        </>
    );
}

export default Managedata;