import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useContext, useEffect, useState } from 'react'
import { Navigate, useNavigate ,useLocation } from 'react-router-dom'
// import { ChevronDownIcon } from '@heroicons/react/20/solid'

 function LinkPage() {
    const location =useLocation();
    const navigate = useNavigate();
    useEffect(()=>{
        console.log();
    },[location.pathname])
    // const [locationpage,setlocation]= useState("");
    // const {namepath,setnamepath} = useContext(useDataContext) ;
    const handlenavigate = (path)=>{
        // setnamepath(path.split("/").pop());
        navigate(path);
    }
    
  return (
    <Menu as="div" className=" z-50 inline-block text-center w-full fixed top-20">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-none bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
          <p className='cursor-pointer'>{location.pathname.split("/").pop()}</p>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="-mr-1 h-5 w-5 text-gray-400">
            <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
        </svg>

        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 z-10 mt-0 w-screen origin-top-center rounded-none bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            <a 
            //   href="manage"
            onClick={()=>handlenavigate('/manage')}
              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Manage
            </a>
          </MenuItem>
          <MenuItem>
            <a
            //   href="/viewer"
            onClick={()=>handlenavigate('/Dashbord')}
              className="cursor-pointer block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
            >
              Dashbord
            </a>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  )
}


export default LinkPage;