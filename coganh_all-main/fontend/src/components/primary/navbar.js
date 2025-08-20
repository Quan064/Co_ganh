
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/appContext'

export default React.memo(function Navbar({ type = {}, back_link = "/menu", mode="dark"}) {
  const { history, user, setUser } = useContext(AppContext)
  const [ is_open_setting, set_is_open_setting ] = useState(false)
  const [ is_open_notification, set_is_open_notification ] = useState(false)
  const [ notifications, set_notifications] = useState([])
  const [ reset_notifications, set_reset_notifications] = useState(0)

  function handle_logout() {
    localStorage.clear()
    setUser({})
  }

  useEffect(() => {
    if(user.id) {
      fetch(`http://192.168.1.249:5000/get_user_notification/${user.id}`)
      .then(res => res.json())
      .then(data => set_notifications(data))
      .catch(err => console.log(err))
    }
  }, [reset_notifications])

  function delete_notification(data) {
    fetch(`http://192.168.1.249:5000/delete_notification/${user.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(data => set_reset_notifications(Math.random()))
    .catch(err => console.log(err))
  }

  function all_delete_notification() {
    if(notifications.length === 0) return
    fetch(`http://192.168.1.249:5000/get_user_notification/${user.id}`)
      .then(res => res.json())
      .then(() => set_notifications([]))
      .catch(err => console.log(err))
  }
  
  return (
    <div className={`fixed top-0 z-[10000000] left-0 right-0 flex items-center justify-between px-4 h-16 border-b border-[#007BFF] ${mode === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
      <div class="left_block">
        <div onClick={() => history("/menu")} class="logo cursor-pointer select-none">Co ganh</div>
        <p onClick={() => history(back_link)} class="back_btn">quay lại</p>
      </div>

      <div class="right_block">
        { user.username && <>
          {type.create_content && <a onClick={() => history("/create_content")} class="create_post dark:text-white">Viết bài</a>}
          <div className="relative mr-4">
            <i onClick={() => set_is_open_notification(!is_open_notification)} class="fa-solid fa-bell text-2xl cursor-pointer select-none hover:brightness-90"></i>
            {notifications.length > 0 && <div className="absolute top-0 right-0 w-3 h-3 text-xs rounded-full bg-red-500 grid place-content-center select-none">!</div>}
            {is_open_notification && <div className={`absolute flex flex-col right-0 bg-slate-600 px-4 py-1 w-96 h-60 overflow-y-scroll rounded animate-enlarge origin-top-right shadow-lg shadow-slate-500 ${mode === "light" && "brightness-200 text-white"}`}>
              {notifications.length === 0 && 
              <div className="flex-1 grid place-content-center text-2xl">
                Chưa có thông báo nào
              </div>
              }
              <ul className="p-0">
                {notifications.map((noti, key) => 
                <li className={`noti_item relative px-4 py-1 bg-slate-700 hover:brightness-90 cursor-pointer select-none rounded transition-all mb-1`}>
                  <div>
                    <p className="font-bold text-blue-400 text-left">{noti.sender}</p>
                  </div>
                  <p className="text-left">{noti.content}</p>
                  <div onClick={() => delete_notification(noti)} className="noti_delete_btn absolute h-full w-9 bg-red-500 right-0 top-0 text-3xl hidden place-content-center hover:brightness-90">
                    <i class="fa-solid fa-xmark"></i>
                  </div>
                </li>
                )}
              </ul>
              <div onClick={all_delete_notification} className="w-full mt-auto border-t border-slate-300 hover:brightness-75 text-center select-none cursor-pointer">xóa hết</div>
            </div>}
          </div>
          <div class="w-8 h-8 relative">
            <div onClick={() => set_is_open_setting(!is_open_setting)} className={`dark:hover:brightness-90 h-full ${mode === "dark" ? "bg-white text-[#007BFF]" : "bg-[#007BFF] text-white"} rounded-full text-2xl cursor-pointer grid place-content-center font-semibold select-none`}>
              {user.username && user.username[0].toUpperCase() }
            </div>
            { is_open_setting && 
            <ul className="absolute p-0 w-32 -right-4 top-5 bg-slate-600 px-2 py-2 rounded shadow-lg shadow-slate-500">
              <li onClick={() => history("/user/" + user.id)} className="py-1 hover:bg-slate-700 px-1 rounded cursor-pointer select-none">Trang cá nhân</li>
              <li onClick={() => {handle_logout(); console.log(123)}} className="py-1 hover:bg-slate-700 px-1 rounded cursor-pointer select-none">Đăng xuất</li>
            </ul>}
          </div>
        </>}
        { !user.username && <>
          <div onClick={() => history("/login")} className="text-lg ml-2 px-4 py-1 rounded bg-[#007BFF] hover:brightness-90 cursor-pointer select-none">Đăng nhập</div>
        </>}
      </div>
    </div>
  )
})
