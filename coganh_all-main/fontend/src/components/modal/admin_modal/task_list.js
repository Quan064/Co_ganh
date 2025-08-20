import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../../context/appContext'

export default function Task_list({tasks, set_is_reset_task, set_task_chunk_index, is_reset_task}) {
  const { history } = useContext(AppContext)
  const [un_public_tasks, set_un_public_tasks] = useState()
  const [UPT_chunk_index, set_UPT_chunk_index] = useState(0)

  // function handle_delete(id) {
  //   let is_delete = window.confirm("bạn có chắc muốn xóa")
  //   if (is_delete) {
  //     fetch(`http://192.168.1.249:5000/delete_task/${id}`)
  //       .then(res => res.json())
  //       .then(data => {
  //         set_is_reset_task(Math.random())
  //       })
  //       .catch(err => console.log(err))
  //   }
  // }

  // function handle_accept(id) {
  //   fetch(`http://192.168.1.249:5000/accept_task/${id}`)
  //     .then(res => res.json())
  //     .then(data => {
  //       set_is_reset_task(Math.random())
  //     })
  //     .catch(err => console.log(err))
  // }

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
    let is_delete = window.confirm("bạn có chắc muốn xóa")
    if (is_delete) {
      let notification = prompt("nhập lý do muốn xóa")
      fetch(`http://192.168.1.249:5000/delete_task/${id}`)
        .then(res => res.json())
        .then(data => {
          if(author_id) {
            handle_send_notification(author_id, notification)
          }
          set_is_reset_task(Math.random())
        })
        .catch(err => console.log(err))
    }
  }

  function handle_accept(id, author_id, task_title) {
    fetch(`http://192.168.1.249:5000/accept_tasks/${id}`)
      .then(res => res.json())
      .then(data => {
        if(author_id) {
          handle_send_notification(author_id, `bài đăng của bạn với tiêu đề ${task_title.length > 10 ? task_title.slice(0,10) + "..." : task_title} đã được chấp nhận`)
        }
        set_is_reset_task(Math.random())
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetch(`http://192.168.1.249:5000/get_unpublic_tasks?page=${UPT_chunk_index}&size=9`)
    .then(res => res.json())
    .then(data => {
      set_un_public_tasks(data)
    })
    .catch(err => console.log(err))
  }, [is_reset_task])

  return (
    <>
    <p className="text-3xl font-bold mb-5">Chờ được duyệt</p>
    <table class="w-full table-auto border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600 px-1 py-1 text-left"></th>
            <th className="border border-slate-600 px-1 py-1 text-left">Task</th>
            <th className="border border-slate-600 px-1 py-1 text-left">Author</th>
            <th className="border border-slate-600 px-1 py-1 text-left">Submissions</th>
            <th className="border border-slate-600 px-1 py-1 text-left">Challenger</th>
            <th className="border border-slate-600 px-1 py-1 text-left"></th>
            <th className="border border-slate-600 px-1 py-1 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {un_public_tasks && un_public_tasks.map((task, i) => 
            <tr key={i}>
              <td className={`border text-center border-slate-600 px-1 py-1 font-bold text-lg`}>{i+1}</td>
              <td onClick={() => history(`/training/${task.id}`, {state: {task}})} className="border border-slate-600 px-1 py-1 font-semibold cursor-pointer hover:text-slate-200">{task.task_name}</td>
              <td className="border border-slate-600 px-1 py-1">{task.author}</td>
              <td className="border border-slate-600 px-1 py-1">{task.submission_count}</td>
              <td className="border border-slate-600 px-1 py-1">{Object.keys(task.challenger).length}</td>
              <td onClick={() => handle_delete(task.id, task.author_id)} className="border border-slate-600 px-1 py-1 text-red-400 text-xl text-center cursor-pointer hover:brightness-90"><i class="fa-solid fa-circle-xmark"></i></td>
              <td onClick={() => handle_accept(task.id, task.author_id, task.task_name)} className="border border-slate-600 px-1 py-1 text-blue-500 text-xl text-center cursor-pointer hover:brightness-90"><i class="fa-solid fa-circle-check"></i></td>
          </tr>
          )}
        </tbody>
      </table>

      <p className="text-3xl font-bold mb-5 mt-10">các bài Blog</p>
    <table class="w-full table-auto border-collapse border border-slate-500">
        <thead>
          <tr>
            <th className="border border-slate-600 px-1 py-1 text-left"></th>
            <th className="border border-slate-600 px-1 py-1 text-left">Task</th>
            <th className="border border-slate-600 px-1 py-1 text-left">Author</th>
            <th className="border border-slate-600 px-1 py-1 text-left">Submissions</th>
            <th className="border border-slate-600 px-1 py-1 text-left">Challenger</th>
            <th className="border border-slate-600 px-1 py-1 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {tasks && tasks.map((task, i) => 
            <tr key={i}>
              <td className={`border text-center border-slate-600 px-1 py-1 font-bold text-lg`}>{i+1}</td>
              <td onClick={() => history(`/training/${task.id}`, {state: {task}})} className="border border-slate-600 px-1 py-1 font-semibold cursor-pointer hover:text-slate-200">{task.task_name}</td>
              <td className="border border-slate-600 px-1 py-1">{task.author}</td>
              <td className="border border-slate-600 px-1 py-1">{task.submission_count}</td>
              <td className="border border-slate-600 px-1 py-1">{Object.keys(task.challenger).length}</td>
              <td onClick={() => handle_delete(task.id, task.author_id)} className="border border-slate-600 px-1 py-1 text-red-400 text-xl text-center cursor-pointer hover:brightness-90"><i class="fa-solid fa-circle-xmark"></i></td>
          </tr>
          )}
        </tbody>
      </table>
    </>
  )
}
