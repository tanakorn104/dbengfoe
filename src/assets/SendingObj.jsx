
function SendingObj() {
 
    return(
        <>
        <div className=" w-full flex pt-16 flex-col justify-center items-center  ">
                <div class="sending relative size-16 border-4 rounded-md border-sky-400 overflow-hidden">
                    <img src="/bottlesendingobj.png" className="bottlesendingobj mt-2" alt="" />
                    {/* <img src="/waterlinesendingobj.png" className="waterlinesendingobj relative mb-5" alt="" /> */}
                </div>
                <p className="mt-4">กำลังส่งข้อมูล...</p>
                {/* <div className="loadertext ml-4"></div> */}
                </div>
        </>
    )
}
export default SendingObj;