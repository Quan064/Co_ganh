import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../../../context/appContext'
import Navbar from '../../primary/navbar'
import Sidebar from '../../primary/sidebar'

import chessboard1 from "../../../static/img/chessboard1.png"
import bot_bot from "../../../static/img/bot_bot.png"
import visualize from "../../../static/img/visualize.png"
import post_page from "../../../static/img/post_page.png"

import "../../../style/style.css"
import "../../../style/menu.css"
import Login_require from '../../modal/requirements/login_require'

export default function Menu() {
  const { history, user } = useContext(AppContext)

  const [is_require_login, set_is_require_login] = useState(false)

  useEffect(() => {
    const fightBotDir = document.querySelector(".bot_bot")
    const notification = document.querySelector(".notification")
    const backBtn = document.querySelector(".notification_directional--back")
    const sign = document.querySelector(".sign")
    const sign_btn = document.querySelector(".sign_btn")
    const create_bot_btn = document.querySelector(".create_bot")
    const fightBotBtn = document.querySelector(".bot_bot")
    const visualizeBtn = document.querySelector(".visualize")
    const training_btn = document.querySelector(".training")
    let fightable = 'True'

    const isMobile = (window.innerWidth <= 500)
    window.onresize = null

    window.onload = null

    window.onpageshow = function (event) {
      var historyTraversal = event.persisted || (typeof window.performance != "undefined" && window.performance.navigation.type === 2);
      if (historyTraversal) {
        window.location.reload();
      }
    }
      fightBotBtn.onclick = () => {
        if(!user.username) {
          set_is_require_login(true)
          return
        }
        if (isMobile) {
          sign.style.display = "flex"
        } else if (fightable === "False") {
          notification.style.display = "block"
        } else {
          history("/bot_bot")
          // window.location.href = "/bot_bot"
        }
      }
      create_bot_btn.onclick = () => {
        if (isMobile) {
          sign.style.display = "flex"
        } else {
          history("/create_bot")
          // window.location.href = "/create_bot"
        }
      }
      visualizeBtn.onclick = () => {
        if (isMobile) {
          sign.style.display = "flex"
        } else {
          history("/visualize_page")
          window.location.href = "/visualize_page"
        }
      }
      training_btn.onclick = () => {
        if (isMobile) {
          sign.style.display = "flex"
        } else {
          history("/task_list")
          // window.location.href = "/task_list"
        }
      }
      sign_btn.onclick = () => sign.style.display = "none"
      backBtn.onclick = () => notification.style.display = "none"
    }, [])

  return (
    <div className=" overflow-scroll dark:bg-[#1e1926] dark:color-white pb-5">
      <Navbar back_link="/"/>
      {is_require_login && <Login_require set_is_require_login={set_is_require_login}/>}
      <link rel="stylesheet" href="../static/css/style.css" />
      <link rel="stylesheet" href="../static/css/animation.css" />
      <link rel="stylesheet" href="../static/css/menu.css" />
      <div className="notification" style={{ display: "none" }}>
        <div className="notification_header">
          <i className="fa-solid fa-face-frown" />
        </div>
        <div className="notification_content">
          oops, có lẽ bạn chưa có bot hoặc bot của bạn đang bị lỗi. hãy kiểm tra lại
          bot của bạn nhé
        </div>
        <div className="notification_directional">
          <div className="notification_directional--back">quay lại</div>
          <div className="notification_directional--create_bot">
            <a
              style={{ color: "#fff", textDecoration: "none" }}
              href="/create_bot"
            >
              tạo bot
            </a>
          </div>
        </div>
      </div>
      <br />
      <div className="menu_content">
        <div className="main">
          <div className="main_image">
            <img
              src={chessboard1}
              alt=""
              className="main_img"
            />
            <a
              className="main_image_link text-blue-800 decoration-solid"
              href="https://www.youtube.com/watch?v=FU3auCFYGJc"
            >
              Hướng dẫn chơi cờ gánh
            </a>
          </div>
          <div className="main_nav_module">
            <div className="code_require bg-slate-800">
              <h2 className="text-2xl font-bold">Programing</h2>
              <a className="btn create_bot">Create bot</a>
              {/* <a className="btn bot_bot">Đấu bot</a> */}
              <a className="btn training">Training</a>
            </div>
            <div className="non_code bg-slate-800">
              <h2 className="text-2xl font-bold">Play chess</h2>
              <a className="btn" href="/human_bot">
                Human vs Bot
              </a>
              {/* <a className="btn" href="/room_manager">Đấu với người</a> */}
            </div>
          </div>
        </div>
        <div className="detail_module">
          <div className="detail_module_title">Others</div>
          <div className="detail_list">
            <div className="detail_item bg-slate-800">
              <div className="detail_image">
                <img src={bot_bot} alt="" />
              </div>
              <div className="detail_nav">
                <div className="icon">
                  <i className="fa-solid fa-robot" />
                </div>
                <a className="btn2 bot_bot">Bot vs Bot</a>
              </div>
            </div>
            <div className="detail_item bg-slate-800">
              <div className="detail_nav">
                <div className="icon">
                  <i className="fa-solid fa-book-open" />
                </div>
                <a onClick={() => history("/post_page")} className="btn2 pp">
                  Blog
                </a>
              </div>
              <div className="detail_image">
                <img src={post_page} alt="" />
              </div>
            </div>
            <div className="detail_item bg-slate-800">
              <div className="detail_image">
                <img src={visualize} alt="" />
              </div>
              <div className="detail_nav">
                <div className="icon">
                  <i className="fa-brands fa-staylinked" />
                </div>
                <a className="btn2 visualize">Visualize</a>
              </div>
            </div>
          </div>
        </div>
        <div className="sign">
          <div className="sign_content">
            Chức năng này phù hợp với dạng thiết bị: máy tính, laptop,... Chúng tôi
            khuyên bạn nên sử dụng thiết bị như trên để có trải nghiệm tốt nhất
          </div>
          <div className="sign_btn">OK</div>
        </div>
        {/* <a className="btn" href="/training', id="") }}">Thử thách</a> */}
      </div>
    </div>
  )
}
