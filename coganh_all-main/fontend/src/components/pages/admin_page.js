import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/appContext'
import User_list from '../modal/admin_modal/user_list'
import Post_list from '../modal/admin_modal/post_list'
import Task_list from '../modal/admin_modal/task_list'
import { useLocation } from 'react-router-dom'

export default function ADMIN_page() {
    const { user, history } = useContext(AppContext)

    const [page, set_page] = useState("users")
    const [is_reset_user, set_is_reset_user] = useState(0)
    const [is_reset_post, set_is_reset_post] = useState(0)
    const [is_reset_task, set_is_reset_task] = useState(0)
    const [user_chunk_index, set_user_chunk_index] = useState(0)
    const [post_chunk_index, set_post_chunk_index] = useState(0)
    const [task_chunk_index, set_task_chunk_index] = useState(0)
    const [users, set_users] = useState([])
    const [posts, set_posts] = useState([])
    const [tasks, set_tasks] = useState([])
    const [fetch_posts, set_fetch_posts] = useState(false)
    const [fetch_tasks, set_fetch_tasks] = useState(false)

    useEffect(() => {
        document.querySelectorAll(".U_nav_item").forEach(item => {
            item.onclick = () => {
                set_page(item.dataset.name)
            }
        })
    }, [])

    useEffect(() => {
        fetch(`http://192.168.1.249:5000/get_all_user`)
            .then(res => res.json())
            .then(data => {
                let d = []
                for (let i = 0; i < data.length; i += 20) {
                    const chunk = data.slice(i, i + 20);
                    d.push(chunk)
                }
                set_users(d)
                set_fetch_posts(true)
            })
            .catch(err => console.log(err))
    }, [is_reset_user])

    useEffect(() => {
        if (!fetch_posts) return
        fetch(`http://192.168.1.249:5000/get_all_post?page=${post_chunk_index}&size=9`)
            .then(res => res.json())
            .then(data => {
                set_posts(data)
                set_fetch_tasks(true)
            })
            .catch(err => console.log(err))
    }, [is_reset_post, fetch_posts, post_chunk_index])

    useEffect(() => {
        if (!fetch_tasks) return
        fetch(`http://192.168.1.249:5000/get_all_task?page=${task_chunk_index}&size=30`)
            .then(res => res.json())
            .then(data => {
                set_tasks(data)
            })
            .catch(err => console.log(err))
    }, [is_reset_task, fetch_tasks, task_chunk_index])

    // localStorage.setItem("data", JSON.stringify(data))

    // // if(data.training) {
    // //     data.training = [] 
    // //     data.posts = [] 
    // //     console.log(JSON.stringify(data))
    // // }
    console.log(posts)

    return (
        <div className="w-full h-screen flex">
            <div className="U_side_bar w-1/4 h-full bg-[#0B427E] flex flex-col">
                <ul className="U_nav_list p-0">
                    <li data-name="users" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "users" ? "bg-blue-700" : ""}`}>
                        <i className="fa-solid fa-robot mr-5"></i>
                        Users
                    </li>
                    <li data-name="posts" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "posts" ? "bg-blue-700" : ""}`}>
                        <i className="fa-solid fa-book-open mr-5"></i>
                        Blogs
                    </li>
                    <li data-name="tasks" className={`U_nav_item text-xl px-5 py-5 hover:bg-blue-600 hover:bg-opacity-50 rounded-md cursor-pointer select-none bg-opacity-80 ${page === "tasks" ? "bg-blue-700" : ""}`}>
                        <i class="fa-solid fa-graduation-cap mr-5"></i>
                        Tasks
                    </li>
                </ul>
                <div onClick={() => history("/menu")} className="U_back_btn text-xl mt-auto mb-10 mx-auto bg-[#007BFF] px-10 py-2 rounded-sm hover:brightness-90 cursor-pointer select-none">back to menu</div>
            </div>
            <div className="U_content w-3/4 h-full p-10 overflow-scroll">
                {page === "users" && <User_list users={users[user_chunk_index]} set_is_reset_user={set_is_reset_user} set_user_chunk_index={set_user_chunk_index} />}
                {page === "posts" && <Post_list posts={posts} is_reset_post={is_reset_post} set_is_reset_post={set_is_reset_post} set_post_chunk_index={set_post_chunk_index} />}
                {page === "tasks" && <Task_list tasks={tasks} is_reset_task={is_reset_task} set_is_reset_task={set_is_reset_task} set_task_chunk_index={set_task_chunk_index} />}
            </div>
        </div>
    )
}
