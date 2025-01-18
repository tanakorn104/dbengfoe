import React, { createContext,useEffect, useState, useContext,useRef } from 'react';

export const AuthandDataContext = createContext();

export const AuthandDataContextProvider = ({ children }) => {
    // const data = localStorage.getItem('userdata');
    const [userdata, setUserData] = useState(null);
    const [isLogin, setisLogin] = useState(false);
    const intervalRefRedfreshtoken = useRef(null);;
    // {
    //     profiledata:null,
    //     rank:null
    // }
    const setIntervalrefreshtokenID = (intervalId) => {
        intervalRefRedfreshtoken.current = intervalId;
    };

    // ฟังก์ชันล้าง interval
    const clearRefreshTokenInterval = () => {
        if (intervalRefRedfreshtoken.current) {
            clearInterval(intervalRefRedfreshtoken.current);
            intervalRefRedfreshtoken.current = null;
            // console.log("Interval cleared.");
        }
    };
    const startchecktoken = ()=>{
        // const id = setInterval(()=>{
        //     console.log("checktoken2");
        // },5000)
        // setIntervalchecktokenID(id);
    }


    return (
        <AuthandDataContext.Provider value={{userdata,setUserData,clearRefreshTokenInterval,setIntervalrefreshtokenID}}>
            {children}
        </AuthandDataContext.Provider>
    );
};



