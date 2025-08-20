import React, { useContext, useEffect, useRef, useState } from 'react'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart } from '@mui/x-charts';
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import level1 from "../../../static/img/level1.png"
import level2 from "../../../static/img/level2.png"
import level3 from "../../../static/img/level3.png"
import level4 from "../../../static/img/level4.png"
import Master from "../../../static/img/Master.png"
import View_code from '../view_code';
import { AppContext } from '../../../context/appContext';

export default function User_bot({ bots, raw_bots }) {
  const { history } = useContext(AppContext)
  const [bot_status, set_bot_status] = useState({
    win: 0,
    lost: 0,
    draw: 0,
  })
  console.log("Asdasdasdas", bots.map(bot => bot.is_public))
  const [is_public_list, set_is_public_list] = useState(bots.map(bot => bot.is_public))

  const [enemy_bot_id, set_enemy_bot_id] = useState([])
  const [code_to_show, set_code_to_show] = useState([])
  const [chunk_index, set_chunk_index] = useState(0)

  useEffect(() => {
    const status = {
      win: 0,
      lost: 0,
      draw: 0,
    }

    raw_bots.forEach(bot => {
      bot.fight_history.forEach(fight => status[fight.status]++)
    });
    const U_bot_item = document.querySelectorAll(".U_bot_item")
    U_bot_item.forEach(item => {
      const open_BIF_bnt = item.querySelector(".open_bot_info_btn")
      open_BIF_bnt.onclick = () => {
        open_BIF_bnt.classList.toggle("bg-[#a0d8fa]")
        open_BIF_bnt.classList.toggle("text-black")
        item.querySelector(".bot_info").classList.toggle("hidden")
      }
    })
    set_enemy_bot_id(raw_bots.map(bot => bot.fight_history.map(item => item.enemy.bot_id)))
    set_bot_status(status)
  }, [raw_bots])

  useEffect(() => {
    if (enemy_bot_id.length > 0) {
      fetch("https://coganh.onrender.com/get_code_to_show", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(enemy_bot_id)
      })
        .then(res => res.json())
        .then(data => {
          let d = []
          for (let i = 0; i < data.length; i += 4) {
              const chunk = data.slice(i, i + 4);
              d.push(chunk)
          }
          set_code_to_show(d)
        })
        .catch(err => console.log(err))
    }
  }, [enemy_bot_id])

  useEffect(() => {
    document.querySelectorAll(".fight_history_item").forEach(item => {
      item.querySelector("div .fight_history_item-view_code_btn").onclick = () => {
        const code_block = item.querySelector(".show_code_block")
        if (code_block.classList.contains("hidden")) {
          code_block.classList.replace("animate-close_code", "animate-open_code")
          code_block.classList.replace("hidden", "flex")
        }
        else {
          code_block.classList.replace("animate-open_code", "animate-close_code")
          code_block.classList.replace("flex", "hidden")
        }
      }
    })
  }, [code_to_show])

  function handle_satus(status) {
    switch (status) {
      case "win":
        return "text-[#A0D8FA]  shadow-[#87bdff]"
      case "lost":
        return "text-red-500  shadow-red-300"
      case "draw":
        return "shadow-white"
      default:
        return "shadow-white"
    }
  }

  function handle_elo(elo) {
    switch (elo) {
      case elo > 0:
        return { class: "text-[#A0D8FA]  shadow-[#87bdff]", text: "+" + elo }
      case elo < 0:
        return { class: "text-red-500  shadow-red-300", text: "-" + elo }
      case elo === 0:
        return { class: "shadow-white", text: elo }
      default:
        return { class: "shadow-white", text: elo }
    }
  }

  function toggle_is_public(id, type, index) {
    console.log(id)
    fetch(`https://coganh.onrender.com/change_is_public?bot_id=${id}&type=${type ? 1 : 0}`)
      .then(res => res.json())
      .then(data => {
        let new_IPLL = JSON.parse(JSON.stringify(is_public_list))
        new_IPLL[index] = Boolean(type)
        set_is_public_list(new_IPLL)
      })
      .catch(err => console.log(err))
  }

  return (
    <>
    {/* {bots[0] && */}
    <div className="w-full h-full flex flex-col justify-between">
      <div className="statistical w-full flex justify-between">
        <div className="statistical_bot w-[40%] h-72 rounded-lg bg-[#0b427e] text-white py-5 grid grid-rows-5 grid-flow-col">
          <div className="statistical_title text-2xl font-bold px-5">THÔNG SỐ TẤT CẢ CÁC BOT</div>
          <div className="grid grid-cols-2 row-span-4">
            <div className="flex flex-col items-center justify-center">
              {/* <p className="text-xl font-semibold mb-5">Số bot sở hữu</p> */}
              <div className="statistical_bot-circle w-32 h-32 rounded-full bg-[#202634] text-[#a0d8fa] flex flex-col justify-center items-center">
                <span className="text-2xl text-[#a0d8fa] font-bold">Số bot</span>
                <div className="text-5xl text-[#a0d8fa]">{bots[0] ? bots.length : 0}</div>
              </div>
            </div>
            <div className="text-2xl flex flex-col justify-center">
              {/* <div>Thông số</div> */}
              <ul className="p-0">
                <li className="text-lg">
                  <span className=" font-bold text-xl">Thắng : </span>{bot_status.win}
                </li>
                <li className="text-lg">
                  <span className=" font-bold">Thua : </span>{bot_status.lost}
                </li>
                <li className="text-lg">
                  <span className="text-white font-bold">Hòa : </span>{bot_status.draw}
                </li>
                <li className="text-lg">
                  <span className="text-white font-bold">Tổng số trận : </span>{bot_status.draw + bot_status.win + bot_status.lost}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="statistical_posts w-[28%] h-72 rounded-lg bg-[#767f80] p-5 flex flex-col items-center">
          <div className="statistical_title text-2xl self-start font-bold">ELO TRUNG BÌNH</div>
          <div className="grid place-content-center h-full font-bold text-4xl">
            {raw_bots[0] ? raw_bots.reduce((cur_elo, bot) => bot.elo + cur_elo, 0) / bots.length : 0}
          </div>
        </div>

        <div className="statistical_training w-[28%] h-72 rounded-lg bg-[#0b427e] p-5 flex flex-col items-center">
          <div className="statistical_title text-2xl self-start font-bold">RANK CAO NHẤT</div>
          <div className="statistical_posts-circle my-auto w-32 h-32 rounded-full bg-slate-200 grid place-content-center ">
            <div className="text-5xl text-[#007BFF]">{raw_bots[0] && raw_bots[0].rank}</div>
          </div>
        </div>
      </div>

      {bots.length === 0 && 
      <div className="w-full h-1/2 flex flex-col justify-center items-center text-5xl">
        Bạn chưa có bot
        <div onClick={() => history("create_bot")} className="text-2xl mt-2 text-[#007BFF] font-semibold underline hover:brightness-90 cursor-pointer">Hãy tạo bot tại đây</div>
      </div>
      }

      <ul className="U_bot_list p-0">
        {console.log(is_public_list)}
        {bots[chunk_index] && bots[chunk_index].map((bot, i) =>
          <li className="U_bot_item rounded-lg border-[#a0d8fa] border-2 bg-opacity-15 p-5 mb-4">
            <div className="ml-auto flex w-fit">
              <div onClick={() => toggle_is_public(bot.id, !is_public_list[i], i)} className="text-2xl grid place-content-center border border-[#a0d8fa] hover:bg-[#a0d8fa] hover:text-black transition-all cursor-pointer select-none w-fit p-3 py-1 rounded-md mb-5 mr-2">{is_public_list[i] ? "PUBLIC" : "PRIVATE"}</div>
              <div className="open_bot_info_btn text-3xl border border-[#a0d8fa] hover:bg-[#a0d8fa] hover:text-black transition-all cursor-pointer select-none p-3 py-1 rounded-md mb-5">
                <i class="fa-solid fa-bars"></i>
              </div>
            </div>
            <div className="U_bot_item-profile flex justify-between">
              <div className="w-[55%] h-72 rounded-lg py-5 pr-5 mb-5 flex">
                <div className="flex flex-col items-center w-1/2">
                  <div className="w-28 h-28 text-5xl font-bold rounded-full bg-[#a0d8fa] text-black grid place-content-center">{bot.bot_name[0].toUpperCase()}</div>
                  <div className="my-5 text-3xl">{bot.bot_name}</div>
                  <div className="text-2xl">{bot.elo}</div>
                </div>
                <div className="w-1/2 flex">
                <div className="flex-1">
                  <p className="text-center text-2xl mb-5">BOT LEVEL</p>
                  {bot.level === 0 &&
                      <div data-level="level1" className="level1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                        <img className="w-5/6 opacity-0" src={level1} alt="" />
                        <div className="level1 text-black text-xl">level 0</div>
                      </div>
                  }
                  {bot.level === 1 &&
                      <div data-level="level1" className="level1 bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                        <img className="w-5/6" src={level1} alt="" />
                        <div className="level1 text-black text-xl">level 1</div>
                      </div>
                  }
                  {bot.level === 2 &&
                    <div data-level="level2" className="level2 bg-white flex flex-col items-center w-32 rounded-md">
                      <img className="max-w-24" src={level2} alt="" />
                      <div className="level2 text-white text-xl">level 2</div>
                    </div>
                  }
                  {bot.level === 3 && 
                  <div data-level="level3" className="level3 bg-white flex flex-col items-center w-32 rounded-md">
                    <img className="max-w-24" src={level3} alt="" />
                    <div className="level3 text-white text-xl">level 3</div>
                  </div>
                  }
                  {bot.level === 4 && 
                  <div data-level="level3" className="level3 bg-white flex flex-col items-center w-32 rounded-md">
                    <img className="max-w-24" src={level4} alt="" />
                    <div className="level3 text-white text-xl">level 4</div>
                  </div>
                  }
                  {bot.level === 5 && 
                  <div data-level="Master" className="Master bg-white flex flex-col items-center w-32 rounded-md">
                    <img className="max-w-24" src={Master} alt="" />
                    <div className="Master text-white text-xl">MASTER</div>
                  </div>
                  }
                  </div>

                  {/* <div data-level="level2" className="level2 bg-white flex flex-col items-center w-32 rounded-md">
                      <img className="max-w-24" src={level2} alt="" />
                      <div className="level2 text-white text-xl">level 2</div>
                    </div>
                    <div data-level="level3" className="level3 bg-white flex flex-col items-center w-32 rounded-md">
                      <img className="max-w-24" src={level3} alt="" />
                      <div className="level3 text-white text-xl">level 3</div>
                    </div>
                    <div data-level="level3" className="level3 bg-white flex flex-col items-center w-32 rounded-md">
                      <img className="max-w-24" src={level4} alt="" />
                      <div className="level3 text-white text-xl">level 4</div>
                    </div>
                    <div data-level="Master" className="Master bg-white flex flex-col items-center w-32 rounded-md">
                      <img className="max-w-24" src={Master} alt="" />
                      <div className="Master text-white text-xl">MASTER</div>
                    </div> */}
                  <div className="w-2"></div>
                  <div className="flex-1">
                    <p className="text-center text-2xl mb-5">RANK</p>
                    <div data-level="level1" className="relative bg-[#a0d8fa] text-black flex flex-col items-center w-full rounded-md">
                      <img className="w-5/6 opacity-0" src={level1} alt="" />
                      <div className="level1 text-white text-xl opacity-0">0</div>
                      <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl max-w-full">1</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[43%] h-72 rounded-lg p-5 flex flex-col items-start">
                {(() => {
                  const win_count = bot.fight_history.filter(h => h.status === "win").length
                  const lost_count = bot.fight_history.filter(h => h.status === "lost").length
                  const draw_count = bot.fight_history.filter(h => h.status === "draw").length
                  let dem = 0
                  if (win_count > 0) dem++
                  if (lost_count > 0) dem++
                  if (draw_count > 0) dem++

                  return (<PieChart
                    series={[
                      {
                        arcLabel: (item) => `${item.value}`,
                        arcLabelMinAngle: 100,
                        data: [
                          { id: 0, value: win_count, label: 'WIN', color: "#1F81C1" },
                          { id: 1, value: lost_count, label: 'LOST', color: "#CD151A" },
                          { id: 2, value: draw_count, label: 'DRAW', color: "#767f80" },
                        ],
                        highlightScope: { faded: 'global', highlighted: 'item' },
                        faded: { innerRadius: 10, additionalRadius: -10, color: 'gray' },
                        innerRadius: 30,
                        outerRadius: 100,
                        paddingAngle: dem === 3 ? 5 : 0,
                        cornerRadius: 5,
                        startAngle: 0,
                        endAngle: 360,
                        cx: 150,
                        cy: 150,
                      },
                    ]}
                    sx={{
                      [`& .${pieArcLabelClasses.root}`]: {
                        fill: 'white',
                        font: 'bold 20px sans-serif',
                      },
                      ["& .MuiChartsLegend-series text"]: {
                        fill: "white !important",
                        font: 'bold 20px sans-serif !important',
                      }
                    }}
                    width={400}
                    height={300}
                  />)
                })()}
              </div>
            </div>
            <div className="bot_info hidden overflow-hidden transition-all">
              <div className="w-full h-[40rem] flex">
                <div className="w-11/12 h-5/6 py-5 m-auto rounded-lg bg-[#282A36] relative text-xl">
                  {bots[0] && <View_code bot={bot} bot_code={bot.code} enable_edit={true} pos={{ top: "-8%", left: "84%" }} />}
                </div>
              </div>

              <div className="U_fight_history flex flex-col mt-10 p-5 w-full max-h-[48rem] rounded-lg border-[#a0d8fa] border-2 bg-opacity-15">
                <div className="flex px-2">
                  <div className="flex-1">Status</div>
                  <div className="flex-auto w-1/12">Enemy</div>
                  <div className="flex-auto w-1/12">Enemy's owner</div>
                  <div className="flex-1">Moves</div>
                  <div className="flex-auto w-1/12">Time</div>
                  <div className="flex-auto w-1/12">Elo change</div>
                  <div className="flex-1"></div>
                </div>
                <div className="w-full my-2 h-[1px] bg-[#036CDC]"></div>
                <ul className="fight_history_list p-0 pl-[1px] flex-1 overflow-scroll">
                  {bot.fight_history.map(({ status, elo_change, move, time, enemy }, j) =>
                    <li key={j} className={`fight_history_item flex flex-col `}>
                      <div className={`flex w-full px-2 py-1 ${i % 2 == 0 ? "bg-[#111C2C]" : "bg-[#0E335B]"}`}>
                        <div className={`flex items-center flex-1 font-bold text-lg [text-shadow:0px_0px_12px_var(--tw-shadow-color)] ${handle_satus(status)}`}>DRAW</div>
                        <div className="flex items-center flex-auto w-1/12">{enemy.bot_name}</div>
                        <div className="flex items-center flex-auto w-1/12">{enemy.owner}</div>
                        <div className="flex items-center flex-1">{move}</div>
                        <div className="flex items-center flex-auto w-1/12">{time}</div>
                        <div className={`flex items-center flex-auto w-1/12 font-bold text-lg [text-shadow:0px_0px_12px_var(--tw-shadow-color)] ${handle_elo(elo_change).class}`}>{handle_elo(elo_change).text}</div>
                        <div className={`fight_history_item-view_code_btn flex items-center flex-1 text-[#a0d8fa] font-bold underline select-none ${code_to_show[i] && (code_to_show[i][j] ? " cursor-pointer" : "text-opacity-25 cursor-not-allowed pointer-events-none")}`}><p className="ml-auto mr-2">CODE</p></div>
                      </div>
                      <div className={`show_code_block w-full overflow-hidden hidden justify-center items-center animate-open_code animate-close_code will-change-contents`}>
                        <div className="w-3/4 h-[30rem] rounded-md overflow-hidden py-4 my-6 bg-[#282A36]">
                          <View_code bot_code={code_to_show[chunk_index] && code_to_show[chunk_index][i][j]} />
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </li>
        )}
      </ul>



      {/* <div className="chart_all w-full h-1/2 rounded-lg border-[#a0d8fa] border-2 bg-opacity-15">
        <LineChart
          xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
          series={[
            {
              data: [2, 5.5, 2, 8.5, 1.5, 5],
            },
            {
              data: [2, 1.5, 1, 5.5, 7.5, 1],
            },
          ]}
          sx={(theme) => ({
            [`.${axisClasses.root}`]: {
              [`.${axisClasses.tick}, .${axisClasses.line}`]: {
                stroke: 'white',
              },
              [`.${axisClasses.tickLabel}`]: {
                fill: 'white',
              },
            },
          })}
          width={500}
          height={300}
        />
      </div> */}
    </div>
    </>
  )
}
