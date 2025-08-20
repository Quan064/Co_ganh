import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'

export default function Post_list({ posts, set_post_chunk_index, set_is_reset_post, is_reset_post }) {
  const { history } = useContext(AppContext)
  const [un_public_post, set_un_public_posts] = useState()
  const [UPP_chunk_index, set_UPP_chunk_index] = useState(0)

  console.log(posts)

  function handle_send_notification(u_id, content) {
    fetch(`http://192.168.1.249:5000/send_notification/${u_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "ADMIN",
        sender_id: "",
        content: content
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
    })
    .catch(err => console.log(err))
  }

  function handle_delete(id, author_id) {
    console.log(id)
    let is_delete = window.confirm("bạn có chắc muốn xóa")
    if (is_delete) {
      let notification = prompt("nhập lý do muốn xóa")
      fetch(`http://192.168.1.249:5000/delete_post/${id}`)
        .then(res => res.json())
        .then(data => {
          if(author_id) {
            handle_send_notification(author_id, notification)
          }
          set_is_reset_post(Math.random())
        })
        .catch(err => console.log(err))
    }
  }

  function handle_accept(id, author_id, post_title) {
    fetch(`http://192.168.1.249:5000/accept_post/${id}`)
      .then(res => res.json())
      .then(data => {
        if(author_id) {
          handle_send_notification(author_id, `bài đăng của bạn với tiêu đề "${post_title.length > 10 ? post_title.slice(0,10) + "..." : post_title}" đã được chấp nhận`)
        }
        set_is_reset_post(Math.random())
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetch(`http://192.168.1.249:5000/get_unpublic_posts?page=${UPP_chunk_index}&size=9`)
    .then(res => res.json())
    .then(data => {
      set_un_public_posts(data)
    })
    .catch(err => console.log(err))
  }, [is_reset_post])

  return (
    <div className=" h-full flex flex-col">
      <div className="w-full flex">
        <a onClick={() => history("/create_content")} class="dark:text-white px-5 py-1 rounded-lg border cursor-pointer select-none hover:bg-white transition-all dark:hover:text-black ml-auto">Viết bài</a>
      </div>
      <div className="">
        <p className="text-3xl font-bold">Chờ được duyệt</p>
        <ul className="p-0 grid grid-cols-3 grid-flow-row gap-4">
          {un_public_post && un_public_post.map(post =>
            <li className="relative h-96 bg-[#0b427e] rounded-lg overflow-hidden shadow-2xl hover:shadow-blue-300 hover:scale-105 transition-all">
              <div onClick={() => handle_accept(post.id, post.author_id, post.title)} className="w-10 h-10 grid place-content-center text-xl bg-blue-500 absolute z-[100000000] left-0 hover:brightness-90 cursor-pointer"><i class="fa-solid fa-check"></i></div>
              
              <div onClick={() => handle_delete(post.id, post.author_id)} className="w-10 h-10 grid place-content-center text-xl bg-red-400 absolute z-[100000000] right-0 hover:brightness-90 cursor-pointer"><i class="fa-solid fa-xmark"></i></div>
              <div onClick={() => history("/post/" + post.post_id, { state: post })} className=" w-full h-2/4 select-none bg-white brightness-95 cursor-pointer">
                <img className=" object-contain " src={post.image_url[0] ? post.image_url[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTErUSgyq868y3dMVxYIbdUe1d9NV1tL4jtbA&s"}></img>
              </div>
              <div className="p-2 mb-2 h-2/4 flex flex-col">
                <div onClick={() => history("/post/" + post.post_id, { state: post })} className="text-2xl mb-2 hover:brightness-90 cursor-pointer">
                  {post.title}
                </div>
                <div className=" text-gray-200">
                  {post.description}
                </div>
                <div onClick={() => post.author_id && history("/user/" + post.author_id)} className=" text-gray-200 mt-auto">
                  Author:  <span className="font-bold hover:brightness-75 cursor-pointer">{post.author}</span>
                </div>
                <div className=" text-gray-200">
                  {post.upload_time}
                </div>
              </div>
            </li>)}
        </ul>

        <p className="text-3xl font-bold mt-10">các bài Blog</p>
        <ul className="p-0 grid grid-cols-3 grid-flow-row gap-4">
          {posts && posts.map(post =>
            <li className="relative h-96 bg-[#0b427e] rounded-lg overflow-hidden shadow-2xl hover:shadow-blue-300 hover:scale-105 transition-all">
              <div onClick={() => handle_delete(post.id)} className="w-10 h-10 grid place-content-center text-xl bg-red-400 absolute z-[100000000] right-0 hover:brightness-90 cursor-pointer"><i class="fa-solid fa-xmark"></i></div>
              <div onClick={() => history("/post/" + post.post_id, { state: post })} className=" w-full h-2/4 select-none bg-white brightness-95 cursor-pointer">
                <img className=" object-contain " src={post.image_url[0] ? post.image_url[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTErUSgyq868y3dMVxYIbdUe1d9NV1tL4jtbA&s"}></img>
              </div>
              <div className="p-2 mb-2 h-2/4 flex flex-col">
                <div onClick={() => history("/post/" + post.post_id, { state: post })} className="text-2xl mb-2 hover:brightness-90 cursor-pointer">
                  {post.title}
                </div>
                <div className=" text-gray-200">
                  {post.description}
                </div>
                <div onClick={() => post.author_id && history("/user/" + post.author_id)} className=" text-gray-200 mt-auto">
                  Author:  <span className="font-bold hover:brightness-75 cursor-pointer">{post.author}</span>
                </div>
                <div className=" text-gray-200">
                  {post.upload_time}
                </div>
              </div>
            </li>)}
        </ul>
      </div>
    </div>
  )
}
