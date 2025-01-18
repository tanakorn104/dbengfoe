import axios from "axios";
import TimeOut from "../TimeOut";
const api = axios.create({
    baseURL: import.meta.env.VITE_Base_SERVER_URL,
    headers: {
            'Content-Type': 'application/json'
        },
    withCredentials:true
}) 
api.interceptors.request.use(
    async (config)=>{
        try{
            if(sessionStorage.getItem('profiledata')){
                const userdata = await axios.get(`${import.meta.env.VITE_Base_SERVER_URL}/auth/checkmycookieandtoken`,{withCredentials:true});

            }else{
                // window.location.href = "/GuestUserOut"
                return Promise.reject("prease login").catch(()=>{window.location.href = "/GuestUserOut"});

            }
            // console.log('-------e');
            // console.error(userdata);
            // if(!userdata){
                
            //     throw userdata;
            // }
        }catch(e){
            // console.log(e.response.data.code)
            // let codeerr = e.response.data.error.code;
            console.log(e)
            let codeerr = e.response;
            if(codeerr == "cookieexp"){
                window.location.href = "/TimeOut"
                return Promise.reject(e.response.data.code)//.catch(()=>{window.location.href = "/TimeOut"});
            }else if(codeerr == "tokenexp"){
                // console.log("to refreshtoken")//แล้วรีเทินconfig
                return Promise.reject(codeerr)//.catch(()=>{window.location.href = "/TimeOut"});
                
            }else{
                return Promise.reject(codeerr)//.catch(()=>{window.location.href = "/TimeOut"});

            }
        }
        return config;
        
    },
   
    
)
export default api
