import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import "../../style/simulation.css"

import chessboard_simulation from "../../static/img/chessboard_simulation.png"
import fire from "../../static/img/fire.webp"
import fire_sound from "../../static/fireSound.mp3"
import CreateBoardSimulation from "../modal/board_simulation_model.js";
import CreateTreeSimulation from "../modal/tree_simulation_model.js";
import Navbar from '../primary/navbar.js'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
export default function Visualize() {
  const { state } = useLocation()
  const { id } = useParams()
  const [data, set_data] = useState({})
  const [controller, set_controller] = useState({})
  useEffect(() => {
    fetch("http://192.168.1.249:5000/get_visualize/" + id)
      .then(res => res.json())
      .then(data => set_data(data))
      .catch(err => console.log(err))
  }, [state])

  // useEffect(() => {
  //   if (data.type === "tree" && controller) controller.start()
  // }, [controller])

  useEffect(() => {



    const { action, name, type } = data

    const run_btn = $(".run_btn")
    // let action = $(".action").innerHTML
    const simulation_type = type
    const simulation_name = name

    const O_C_btn = $(".O_C_btn i")
    const open_code_btn = $(".open_code_btn i")
    const side_select = $(".side_select")

    const setting_bar = $(".setting_bar")
    const action_block = $(".action_block")
    const play_animation_controller = $(".play_animation_controller")
    const play_pause_btn = $("#play_pause_btn")
    const duration_bar = $(".duration_bar")
    duration_bar.value = 0
    const visualize_speed = $(".visualize_speed")
    const pre_action = $(".pre_action")
    const play_btn = $(".play_btn")
    const pause_btn = $(".pause_btn")
    const next_action = $(".next_action")
    let isDragging = false;

    // const sBoard = $(".VI_setting_item.sboard")
    // const sChooseChess = $(".VI_setting_item.choose_chess")
    // const sVay_check = $(".VI_setting_item.vay_check")
    // const sNode = $(".VI_setting_item.node")
    // const sMinimaxTurn = $(".VI_setting_item.minimax_turn")
    // const sChooseChessMove = $(".choose_chess_move")

    // const your_chess = $$(".your_chess")

    // switch (simulation_name) {
    //   case "valid_move":
    //     sBoard.style.display = "flex"
    //     sChooseChess.style.display = "flex"
    //     break;
    //   case "vay":
    //     sBoard.style.display = "flex"
    //     sVay_check.style.display = "flex"
    //     break;
    //   case "ganh_chet":
    //     sBoard.style.display = "flex"
    //     sChooseChessMove.style.display = "flex"
    //     break
    //   default:
    //     sNode.style.display = "flex"
    //     sMinimaxTurn.style.display = "flex"
    //     break;
    // }


    duration_bar.onchange = (e) => {
      if (simulation_type === "tree") {
        controller.animation_index = Math.round((controller.action.length - 1) * (e.target.value / 100))
      } else if (simulation_type === "board") {
        controller.animation_index = Math.round((controller.run_task.length - 1) * (e.target.value / 100))
      }
      controller.Pause()
      controller.play_one_frame(controller.animation_index)
      // controller.play_animation()
      // duration_bar.value = (controller.animation_index / (controller.action.length - 1)) * 100
    }

    visualize_speed.onchange = () => {
      controller.speed = Number(visualize_speed.value)
    }

    if (data.name === "vay") {
      side_select.onchange = () => {
        controller.config_run_task = (obj) => {
          let run_task = []
          for (let [x, y] of obj[side_select.value]) {
            let isHasMove = obj.valid_move_for_single_chess[side_select.value][`[${[x, y]}]`].length > 0
            run_task.push(...[
              ["RMH", "", 1000],
              ["hightlight", { row: [3, 4, 5, 6], type: "run" }, 0],
              ["hightlight", { row: [((x + y)) % 2 === 0 ? 4 : 6], type: "true" }, 0],
              ["RMH", "", 1000],
              ["CC_M", ["valid", "valid_move_for_single_chess", side_select.value, `[${[x, y]}]`], 0],
              ["hightlight", { row: [(isHasMove ? [9, 10] : 9)], type: (isHasMove ? "true" : "false") }, 0],
            ])
            if (isHasMove) {
              run_task.push(
                ["SDC", ["vay", false], 0]
              )
              obj.run_task = run_task
              return
            }
          }
          run_task.push(...[
            ["RMH", "", 1000],
            ["hightlight", { row: [12, 13], type: "true" }, 0],
            ["FT", obj[side_select.value], 100],
          ])
          run_task.push(
            ["SDC", ["vay", true], 0]
          )
          obj.run_task = run_task
        }
        controller.start()
        controller.Pause()
      }
    }

    pre_action.onclick = async () => {
      controller.Pause()
      if (controller.animation_index > 0) {
        controller.animation_index -= 1
        await controller.play_one_frame(controller.animation_index)
        duration_bar.value = (controller.animation_index / (simulation[(simulation_type === "tree" ? "action" : "run_task")].length - 1)) * 100
      }
    }

    next_action.onclick = async () => {
      console.log(controller.animation_index)
      controller.Pause()
      if (controller.animation_index < simulation[(simulation_type === "tree" ? "action" : "run_task")].length - 1) {
        if (simulation_type === "tree" || controller.moves.length !== 0 || controller.all_move.your_pos.length !== 0 || controller.opp_pos.length !== 0) controller.animation_index += 1
        await controller.play_one_frame(controller.animation_index)
        duration_bar.value = (controller.animation_index / (simulation[(simulation_type === "tree" ? "action" : "run_task")].length - 1)) * 100
      }
    }

    play_btn.onclick = () => {
      // controller.Play()
      controller.isPaused = false
      controller.play_animation(controller.animation_index)
    }

    pause_btn.onclick = () => {
      controller.isPaused = true
      // controller.play_animation(controller.animation_index)
    }

    // let [x,y] = your_pos[Math.round(Math.random() * (your_pos.length - 1))]

    let simulation
    if (simulation_type === "board") {
      if (simulation_name === "valid_move") {
        controller.is_single_chess = true
        controller.chosed_chess = [[0, 2]]
        controller.choose_chess(controller.chosed_chess)
      }
      controller.start()
      if (simulation_name === "vay") {
        controller.config_run_task = (obj) => {
          let run_task = []
          for (let [x, y] of obj[side_select.value]) {
            let isHasMove = obj.valid_move_for_single_chess[side_select.value][`[${[x, y]}]`].length > 0
            run_task.push(...[
              ["RMH", "", 1000],
              ["hightlight", { row: [3, 4, 5, 6], type: "run" }, 0],
              ["hightlight", { row: [((x + y)) % 2 === 0 ? 4 : 6], type: "true" }, 0],
              ["RMH", "", 1000],
              ["CC_M", ["valid", "valid_move_for_single_chess", side_select.value, `[${[x, y]}]`], 0],
              ["hightlight", { row: [(isHasMove ? [9, 10] : 9)], type: (isHasMove ? "true" : "false") }, 0],
            ])
            if (isHasMove) {
              run_task.push(
                ["SDC", ["vay", false], 0]
              )
              obj.run_task = run_task
              return
            }
          }
          run_task.push(
            ["FT", obj[side_select.value], 100]
          )
          run_task.push(
            ["SDC", ["vay", true], 0]
          )
          obj.run_task = run_task
        }
      }
      if (simulation_name === "valid_move") {
        controller.run_task = JSON.parse(action.replaceAll("9999", (controller.chosed_chess[0][0] + controller.chosed_chess[0][1]) % 2 === 0 ? "4" : "6"))
      }
      if (simulation_name === "ganh_chet") {
        controller.config_run_task = () => {
          const setting_board = $(".VI_board")
          let valid_remove = controller.ganh_chet(controller.new_pos, controller.opp_pos, 1, -1)
          let run_task = []
          run_task.push(...[
            ["render", JSON.parse(`[${setting_board.innerHTML.replaceAll("\n", ",")}]`.replaceAll("],]", "]]")), 0],
            ["hightlight", { row: [5, 6], type: "true" }, 0],
            ["MC", [controller.selected_pos, controller.new_pos], 1000],
            ...controller.opp_pos.map((pos) => ["CSC", pos, 500]),
            ["RMH", "", 0]
          ])
          if (valid_remove.length > 0) {
            run_task.push(...[
              ["FT", valid_remove, 1000],
              ["hightlight", { row: [7, 8, 9, 10], type: "true" }, 0],
              ["RMH", "", 1000],
              ["hightlight", { row: [12], type: "true" }, 1000],
              ["SDC", ["ganh_chet", [true, valid_remove]], 0],
            ])
          } else {
            run_task.push(...[
              ["SDC", ["ganh_chet", [false, valid_remove]], 1000],
              ["hightlight", { row: [7, 8, 9], type: "false" }, 0],
            ])
          }
          console.log(run_task)
          controller.run_task = run_task
        }
      }
    } else if (simulation_type === "tree") {
      console.log(controller)
      controller.start()
    }

    run_btn.onclick = () => {
      if (simulation_type === "board") {
        if (controller.isErr) {
          controller.setting_board.style.animation = "none"
          setTimeout(() => {
            controller.setting_board.style.animation = "horizontal-shaking .1s linear"
          }, 10);
          return
        }
        // controller.return_value_ouput.style.display = "none"
        controller.start()
        controller.chosed_chess = controller.chosed_chess
        controller.play_animation()
        controller.Play()
      } else if (simulation_type === "tree") {
        controller.run_algorithm("minimax")
        controller.isPaused = false
        controller.play_visualize()
      }
      // controller.move_chess([0,2], [1,2], 0)
    }

    let startX, startY;
    let scrollLeft, scrollTop;

    const fake_window = document.querySelector('.fake_window');
    const content = document.querySelector('.fake_window');

    content.scrollLeft = 1500 - window.innerWidth / 2;
    content.scrollTop = window.innerHeight / 2 + 800;


    // window.addEventListener('load', (event) => {
    //     window.scrollTo(0, 0);
    // });

    window.onbeforeunload = function() {
      content.scrollLeft = 1500 - this.window.innerWidth / 2;
      content.scrollTop = this.window.innerHeight / 2 + 800;
    }

    // Also set scroll position to top on page load
    window.onload = function () {
      content.scrollLeft = 1500 - this.window.innerWidth / 2;
      content.scrollTop = this.window.innerHeight / 2 + 800;
    }

    content.onmousedown = (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      scrollLeft = content.scrollLeft;
      scrollTop = content.scrollTop;
      content.style.cursor = 'grabbing'; // Thay đổi con trỏ chuột
      //   e.preventDefault(); // Ngăn chặn sự kiện mặc định
    }

    content.onmouseup = () => {
      isDragging = false;
      content.style.cursor = 'default'; // Khôi phục con trỏ chuột
    }

    content.onmouseleave = () => {
      isDragging = false;
      content.style.cursor = 'default'; // Khôi phục con trỏ chuột
    }

    content.onmousemove = (e) => {
      if (!isDragging) return;
      const x = e.clientX;
      const y = e.clientY;
      const walkX = (x - startX);
      const walkY = (y - startY);
      content.scrollLeft = scrollLeft - walkX;
      content.scrollTop = scrollTop - walkY;
    }

    O_C_btn.onclick = () => {
      setting_bar.classList.toggle("appear")
    }

    open_code_btn.onclick = () => {
      action_block.classList.toggle("appear")
    }

    action_block.onmousemove = () => {
      isDragging = false
    }

    play_animation_controller.onmousemove = () => {
      isDragging = false
    }

    setting_bar.onmousemove = () => {
      isDragging = false
    }
    console.log(controller)
  }, [controller, state])

  return (
    <div className="fake_window w-screen h-screen overflow-hidden">
      <Navbar back_link="/visualize_page" mode="light"/>
      {console.log("render")}
      <div className="fake_body">
        <img
          style={{ position: "fixed" }}
          className="board_img"
          src={chessboard_simulation}
          alt=""
          hidden
        />
        <img
          style={{ position: "fixed" }}
          className="fire_img"
          src={fire}
          alt=""
          hidden
        />
        <audio className="fire_sound" src={fire_sound} />
        <label htmlFor="checkbox" className="r_btn O_C_btn">
          <i style={{ fontSize: 34 }} className="fa-solid fa-gear" />
          <div className="setting_bar">
            <div className="setting_block">
              {data.type === "board" &&
                <div className="VI_setting_item sboard">
                  <div className="board_title">board</div>
                  <pre className="VI_board" contentEditable="">
                    [-1,-1,-1,-1,-1]{"\n"}[-1, 0, 0, 0,-1]{"\n"}[ 1, 0, 0, 0,-1]{"\n"}[
                    1, 0, 0, 0, 1]{"\n"}[ 1, 1, 1, 1, 1]
                  </pre>
                  <div className="random_board_btn">
                    <i className="fa-solid fa-dice" />
                  </div>
                </div>
              }
              {data.name === "valid_move" &&
                <div className="VI_setting_item choose_chess">
                  <div className="choose_your_pos_title">Chọn quân</div>
                  <div className="your_pos_list">
                    <div className="your_pos_item selected" data-x={0} data-y={2}>
                      (0,2)
                    </div>
                    <div className="your_pos_item" data-x={0} data-y={3}>
                      (0,3)
                    </div>
                    <div className="your_pos_item" data-x={0} data-y={4}>
                      (0,4)
                    </div>
                    <div className="your_pos_item" data-x={1} data-y={4}>
                      (1,4)
                    </div>
                    <div className="your_pos_item" data-x={2} data-y={4}>
                      (2,4)
                    </div>
                    <div className="your_pos_item" data-x={3} data-y={4}>
                      (3,4)
                    </div>
                    <div className="your_pos_item" data-x={4} data-y={4}>
                      (4,4)
                    </div>
                    <div className="your_pos_item" data-x={4} data-y={3}>
                      (4,3)
                    </div>
                  </div>
                  <div className="random_your_pos_btn">
                    <i className="fa-solid fa-dice" />
                  </div>
                </div>
              }
              {data.name === "vay" &&
                <div className="VI_setting_item vay_check">
                  <div className="item_title">Quân được kiểm tra vây</div>
                  <select className="side_select" name="" id="">
                    <option value="your_pos">Quân xanh</option>
                    <option value="opp_pos">Quân đỏ</option>
                  </select>
                </div>
              }
              {data.name === "ganh_chet" &&
                <div className="VI_setting_item choose_chess_move">
                  <div className="item_title">Chọn quân</div>
                  <div className="your_chess_list">
                    <div className="your_chess_item selected" data-x={0} data-y={2}>
                      (0,2)
                    </div>
                    <div className="your_chess_item" data-x={0} data-y={3}>
                      (0,3)
                    </div>
                    <div className="your_chess_item" data-x={0} data-y={4}>
                      (0,4)
                    </div>
                    <div className="your_chess_item" data-x={1} data-y={4}>
                      (1,4)
                    </div>
                    <div className="your_chess_item" data-x={2} data-y={4}>
                      (2,4)
                    </div>
                    <div className="your_chess_item" data-x={3} data-y={4}>
                      (3,4)
                    </div>
                    <div className="your_chess_item" data-x={4} data-y={4}>
                      (4,4)
                    </div>
                    <div className="your_chess_item" data-x={4} data-y={3}>
                      (4,3)
                    </div>
                  </div>
                  <div className="item_title">Chọn vị trí di chuyển</div>
                  <div className="your_move_list">
                    <div className="your_move_item" data-x={1} data-y={1}>
                      (1,1)
                    </div>
                    <div className="your_move_item" data-x={1} data-y={2}>
                      (1,2)
                    </div>
                    <div className="your_move_item" data-x={1} data-y={3}>
                      (1,3)
                    </div>
                  </div>
                </div>
              }

              {data.name === "minimax" && <>
                <div className="VI_setting_item node">
                  <div className="item_title">Node</div>
                  <div className="node_setting">
                    <input type="text" className="node_name" placeholder="Name" />
                    <input type="number" className="node_value" placeholder="Value" />
                  </div>
                </div>
                <div className="VI_setting_item minimax_turn">
                  <div className="item_title">Thứ tự minimax</div>
                  <ul className="minimax_list"></ul>
                </div>
              </>}
              <div className="run_btn">Khởi tạo</div>
            </div>
          </div>
        </label>
        {/* <input type="checkbox" name="" id="open_code_cb" style="position: fixed;" hidden> */}
        <label htmlFor="open_code_cb" className="r_btn open_code_btn">
          <i className="fa-solid fa-code" />
          <div className="action_block">
            <div className="code_list">
              {/* {{controller.codes | safe}} */}
              <pre className="bg-white bg-opacity-0 border-0 p-0">
                <code className="language-python bg-white bg-opacity-0">
                  <div dangerouslySetInnerHTML={{ __html: data.codes }}></div>
                </code>
              </pre>
              <div className="row_list">
                {(new Array(data.row).fill(0)).map((item) => <div className="code_row" />)}
              </div>
            </div>
          </div>
          <div className="show_data_change">value</div>
        </label>
        <div className="play_animation_controller">
          <div className="btn_controller">
            <div className="controller_btn pre_action">
              <i className="fa-solid fa-backward-step" />
            </div>
            <input
              type="checkbox"
              name=""
              id="play_pause_btn"
              style={{ position: "fixed" }}
              hidden
            />
            <label htmlFor="play_pause_btn" className="play_pause_btn">
              <div className="controller_btn play_btn">
                <i className="fa-solid fa-play" />
              </div>
              <div className="controller_btn pause_btn">
                <i className="fa-solid fa-pause" />
              </div>
            </label>
            <div className="controller_btn next_action">
              <i className="fa-solid fa-forward-step" />
            </div>
          </div>
          <input type="range" className="duration_bar" name="" id="" />
          <select value={1} className="visualize_speed">
            <option value={0.25}>0.25x</option>
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={4}>4x</option>
            <option value={10}>10x</option>
          </select>
        </div>

        {/* </div> */}
        <div id="content">
          <div className="VI_container">
            {/* {"{"}% if controller.type == "board" %{"}"} */}
            {data.type && (data.type === "board" ?
              <CreateBoardSimulation controller={(c) => set_controller(c)} root="canvas" data={data} />
              :
              // <svg width={960} height={600} />
              <CreateTreeSimulation controller={(c) => set_controller(c)} />
            )}
          </div>
        </div>
      </div>
    </div>


  )
}
