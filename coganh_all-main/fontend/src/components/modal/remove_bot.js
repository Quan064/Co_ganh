import React, { useContext, useEffect, useRef } from 'react'
import your_bot from "../../static/img/your_bot.png"
import { AppContext } from '../../context/appContext'


export default function Remove_bot({set_selected_bot, selected_bot, set_new_bot, set_is_open_remove_bot}) {
    const { user } = useContext(AppContext)
    const delete_btn_Ref = useRef(null)
    const keep_btn_Ref = useRef(null)

    useEffect(() => {
        if(delete_btn_Ref.current) {
            delete_btn_Ref.current.onclick = () => {
                fetch(`http://192.168.1.249:5000/remove_bot?owner=${user.username}&bot_name=${selected_bot.bot_name}`)
                .then(res => res.json())
                .then(data => {
                    set_selected_bot(null)
                    set_new_bot((new Date).getMilliseconds())
                    set_is_open_remove_bot(false)
                })
                .catch(err => console.log(err))
            }
        }
    
        if(keep_btn_Ref.current) {
            keep_btn_Ref.current.onclick = () => set_is_open_remove_bot(false)
        }
    } ,[])

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-slate-700 z-[1000000000000] rounded-lg flex flex-col items-center py-20">
            {/* <p className="text-3xl my-10">Bạn có chắc muốn xóa con bot này</p> */}
            <div className={`w-32 h-auto bg-[#DCF9FF] flex flex-col items-center relative mt-10 rounded-md`} >
                <img className="max-w-28" src={your_bot} alt="" />
                <div className="text-xl text-red-600 font-semibold">
                    {selected_bot.bot_name}
                </div>
                <div className="CB_bot_item_info" style={{ transform: "translateY(50%)", display: "block" }}>
                    <div className="introduce text-xl">
                        ĐỪNG XÓA TÔI :{"((((("}
                    </div>
                    {/* <div className="hint"><p style="color: red;"><i className="fa-solid fa-angles-down"></i>lời khuyên<i className="fa-solid fa-angles-down"></i></p>Cố lên 😏.</div> */}
                </div>
            </div>
            <div className="flex mt-auto">
                <div ref={keep_btn_Ref} className="px-5 py-1 mx-2 text-2xl bg-blue-600 rounded mt-auto cursor-pointer select-none hover:brightness-90">Giữ lại</div>
                <div ref={delete_btn_Ref} className="px-5 py-1 mx-2 text-2xl bg-slate-400 rounded mt-auto cursor-pointer select-none hover:brightness-90">XÓA</div>
            </div>
        </div>
    )
}
