import React, { useContext, useEffect, useState } from 'react'
import { CircularProgressbar, buildStyles  } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { LineChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { AppContext } from '../../../context/appContext';

export default function User_dashboard({data: {bots, posts, your_tasks, tasks}}) {
  const {user} = useContext(AppContext)

  const [chart_post_data, set_chart_post_data] = useState([0,0,0,0,0,0,0,0,0,0,0,0])
  const [chart_task_data, set_chart_task_data] = useState([0,0,0,0,0,0,0,0,0,0,0,0])

  const [bot_status, set_bot_status] = useState({
    win: 0,
    lost: 0,
    draw: 0,
  })

  useEffect(() => {
    let chart_post_data = [0,0,0,0,0,0,0,0,0,0,0,0]
    let chart_task_data = [0,0,0,0,0,0,0,0,0,0,0,0]
    posts.forEach(post => {
      let month = get_month(post.upload_time)
      chart_post_data[month]++
    })
  
    tasks.forEach(task => {
      let month = get_month(task.submit_time)
      chart_task_data[month-1]++
    })
    chart_post_data.splice(new Date().getMonth() + 1)
    chart_task_data.splice(new Date().getMonth() + 1)
    console.log(chart_task_data)
    set_chart_post_data(chart_post_data)
    set_chart_task_data(chart_task_data)
  }, [tasks, posts])

  function get_month(dateString) {
    let [datePart] = dateString.split(/[\s,]+/);
    let [month] = datePart.split('/');

    return parseInt(month)
  }

  useEffect(() => {
    if(bots) {
      const status = {
        win: 0,
        lost: 0,
        draw: 0,
      }
    
      bots.forEach(bot => {
        bot.fight_history.forEach(fight => status[fight.status]++)
      });
      set_bot_status(status)
    }
  }, [bots])

  return (
    <div className="w-full flex flex-col justify-between overflow-scroll">
        <div className="statistical w-full flex justify-between">
          <div className="statistical_bot w-[40%] h-72 rounded-lg border-blue-400 border-2 bg-[#4F6AF3] py-5 grid grid-rows-5 grid-flow-col">
            <div className="statistical_title text-2xl px-5">Thông số của Bot</div>
            <div className="grid grid-cols-2 row-span-4">
              <div className="flex flex-col items-center justify-center">
                {/* <p className="text-xl font-semibold mb-5">Số bot sở hữu</p> */}
                <div className="statistical_bot-circle w-32 h-32 rounded-full bg-slate-200 grid place-content-center ">
                  <div className="text-5xl text-[#007BFF]">{bots && bots.length}</div>
                </div>
              </div>
              <div className="text-2xl flex flex-col justify-center">
                {/* <div>Thông số</div> */}
                <ul className="p-0">
                  <li className="text-lg">
                    <span className="text-[blue] font-bold">Thắng : </span>{bot_status.win}

                  </li>
                  <li className="text-lg">
                    <span className="text-red-600 font-bold">Thua : </span>{bot_status.lost}

                  </li>
                  <li className="text-lg">
                    <span className="text-gray-200 font-bold">Hòa : </span>{bot_status.draw}

                  </li>
                  <li className="text-lg">
                    <span className="text-gray-200 font-bold">Tổng số trận : </span>{bot_status.draw + bot_status.win + bot_status.lost}

                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="statistical_posts w-[28%] h-72 rounded-lg border-blue-400 border-2 bg-[#0F2845] p-5 flex flex-col items-center">
            <div className="statistical_title text-3xl self-start flex items-center mb-auto"><i className="fa-solid fa-book-open mr-5"></i><span className="text-xl">SỐ BLOG ĐÃ ĐĂNG</span></div>
            <div className="statistical_training-circle mb-[10%]">
              <div className="statistical_bot-circle w-52 h-40 rounded-xl bg-slate-200 grid place-content-center ">
                <div className="text-5xl text-[#007BFF]">{your_tasks && your_tasks.length}</div>
              </div>
            </div>
          </div>

          <div className="statistical_training w-[28%] h-72 rounded-lg border-blue-400 border-2 bg-[#0F2845] p-5 flex flex-col items-center">
            <div className="statistical_title text-3xl self-start flex items-center mb-auto"><i class="fa-solid fa-graduation-cap mr-5"></i><span className="text-lg">TASK ĐÃ ĐĂNG</span></div>

            <div className="statistical_training-circle w-32 h-32 mb-[16%]">
              <div className="statistical_bot-circle w-32 h-32 rounded-full bg-slate-200 grid place-content-center ">
                <div className="text-5xl text-[#007BFF]">{your_tasks && your_tasks.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="chart_all mt-5 w-full h-96 rounded-lg border-blue-400 border-2 bg-[#0F2845]">
        <LineChart
          xAxis={[{scaleType: 'point', data: [`tháng 1`, `tháng 2`, `tháng 3`, `tháng 4`, `tháng 5`, `tháng 6`, `tháng 7`, `tháng 8`, `tháng 9`, `tháng 10`, `tháng 11`, `tháng 12`] }]}
          series={[
            {
              data: chart_task_data,
              label: "post"
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
            ["& .MuiChartsLegend-series text"]: {
              fill: "white !important",
              font: 'bold 20px sans-serif !important',
            } 
          })}
          // width={1000}
          // height={300}
        />
        </div>
        <div className="chart_all mt-5 w-full h-96 rounded-lg border-blue-400 border-2 bg-[#0F2845]">
        <LineChart
          xAxis={[{scaleType: 'point', data: [`tháng 1`, `tháng 2`, `tháng 3`, `tháng 4`, `tháng 5`, `tháng 6`, `tháng 7`, `tháng 8`, `tháng 9`, `tháng 10`, `tháng 11`, `tháng 12`] }]}
          series={[
            {
              data: chart_post_data,
              label: "task"
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
            ["& .MuiChartsLegend-series text"]: {
              fill: "white !important",
              font: 'bold 20px sans-serif !important',
            } 
          })}
          // width={1000}
          // height={300}
        />
        </div>
        
    </div>
  )
}
