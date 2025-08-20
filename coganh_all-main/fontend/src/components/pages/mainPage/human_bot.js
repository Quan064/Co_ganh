import React, { useContext, useEffect, useState } from 'react'
import level1 from "../../../static/img/level1.png"
import level2 from "../../../static/img/level2.png"
import level3 from "../../../static/img/level3.png"
import level4 from "../../../static/img/level4.png"
import Master from "../../../static/img/Master.png"
import chessboard1 from "../../../static/img/chessboard1.png"
import capture_audio from "../../../static/capture.mp3"
import move_audio from "../../../static/move-self.mp3"
import fireSound_audio from "../../../static/fireSound.mp3"
import fire_webp from "../../../static/img/fire.webp"

import createRateModel from "../../modal/rate_model"

import "../../../style/human_bot.css"
import "../../../style/rate_model.css"
import { AppContext } from '../../../context/appContext'

export default function Human_Bot() {
    const { user, history } = useContext(AppContext)

    const { username } = user

    const [ bot, set_bot ] = useState("Master")
    const [ reload, set_reload ] = useState()

    useEffect(() => {
        console.log("human_bot")
        const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)

        const isMobile = (window.innerWidth <= 500)

        let board = $(".board")
        let boardValue = board.getBoundingClientRect()
        let chessGrapX = boardValue.width / 4
        let chessGrapY = boardValue.height / 4
        let ready = true
        let d1 = [[1, 0], [0, 1], [0, -1], [-1, 0]]
        let d2 = [[1, 0], [0, 1], [0, -1], [-1, 0], [-1, -1], [-1, 1], [1, 1], [1, -1]]
        let radius = 16
        let canvas = $("canvas")
        canvas.style.left = board.offsetLeft - radius - 5 + "px"
        canvas.style.top = board.offsetTop - radius - 5 + "px"
        canvas.width = boardValue.width + 2 * radius + 10
        canvas.height = boardValue.height + 2 * radius + 10
        let cv2 = canvas.getContext("2d")
        let rs = 1
        let dem
        let chessEnemy

        // let username = user.username

        let selectedChess
        const gameResult = $(".game_result")
        const gameStatus = $(".HB_game_status")
        const play_again_btn = $(".play_again_btn")
        const moveSound = $(".move_sound")
        const captureSound = $(".capture_sound")
        const fireSound = $(".fire_sound")
        fireSound.volume = 0.6

        const rate_btn = $(".rate_btn")
        const rate = $(".RM_rate")
        const ske_loading = $(".RM_ske_loading")

        play_again_btn.onclick = () => set_reload(Math.random())

        const gridHTML = `
<div class="HB_grid">
<div class="HB_row1"></div>
<div class="HB_row2"></div>            
<div class="HB_row3"></div>
<div class="HB_row4"></div>
</div>
<div class="HB_grid">
<div class="HB_row1"></div>
<div class="HB_row2"></div>            
<div class="HB_row3"></div>
<div class="HB_row4"></div>
</div>
<div class="HB_grid">
<div class="HB_row1"></div>
<div class="HB_row2"></div>            
<div class="HB_row3"></div>
<div class="HB_row4"></div>
</div>
<div class="HB_grid">
<div class="HB_row1"></div>
<div class="HB_row2"></div>            
<div class="HB_row3"></div>
<div class="HB_row4"></div>
</div>
`

        let grid = [
            [-1, -1, -1, -1, -1],
            [-1, 0, 0, 0, -1],
            [1, 0, 0, 0, -1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1]
        ]

        let curBoard = [
            [-1, -1, -1, -1, -1],
            [-1, 0, 0, 0, -1],
            [1, 0, 0, 0, -1],
            [1, 0, 0, 0, 1],
            [1, 1, 1, 1, 1]
        ]

        let chessPosition = [
            [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [4, 1], [4, 2]],
            [[0, 2], [0, 3], [2, 4], [4, 3], [0, 4], [1, 4], [3, 4], [4, 4]]
        ]

        const type = [
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1],
            [0, 1, 0, 1, 0],
            [1, 0, 1, 0, 1]
        ]

        function resetBoard() {
            board = $(".board")
            boardValue = board.getBoundingClientRect()
            chessGrapX = boardValue.width / 4
            chessGrapY = boardValue.height / 4
            canvas = $("canvas")
            canvas.style.left = board.offsetLeft - radius - 5 + "px"
            canvas.style.top = board.offsetTop - radius - 5 + "px"
            canvas.width = boardValue.width + 2 * radius + 10
            canvas.height = boardValue.height + 2 * radius + 10
            cv2 = canvas.getContext("2d")
            board.innerHTML = gridHTML
            dem = 0
            for (let i = 0; i < grid.length; i++) {
                for (let j = 0; j < grid[i].length; j++) {
                    board.innerHTML += `<div data-choosable="false" data-posx="${j}" data-posy="${i}" class="box" style="top:${chessGrapY * i - 40 * rs}px; left:${chessGrapX * j - 40 * rs}px;"></div>`
                    if (grid[i][j] === -1) {
                        board.innerHTML += `<div data-so="${dem}" data-posx="${j}" data-posy="${i}" style="background-color: red; top:${chessGrapY * i - 30 * rs}px; left:${chessGrapX * j - 30 * rs}px;" class="chess HB_enemy"></div>`
                    } else if (grid[i][j] === 1) {
                        board.innerHTML += `<div data-so="${dem}" data-posx="${j}" data-posy="${i}" style="background-color: blue; top:${chessGrapY * i - 30 * rs}px; left:${chessGrapX * j - 30 * rs}px;" class="chess player"></div>`
                    }
                    dem++
                }
            }
        }

        resetBoard()

        let choosen_bot = bot
        const bot_items = $$(".bot_item")
        const fight_btn = $(".fight_btn")
        const overflow = $(".overflow")
        const bot_avatar_img = $(`.bot_avatar_${isMobile ? "mobile" : "pc"} img`)
        const bot_info_name = $(`.bot_info_name_${isMobile ? "mobile" : "pc"}`)

        bot_items.forEach(item => {
            item.onclick = (e) => {
                if (item.classList.contains("selected")) {
                    choosen_bot = ""
                    item.classList.remove("selected")
                    fight_btn.classList.remove("active")
                    return
                }
                bot_items.forEach(e => e.classList.remove("selected"))
                choosen_bot = item.dataset.level
                item.classList.add("selected")
                // bot_html = item
                fight_btn.classList.add("active")

            }
        })

        fight_btn.onclick = () => {
            if (!choosen_bot) return
            let bot

            switch (choosen_bot) {
                case "level1": bot = level1; break
                case "level2": bot = level2; break
                case "level3": bot = level3; break
                case "level4": bot = level4; break
                case "Master": bot = Master; break
                default: bot = Master; break
            }
            bot_avatar_img.src = bot
            bot_info_name.innerHTML = choosen_bot
            overflow.style.display = "none"
            set_bot(choosen_bot)
        }

        let move_list = []

        let img_data = {
            username: username || `Coganh_${Date.now()}`,
            side: 1,
            img: [],
            setup: {},
        }

        let rateModel

        rate_btn.onclick = () => {
            rate.classList.toggle("RM_appear")
            rate_btn.classList.toggle("active")
            console.log({ move_list: move_list, img_data: img_data })
            if (rateModel) return
            rateModel = true
            fetch("http://192.168.1.249:5000/get_rate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ move_list: move_list, img_data: img_data })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    const img_list = JSON.parse(data.img_url)
                    let rating = []
                    img_list.splice(1,img_list.length).forEach((url, i) => {
                        rating.push({
                            type: data.rate[i],
                            move: {
                                sellected_pos: `(${move_list[i].move.selected_pos[0]}, ${move_list[i].move.selected_pos[1]})`,
                                new_pos: `(${move_list[i].move.new_pos[0]}, ${move_list[i].move.new_pos[1]})`,
                            },
                            img_url: url,
                        })
                    })
                    rateModel = createRateModel(".RM_rate", rating)
                    rateModel.start()
                })
        }

        let boxes = $$(".box")

        function getPos(e) {
            if (!ready) return

            const eX = Number(e.dataset.posx)
            const eY = Number(e.dataset.posy)
            selectedChess = e

            clearBox()

            if (type[eX][eY] === 0) {
                d1.forEach(pos => {
                    let newPosX = eX + pos[0]
                    let newPosY = eY + pos[1]
                    if (newPosX >= 0 && newPosX < 5 && newPosY >= 0 && newPosY < 5 && grid[newPosY][newPosX] === 0) {
                        let box = Array.from(boxes).filter(e => Number(e.dataset.posx) === newPosX && Number(e.dataset.posy) === newPosY)
                        box.forEach(e => {
                            e.dataset.choosable = "true"
                        })
                    }
                })
            } else {
                d2.forEach(pos => {
                    let newPosX = eX + pos[0]
                    let newPosY = eY + pos[1]
                    if (newPosX >= 0 && newPosX < 5 && newPosY >= 0 && newPosY < 5 && grid[newPosY][newPosX] === 0) {
                        let box = Array.from(boxes).filter(e => Number(e.dataset.posx) === newPosX && Number(e.dataset.posy) === newPosY)
                        box.forEach(e => {
                            e.dataset.choosable = "true"
                        })
                    }
                })
            }
        }

        function changeTurn(ob1, ob2) {
            $(ob1).classList.add("unavalable")
            $(ob2).classList.remove("unavalable")
        }

        function findI(e) {
            return e[0] === this[0] && e[1] === this[1]
        }

        function changeBoard(newBoard, removeDict, selected_pos, new_pos) {
            const chesses = $$(".chess")
            for(let i = 0; i < 5; i++) {
                for(let j = 0; j < 5; j++) {
                    if(curBoard[i][j] !== newBoard[i][j] && Object.keys(removeDict).length !== 0) {
                        if(curBoard[i][j] !== 0 && newBoard[i][j] === 0) {
                            const changedChess = Array.from(chesses).find(e => {
                                return Number(e.dataset.posx) === j && Number(e.dataset.posy) === i
                            })
                            if(changedChess) {
                                console.log("changedChess: ",changedChess)
                                chessPosition.forEach((es,index) => es.forEach((e, indx)=> {
                                    if(es.findIndex(findI, [j,i]) !== -1) {
                                        chessPosition[index].splice(es.findIndex(findI, [j,i]),1)
                                    }
                                }))
                                captureSound.play()
                                fireSound.play()
                                const fire = document.createElement("img")
                                fire.setAttribute("src", fire_webp)
                                fire.setAttribute("style", `top:${chessGrapY*i - 30 * rs}px; left:${chessGrapX*j - 30 * rs}px;`)
                                fire.setAttribute("class", "fire")
                                let newFire = board.appendChild(fire)
                                newFire.onanimationend = (e) => {
                                    console.log("remove")
                                    changedChess.remove()
                                }
                            }
                        }
                    }
                    curBoard[i][j] = newBoard[i][j];
                }
            }
            
            img_data.img.push([selected_pos[0],selected_pos[1],new_pos[0],new_pos[1], removeDict])
        
            if(chessPosition[0].length === 0) {
                gameStatus.innerHTML = "You Win"
                gameStatus.style.backgroundColor = "green"
                gameStatus.style.display = "block"
                gameStatus.style.opacity = "1";
                rate_btn.style.display = "block"
            } else if(chessPosition[1].length === 0) {
                gameStatus.innerHTML = "You lost"
                gameStatus.style.backgroundColor = "red"
                gameStatus.style.opacity = "1";
                rate_btn.style.display = "block"
            } else if(chessPosition[0].length === 1 && chessPosition[1].length === 1) {
                gameStatus.innerHTML = "draw"
                gameStatus.style.backgroundColor = "#ccc"
                gameStatus.style.display = "block"
                gameStatus.style.opacity = "1";
                rate_btn.style.display = "block"
            }
        }

        function ganh_chet(move, opp_pos, side, opp_side) {
            let valid_remove = [];
            let at_8intction = (move[0] + move[1]) % 2 === 0;

            for (let [x0, y0] of opp_pos) {
                let dx = x0 - move[0];
                let dy = y0 - move[1];
                if (dx >= -1 && dx <= 1 && dy >= -1 && dy <= 1 && (dx === 0 || dy === 0 || at_8intction)) {
                    if ((move[0] - dx >= 0 && move[0] - dx <= 4 && move[1] - dy >= 0 && move[1] - dy <= 4 && grid[move[1] - dy][move[0] - dx] === opp_side) ||
                        (x0 + dx >= 0 && x0 + dx <= 4 && y0 + dy >= 0 && y0 + dy <= 4 && grid[y0 + dy][x0 + dx] === side)) {
                        valid_remove.push([x0, y0]);
                    }
                }
            }

            for (let [x, y] of valid_remove) {
                grid[y][x] = 0;
                opp_pos = opp_pos.filter(([px, py]) => px !== x || py !== y);
            }

            return valid_remove;
        }

        function vay(opp_pos) {
            for (let pos of opp_pos) {
                let move_list
                if ((pos[0] + pos[1]) % 2 === 0) {
                    move_list = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [-1, 1], [1, -1]];
                } else {
                    move_list = [[1, 0], [-1, 0], [0, 1], [0, -1]];
                }
                for (let move of move_list) {
                    let new_valid_x = pos[0] + move[0];
                    let new_valid_y = pos[1] + move[1];
                    if (new_valid_x >= 0 && new_valid_x <= 4 && new_valid_y >= 0 && new_valid_y <= 4 && grid[new_valid_y][new_valid_x] === 0) {
                        console.log(new_valid_x, new_valid_y)
                        return [];
                    }
                }
            }

            let valid_remove = opp_pos.slice();
            for (let [x, y] of opp_pos) {
                grid[y][x] = 0;
            }
            opp_pos = [];
            return valid_remove;
        }

        function isReady(bol) {
            const chesses = $$(".chess")
            if (bol) {
                chesses.forEach(chess => chess.classList.remove("not_ready"))
                changeTurn(`.bot_info_${isMobile ? "mobile" : "pc"}`, `.player_info_${isMobile ? "mobile" : "pc"}`)
            } else {
                chesses.forEach(chess => chess.classList.add("not_ready"))
                changeTurn(`.player_info_${isMobile ? "mobile" : "pc"}`, `.bot_info_${isMobile ? "mobile" : "pc"}`)
            }
            ready = bol
        }

        function changePos(x, y, newX, newY) {
            const chessX = Number(x)
            const chessY = Number(y)
            const boxX = Number(newX)
            const boxY = Number(newY)
            let path = grid[chessY][chessX]
            grid[chessY][chessX] = grid[boxY][boxX]
            grid[boxY][boxX] = path
        }

        function swap(chess, box, newPos, selected_pos) {
            let valid_remove
            cv2.clearRect(0, 0, canvas.width, canvas.height);
            moveSound.play()
            let r = [2,1.5,2,2.5,2]
            let preBoard = curBoard.map(row => row.map(item => item))
            let removeDict = {};
            if(box) {
                cv2.beginPath();
                cv2.arc(chess.dataset.posx * (boardValue.width / 4) + radius + 2.5 * r[chess.dataset.posx], chess.dataset.posy * (boardValue.height / 4) + radius + 2.5 * r[chess.dataset.posx], radius, 0, 2 * Math.PI);
                cv2.lineWidth = 5;
                cv2.fillStyle = "#577DFF"
                cv2.fill()
                cv2.strokeStyle = "#577DFF";
                cv2.stroke();
                chess.style.left = box.offsetLeft + 10 * rs + "px"
                chess.style.top = box.offsetTop + 10 * rs + "px"
        
                newPos = [Number(box.dataset.posx), Number(box.dataset.posy)]
                selected_pos = [Number(chess.dataset.posx),Number(chess.dataset.posy)]
                
                let opp_pos = chessPosition[0]
                changePos(chess.dataset.posx,chess.dataset.posy, box.dataset.posx, box.dataset.posy)
                valid_remove = [...ganh_chet([Number(box.dataset.posx), Number(box.dataset.posy)], opp_pos, 1, -1), ...vay(opp_pos)]
                move_list.push({
                    your_pos: [...chessPosition[1]],
                    opp_pos: [...chessPosition[0]],
                    board: preBoard,
                    side: 1,
                    remove: valid_remove,
                    move: {
                        selected_pos: selected_pos,
                        new_pos: newPos,
                    }
                })
                valid_remove.forEach(i => {
                    removeDict[i.join(',')] = "remove_red";
                });
                
                chessPosition[1][chessPosition[1].findIndex(findI, [Number(chess.dataset.posx), Number(chess.dataset.posy)])] = [Number(box.dataset.posx), Number(box.dataset.posy)]
                chess.dataset.posx = box.dataset.posx
                chess.dataset.posy = box.dataset.posy
            } else {
                cv2.beginPath();
                cv2.arc(chess.dataset.posx * (boardValue.width / 4) + radius + 2.5 * r[chess.dataset.posx], chess.dataset.posy * (boardValue.height / 4) + radius + 2.5 * r[chess.dataset.posx], radius, 0, 2 * Math.PI);
                cv2.lineWidth = 5;
                cv2.fillStyle = "#FC6666"
                cv2.fill()
                cv2.strokeStyle = "#FC6666";
                cv2.stroke();
                
                let opp_pos = chessPosition[1]
                console.log({selected_pos,newPos})
                changePos(selected_pos[0], selected_pos[1], newPos[0], newPos[1])
                valid_remove = [...ganh_chet([newPos[0], newPos[1]], opp_pos, -1, 1), ...vay(opp_pos)]
                console.log({selected_pos,newPos})
        
                move_list.push({
                    your_pos: [...chessPosition[1]],
                    opp_pos: [...chessPosition[0]],
                    board: preBoard,
                    side: -1,
                    remove: valid_remove,
                    move: {
                        selected_pos: selected_pos,
                        new_pos: newPos,
                    }
                })
                valid_remove.forEach(i => {
                    removeDict[i.join(',')] = "remove_blue";
                });
        
                chessPosition[0][chessPosition[0].findIndex(findI, [selected_pos[0], selected_pos[1]])] = [newPos[0], newPos[1]]
                chess.style.left = newPos[0] * chessGrapX - 30 * rs + "px"
                chess.style.top = newPos[1] * chessGrapX - 30 * rs + "px"
                chess.dataset.posx  = `${newPos[0]}`
                chess.dataset.posy = `${newPos[1]}`
                isReady(true)
            }
            changeBoard(grid, removeDict, selected_pos, newPos)
        }

        function clearBox() {
            boxes.forEach(box => {
                box.dataset.choosable = "false"
            })
        }

        function getBotmove() {
            console.log('asd')
            setTimeout(() => {
                if (chessPosition[0].length <= 0 || chessPosition[1].length <= 0) return
                chessEnemy = $$(".chess.HB_enemy")
                let data = {
                    your_pos: [],
                    your_side: -1,
                    opp_pos: [],
                    board: grid,
                }

                console.log(JSON.parse(JSON.stringify(data)))

                grid.forEach((row, i) => {
                    row.forEach((__, j) => {
                        if (grid[i][j] === 1) data.your_pos.push([j, i])
                        if (grid[i][j] === -1) data.opp_pos.push([j, i])
                    })
                })

                console.log(JSON.parse(JSON.stringify(data)))

                fetch("http://192.168.1.249:5000/get_pos_of_playing_chess", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        data: data,
                        choosen_bot: choosen_bot,
                    }),
                })
                    .then(res => res.json(data))
                    .then(resData => {
                        const { selected_pos, new_pos } = resData
                        console.log("selected_pos:  ", { selected_pos, new_pos })
                        const selectedChess = Array.from(chessEnemy).find(e => {
                            return Number(e.dataset.posx) === selected_pos[0] && Number(e.dataset.posy) === selected_pos[1]
                        })
                        console.log("resData: ", resData)
                        swap(selectedChess, null, new_pos, selected_pos)
                    })
            }, 1000)
        }

        boxes.forEach((e) => {
            e.onclick = () => {
                if (e.dataset.choosable === "true" && selectedChess) {
                    isReady(false)
                    swap(selectedChess, e)
                    clearBox()
                    getBotmove()
                }
            }
            e.ontouchend = () => {
                if (e.dataset.choosable === "true" && selectedChess) {
                    isReady(false)
                    swap(selectedChess, e)
                    clearBox()
                    getBotmove()
                }
            }
        })

        const chess = $$(".chess.player")

        chess.forEach(e => {
            e.onclick = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height) }
            e.ontouchend = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height); console.log("touch") }
        });

        window.onresize = function (event) {
            if (window.outerWidth <= 500) {
                rs = 0.5
                radius = 8
            } else {
                rs = 1
                radius = 16
            }
            resetBoard()
            boxes = $$(".box")
            console.log("resize")
            boxes.forEach((e) => {
                e.onclick = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
                e.ontouchend = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
            })

            const chess = $$(".chess.player")

            chess.forEach(e => {
                e.onclick = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height) }
                e.ontouchend = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height); console.log("touch") }
            });
        }

        window.onload= (event) => {
            console.log(event)
            if (window.outerWidth <= 500) {
                rs = 0.5
                radius = 8
            } else {
                rs = 1
                radius = 16
            }
            resetBoard()
            boxes = $$(".box")
            console.log("reload")
            boxes.forEach((e) => {
                e.onclick = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
                e.ontouchend = () => {
                    if (e.dataset.choosable === "true" && selectedChess) {
                        isReady(false)
                        swap(selectedChess, e)
                        clearBox()
                        getBotmove()
                    }
                }
            })

            const chess = $$(".chess.player")

            chess.forEach(e => {
                e.onclick = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height) }
                e.ontouchend = () => { getPos(e); cv2.clearRect(0, 0, canvas.width, canvas.height); console.log("touch") }
            });
        }
    }, [username, reload])

    return (
        <div className="flex h-screen justify-around items-center">
            <div className="game_state pc">
                <div className="game_turn game_turn-bot_">
                    <div className="bot_avatar_pc">
                        <img src={Master} alt="" />
                    </div>
                    <div className="game_turn_info bot_info_pc unavalable">
                        <div className="bot_info_name_pc">Master</div>
                    </div>
                </div>
                <div className="game_turn game_turn-player">
                    <div className="player_avatar">{(username && username[0].toUpperCase()) || "C"}</div>
                    <div className="game_turn_info player_info_pc">
                        <div className="player_info_name">{username || "Coganh"}</div>
                    </div>
                </div>
            </div>
            <div className="game_turn game_turn-bot mobile_active">
                <div className="bot_avatar_mobile">
                    <img src={Master} alt="" />
                </div>
                <div className="game_turn_info bot_info_mobile unavalable">
                    {/* <div class="bot_title">DEFEATED</div> */}
                    <div className="bot_info_name_mobile">Master</div>
                </div>
            </div>
            <div className="board" />
            <div className="game_turn game_turn-player mobile_active">
                <div className="player_avatar">{(username && username[0].toUpperCase()) || "C"}</div>
                <div className="game_turn_info player_info_mobile">
                    <div className="player_info_name">{username || "Coganh"}</div>
                </div>
            </div>
            <canvas />
            <div className="RM_rate">
                <div className="RM_game_display">
                    <i className="fa-solid fa-angle-left RM_arrow_left" />
                    <div className="RM_img_main">
                        <ul className="RM_img_list p-0 m-0">
                            <li className="RM_img_item RM_default">
                                <img src={chessboard1} alt="" />
                            </li>
                        </ul>
                        <div className="RM_counter">0</div>
                    </div>
                    <i className="fa-solid fa-angle-right RM_arrow_right" />
                    <div className="RM_loader">
                        <div className="RM_loading" />
                    </div>
                </div>
                <div className="RM_game_rate">
                    <div className="RM_rate_list">
                        <ul className="RM_overview p-0">
                            <div className="RM_header">
                                <div className="RM_player RM_you">
                                    <div className="RM_content">Bạn</div>
                                </div>
                                <div className="RM_move_count">MOVES: 20</div>
                                <div className="RM_player RM_enemy">
                                    <div className="RM_content">Đối thủ</div>
                                </div>
                            </div>
                        </ul>
                        <div className="RM_spacing" />
                        <ul className="RM_detail p-0"></ul>
                    </div>
                    <div className="RM_ske_loading">
                        <ul className="RM_ske_loading-overview p-0">
                            <li />
                            <li />
                            <li />
                            <li />
                        </ul>
                        <div className="RM_spacing" />
                        <ul className="RM_ske_loading-detail p-0">
                            <li />
                            <li />
                            <li />
                        </ul>
                    </div>
                </div>
            </div>
            <input
                type="checkbox"
                name=""
                id="open_game_result"
                hidden
                style={{ position: "fixed" }}
            />
            <div className="game_result">
                <label htmlFor="open_game_result" className="game_result_nav">
                    <i className="fa-solid fa-angles-up arrow_up" />
                    <i className="fa-solid fa-angles-down arrow_down" />
                </label>
                <div className="HB_game_status">Game on...</div>
                <a onClick={() => history("/menu")} className="HB_menu_btn">
                    Menu
                </a>
                <div className="rate_btn">Xem đánh giá</div>
                <div className="play_again_btn">Play again</div>
            </div>
            <div className="overflow">
                <div className="choose_bot_model">
                    <div className="choose_bot_model-title">Chọn bot</div>
                    <div className="bot_list">
                        <div className="bot_list_block">
                            <div data-level="level1" className="bot_item h-auto level1">
                                <img className="" src={level1} alt="" />
                                <div className="bot_item_title level1">level 1</div>
                            </div>
                            <div data-level="level2" className="bot_item h-auto level2">
                                <img className="" src={level2} alt="" />
                                <div className="bot_item_title level2">level 2</div>
                            </div>
                            <div data-level="level3" className="bot_item h-auto level3">
                                <img className="" src={level3} alt="" />
                                <div className="bot_item_title level3">level 3</div>
                            </div>
                        </div>
                        <div className="bot_list_block">
                            <div data-level="level4" className="bot_item h-auto level4">
                                <img className="" src={level4} alt="" />
                                <div className="bot_item_title level4">level 4</div>
                            </div>
                            <div data-level="Master" className="bot_item h-auto Master">
                                <img className="" src={Master} alt="" />
                                <div className="bot_item_title Master">MASTER</div>
                            </div>
                        </div>
                    </div>
                    <div className="fight_btn">Thách đấu</div>
                </div>
            </div>
            {/* <img className="fire" src={fire_webp} alt="" hidden/> */}
            <audio
                className="capture_sound"
                src={capture_audio}
            />
            <audio
                className="move_sound"
                src={move_audio}
            />
            <audio
                className="fire_sound"
                src={fireSound_audio}
            />
        </div>

    )
}
