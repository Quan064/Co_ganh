import React, { useContext, useEffect, useState } from 'react'

import "../../../style/post_page.css"
import { AppContext } from '../../../context/appContext'
import Navbar from '../../primary/navbar'

export default function Post_page() {
  const [posts, set_posts] = useState([])
  const [post_chunk_index, set_post_chunk_index] = useState(0)
  const { history } = useContext(AppContext)

  useEffect(() => {
    fetch(`http://192.168.1.249:5000/get_posts?page=${post_chunk_index}&size=10`)
    .then(res => res.json())
    .then(data => {
      set_posts(data)
    })
    .catch(err => {
      console.log(err)
    })
  }, [])

  useEffect(() => {
    const $ = document.querySelector.bind(document)
    const $$ = document.querySelectorAll.bind(document)

    const post_item = $$(".posts_item")

    post_item.forEach((item) => {
        const id = item.querySelector(".review_title").dataset.id
        item.onclick = () => {
            console.log(`/post/${id}`)
            fetch(`/get_post/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log(data)
            })
            .catch(err => {
                // window.location.href = `http://127.0.0.1:5000/post`
            })
        }
    })
  }, [])

  return (
    <div className=" h-full w-full flex justify-center">
      <Navbar type={{create_content: true}} back_link="/menu"/>
      <div className="w-[90%] md:w[80%] lg:w-[55%] mt-28">
        <div className="code_guide">
          <img
            style={{ width: 80, height: 80 }}
            src="https://jungle-laborer-6ce.notion.site/icons/mathematics_green.svg?mode=dark"
            alt=""
          />
          <div className="code_guide_title">Định hướng xây dựng thuật toán</div>
          <div className="cod_guide_description">
            Để có thể xây dựng thuật toán đánh cờ của chính mình, ta có thể tham khảo
            các thuật toán phổ biến như{" "}
            <span style={{ fontWeight: "bold" }}>MCTS</span>,{" "}
            <span style={{ fontWeight: "bold" }}>UCT</span>,{" "}
            <span style={{ fontWeight: "bold" }}>Minimax</span> … Các thuật toán này
            đều mang một ý tưởng chung là tính toán ra các biến thiên từ trạng thái
            bàn cờ hiện tại, so sánh đánh giá tình trạng của chúng với nhau để tìm ra
            nước đi tốt nhất.
            <hr style={{ margin: "10px 0", width: 1, height: 1 }} />
            Thế nhưng để đánh giá tình trạng bàn cờ, ta phải bắt đầu từ việc mô phỏng
            bàn cờ sau những nước đi, giúp bot hiểu được làm thế nào để ăn quân từ đó
            lựa chọn nước đi tối ưu lợi ích.
            <hr style={{ margin: "10px 0", width: 1, height: 1 }} />
            **Bot của người chơi có mặc định màu{" "}
            <span style={{ fontWeight: "bold", color: "#007BFF" }}>
              xanh dương
            </span>{" "}
            và đối thủ là màu{" "}
            <span style={{ fontWeight: "bold", color: "red" }}>đỏ</span>.**
          </div>
          <div className="posts_list">
            {posts.filter(item => item.author === "vudeptrai2").map((post,i) => 
              <div key={i} className="posts_item">
                <div className="review_info">
                  <div className="author">
                    <div className="author_avatar dark:bg-white">
                      {post.author[0].toUpperCase()}
                    </div>
                    <div onClick={() => history("/user/"+post.author_id)} className="author_name dark:text-gray-300">
                      {post.author}
                    </div>
                    <div className="upload_time dark:text-gray-300">{post.upload_time}</div>
                  </div>
                  <a
                    onClick={() => history("/post/" + post.post_id, {state: post})}
                    className="review_title dark:text-gray-200"
                  >{post.title}</a>
                  <div className="review_decription">{post.description}</div>
                </div>
                <a
                  onClick={() => history("/post/" + post.post_id, {state: post})}
                  className="review_img"
                >
                  <img className="h-auto" src={post.image_url[0]} alt="" />
                  <div className="back_drop" />
                </a>
              </div>
            )}
          </div>
        </div>
        <hr
          style={{ width: "96%", margin: "40px 2%", border: "1px solid #007BFF" }}
        />
        <div className="posts">
          <div className="posts_title">Bài đăng nổi bật</div>
          <div className="posts_list">
          {posts.filter(item => item.author !== "vudeptrai2").map((post,i) => 
            <div key={i} className="posts_item">
              <div className="review_info">
                <div className="author">
                  <div className="author_avatar dark:bg-white">
                    {post.author[0].toUpperCase()}
                  </div>
                  <div className="author_name dark:text-gray-300">
                    {post.author}
                  </div>
                  <div className="upload_time dark:text-gray-300">{post.upload_time}</div>
                </div>
                <a
                  onClick={() => history("/post/" + post.post_id, { state: post })}
                  className="review_title dark:text-gray-200"
                >{post.title}</a>
                <div className="review_decription">{post.description}</div>
              </div>
              <a
                onClick={() => history("/post/" + post.post_id, { state: post })}
                className="review_img"
              >
                <img className="h-auto" src={post.image_url[0]} alt="" />
                <div className="back_drop" />
              </a>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>

  )
}
