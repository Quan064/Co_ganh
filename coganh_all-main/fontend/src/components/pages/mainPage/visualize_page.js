import React, { useContext, useEffect } from 'react'
import "../../../style/visualize_page.css"

import valid_move_visualize from "../../../static/img/valid_move_visualize.png"
import ganh_chet_visualize from "../../../static/img/ganh_chet_visualize.png"
import vay_visualize from "../../../static/img/vay_visualize.png"
import visualize from "../../../static/img/visualize.png"
import { AppContext } from '../../../context/appContext'
import Navbar from '../../primary/navbar'

export default function Visualize_page() {
    const { history } = useContext(AppContext)

    // useEffect(() => {

    // })

    return (
        <div className="VP_container">
            <Navbar/>
            <div className="VP_title">Mô phỏng thuật toán</div>
            <div className="visualize_type">Thuật toán bàn cờ</div>
            <ul className="visualize_list p-0">
                <li className="visualize_item">
                    <a onClick={() => history("/visualize/"+"OYRJNv4Jqez9dKZjLW27", { state: "OYRJNv4Jqez9dKZjLW27" })}>
                        <img
                            src={valid_move_visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">NƯỚC ĐI HỢP LỆ</div>
                    </a>
                </li>
                <li className="visualize_item">
                    <a onClick={() => history("/visualize/"+"aLzIcTxFR2EfRXVFov07", { state: "aLzIcTxFR2EfRXVFov07" })}>
                        <img
                            src={ganh_chet_visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">GÁNH CHẸT</div>
                    </a>
                </li>
                <li className="visualize_item">
                    <a onClick={() => history("/visualize/"+"1OyReHWrH3zgV5IfcZPk", { state: "1OyReHWrH3zgV5IfcZPk" })}>
                        <img
                            src={vay_visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">VÂY</div>
                    </a>
                </li>
            </ul>
            <div className="visualize_type">Thuật toán nâng cao</div>
            <ul className="visualize_list p-0">
                <li className="visualize_item">
                    <a onClick={() => history("/visualize/"+"SctXzAxW6TtcMSPwPm1N", { state: "SctXzAxW6TtcMSPwPm1N" })}>
                        <img
                            src={visualize}
                            alt=""
                            className="visualize_image"
                        />
                        <div className="name">MINIMAX</div>
                    </a>
                </li>
            </ul>
        </div>

    )
}
