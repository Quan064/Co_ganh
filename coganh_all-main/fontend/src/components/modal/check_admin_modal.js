import React, { useRef, useState } from 'react'
import ADMIN_page from '../pages/admin_page'

export default function Check_admin_modal() {
    const [is_admin, set_is_admin] = useState(false)
    const input_ref = useRef(null)
    function check_admin() {
        if(input_ref.current.value === process.env.REACT_APP_ADMIN_CODE) {
            set_is_admin(true)
        } else {
            input_ref.current.value = ""
            input_ref.current.style.border = "1px solid red"
            input_ref.current.placeholder = "Sai mật khẩu"
        }
    }

    return (
        <>
            { !is_admin && 
                    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-20 z-[100000000000000]">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0757ad] w-1/3 h-3/4 rounded-2xl grid place-content-center px-20">
                        <div className="flex flex-col items-center text-2xl"> 
                            <p className="text-3xl text-center">
                                Nhập mật khẩu ADMIN
                            </p>
                            <input type="password" ref={input_ref} className="w-full py-1 px-4 outline-none border rounded mt-10 border-white focus:border-blue-300 bg-[#0757ad]"></input>
                            <div className="text-2xl py-1 px-4 rounded-lg mt-10 bg-[#278ae8] hover:brightness-90 cursor-pointer select-none" onClick={() => check_admin()}>Enter</div>
                        </div>
                    </div>
                </div> 
                }
            { is_admin && <ADMIN_page />}
        </>
    )
}
