import React, { useContext } from 'react'
import { AppContext } from '../../context/appContext'

export default function Home() {
    const { history } = useContext(AppContext)

    return (
        <>
            <div className="H_content flex flex-col items-center">
                <h1 className="H_title text-[25x] m-10">Xin chào</h1>
                <h1 className="H_title1 text-xl w-2/5 text-center">
                    Rất cảm ơn bạn khi đã thử trải nghiệm sản phẩm này của nhóm chúng mình. Dự
                    án này được bọn mình làm ra với mục đích là để các bạn có 1 công cụ để áp
                    dụng những gì đã học về ngôn ngữ Python để tự tạo cho mình 1 con bot.
                    Chúng mình mong bạn sẽ học được thêm điều gì mới từ sản phẩm này
                </h1>
                <br />
                <a className="menu_btn block no-underline text-white text-xl border text-center cursor-pointer transition-all duration-[0.2s] ease-linear m-5 px-[60px] py-2.5 rounded-[5px] border-solid border-[#007BFF] hover:bg-[#007BFF] hover:no-underline hover:text-white" onClick={() => history("/menu")}>
                    Menu
                </a>
            </div>
        </>
    )
}
