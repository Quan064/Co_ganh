import React, { useContext } from 'react'
import { AppContext } from '../../context/appContext'

export default function LoginRequest(props) {

    const { history } = useContext(AppContext)

    const { setIsRequestLogin, title } = props

  return (
    <div className="z-[120] fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-30 flex items-center justify-center">
      {/* scale-y-[1.2] animate-[enlarge_.3s_ease-in-out] */}
        <div className=" transform origin-center translate-y-[0] bg-white w-[40%] px-12 py-16 shadow-lg rounded-lg flex flex-col items-center animate-[informationAppears_.25s_ease-in-out] will-change-auto">
            <h1 className="break-normal font-medium text-center text-[#8C52FF]">{title}</h1>
            <div onClick={() => history('/signin')} className="w-fit text-xl text-white text-center font-medium px-8 py-2 rounded-md mt-12 bg-[#8C52FF] hover:brightness-95 cursor-pointer">Login tại đây</div>
            <div onClick={() => setIsRequestLogin(false)} className="w-fit text-xl text-center font-medium px-8 py-2 rounded-md mt-4 bg-slate-300 hover:brightness-95 cursor-pointer">hủy</div>
        </div>
    </div>
  )
}
