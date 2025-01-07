import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext();

const DataContextProvider = ({ children }) => {
    // const data = localStorage.getItem('userdata');
    const [datastatus, setStatusPage] = useState({statuspage:"r",message:"เพิ่มข้อมูลสำเร็จ"});



    return (
        <DataContext.Provider value={{datastatus,setStatusPage}}>
            {children}
        </DataContext.Provider>
    );
};

export  {DataContext,DataContextProvider};


