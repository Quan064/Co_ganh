import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'
import Handle_chunk from '../handle_chunk'

var check = 0
export default function User_post({ posts }) {
  const { user, history } = useContext(AppContext)

  const [is_reset_post, set_is_reset_post] = useState(0)
  const [is_reset_UPP, set_is_reset_UPP] = useState(0)
  const [Posts, set_Posts] = useState(posts)
  const [un_public_post, set_un_public_posts] = useState()
  const [chunk_index, set_chunk_index] = useState(0)
  const [UPP_chunk_index, UPP_set_chunk_index] = useState(0)

  useEffect(() => {
    if (is_reset_post !== check) {
      fetch(`http://192.168.1.249:5000/get_post_by_username/${user.username}`)
        .then(res => res.json())
        .then(data => set_Posts(data))
        .catch(err => console.log(err))
      check = is_reset_post
    }
  }, [is_reset_post])

  useEffect(() => {
    fetch(`http://192.168.1.249:5000/get_unpublic_user_posts?username=${user.username}&page=${UPP_chunk_index}&size=9`)
      .then(res => res.json())
      .then(data => set_un_public_posts(data))
      .catch(err => console.log(err))
  }, [is_reset_UPP, UPP_chunk_index])

  function handle_delete(id) {
    console.log(id)
    let is_delete = window.confirm("bạn có chắc muốn xóa")
    if (is_delete) {
      fetch(`http://192.168.1.249:5000/delete_post/${id}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          set_is_reset_post(Math.random())
        })
        .catch(err => console.log(err))
    }
  }

  console.log(un_public_post)

  return (
    <div className=" h-full flex flex-col">
      <div className="w-full flex">
        <a onClick={() => history("/create_content")} class="dark:text-white px-5 py-1 rounded-lg border cursor-pointer select-none hover:bg-white transition-all dark:hover:text-black ml-auto">Viết bài</a>
      </div>
      <div className="">
        <p className="text-3xl font-bold">Chờ được duyệt</p>
        <ul className="p-0 grid grid-cols-3 grid-flow-row gap-4">
          {un_public_post && un_public_post.map(post =>
            <li onClick={() => history("/post/" + post.post_id, { state: post })} className="relative h-96 w-[100%] bg-[#0b427e] rounded-lg overflow-hidden shadow-2xl hover:shadow-blue-300 hover:scale-105 cursor-pointer transition-all">
              <div onClick={() => handle_delete(post.id)} className="w-10 h-10 grid place-content-center text-xl bg-red-400 absolute z-[100000000] left-0 hover:brightness-90 cursor-pointer"><i class="fa-solid fa-xmark"></i></div>
              <div className=" w-full h-2/4 select-none bg-white brightness-95">
                <img className=" object-contain " src={post.image_url[0] ? post.image_url[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTErUSgyq868y3dMVxYIbdUe1d9NV1tL4jtbA&s"}></img>
              </div>
              <div className="p-2 mb-2 h-2/4 flex flex-col">
                <div className="text-2xl mb-2">
                  {post.title}
                </div>
                <div className=" text-gray-200">
                  {post.description}
                </div>
                <div className=" text-gray-200 mt-auto">
                  {post.upload_time}
                </div>
              </div>
            </li>)}
        </ul>
        <p className="text-3xl font-bold mt-10">các bài Blog</p>
        <ul className="p-0 grid grid-cols-3 grid-flow-row gap-4">
          {Posts[chunk_index] && Posts[chunk_index].map(post =>
            <li onClick={() => history("/post/" + post.post_id, { state: post })} className="relative h-96 w-[100%] bg-[#0b427e] rounded-lg overflow-hidden shadow-2xl hover:shadow-blue-300 hover:scale-105 cursor-pointer transition-all">
              <div onClick={() => handle_delete(post.id)} className="w-10 h-10 grid place-content-center text-xl bg-red-400 absolute z-[100000000] left-0 hover:brightness-90 cursor-pointer"><i class="fa-solid fa-xmark"></i></div>
              <div className="w-10 h-10 grid place-content-center text-5xl text-red-500 absolute z-[100000000] right-4 top-4 [text-shadow:0px_0px_20px_var(--tw-shadow-color)] shadow-red-900">
                <i class="fa-solid fa-heart"></i>
                <p class="text-white font-semibold text-lg absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2">{post.upvote.length - post.downvote.length}</p>
              </div>
              <div className=" w-full h-2/4 select-none bg-white brightness-95">
                <img className=" object-contain " src={post.image_url[0] ? post.image_url[0] : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTErUSgyq868y3dMVxYIbdUe1d9NV1tL4jtbA&s"}></img>
              </div>
              <div className="p-2 mb-2 h-2/4 flex flex-col">
                <div className="text-2xl mb-2">
                  {post.title}
                </div>
                <div className=" text-gray-200">
                  {post.description}
                </div>
                <div className=" text-gray-200 mt-auto">
                  {post.upload_time}
                </div>
              </div>
            </li>)}
        </ul>
        {Posts.length > 1 && <Handle_chunk chunk_index={chunk_index} set_chunk_index={set_chunk_index} max_chunk={Posts.length - 1}/>}
      </div>
      {Posts.length === 0 &&
        <div className="flex-1 grid place-content-center text-4xl pb-28">
          Bạn chưa tạo bài blog nào
        </div>
      }
    </div>
  )
}
