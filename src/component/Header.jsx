import { useContext, useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
// import { useAuth } from './AuthContext'
import { AuthandDataContext } from "./AuthContext";
import LinkPage from "./LinkPage";

function Header() {
  // const {user}=useAuth();
  // console.log(user.email);
  // console.log(sessionStorage.getItem('profiledata'));
  // const {profile}= props;
  const {userdata} = useContext(AuthandDataContext)

  var user = JSON.parse(sessionStorage.getItem('profiledata')) ? JSON.parse(sessionStorage.getItem('profiledata')) : null;
  var rank = (sessionStorage.getItem('role')) ? (sessionStorage.getItem('role')) : null;
  // console.log(res);
  const navigate = useNavigate();
  useEffect(() => {
    // if (user == null) {
    //   navigate('/login');
    // }
  }, [])
  return (
    user ? <>
      <div className="z-50 w-full h-20  flex flex-row justify-between items-center p-6 drop-shadow-md fixed bg-white  inset-0">
        {/* <div className="bg-slate-200 w-full h-15 p-4 flex flex-row justify-between items-center "> */}
        <Link to="/">
          <h1 className='font-medium  md:text-2xl hover:text-gray-600'>ระบบบริหารงานพัฒนานิสิต</h1>
        </Link>
        <div className="flex flex-row">
          <div className="flex flex-col md:hidden text-xs md:text-base mr-2">
            <div className="flex w-full justify-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 ">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </div>
            {/* <p className="text-xs">{`${userdata.profile.name.split(" ")[0]}`}</p> */}
            <p className="text-xs">{user.name.split(" ")[0]}</p>

          </div>
          <div className="hidden md:block mr-6">
            <div className="flex flex-col text-xs  md:text-base">
              {/* <p>{`${userdata.profile.name}`}</p> */}
              {/* <p>{`${userdata.profile.email}`}</p> */}
              <p>{user.name}</p>
              <p>{user.email}</p>
            </div>
          </div>
          <a  href='/Logout' className="flex flex-col  items-center  justify-between hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"  className="stroke-current stroke-[1.5] size-5 md:size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>

            <p  className="text-xs md:text-base">Logut</p>
          </a>
        </div>

      </div>
      {/* <LinkPage/> */}
      {/* {console.log(rank)} */}
      {/* {rank == 'admin' ? <LinkPage  /> : ''} */}

    </> : <>
      <div className="z-50 w-full h-20  flex flex-row justify-between  items-center p-6 drop-shadow-md fixed bg-white  inset-0">
        {/* <div className="bg-slate-200 w-full h-15 p-4 flex flex-row justify-between items-center "> */}
        <h1 className='font-medium  md:text-2xl'>ระบบบริหารงานพัฒนานิสิต</h1>
        <div className="flex flex-col">
          <h2>กรุณาเข้าสู่ระบบ</h2>
        </div>
        {/* </div> */}
      </div>
    </>
  )

}
export default Header