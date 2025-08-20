import React, { useContext, useEffect, useState } from 'react'
import "../../../style/task_list.css"
import { AppContext } from '../../../context/appContext'
import Navbar from '../../primary/navbar'

export default function Task_list() {
    const [tasks, set_tasks] = useState([])
    const { user, history } = useContext(AppContext)
    const [task_chunk_index, set_task_chunk_index] = useState(0)

    useEffect(() => {
        fetch(`http://192.168.1.249:5000/get_all_task?page=${task_chunk_index}&size=30`, {method: "GET"})
            .then(res => res.json())
            .then(data => {set_tasks(data)})
    }, [])

    return (
        <>  
            <Navbar back_link="/menu" type={{create_content: true}}/>
            <div className="TL_container w-full pt-24">
                <div className="task_title">
                    <div className="tsk_status">Status</div>
                    <div className="tsk_name">Problem</div>
                    <div className="tsk_acceptance">Acceptances</div>
                    <div className="tsk_difficult">Difficulty</div>
                    <div className="tsk_author">Author</div>
                </div>
                {/* <hr style={`margin: "10px 0", border: "1px solid #ccc", width: "100%" `} /> */}
                <ul className="task_list p-0">
                    {tasks.map((task, i) =>                 
                        <li key={i} className="task_item">
                            {user.username in task.challenger ? <div className={`task_status font-bold ${task.challenger[user.username].current_submit.status == 'AC' ? 'accepted' : 'err'}`}>{task.challenger[user.username].current_submit.status}</div> : <div className="task_status"></div>}
                            <a onClick={() => history(`/training/${task.id}`,{
                                state: {
                                    task
                                }
                            })}className="task_name cursor-pointer">{task.task_name}</a>
                            <div className="task_acceptance">{task.accepted_count}</div>
                            <div className={`task_difficult font-bold ${task.tag.difficult}`}>{task.tag.difficult}</div>
                            <div className="task_author">{task.author}</div>
                        </li>
                    )}
                </ul>
            </div>
        </>

    )
}
