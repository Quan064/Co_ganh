import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'
import User_dashboard from '../../modal/user_modal/user_dashboard'
import User_bot from '../../modal/user_modal/user_bot'
import User_post from '../../modal/user_modal/user_posts'
import User_training from '../../modal/user_modal/user_training'
import { useParams } from 'react-router-dom'

export default function User() {
    const { user, history } = useContext(AppContext)
    const { id } = useParams()
    // const { username } = user
    const [username, set_username] = useState()
    const [page, set_page] = useState("dashboard")
    const [data, set_data] = useState(JSON.parse(localStorage.getItem("data")))
    // console.log(JSON.parse(localStorage.getItem("data")))

    useEffect(() => {
        if(id) {
            fetch("http://192.168.1.249:5000/get_all_user_data/" + id)
            .then(res => res.json())
            .then(data => {set_data({raw_data: data, chunked_data: handle_chunk(data)}); set_username(data.username)})
        }
    }, [id])

    useEffect(() => {
        document.querySelectorAll(".U_nav_item").forEach(item => {
            item.onclick = () => {
                set_page(item.dataset.name)
            }
        })
    }, [])

    function create_chunk(array, size) {
        let d = []
        for (let i = 0; i < array.length; i += size) {
            const chunk = array.slice(i, i + size);
            d.push(chunk)
        }

        return d
    }

    function handle_chunk(data) {
        const {bots, your_tasks, tasks, posts} = data
        let res = {
            bots: create_chunk(bots, 4),
            your_tasks: create_chunk(your_tasks, 10),
            tasks: create_chunk(tasks, 40),
            posts: create_chunk(posts, 9),
        }

        return res
    }

    localStorage.setItem("data", JSON.stringify(data))

    // if(data.training) {
    //     data.training = [] 
    //     data.posts = [] 
    //     console.log(JSON.stringify(data))
    // }


    return (
        <div className="w-full h-screen flex">
            <div className="U_side_bar w-1/4 h-full bg-[#0B427E] flex flex-col">
                <div className="U_user flex flex-col items-center w-full px-5 py-5 mb-5 bg-[#0757AD]">
                    <div className="U_avatar text-5xl mb-5 bg-[#007BFF] min-w-16 min-h-16 rounded-full grid place-content-center">{username && username[0].toUpperCase()}</div>
                    <div className="U_info">
                        <div className="U_name text-2xl text-center">{username}</div>
                    </div>
                </div>
                <ul className="U_nav_list p-0">
                    <li data-name="dashboard" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "dashboard" ? "bg-blue-700" : ""}`}>
                        <i class="fa-solid fa-chart-line mr-5"></i>
                        Dash board
                    </li>
                    <li data-name="bot" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "bot" ? "bg-blue-700" : ""}`}>
                        <i className="fa-solid fa-robot mr-5"></i>
                        Bot
                    </li>
                    <li data-name="post" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "post" ? "bg-blue-700" : ""}`}>
                        <i className="fa-solid fa-book-open mr-5"></i>
                        Blog
                    </li>
                    <li data-name="training" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "training" ? "bg-blue-700" : ""}`}>
                        <i class="fa-solid fa-graduation-cap mr-5"></i>
                        Training
                    </li>
                </ul>
                <div onClick={() => history("/menu")} className="U_back_btn text-xl mt-auto mb-10 mx-auto bg-[#007BFF] px-10 py-2 rounded-sm hover:brightness-90 cursor-pointer select-none">back to menu</div>
            </div>
            <div className="U_content w-3/4 h-full p-10 overflow-scroll">
                {page === "dashboard" && data.raw_data && <User_dashboard data={data.raw_data}/>}
                {page === "bot" && <User_bot bots={data.chunked_data.bots} raw_bots={data.raw_data.bots}/>}
                {page === "post" && <User_post posts={data.chunked_data.posts}/>}
                {page === "training" && <User_training tasks={data.chunked_data.tasks} raw_tasks={data.raw_data.tasks} your_tasks={data.chunked_data.your_tasks}/>}
            </div>
        </div>
    )
}
