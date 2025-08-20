import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import "../../style/post.css"
import { AppContext } from '../../context/appContext'
import Comment_modal from '../modal/comment_modal'
import Navbar from '../primary/navbar'
import Vote_modal from '../modal/vote_modal'

export default function Post() {
  const { theme, history } = useContext(AppContext)
  const { state } = useLocation()
  const { post_id } = useParams()
  const [post, set_post] = useState({})
  const [comment_count, set_comment_count] = useState(0)
  useEffect(() => {
    if (state) {
      set_post(state)
    } else {
      fetch("http://192.168.1.249:5000/get_post_by_id/" + post_id)
        .then(res => res.json())
        .then(data => {
          set_post(data)
        })
        .catch(err => console.log(err))
    }
  }, [state, post_id])

  useEffect(() => {
    document.querySelectorAll(".notion-enable-hover").forEach(item => {
      if(theme === "dark") {
        item.style.backgroundColor = "#444"
        item.style.color = "#fff"
      }
    })
    document.querySelectorAll("a").forEach(item => {
        item.style.textDecoration = "underline"
        item.style.color = "#0866FF"
    })
    document.querySelectorAll("figcaption").forEach(item => {
      if(theme === "dark") {
        item.style.color = "#ccc"
        item.style.textDecoration = "none"
      }
    })
  })

  function scroll_to_comment() {
    const element = document.querySelector("#comment_modal");
    element.scrollIntoView({ block: 'end',  behavior: 'smooth' });
  }

  function copy_to_clipBoard() {
    navigator.clipboard.writeText(window.location);
    alert("copy to clipboard")
  }
  

  return (
    <div className="relative w-full h-full flex justify-center">
      <Navbar back_link="/post_page"/>
      <div className="absolute top-28 left-28 text-6xl select-none">
        {post && <Vote_modal post={post}/>}
        <i onClick={() => scroll_to_comment()} class="fa-solid fa-comment text-[#a0d8fa] hover:brightness-90 cursor-pointer"></i>
        <p className="text-2xl text-center">{comment_count}</p>
      </div>
      <div className="P_container">
        <h1 className="P_title">{post && post.title}</h1>
        <div className="P_user">
          <div className="P_user_avatar dark:text-[#007BFF]">{post && post.author && post.author[0].toUpperCase()}</div>
          <div className="P_user_info">
            <div onClick={() => history("/user/"+post.author_id)} className="P_user_name">{post && post.author}</div>
            <div className="time">{post && post.upload_time}</div>
          </div>
          <div className="selection">
            <div onClick={copy_to_clipBoard} className="copy_link">
              <i className="fa-solid fa-link" />
            </div>
          </div>
        </div>
        <div dangerouslySetInnerHTML={{ __html: post && post.content }}></div>
        <Comment_modal set_comment_count={set_comment_count} post_id={post_id}/>
      </div>
    </div>

  )
}
