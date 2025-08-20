import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';

import "../../../style/training.css"
import "../../../style/text_editor.css"
import { AppContext } from '../../../context/appContext';
import AceEditor from "react-ace";
import Comment_modal from '../../modal/comment_modal';
import Login_require from '../../modal/requirements/login_require';
import { type } from '@testing-library/user-event/dist/type';

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

export default function Training() {
    const { user, history } = useContext(AppContext)
    const { username } = user

    const { state } = useLocation();
    var { id } = useParams()
    const [task, set_task] = useState(state ? state.task : {})
    const [code, set_code] = useState("")
    const [{ demo_code, inp_oup, task_name, content, accepted_count, submission_count, input_title }, set_data] = useState(task)
    const [comment_count, set_comment_count] = useState(0)
    var task_id = id
    useEffect(() => {
        if (task.task_name) {
            var { demo_code, inp_oup, task_name, content, accepted_count, submission_count, input_title } = task
            console.log(task, demo_code)
            var default_code = task.challenger[user.username] ? task.challenger[user.username].current_submit.code : demo_code
            try {
                let a = JSON.parse(default_code)
                default_code = a
            } catch { }
            set_code(default_code || demo_code)
        }
    }, [task])
    // useEffect(() => {
    //     if(!task_name) {
    //         fetch(`http://192.168.1.249:5000/get_task_by_id/${task_id}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             // console.log(data)
    //             set_task(data)
    //             set_data(data)
    //         })
    //         .catch(err => console.log(err))
    //     }
    // }, [])
    console.log(code)
    const [change_SB_history, set_change_SB_history] = useState()
    const [is_require_login, set_is_require_login] = useState(false)

    function handle_inp_oup(jsonString) {
        let data = eval(jsonString.replaceAll("T", "t").replaceAll("F", "f").replaceAll("(", "[").replaceAll(")", "]"))
        // console.log(data)
        // return
        let res = []
        console.log(data)

        data.forEach(item => {
            let handle_data = {
                input: [],
                output: ""
            }
            item.input.forEach(inp => {
                if ((typeof inp === "string" || typeof inp === "object") && -1 in inp) {
                    res.input.push(JSON.stringify(inp))
                } else {
                    let sub_input = JSON.stringify(inp)
                    if (sub_input.includes("{") && sub_input.includes("}")) {
                        handle_data.input.push(sub_input.replaceAll("[", "(").replaceAll("]", ")"))
                    } else {
                        handle_data.input.push(sub_input.replaceAll("[", "(").replaceAll("]", ")").replaceAll("))", ")]").replaceAll("((", "[("))
                    }
                }
            })
            handle_data.output = JSON.stringify(item.output).replaceAll("t", "T").replaceAll("f", "F")
            res.push(handle_data)
        })

        return res
    }

    useEffect(() => {
        console.log("Asd")
        fetch("http://192.168.1.249:5000/get_task/" + task_id)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                set_task(data)
                set_data(data)
            })
            .catch(err => console.log(err))
    }, [change_SB_history])

    function hangle_view_code(code_history) {
        const submissions_items = $$(".submissions_item")
        submissions_items.forEach((item, i) => {
            item.querySelector(".view_code_btn").onclick = () => {
                submissions_items.forEach(item => {
                    item.classList.remove("choosen")
                })
                item.classList.add("choosen")
                set_code(code_history[i])
            }
        })
    }

    useEffect(() => {
        console.log(task)

        const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)
        const submissions_list = $(".submissions_list")
        

        async function render_summissions(isfirstRender = false) {
            let code_history = []
            // if (task.challenger && task.challenger.username) {
            //     console.log("hello")
            //     submissions_list.innerHTML = ""
            //     const user_submissions = JSON.parse(JSON.stringify(task.challenger[username].submissions))
            //     console.log(user_submissions)
            //     user_submissions.reverse()
            //     user_submissions.forEach(submissions => {
            //         code_history.push(submissions.code)
            //         submissions_list.innerHTML += `
            //             <li class="submissions_item">
            //                 <div class="submissions_status ${submissions.status === "AC" ? "accepted" : "err"}">${submissions.status === "AC" ? "Accepted" : submissions.status === "WA" ? "Wrong answer" : "Syntax error"}</div>
            //                 <div class="submissions_time">${submissions.submit_time}</div>
            //                 <div class="submissions_test_finished">${submissions.test_finished}</div>
            //                 <div class="view_code_btn">view code</div>
            //             </li>
            //         `
            //     })
            //     hangle_view_code(code_history)
            // }
        }
        if(task.challenger[username]) {
            hangle_view_code(JSON.parse(JSON.stringify(task.challenger[username].submissions)).reverse().map(sub => sub.code))
        }
        // render_summissions(true)
    }, [task, user])


    useEffect(() => {
        console.log(task)

        const submitBtn = $(".coding_module-nav--submitBtn.CM_btn")
        const runBtn = $(".coding_module-nav--runBtn")
        const loader = $(".coding_module-nav--submitBtn.loader")

        const uniNavItem = $$(".utility_nav-block--item")
        const taskBtn = $(".bot_display_nav-block--item.task")
        const resulttBtn = $(".bot_display_nav-block--item.result")
        const submissionsBtn = $(".bot_display_nav-block--item.submissions")
        const helpBtn = $(".bot_display_nav-block--item.help")
        const task_block = $(".bot_display-task")
        const result_block = $(".bot_display-result")
        const submissions_block = $(".bot_display-submissions")
        const help_block = $(".bot_display-help")
        const all_block = $$(".bot_display-item")

        // result block

        const result_type = $(".type")
        const result_status = $(".status")
        const display_result = $(".display_result")
        const test_case_result_list = $(".test_case_result_list")
        let test_case_result_item = $$(".test_case_result_item")
        let text_case_InOu = $$(".text_case_InOu")
        const test_case_result_err = $(".test_case_result_err")
        const test_case_result_overview = $(".test_case_result_overview")
        const test_case_runtime = $(".test_case_runtime")
        const test_case_AC = $(".test_case_AC")
        const runtime = $(".runtime")
        const AC = $(".AC")



        const test_case_nav_item = $$(".test_case_nav_item")
        const test_case_item = $$(".test_case_item")
        const inp = $$(".inp")

        const animation = $(".bot_display_nav-block .animation")
        const animationChild = $(".utility_nav-block .animation .children")
        const bDAnimation = $(".bot_display_nav-block .animation")
        const bDAnimationChild = $(".bot_display_nav-block .animation .children")
        const botDisplayBlock = $$(".bot_display-video-item")
        let options = {
            timeZone: 'Asia/Ho_Chi_Minh',
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        }

        runBtn.onclick = () => {
            if (!username) {
                set_is_require_login(true)
                return
            }

            test_case_nav_item.forEach(item => {
                item.querySelector(".test_case_nav_title").classList.toggle("appear")
            })
            let formatter = new Intl.DateTimeFormat([], options);

            fetch("http://192.168.1.249:5000/run_task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code,
                    inp_oup: inp_oup,
                    time: formatter.format(new Date()),
                }),
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    $$(".output_block").forEach(item => item.remove())
                    if (data.status === "SE") {
                        render_result(data, data.status)
                        return
                    }
                    data.user_output.forEach((oup, i) => {
                        if (oup.output_status === "AC") {
                            test_case_nav_item[i].className = "test_case_nav_item accepted"
                        } else {
                            test_case_nav_item[i].className = "test_case_nav_item err"
                        }
                    })
                    test_case_item.forEach((item, i) => {
                        item.innerHTML += `
                        <div class="output_block">
                            <hr style="width: 100%; margin: 10px 0;">
                            <div class="oup_title">output</div>
                            <div contenteditable="" name="" id="" class="oup">${data.output[i]}</div>
                            <div class="user_oup_title">your_output</div>
                            <div contenteditable="" name="" id="" class="your_oup ${data.user_output[i].output_status === "AC" ? "accepted" : "err"}">${data.user_output[i].output}</div>
                        </div>
                    `
                    })
                })
            test_case_nav_item.forEach(item => {
                item.querySelector(".test_case_nav_title").classList.toggle("appear")
            })
        }

        submitBtn.onclick = () => {
            console.log(code)
            // const code = editor.getValue()
            submitCode(code)
        }

        function submitCode(code) {
            if (!username) {
                set_is_require_login(true)
                return
            }
            let formatter = new Intl.DateTimeFormat([], options);
            fetch("http://192.168.1.249:5000/submit_code", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code,
                    inp_oup: inp_oup,
                    id: task_id,
                    time: formatter.format(new Date()),
                    username: username
                }),
            })
                .then(res => res.json())
                .then(data => {
                    render_result(data, data.status)

                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {

                })
        }

        function capitalize(s) {
            return s && s[0].toUpperCase() + s.slice(1);
        }

        function render_result(data, status) {
            result_status.className = data.status === "AC" ? "status accepted" : "status err"
            result_type.className = data.status === "AC" ? "type accepted" : "type err"
            display_result.className = data.status === "AC" ? "display_result accepted" : "display_result err"

            result_status.innerHTML = data.status === "AC" ? "Accepted" : data.status === "WA" ? "Wrong answer" : "Syntax error"
            test_case_result_list.innerHTML = ""

            if (status === "SE") {
                test_case_result_overview.style.display = "none"
                test_case_result_err.style.display = "block"
                test_case_result_err.innerHTML = data.err.replaceAll('\n', '<br>').replaceAll('    ', '&emsp;')
                test_case_result_list.style.display = "none"
            } else {
                test_case_result_overview.style.display = "flex"
                runtime.innerHTML = `${Math.round(data.run_time)}` + "ms"
                if (data.run_time > 1000) {
                    test_case_runtime.classList.add("err")
                }
                else {
                    test_case_runtime.classList.remove("err")
                }
                const [left, right] = data.test_finished.split("/");
                AC.innerHTML = data.test_finished
                if (left != right) {
                    test_case_AC.classList.add("err")
                } else {
                    test_case_AC.classList.remove("err")
                }
                test_case_result_err.style.display = "none"
                test_case_result_list.style.display = "grid"
                data.user_output.forEach((oup, i) => {
                    let type_output
                    try {
                        type_output = typeof JSON.parse(oup.output)
                    } catch {
                        type_output = "j cha dc"
                    }
                    test_case_result_list.innerHTML += `
                        <li tabindex="0" class="test_case_result_item ${oup.output_status === "AC" ? "accepted" : "err"}">
                            Test ${i + 1}
                            <div class="text_case_InOu ${oup.output_status === "AC" ? "accepted" : "err"}">
                                <div class="text_case_oup_title">output =</div>
                                <div class="test_case_oup">${data.output[i]}</div>
                                <hr style="width: 100%; border: 1px solid #007BFF; margin-top: 14px">
                                <div class="user_oup_title">your output =</div>
                                <div class="user_oup">${type_output === 'boolean' ? capitalize(`${oup.output}`) : oup.output}</div>
                            </div>
                        </li>
                    `
                })
                reset_result_item()
            }
            // set_change_SB_history(Math.random())
            changeAnimation(resulttBtn, animation.clientWidth - (taskBtn.clientWidth * 3) - 3 + "px", resulttBtn.clientWidth + "px", "result", bDAnimationChild)
        }

        function reset_result_item() {
            test_case_result_item = $$(".test_case_result_item")
            test_case_result_item.forEach(item => {
                item.onblur = () => {
                    item.querySelector(".text_case_InOu").classList.remove("appear")
                }

                item.onclick = () => {
                    text_case_InOu.forEach(i => i.classList.remove("appear"))
                    item.querySelector(".text_case_InOu").classList.add("appear")
                }
            })
        }

        function toggleMode(mode) {
            all_block.forEach(item => item.style.display = "none")
            switch (mode) {
                case "task":
                    task_block.style.display = "block"
                    break
                case "result":
                    console.log("Result")
                    result_block.style.display = "block"
                    break
                case "submissions":
                    submissions_block.style.display = "block"
                    break
                case "help":
                    help_block.style.display = "block"
                    break
                default:
                    break
            }
        }

        function changeAnimation(e, right, width, mode, animationChild) {
            $$(".bot_display_nav-block--item").forEach(ele => ele.style.color = "#ccc")
            e.style.color = "#fff"
            animationChild.style.right = right;
            animationChild.style.width = width;
            toggleMode(mode)
        }

        function scrollToView(element) {
            if (!element) return
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                })
            }, 200)
        }

        taskBtn.onclick = (e) => {
            changeAnimation(taskBtn, `${100 - (e.target.clientWidth / bDAnimation.clientWidth * 100)}%`, e.target.clientWidth + "px", "task", bDAnimationChild)
        }

        resulttBtn.onclick = (e) => {
            changeAnimation(resulttBtn, animation.clientWidth - (taskBtn.clientWidth * 3) - 7 + "px", e.target.clientWidth + "px", "result", bDAnimationChild)
        }

        submissionsBtn.onclick = (e) => {
            changeAnimation(submissionsBtn, animation.clientWidth - (resulttBtn.clientWidth * 4.4) - 10 + "px", e.target.clientWidth + "px", "submissions", bDAnimationChild)
        }

        helpBtn.onclick = (e) => {
            changeAnimation(helpBtn, "0", e.target.clientWidth + "px", "help", bDAnimationChild)
        }

        inp.forEach(item => {
            item.oninput = () => {
                item.style.height = "5px";
                item.style.height = (item.scrollHeight) + "px";
            }
        })


        test_case_nav_item.forEach((item, i) => {
            item.onclick = () => {
                test_case_item.forEach(i => i.classList.remove("appear"))
                test_case_nav_item.forEach(i => i.classList.remove("choosen"))
                item.classList.add("choosen")
                test_case_item[i].classList.add("appear")
            }
        })
    }, [task, user, code])

    return (
        <div className="h-screen">
            {is_require_login && <Login_require set_is_require_login={set_is_require_login} />}
            <div
                className="cover"
                style={{
                    display: "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(255, 255, 255, .05)",
                    zIndex: 1000
                }}
            />
            <div className="guide" />
            <div className="CM_container">
                <div className="container_element bot_display">
                    <div className="bot_display-tasks">
                        <div className="bot_display-tasks_nav"></div>
                    </div>
                    <div className="bot_display_nav">
                        <div className="bot_display_nav-block">
                            <div className="bot_display_nav-block--item task">
                                TASK
                                <div className="loading_nav_task">
                                    <div className="loader" />
                                    <i className="fa-solid fa-circle-check check_icon" />
                                </div>
                            </div>
                            <div className="bot_display_nav-block--item result">
                                RESULT
                                <div className="loading_nav_image">
                                    <i className="fa-solid fa-circle-check check_icon" />
                                    <div className="loader" />
                                </div>
                            </div>
                            <div className="bot_display_nav-block--item submissions">
                                SUBMISSIONS
                            </div>
                            <div className="bot_display_nav-block--item help">HELP</div>
                            <div className="animation">
                                <div className="children" />
                            </div>
                        </div>
                    </div>
                    <div
                        style={{ display: "block" }}
                        className="bot_display-item bot_display-task"
                    >
                        {/* {{task}} */}
                        <div className="bot_display-task--title">
                            {task_name}
                        </div>
                        <ul className="bot_display-task--class_list p-0">
                            <li className={`bot_display-task--class_item ${task.tag && task.tag.difficult}`}>
                                {task.tag && task.tag.difficult}
                            </li>
                        </ul>
                        <div className="task_content" dangerouslySetInnerHTML={{ __html: content }}></div>
                        <div className="bot_display-task--status">
                            <div className="bot_display-task--status_item tallent">
                                accepted
                                <div className="num">
                                    {accepted_count}
                                </div>
                            </div>
                            <div className="bot_display-task--status_item good">
                                submissions
                                <div className="num">
                                    {submission_count}
                                </div>
                            </div>
                            <div className="bot_display-task--status_item submissions">
                                accepted rate
                                <div className="num">
                                    {Math.round(accepted_count / (submission_count > 0 ? submission_count : 1) * 100) + "%"}
                                </div>
                            </div>
                        </div>
                        <Comment_modal bg="bg-[#262626]" px="" task_id={task_id} set_comment_count={set_comment_count}/>
                    </div>
                    <div
                        style={{ display: "none" }}
                        className="bot_display-item bot_display-result"
                    >
                        <div className="type accepted">
                            <div className="user">
                                <div className="CM_user_avatar">
                                    {username && username[0].toUpperCase()}
                                </div>
                                <div className="user_name">
                                    {username}
                                </div>
                            </div>
                            <div className="status accepted">chưa có kết quả</div>
                        </div>
                        <div className="display_result accepted">
                            <div className="test_case_result">
                                <div className="test_case_result_overview">
                                    <div className="test_case_runtime">
                                        <div className="runtime_title">Runtime</div>
                                        <div className="runtime">1ms</div>
                                    </div>
                                    <div className="test_case_AC">
                                        <div className="AC_title">AC</div>
                                        <div className="AC">10/10</div>
                                    </div>
                                </div>
                                <div className="warper_TCRL">
                                    <ul className="test_case_result_list p-0">
                                        {/* <li tabindex="0" class="test_case_result_item accepted">
                              Test 1
                              <div class="text_case_InOu accepted">
                                  <div class="text_case_oup_title">output =</div>
                                  <div class="test_case_oup">[[1,2],[3,1],[5,1],[3,5],[1,2],[3,1],[5,1],[3,5],[1,2],[3,1],[5,1],[3,5]]</div>
                                  <hr style="width: 100%; border: 1px solid #007BFF; margin-top: 14px">
                                  <div class="user_oup_title">your output =</div>
                                  <div class="user_oup">[1,2,3,4]</div>
                              </div>
                          </li> */}
                                    </ul>
                                </div>
                                <div
                                    style={{ display: "none" }}
                                    className="test_case_result_err overflow-y-scroll"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div
                        style={{ display: "none" }}
                        className="bot_display-item bot_display-submissions"
                    >
                        <div className="submissions_title">
                            <div className="sbum_status">Status</div>
                            <div className="sbum_submit_time">Submit time</div>
                            <div className="sbum_test_finished">Test finished</div>
                            <div style={{ flex: 2 }} />
                        </div>
                        <ul className="submissions_list">
                            {/* {console.log(task.challenger[username])} */}
                            {(task.challenger && task.challenger[username]) && JSON.parse(JSON.stringify(task.challenger[username].submissions)).reverse().map(submission => 
                            <li class="submissions_item">
                                <div class={`submissions_status ${submission.status === "AC" ? "accepted" : "err"}`}>{submission.status === "AC" ? "Accepted" : submission.status === "WA" ? "Wrong answer" : "Syntax error"}</div>
                                <div class="submissions_time">{submission.submit_time}</div>
                                <div class="submissions_test_finished">{submission.test_finished}</div>
                                <div onClick={() => {}} class="view_code_btn">view code</div>
                            </li>    
                            )}
                        </ul>
                    </div>
                    <div
                        style={{ display: "none" }}
                        className="bot_display-item bot_display-help"
                    >
                        <div className="help_title">Kiến thức cần thiết</div>
                        <ul className="help_list help_type p-0">
                            {task.tag && task.tag.skill_require.map((skill, i) =>
                                <li key={i} className="help_item help_type">
                                    <a href={skill.link}>
                                        {skill.name}
                                    </a>
                                </li>
                            )}
                        </ul>
                        <div className="help_title">Các bài blog</div>
                        <ul className="help_list p-0">
                            <li className="help_item help_blog">
                                <a onClick={() => history("/post/" + "1719022233537", { state: "1719022233537" })}>
                                    Kiểm tra nước đi hợp lệ
                                </a>
                            </li>
                            <li className="help_item help_blog">
                                <a onClick={() => history("/post/" + "1719228535494", { state: "1719228535494" })}>
                                    Kiểm tra gánh chẹt
                                </a>
                            </li>
                            <li className="help_item help_blog">
                                <a onClick={() => history("/post/" + "1720181857262", { state: "1720181857262" })}>
                                    Kiểm tra vây
                                </a>
                            </li>
                        </ul>
                        <div className="help_title">Mô phỏng thuật toán</div>
                        <ul className="help_list p-0">
                            <li className="help_item help_blog">
                                <a onClick={() => history("/visualize/" + "OYRJNv4Jqez9dKZjLW27", { state: "OYRJNv4Jqez9dKZjLW27" })}>
                                    Kiểm tra nước đi
                                </a>
                            </li>
                            <li className="help_item help_blog">
                                <a onClick={() => history("/visualize/" + "aLzIcTxFR2EfRXVFov07", { state: "aLzIcTxFR2EfRXVFov07" })}>
                                    Kiểm tra gánh chẹt
                                </a>
                            </li>
                            <li className="help_item help_blog">
                                <a onClick={() => history("/visualize/" + "1OyReHWrH3zgV5IfcZPk", { state: "1OyReHWrH3zgV5IfcZPk" })}>
                                    Kiểm tra vây
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="container_element coding_module">
                    <div className="coding_module-nav">
                        <a onClick={() => history("/task_list")} className="coding_module-nav--backBtn">
                            <i className="fa-solid fa-arrow-right-from-bracket" />
                        </a>
                        <div className="coding_module-nav--runBtn CM_btn">Run</div>
                        <div
                            className="coding_module-nav--submitBtn loader"
                            style={{ display: "none", animation: "none" }}
                        >
                            <div className="coding_module-nav--loading" />
                        </div>
                        <div className="coding_module-nav--submitBtn CM_btn">Submit</div>
                    </div>
                    <div
                        className="a"
                        style={{
                            height: "100%",
                            position: "relative",
                            display: "flex",
                            flexDirection: "column"
                        }}
                    >
                        <AceEditor
                            value={code}
                            mode="python"
                            theme="dracula"
                            onChange={(e) => set_code(e)}
                            name="UNIQUE_ID_OF_DIV"
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                autoScrollEditorIntoView: true,
                            }}
                            width='100%'
                            height='66.5%'
                            className="coding_module-coding_block"
                        />
                        <div
                            className="guide_box--nav"
                            style={{ zIndex: 2000, display: "none" }}
                        >
                            <div className="left">⮜</div>
                            <div className="right">⮞</div>
                        </div>
                        {/* <div class="guide_box">
              <div class="guide_box--content">hellohellohellohellellohellohellohelloellohellohellohellohellohellohelloello</div>
              <div class="guide_box--arrow"></div>
          </div> */}
                        <div className="test_cases_block">
                            <div className="title">Test case</div>
                            <ul className="test_case_nav_list">
                                <li className="test_case_nav_item choosen">
                                    <div className="test_case_nav_title">Case 1</div>
                                    <div className="test_case_item_loader">
                                        <div className="test_case_item_loading" />
                                    </div>
                                </li>
                                <li className="test_case_nav_item">
                                    <div className="test_case_nav_title">Case 2</div>
                                    <div className="test_case_item_loader">
                                        <div className="test_case_item_loading" />
                                    </div>
                                </li>
                            </ul>
                            <ul className="test_case_list">
                                {
                                    inp_oup && handle_inp_oup(inp_oup).slice(0, 2).map((item, i) =>
                                        <li key={i} className={`test_case_item ${i === 0 ? "appear" : ''}`}>
                                            {item.input.map((inp, j) =>
                                                <div key={j}>
                                                    <div className="inp_title">
                                                        {input_title[j]}
                                                    </div>
                                                    <div className="inp">
                                                        {inp}
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
