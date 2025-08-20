import React, { useContext, useEffect, useRef, useState } from 'react'
import "../../../style/style.css"
import "../../../style/create_bot.css"
import level1 from "../../../static/img/level1.png"
import level2 from "../../../static/img/level2.png"
import level3 from "../../../static/img/level3.png"
import level4 from "../../../static/img/level4.png"
import Master from "../../../static/img/Master.png"
import your_bot from "../../../static/img/your_bot.png"
import demo_video from "../../../static/upload_video/demo.mp4"
import chessboard_debug from "../../../static/img/chessboard.png"

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { AppContext } from '../../../context/appContext'
import Add_bot from '../../modal/add_bot'
import Remove_bot from '../../modal/remove_bot'
import Login_require from '../../modal/requirements/login_require'
import Loading from '../../modal/loading'

const bots_list = {
    level1: level1,
    level2: level2,
    level3: level3,
    level4: level4,
    Master: Master,
    your_bot: your_bot,
}

export default function Create_bot() {
    const { history, user } = useContext(AppContext)
    const { username } = user

    const [code, set_code] = useState("")
    const [new_bot, set_new_bot] = useState(username)
    const [bots, set_bots] = useState([])
    const [selected_bot, set_selected_bot] = useState({bot_name: username})
    const [src, set_src] = useState(demo_video)
    const [is_VD_check, set_is_VD_check] = useState(true)
    const [is_DB_check, set_is_DB_check] = useState(true)
    const [is_open_add_bot, set_is_open_add_bot] = useState(false)
    const [is_open_remove_bot, set_is_open_remove_bot] = useState(false)
    const [is_require_login, set_is_require_login ] = useState(false)
    const [is_loading_videp, set_is_loading_video] = useState(false)

    useEffect(() => {
        if(username) {
            fetch("http://192.168.1.249:5000/get_user_bot/" + user.username)
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                if (data[0]) {
                    // console.log(!selected_bot)
                    if(code.length < 5 || !selected_bot) {
                        set_code(data[0].code)
                        set_selected_bot(data[0])
                    }
                    set_bots(data)
                } else {
                    set_code(`# NOTE: tool
# valid_move(x, y, board): trả về các nước đi hợp lệ của một quân cờ - ((x, y), ...)
# distance(x1, y1, x2, y2): trả về số nước đi ít nhất từ (x1, y1) đến (x2, y2) - n

# NOTE: player
# player.your_pos: vị trí tất cả quân cờ của bản thân - [(x, y), ...]
# player.opp_pos: vị trí tất cả quân cờ của đối thủ - [(x, y), ...]
# player.your_side: màu quân cờ của bản thân - 1:🔵
# player.board: bàn cờ - -1:🔴 / 1:🔵 / 0:∅

# Remember that player.board[y][x] is the tile at (x, y) when printing
def main(player):
    move = [[-1,0],[0,-1],[0,1],[1,0]]
    for x,y in player.your_pos:
        for mx,my in move:
            if 0 <= x+mx <= 4 and 0 <= y+my <= 4 and player.board[y+my][x+mx] == 0:
                return {"selected_pos": (x,y), "new_pos": (x+mx, y+my)}`)
                }
            })
            .catch(err => console.error(err))
        }
    }, [username, new_bot])

    useEffect(() => {
        const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)
        const saveBtn = $(".CB_coding_module-nav--saveBtn")
        const fight_result_item = $$(".fight_result_item")
        if (saveBtn.dataset.saved = "true") {
            saveBtn.style.backgroundColor = "#1E1E1E"
            saveBtn.style.color = "#fff"
        }
        fight_result_item.forEach(item => {
            item.style.display = "none"
        })
    }, [code])

    useEffect(() => {

        const $ = document.querySelector.bind(document)
        const $$ = document.querySelectorAll.bind(document)

        // const username = "vudeptrAI"

        const runBtn = $(".CB_coding_module-nav--CB_runBtn.cb_btn")
        const saveBtn = $(".CB_coding_module-nav--saveBtn")
        const terminal = $(".utility_block-element.terminal")
        const rule = $(".utility_block-element.rule")
        const result = $(".utility_block-element.result")
        const uniBlock = $$(".utility_block-element")
        const loader = $(".CB_coding_module-nav--CB_runBtn.CB_loader")
        const video = $(".bot_display-video--result")
        const debug = $(".bot_display-video--debug")
        const help = $(".bot_display-video--help")

        const uniNavItem = $$(".utility_nav-block--item")
        const ruleBtn = $(".utility_nav-block--item.rule")
        const terminalBtn = $(".utility_nav-block--item.terminal")
        const resultBtn = $(".utility_nav-block--item.result")
        const videoBtn = $(".bot_display_nav-block--item.video")
        const debugtBtn = $(".bot_display_nav-block--item.debug")
        const helpBtn = $(".bot_display_nav-block--item.help")
        const animation = $(".utility_nav-block .animation")
        const animationChild = $(".utility_nav-block .animation .children")
        const bDAnimation = $(".bot_display_nav-block .animation")
        const bDAnimationChild = $(".bot_display_nav-block .animation .children")
        const botDisplayBlock = $$(".bot_display-video-item")

        const debugArrowRight = $(".bot_display-video--debug .arrow_right")
        const debugArrowLeft = $(".bot_display-video--debug .arrow_left")
        const debugImageList = $(".debug_img_list")
        const counter = $(".counter")
        const selectDebugNum = $(".selector")
        const loadingVideo = $(".loading_video")
        const loadingImage = $(".loading_image")
        const loadingNavImage = $(".loading_nav_image")
        const loadingNavVideo = $(".loading_nav_video")
        const loadingNavImageLD = $(".loading_nav_image .loader")
        const loadingNavVideoLD = $(".loading_nav_video .loader")
        const loadingNavImageCI = $(".loading_nav_image .check_icon")
        const loadingNavVideoCI = $(".loading_nav_video .check_icon")
        const loadingNavImageFI = $(".loading_nav_image .fail_icon")
        const loadingNavVideoFI = $(".loading_nav_video .fail_icon")
        const isEnableDebug = $("input#debug")
        const isEnableVideo = $("input#video")

        const rate_selected_pos = $(".debug_info-selected_pos")
        const rate_new_pos = $(".debug_info-new_pos")
        const rate_level = $(".debug_info-move_level")


        let bot_html
        const win_loose_block = $(".win_loose_block")
        let win_loose_items = [
            `
    <div class="winer">
    <div class="winer_avatar">T</div>
    <div class="winer_info">
        <div class="winer_title">VICTORY</div>
        <div class="winer_info_name">{winer_name}</div>
    </div>
    <!-- <div class="side blue"></div> -->
    `,
            `
    </div>
    <div class="loser">
        <div class="loser_avatar"><img src="../../../public/img/bot4.png" alt=""></div>
        <div class="loser_info">
            <div class="loser_title">DEFEATED</div>
            <div class="loser_info_name">{loser_name}</div>
        </div>
        <!-- <div class="side red"></div> -->
    </div>
    `
        ]

        // const CB_bot_item = $$(".CB_bot_item")
        let choosen_bot
        var request_data = {
            code: "",
            bot: "",
            username: user.username,
            your_bot_name: selected_bot?.bot_name || user.username
        }

        const CB_bot_items = $$(".CB_bot_item")

        CB_bot_items.forEach(item => {
            item.onclick = (e) => {
                if (item.classList.contains("CB_selected")) {
                    choosen_bot = ""
                    request_data.bot = ""
                    bot_html = ""
                    item.classList.remove("CB_selected")
                    runBtn.classList.remove("CB_active")
                    return
                }
                CB_bot_items.forEach(e => e.classList.remove("CB_selected"))
                choosen_bot = item.dataset.level
                item.classList.add("CB_selected")
                request_data.bot = choosen_bot
                bot_html = item
                runBtn.classList.add("CB_active")
            }
        })

        let debugImageItems
        let imageNum = 0
        let currentDisplayMode = "video"
        let currentUtiMode = "rule"

        let gameResult;
        let img_url = []
        let rate = []

        var audio = $(".bot_display-video--result");
        console.log(audio)
        audio.volume = 0.1;

        // var editor = ace.edit("CB_coding_module-coding_block");

        // editor.setOptions({
        //     mode: "ace/mode/python",
        //     selectionStyle: "text",
        //     theme: "ace/theme/dracula",
        //     autoScrollEditorIntoView: true,
        //     enableBasicAutocompletion: true,
        //     enableLiveAutocompletion: true,
        // });

        saveBtn.onclick = () => {
            console.log(username)
            if(!username) {
                set_is_require_login(true)
                return
            }
            saveBtn.dataset.saved = "true"
            fetch("http://192.168.1.249:5000/save_bot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    code: code.replaceAll('\r', ''),
                    username: user.username,
                    bot_name: user.username
                }),
            })
                .then(res => res.json())
                .then(data => {
                    saveBtn.style.backgroundColor = "#fff"
                    saveBtn.style.color = "#000"
                    const a = data
                    terminal.innerHTML += `${a}`
                })
                .catch(err => console.log(err))
        }

        runBtn.onclick = () => {
            if(!username) {
                set_is_require_login(true)
                return
            }
            if (!choosen_bot) return
            console.log(choosen_bot)
            rate = []
            run()
        }

        function run() {
            if (!isEnableDebug.checked && !isEnableVideo.checked) {
                return
            }
            request_data.code = code
            loader.style.display = "block"
            runBtn.style.display = "none"

            toggleMode("terminal")
            terminal.style.backgroundColor = "#252525"
            terminalBtn.style.color = "#fff"
            ruleBtn.style.color = "#ccc"
            resultBtn.style.color = "#ccc"
            changeAnimation(terminalBtn, `${((terminalBtn.clientWidth - 10) / animation.clientWidth * 100)}%`, terminalBtn.clientWidth + "px", "terminal", animationChild)
            terminal.innerHTML = `loading...`
            gameResult = null

            if (isEnableVideo.checked && !isEnableDebug.checked) {
                uploadCode(request_data)
                return
            }
            set_is_loading_video(true)

            debugImageList.style.display = "none"
            loadingImage.style.display = "block"
            loadingNavImageLD.style.display = "block"
            loadingNavImageCI.style.display = "none"
            loadingNavImageFI.style.display = "none"
            if (isEnableVideo.checked) {
                loadingVideo.style.display = "block"
                video.style.display = "none"
                loadingNavVideoLD.style.display = "block"
                loadingNavVideoCI.style.display = "none"
                loadingNavVideoFI.style.display = "none"
            }

            fetch("http://192.168.1.249:5000/debug_bot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    request_data: request_data,
                    debugNum: Number(selectDebugNum.value),
                }),
            })
                .then(res => res.json())
                .then(data => {
                    loadingImage.style.display = "none"
                    terminal.style.backgroundColor = "#000"
                    if (!isEnableVideo.checked && isEnableDebug.checked) {
                        loader.style.display = "none"
                        runBtn.style.display = "block"
                    }
                    if (data.code === 200) {
                        img_url = JSON.parse(data.img_url)
                        debugImageList.innerHTML = ""
                        img_url.forEach((url, index) => {
                            debugImageList.innerHTML += `
                            <li data-num="${index}" class="debug_img_item"><img src="${url}" alt=""></li>
                        `
                        })
                        data.rate.forEach((item, i) => {
                            rate.push({
                                type: item,
                                move: data.inp_oup[i],
                            })
                        })
                        debugImageItems = $$(".debug_img_item")
                        debugImageList.style.display = "block"
                        debugImageItems[0].classList.add("display_image")
                        imageNum = 0
                        counter.innerHTML = imageNum
                        loadingNavImageLD.style.display = "none"
                        loadingNavImageCI.style.display = "block"
                        loadingNavImageFI.style.display = "none"
                        debugArrowRight.style.opacity = "1"
                        const a = data.output.replaceAll('\n', '<br>').replaceAll('    ', '&emsp;')
                        terminal.innerHTML = `
                <br>
                [debug output] <br>
                <br>
            `
                        terminal.innerHTML += `${a}`
                        if (isEnableVideo.checked) uploadCode(request_data)
                    } else {
                        loader.style.display = "none"
                        runBtn.style.display = "block"
                        loadingNavImageFI.style.display = "block"
                        loadingNavVideoFI.style.display = "block"
                        loadingNavVideoLD.style.display = "none"
                        loadingVideo.style.display = "none"
                        loadingNavVideoFI.style.display = "block"
                        debugImageList.style.display = "block"
                        if (currentDisplayMode === "video") video.style.display = ""
                        const a = data.output.replaceAll('\n', '<br>').replaceAll('    ', '&emsp;')
                        terminal.innerHTML = `${a}`
                    }
                })
        }

        function uploadCode(request) {
            toggle_bot_result(bot_html, ".fight_result_loader")
            loadingVideo.style.display = "block"
            video.style.display = "none"
            loadingNavVideoLD.style.display = "block"
            loadingNavVideoCI.style.display = "none"
            fetch("http://192.168.1.249:5000/run_bot", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            })
                .then(res => res.json())
                .then(data => {
                    if (isEnableVideo.checked && !isEnableDebug.checked) terminal.innerHTML = ""
                    const a = data.output.replaceAll('\n', '<br>').replaceAll('    ', '&emsp;')
                    if (data.code === 200) {
                        gameResult = data
                        terminal.innerHTML += `
                <br>
                [video output] <br>
                <br>
            `
                        terminal.innerHTML += `${a}`
                    } else {
                        console.log(a)
                        terminal.innerHTML += `${a}`
                    }
                })
                .catch(err => {
                    terminal.innerHTML = `${err}`
                    loadingNavVideoFI.style.display = "block"
                })
                .finally(() => {
                    loader.style.display = "none"
                    runBtn.style.display = "block"
                    terminal.style.backgroundColor = "#000"
                    loadingNavVideoLD.style.display = "none"
                    loadingVideo.style.display = "none"
                    if (gameResult?.code === 200) {
                        loadingNavVideoCI.style.display = "block"
                        loadingNavVideoFI.style.display = "none"
                        set_src(gameResult.new_url)
                        video.load()
                        if (currentDisplayMode === "video") video.style.display = ""
                        changeAnimation(resultBtn, "0", resultBtn.clientWidth + "px", "result", animationChild)
                        toggleMode("result")
                    } else {
                        toggle_bot_result(bot_html, ".fight_result_lost")
                        loadingNavVideoFI.style.display = "block"
                    }
                })
        }

        function change_rate(i) {
            console.log(rate)
            if (i < 0) {
                rate_selected_pos.innerHTML = "(x1,y2)"
                rate_new_pos.innerHTML = "(x2,y2)"
                rate_level.innerHTML = "đánh giá"
                rate_level.classList.remove("excellent", "bad", "good")
                rate_level.classList.add("normal")
                console.log("I: ", i)
                return
            }

            rate_selected_pos.innerHTML = `(${rate[i].move.selected_pos})`
            rate_new_pos.innerHTML = `(${rate[i].move.new_pos})`

            rate_level.innerHTML = rate[i].type
            if (rate[i].type === "Tốt nhất") {
                rate_level.classList.remove("good", "bad", "normal")
                rate_level.classList.add("excellent")
            } else if (rate[i].type === "Tốt") {
                rate_level.classList.remove("excellent", "bad", "normal")
                rate_level.classList.add("good")
            } else if (rate[i].type === "Tệ") {
                rate_level.classList.remove("excellent", "good", "normal")
                rate_level.classList.add("bad")
            } else if (rate[i].type === "Bình thường") {
                rate_level.classList.remove("excellent", "good", "bad")
                rate_level.classList.add("normal")
            }

        }

        function toggle_bot_result(bot, type) {
            bot.querySelectorAll(".fight_result_item").forEach(item => {
                item.style.display = "none"
            })
            bot.querySelector(type).style.display = "flex"
            // fight_result_item.forEach(item => {
            //     item.style.display = "none"
            // })
        }

        const utility_nav_block = $(".utility_nav-block")

        function toggleMode(mode) {
            // currentMode = mode
            switch (mode) {
                case "terminal":
                    currentUtiMode = mode
                    uniBlock.forEach(ele => ele.style.display = "none")
                    terminal.style.display = "block"
                    break;
                case "rule":
                    currentUtiMode = mode
                    uniBlock.forEach(ele => ele.style.display = "none")
                    rule.style.display = "flex"
                    break;
                case "result":
                    currentUtiMode = mode
                    if (gameResult) {
                        uniBlock.forEach(ele => ele.style.display = "none")
                        console.log(gameResult)
                        const { max_move_win, status } = gameResult
                        if (status === "win") {
                            toggle_bot_result(bot_html, ".fight_result_win")
                            win_loose_block.innerHTML = `
                    ${win_loose_items[0].replace("{winer_name}", username)}
                    ${win_loose_items[1].replace("{loser_name}", choosen_bot)}
                    `
                        } else if (status === "lost") {
                            toggle_bot_result(bot_html, ".fight_result_lost")
                            win_loose_block.innerHTML = `
                    ${win_loose_items[1].replace("{loser_name}", choosen_bot).replace("DEFEATED", "VICTORY")}
                    ${win_loose_items[0].replace("{winer_name}", username).replace("VICTORY", "DEFEATED")}
                    `
                        } else if (status === "draw") {
                            toggle_bot_result(bot_html, ".fight_result_draw")
                            win_loose_block.innerHTML = `
                    ${win_loose_items[0].replace("{winer_name}", username).replace("VICTORY", "DRAW")}
                    ${win_loose_items[1].replace("{loser_name}", choosen_bot).replace("DEFEATED", "DRAW")}
                    `
                        }
                        $(".loser_avatar img").src = bots_list[(choosen_bot === selected_bot.bot_name ? "your_bot" : choosen_bot)]
                        const moveCount = $(".info_move-count")
                        moveCount.innerHTML = `moves: ${max_move_win}`
                        result.style.display = "flex"
                    }
                    break;
                case "video":
                    currentDisplayMode = mode
                    botDisplayBlock.forEach(ele => ele.style.display = "none")
                    if (loadingVideo.style.display === "none" || loadingVideo.style.display === "") video.style.display = ""
                    debug.style.display = "none"
                    break;
                case "debug":
                    currentDisplayMode = mode
                    botDisplayBlock.forEach(ele => ele.style.display = "none")
                    debug.style.display = "flex"
                    break;
                case "help":
                    currentDisplayMode = mode
                    botDisplayBlock.forEach(ele => ele.style.display = "none")
                    help.style.display = "block"
                    break;
                default:
                    break;
            }

        }

        function changeAnimation(e, right, width, mode, animationChild) {
            if (mode === "terminal" || mode === "rule" || mode === "result") {
                uniNavItem.forEach(ele => ele.style.color = "#ccc")
            } else {
                $$(".bot_display_nav-block--item").forEach(ele => ele.style.color = "#ccc")
            }
            e.style.color = "#fff"
            animationChild.style.right = right;
            animationChild.style.width = width;
            toggleMode(mode)
        }

        ruleBtn.onclick = (e) => {
            changeAnimation(ruleBtn, `${100 - (e.target.clientWidth / animation.clientWidth * 100)}%`, e.target.clientWidth + "px", "rule", animationChild)
        }

        terminalBtn.onclick = (e) => {
            changeAnimation(terminalBtn, `${((e.target.clientWidth - 10) / animation.clientWidth * 100)}%`, e.target.clientWidth + "px", "terminal", animationChild)
        }

        resultBtn.onclick = (e) => {
            if (gameResult) changeAnimation(result, "0", e.target.clientWidth + "px", "result", animationChild)
        }

        videoBtn.onclick = (e) => {
            changeAnimation(videoBtn, `${100 - (e.target.clientWidth / bDAnimation.clientWidth * 100)}%`, e.target.clientWidth + "px", "video", bDAnimationChild)
        }

        debugtBtn.onclick = (e) => {
            changeAnimation(debugtBtn, animation.clientWidth - (videoBtn.clientWidth * 3) - 3 + "px", e.target.clientWidth + "px", "debug", bDAnimationChild)
        }

        helpBtn.onclick = (e) => {
            changeAnimation(helpBtn, "0", e.target.clientWidth + "px", "help", bDAnimationChild)
        }

        debugArrowRight.onclick = (e) => {
            if (imageNum + 2 <= debugImageItems.length) {
                debugImageItems[imageNum].classList.remove("display_image")
                imageNum++
                change_rate(imageNum - 1)
                counter.innerHTML = imageNum
                debugImageItems[imageNum].classList.add("display_image")
            } else {
                debugImageItems[imageNum].classList.remove("display_image")
                imageNum = 0
                change_rate(-1)
                counter.innerHTML = imageNum
                debugImageItems[imageNum].classList.add("display_image")
            }
        }

        debugArrowLeft.onclick = (e) => {
            if (imageNum - 1 >= 0) {
                debugImageItems[imageNum].classList.remove("display_image")
                imageNum--
                change_rate(imageNum - 1)
                counter.innerHTML = imageNum
                debugImageItems[imageNum].classList.add("display_image")
            } else {
                debugImageItems[imageNum].classList.remove("display_image")
                imageNum = debugImageItems.length - 1
                change_rate(debugImageItems.length - 2)
                counter.innerHTML = imageNum
                debugImageItems[imageNum].classList.add("display_image")
            }
        }

        const box = $(".guide")

        const cover = $(".cover")
        const guideBox_nav = $(".guide_box--nav")
        const guideBox_navLeft = $(".guide_box--nav .left")
        const guideBox_navRight = $(".guide_box--nav .right")
        const acceptBtn = $(".accept-btn")
        const rejectBtn = $(".reject-btn")
        const instruction = $(".instruction")

        let i = -1;
        let pre_i = i;

        function showGuideBox(i) {
            const guideBoxes = $$(".guide_box")
            guideBoxes[i].style.display = "block"
            if (pre_i != -1 && pre_i != i) guideBoxes[pre_i].style.display = "none"
            if (pre_i === i && i > 0) {
                cover.style.display = "none"
                guideBoxes[i].style.display = "none"
                guideBox_nav.style.display = "none"
            }
            pre_i = i
        }

        function isShowInstruction() {
            cover.style.display = "block"
            guideBox_nav.style.display = "flex"
            instruction.style.display = "none"
        }

        // acceptBtn.onclick = isShowInstruction
        // rejectBtn.onclick = () => instruction.style.display = "none";

        guideBox_navLeft.onclick = () => showGuideBox(i > 0 ? --i : i)
        guideBox_navRight.onclick = () => showGuideBox(i + 1 < $$(".guide_box").length ? ++i : i)
    }, [code])

    function select_bot(e, bot) {
        set_selected_bot(bot)
        set_code(bot.code)
    }

    return (
        <div className="h-screen">
            { is_require_login && <Login_require set_is_require_login={set_is_require_login}/>}
            { is_open_add_bot &&  <Add_bot set_new_bot={set_new_bot} set_is_open_add_bot={set_is_open_add_bot} set_code={set_code} set_selected_bot={set_selected_bot}/>}
            { is_open_remove_bot && <Remove_bot set_selected_bot={set_selected_bot} set_new_bot={set_new_bot} selected_bot={selected_bot} set_is_open_remove_bot={set_is_open_remove_bot}/>}
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
            <div className="CB_container md:max-w-full h-screen">
                <div className="CB_container_element bot_display">
                    <div className="bot_display_nav">
                        <div className="bot_display_nav-block">
                            <div className="bot_display_nav-block--item video">
                                VIDEO
                                <div className="loading_nav_video">
                                    <div className="loader" />
                                    <i className="fa-solid fa-circle-check check_icon" />
                                    <i className="fa-solid fa-circle-xmark fail_icon" />
                                </div>
                            </div>
                            <div className="bot_display_nav-block--item debug">
                                DEBUG
                                <div className="loading_nav_image">
                                    <div className="loader" />
                                    <i className="fa-solid fa-circle-check check_icon" />
                                    <i className="fa-solid fa-circle-xmark fail_icon" />
                                </div>
                            </div>
                            <div className="bot_display_nav-block--item help">HELP</div>
                            <div className="animation">
                                <div className="children" />
                            </div>
                        </div>
                    </div>
                    <div className="bot_display-video--background">
                        <video
                            style={{ display: "auto" }}
                            className="bot_display-video-item bot_display-video--result inline-block"
                            controls
                            src={src}
                        >
                            Your browser does not support the video tag.
                        </video>
                        <div className="loading_video">
                            <div className="loader" />
                        </div>
                        <div
                            style={{ display: "none" }}
                            className="bot_display-video-item bot_display-video--debug"
                        >
                            <div className="loading_image">
                                <div className="loader" />
                            </div>
                            <div className="debug_nav">
                                <i className="fa-solid fa-angle-up arrow_left" />
                                <i className="fa-solid fa-angle-down arrow_right" />
                            </div>
                            {/* <i className="fa-solid fa-angle-left arrow_left"></i> */}
                            <div className="debug_img_main">
                                <ul className="p-0 debug_img_list m-0">
                                    <li className="debug_img_item default">
                                        <img src={chessboard_debug} alt="" />
                                    </li>
                                </ul>
                                <div className="counter">0</div>
                            </div>
                            {/* <i className="fa-solid fa-angle-right arrow_right"></i> */}
                            <div className="debug_info">
                                <div className="debug_info-state">
                                    <div className="debug_info-selected_pos">(x1,y1)</div>
                                    <div className="debug_info-arrow">
                                        <i className="fa-solid fa-arrow-down-long" />
                                    </div>
                                    <div className="debug_info-new_pos">(x2,y2)</div>
                                </div>
                                <div className="debug_info-move_level normal">đánh giá</div>
                            </div>
                        </div>
                        <div
                            style={{ display: "none" }}
                            className="bot_display-video-item bot_display-video--help"
                        >
                            <div className="help_title">Kiến thức cần thiết</div>
                            <ul className="p-0 help_list help_type">
                                <li className="help_item help_type">
                                    <a href="https://www.w3schools.com/python/python_lists.asp">
                                        if else
                                    </a>
                                </li>
                                <li className="help_item help_type">
                                    <a href="https://www.w3schools.com/python/python_lists.asp">
                                        dictionary
                                    </a>
                                </li>
                                <li className="help_item help_type">
                                    <a href="https://www.w3schools.com/python/python_lists.asp">
                                        function
                                    </a>
                                </li>
                                <li className="help_item help_type">
                                    <a href="https://www.w3schools.com/python/python_lists.asp">
                                        object
                                    </a>
                                </li>
                                <li className="help_item help_type">
                                    <a href="https://www.w3schools.com/python/python_ml_getting_started.asp">
                                        Loop
                                    </a>
                                </li>
                                <li className="help_item help_type">
                                    <a href="https://www.24h.com.vn/bong-da/nhan-dinh-bong-da-argentina-ecuador-niem-cam-hung-messi-tiep-da-thang-hoa-copa-america-c48a1582788.html">
                                        List
                                    </a>
                                </li>
                            </ul>
                            <div className="help_title">Các bài blog</div>
                            <ul className="p-0 help_list">
                                <li className="help_item help_blog">
                                    <a onClick={() => history("/post/" + "1719022233537")}>
                                        Kiểm tra nước đi hợp lệ
                                    </a>
                                </li>
                                <li className="help_item help_blog">
                                    <a onClick={() => history("/post/" + "1719228535494")}>
                                        Kiểm tra gánh chẹt
                                    </a>
                                </li>
                                <li className="help_item help_blog">
                                    <a onClick={() => history("/post/" + "1720181857262")}>
                                        Kiểm tra vây
                                    </a>
                                </li>
                            </ul>
                            <div className="help_title">Mô phỏng thuật toán</div>
                            <ul className="p-0 help_list">
                                <li className="help_item help_blog">
                                    <a href="{{url_for('visualize', id='SctXzAxW6TtcMSPwPm1N')}}">
                                        minimax
                                    </a>
                                </li>
                                <li className="help_item help_blog">
                                    <a href="{{url_for('visualize', id='OYRJNv4Jqez9dKZjLW27')}}">
                                        Kiểm tra nước đi
                                    </a>
                                </li>
                                <li className="help_item help_blog">
                                    <a href="{{url_for('visualize', id='aLzIcTxFR2EfRXVFov07')}}">
                                        Kiểm tra gánh chẹt
                                    </a>
                                </li>
                                <li className="help_item help_blog">
                                    <a href="{{url_for('visualize', id='1OyReHWrH3zgV5IfcZPk')}}">
                                        Kiểm tra vây
                                    </a>
                                </li>
                            </ul>
                            <ul className="p-0 help_list"></ul>
                        </div>
                    </div>
                    <div className="utility">
                        <div className="utility_nav">
                            <div className="utility_nav-block">
                                <div className="utility_nav-block--item rule">RULE</div>
                                <div className="utility_nav-block--item terminal">TERMINAL</div>
                                <div className="utility_nav-block--item result">RESULT</div>
                                <div className="animation">
                                    <div className="children" />
                                </div>
                            </div>
                        </div>
                        <div className="utility_block">
                            <div className="utility_block-element rule">
                                <div className="input">
                                    <div className="text-2xl text-gray-300 mb-4 mt-1">input</div>
                                    <div className="p-0">
                                        Player.your_pos: vị trí tất cả quân cờ của bản thân (x, y){" "}
                                        <br />
                                        Player.opp_pos: vị trí tất cả quân cờ của đối thủ (x, y) <br />
                                        Player.your_side: màu cờ của bản thân (-1:🔴 / 1:🔵) <br />
                                        Player.board: bàn cờ (-1:🔴 / 1:🔵 / 0:∅) <br />
                                        <br />
                                        -điều kiện:
                                        <br />
                                        0 ≤ x, y ≤ 4 <br />
                                        Player.your_side in (-1, 1) <br />
                                        {"{"}j for i in Player.board for j in i{"}"} == {"{"}0, 1, -1
                                        {"}"}
                                    </div>
                                </div>
                                <div className="output">
                                    <div className="text-2xl text-gray-300 mb-4 mt-1">output</div>
                                    <div className="p-0">
                                        selected_pos: vị trí của quân cờ được chọn new_pos: vị trí sau
                                        khi di chuyển của quân cờ đó
                                    </div>
                                </div>
                            </div>
                            <div className="utility_block-element terminal">&gt;&gt;&gt; </div>
                            <div className="utility_block-element result">
                                <div className="mode_solo">
                                    {/* <div className="status">Winner</div>
                      <div className="info">
                          <div className="info_move-count">moves: 100</div>
                          <div className="player">you: <hr> <div style="width: 40px; height: 40px; border-radius: 50%; background-color: blue;"></div></div>
                          <div className="enemy">bot: <hr> <div style="width: 40px; height: 40px; border-radius: 50%; background-color: red;"></div></div>
                      </div> */}
                                    <div className="win_loose_block">
                                        <div className="winer">
                                            <div className="winer_avatar">T</div>
                                            <div className="winer_info">
                                                <div className="winer_title">VICTORY</div>
                                                <div className="winer_info_name">tlv23</div>
                                            </div>
                                            {/* <div className="side blue"></div> */}
                                        </div>
                                        <div className="loser">
                                            <div className="loser_avatar">
                                                <img src="../../../public/img/level4.png" alt="" />
                                            </div>
                                            <div className="loser_info">
                                                <div className="loser_title">DEFEATED</div>
                                                <div className="loser_info_name">level1</div>
                                            </div>
                                            {/* <div className="side red"></div> */}
                                        </div>
                                    </div>
                                    <div className="info_move-count">move 100</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="CB_container_element CB_coding_module">
                    <div className="CB_coding_module-nav">
                        <a onClick={() => history("/menu")} className="CB_coding_module-nav--backBtn">
                            <i className="fa-solid fa-arrow-right-from-bracket" />
                        </a>
                        <div className="debug_mode_selector">
                            <div>Debug turn</div>
                            <select className="selector">
                                {/* <option value="default" className="option">default</option> */}
                                <option value={2} className="option">
                                    2
                                </option>
                                <option value={4} className="option">
                                    4
                                </option>
                                <option value={6} className="option">
                                    6
                                </option>
                                <option value={8} className="option">
                                    8
                                </option>
                                <option value={10} className="option">
                                    10
                                </option>
                            </select>
                        </div>
                        <div className="CB_coding_module-nav--saveBtn CB_active" data-saved="false">
                            save
                        </div>
                        <div
                            className="CB_coding_module-nav--CB_runBtn CB_loader"
                            style={{ display: "none", animation: "none" }}
                        >
                            <div className="CB_coding_module-nav--loading" />
                        </div>
                        <div className="CB_coding_module-nav--CB_runBtn cb_btn">run</div>
                        <div className="CB_coding_module-nav--setting">
                            <label htmlFor="check">
                                <i className="fa-solid fa-gear setting_icon" />
                            </label>
                            <input type="checkbox" name="check" id="check" hidden />
                            <ul className="p-0 setting_list">
                                <label htmlFor="debug" className="setting_item">
                                    Enable debug
                                    <input
                                        type="checkbox"
                                        name="debug"
                                        id="debug"
                                        checked={is_DB_check}
                                        onChange={() => set_is_DB_check(!is_DB_check)}
                                    />
                                </label>
                                <label htmlFor="video" className="setting_item">
                                    Enable video
                                    <input
                                        type="checkbox"
                                        name="video"
                                        id="video"
                                        checked={is_VD_check}
                                        onChange={() => set_is_VD_check(!is_VD_check)}
                                    />
                                </label>
                            </ul>
                        </div>
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
                        <div className="bg-[#282A36] p-0 m-0 flex px-2 py-[2px]">
                            <span className="mr-1">bot:</span>
                            <select onChange={(e) => select_bot(e.target.value, bots.find(bot => bot.bot_name === e.target.value))} value={selected_bot ? selected_bot.bot_name: "Null"} className="your_bot_list bg-[#1d1e28]">
                                {bots[0] && bots.map((bot, i) => 
                                    <option key={i} value={bot.bot_name} data-code={bot.code} className={`your_bot_item ${i === 0 ? "bg-gray-700" : "bg-gray-800"} px-2 rounded-sm relative ml-1 select-none hover:bg-gray-700 cursor-pointer`}>
                                        {bot.bot_name}
                                    </option>
                                )}
                            </select>
                            <div onClick={() => set_is_open_add_bot(!is_open_add_bot)} className="add_bot bg-gray-700 ml-2 text-sm px-1 rounded-sm cursor-pointer hover:brightness-90">
                                Add bot
                            </div>
                            <div onClick={() => set_is_open_remove_bot(!is_open_remove_bot)} className="remove_bot bg-gray-700 ml-2 text-sm px-1 rounded-sm cursor-pointer hover:brightness-90">
                                remove bot
                            </div>
                        </div>
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
                            height='76.5%'
                            className="CB_coding_module-coding_block"
                        />
                        <div
                            className="guide_box--nav"
                            style={{ zIndex: 2000, display: "none" }}
                        >
                            <div className="left">⮜</div>
                            <div className="right">⮞</div>
                        </div>
                        {/* <div className="guide_box">
              <div className="guide_box--content">hellohellohellohellellohellohellohelloellohellohellohellohellohellohelloello</div>
              <div className="guide_box--arrow"></div>
          </div> */}
                        <div className="CB_coding_module-bot_list">
                            <div className="choose_bot_module">
                                <div className="choose_bot_module-title">BOT</div>
                                <div className="CB_bot_list">
                                    <div data-level="level1" className="CB_bot_item level1">
                                        <img className="max-w-12" src={level1} alt="" />
                                        <div className="CB_bot_item_title level1">level 1</div>
                                        <div className="fight_result">
                                            <div className="fight_result_item fight_result_draw">
                                                <i className="fa-solid fa-handshake-simple" />
                                            </div>
                                            <div className="fight_result_item fight_result_loader">
                                                <div className="fight_result_loading" />
                                            </div>
                                            <div className="fight_result_item fight_result_win" />
                                            <div className="fight_result_item fight_result_lost">
                                                <i className="fa-solid fa-skull" />
                                            </div>
                                        </div>
                                        <div className="CB_bot_item_info">
                                            <div className="introduce">
                                                Robot của vị tướng lĩnh này sẽ luôn luôn nhả quân cho bạn.
                                            </div>
                                            <div className="hint">
                                                <p style={{ color: "red" }}>
                                                    <i className="fa-solid fa-angles-down" />
                                                    lời khuyên
                                                    <i className="fa-solid fa-angles-down" />
                                                </p>{" "}
                                                Có vẻ robot của bạn cần học cách gánh/ chẹt
                                            </div>
                                        </div>
                                    </div>
                                    <div data-level="level2" className="CB_bot_item level2">
                                        <img className="max-w-12" src={level2} alt="" />
                                        <div className="CB_bot_item_title level2">level 2</div>
                                        <div className="fight_result">
                                            <div className="fight_result_item fight_result_draw">
                                                <i className="fa-solid fa-handshake-simple" />
                                            </div>
                                            <div className="fight_result_item fight_result_loader">
                                                <div className="fight_result_loading" />
                                            </div>
                                            <div className="fight_result_item fight_result_win" />
                                            <div className="fight_result_item fight_result_lost">
                                                <i className="fa-solid fa-skull" />
                                            </div>
                                        </div>
                                        <div className="CB_bot_item_info">
                                            <div className="introduce">
                                                Robot của vị tướng lĩnh này sẽ luôn tiến quân vào những vị
                                                trí chiến lược.
                                            </div>
                                            <div className="hint">
                                                <p style={{ color: "red" }}>
                                                    <i className="fa-solid fa-angles-down" />
                                                    lời khuyên
                                                    <i className="fa-solid fa-angles-down" />
                                                </p>
                                                Robot của bạn cần một chiến thuật vây bắt hợp lý hơn.
                                            </div>
                                        </div>
                                    </div>
                                    <div data-level="level3" className="CB_bot_item level3">
                                        <img className="max-w-12" src={level3} alt="" />
                                        <div className="CB_bot_item_title level3">level 3</div>
                                        <div className="fight_result">
                                            <div className="fight_result_item fight_result_draw">
                                                <i className="fa-solid fa-handshake-simple" />
                                            </div>
                                            <div className="fight_result_item fight_result_loader">
                                                <div className="fight_result_loading" />
                                            </div>
                                            <div className="fight_result_item fight_result_win" />
                                            <div className="fight_result_item fight_result_lost">
                                                <i className="fa-solid fa-skull" />
                                            </div>
                                        </div>
                                        <div className="CB_bot_item_info">
                                            <div className="introduce">
                                                Robot của vị tướng lĩnh này luôn dồn quân tại đáy và sẽ tiêu
                                                diệt những quân cờ lại gần.
                                            </div>
                                            <div className="hint">
                                                <p style={{ color: "red" }}>
                                                    <i className="fa-solid fa-angles-down" />
                                                    lời khuyên
                                                    <i className="fa-solid fa-angles-down" />
                                                </p>
                                                Đừng quên việc phòng thủ khi vây quân.
                                            </div>
                                        </div>
                                    </div>
                                    <div data-level="level3" className="CB_bot_item level3">
                                        <img className="max-w-12" src={level4} alt="" />
                                        <div className="CB_bot_item_title level3">level 4</div>
                                        <div className="fight_result">
                                            <div className="fight_result_item fight_result_draw">
                                                <i className="fa-solid fa-handshake-simple" />
                                            </div>
                                            <div className="fight_result_item fight_result_loader">
                                                <div className="fight_result_loading" />
                                            </div>
                                            <div className="fight_result_item fight_result_win" />
                                            <div className="fight_result_item fight_result_lost">
                                                <i className="fa-solid fa-skull" />
                                            </div>
                                        </div>
                                        <div className="CB_bot_item_info">
                                            <div className="introduce">
                                                Robot của người lãnh đạo này sẽ ăn quân ngay khi có cơ hội.
                                            </div>
                                            <div className="hint">
                                                <p style={{ color: "red" }}>
                                                    <i className="fa-solid fa-angles-down" />
                                                    lời khuyên
                                                    <i className="fa-solid fa-angles-down" />
                                                </p>
                                                Robot của bạn cần một thế cờ có tính chiến thuật hơn.
                                            </div>
                                        </div>
                                    </div>
                                    <div data-level="Master" className="CB_bot_item Master">
                                        <img className="max-w-12" src={Master} alt="" />
                                        <div className="CB_bot_item_title Master">MASTER</div>
                                        <div className="fight_result">
                                            <div className="fight_result_item fight_result_draw">
                                                <i className="fa-solid fa-handshake-simple" />
                                            </div>
                                            <div className="fight_result_item fight_result_loader">
                                                <div className="fight_result_loading" />
                                            </div>
                                            <div className="fight_result_item fight_result_win" />
                                            <div className="fight_result_item fight_result_lost">
                                                <i className="fa-solid fa-skull" />
                                            </div>
                                        </div>
                                        <div className="CB_bot_item_info" style={{ right: "-60%" }}>
                                            <div className="introduce">
                                                Robot của người này là bất bại.
                                            </div>
                                            <div className="hint">
                                                <p style={{ color: "red" }}>
                                                    <i className="fa-solid fa-angles-down" />
                                                    lời khuyên
                                                    <i className="fa-solid fa-angles-down" />
                                                </p>
                                                Cố lên 😏.
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        data-level={selected_bot?.bot_name || user.username}
                                        className={`CB_bot_item ${selected_bot?.bot_name || user.username}`}
                                    >
                                        <img className="max-w-12" src={your_bot} alt="" />
                                        <div className="CB_bot_item_title Master">
                                            {selected_bot?.bot_name || user.username}
                                        </div>
                                        <div className="fight_result">
                                            <div className="fight_result_item fight_result_draw">
                                                <i className="fa-solid fa-handshake-simple" />
                                            </div>
                                            <div className="fight_result_item fight_result_loader">
                                                <div className="fight_result_loading" />
                                            </div>
                                            <div className="fight_result_item fight_result_win" />
                                            <div className="fight_result_item fight_result_lost">
                                                <i className="fa-solid fa-skull" />
                                            </div>
                                        </div>
                                        <div className="CB_bot_item_info" style={{ right: "-60%" }}>
                                            <div className="introduce">
                                                nếu bạn thua chính mình thì do bạn mạnh hay yếu nhỉ?
                                            </div>
                                            {/* <div className="hint"><p style="color: red;"><i className="fa-solid fa-angles-down"></i>lời khuyên<i className="fa-solid fa-angles-down"></i></p>Cố lên 😏.</div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className="choose_mode_module">
                  <div className="choose_mode_module-title">MODE</div>
                  <div className="mode_list">
                      <div data-mode="solo" className="mode_item">Solo</div>
                      <div data-mode="tournament" className="mode_item">Tournament</div>
                  </div>
              </div> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="username" hidden="">
                {"{"}
                {"{"}user.username{"}"}
                {"}"}
            </div> */}
        </div>

    )
}
