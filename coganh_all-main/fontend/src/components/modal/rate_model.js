
import brilliant_icon from "../../static/img/brilliant_icon.png"
import bad_icon from "../../static/img/bad_icon.png"
import good_icon from "../../static/img/good_icon.png"
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

export default function createRateModel(rate_dom, data) {
    let doom_main = $(rate_dom)
    let doom_main_$ = doom_main.querySelector.bind(doom_main)
    let doom_main_$$ = doom_main.querySelectorAll.bind(doom_main)
    doom_main_$(".RM_ske_loading").style.display = "none"
    doom_main_$(".RM_loader").style.display = "none"
    return ({
        doom_img_loader: doom_main_$(".RM_img_list"),
        doom_img_item: null,
        arrow_left: doom_main_$(".RM_arrow_left"),
        arrow_right: doom_main_$(".RM_arrow_right"),
        doom_rate_item: null,
        doom_img_counter: doom_main_$(".RM_counter"),
        doom_player_you: doom_main_$(".RM_player.RM_you .RM_content"),
        doom_player_enemy: doom_main_$(".RM_player.RM_enemy .RM_content"),
        cur_img: 0,
        move_count: 0,

        get_rate_list_detail() {
            return doom_main_$(".RM_rate_list .RM_detail")
        },

        get_rate_item: function(index) {
            const rate_item = doom_main_$$(".RM_rate_item")
            if(index) {
                return rate_item[index]
            }
            return rate_item
        },

        render(side) {
            const rate_list_detail = this.get_rate_list_detail()
            let type_count = [
                {
                    "Tốt nhất": 0,
                    "Tốt": 0,
                    "Bình thường": 0,
                    "Tệ": 0,
                },
                {
                    "Tốt nhất": 0,
                    "Tốt": 0,
                    "Bình thường": 0,
                    "Tệ": 0,
                }
            ]

            this.move_count = data.length

            doom_main_$(".RM_move_count").innerHTML = `MOVE: ${this.move_count}`
            if(side === 1) {
                this.doom_player_you.classList.add("RM_blue")
                this.doom_player_enemy.classList.add("RM_red")
            } else {
                this.doom_player_enemy.classList.add("RM_blue")
                this.doom_player_you.classList.add("RM_red")
            }

            data.forEach((rate,i) => {
                let res = {
                    type: "",
                    icon: ""
                }

                type_count[i % 2 === 0 ? 0 : 1][rate.type]++
                if (rate.type === "Tốt nhất") {
                    res.type = rate.type
                    res.icon = `<img class="RM_rate_item-you_img" src=${brilliant_icon} alt="">`
                } else if(rate.type === "Tệ") {
                    res.icon = `<img class="RM_rate_item-you_img" src=${bad_icon} alt="">`
                    res.type = rate.type
                } else if(rate.type === "Tốt") {
                    res.icon = `<img class="RM_rate_item-you_img" src=${good_icon} alt="">`
                    res.type = rate.type
                }

                if(side === 1) {
                    rate_list_detail.innerHTML += `
                        <li class="RM_rate_item">
                            <div class="RM_rate_item-you">${i % 2 === 0 ? res.icon + res.type : ""}</div>
                            <div class="RM_rate_item-move">${rate.move.sellected_pos + " => " + rate.move.new_pos}</div>
                            <div class="RM_rate_item-opp">${i % 2 !== 0 ? res.type + res.icon : ""}</div>
                        </li>
                    `
                } else {
                    rate_list_detail.innerHTML += `
                        <li class="RM_rate_item">
                            <div class="RM_rate_item-you">${i % 2 !== 0 ? res.icon + res.type : ""}</div>
                            <div class="RM_rate_item-move">${rate.move.sellected_pos + " => " + rate.move.new_pos}</div>
                            <div class="RM_rate_item-opp">${i % 2 === 0 ? res.type + res.icon : ""}</div>
                        </li>
                    `
                }

                this.doom_img_loader.innerHTML += `
                    <li style="display: none;" class="RM_img_item RM_default"><img src=${rate.img_url} alt=""></li>
                `
            });

            const overview = doom_main_$(".RM_overview")

            if(side === -1) type_count = type_count.reverse()

            for(let i = 0; i < 4; i++) {
                if(i === 0) {
                    overview.innerHTML += `
                        <li class="RM_excellent_count">
                            <div class="RM_excellent_count-you">${type_count[0]["Tốt nhất"]}</div>
                            <div class="RM_excellent_count-title RM_excellent">TỐT NHẤT</div>
                            <div class="RM_excellent_count-opp">${type_count[1]["Tốt nhất"]}</div>
                        </li>
                    `
                }
                if(i === 1) {
                    overview.innerHTML += `
                        <li class="RM_excellent_count">
                            <div class="RM_excellent_count-you">${type_count[0]["Tốt"]}</div>
                            <div class="RM_excellent_count-title RM_good">TỐT</div>
                            <div class="RM_excellent_count-opp">${type_count[1]["Tốt"]}</div>
                        </li>
                    `
                }
                if(i === 2) {
                    overview.innerHTML += `
                        <li class="RM_excellent_count">
                            <div class="RM_excellent_count-you">${type_count[0]["Bình thường"]}</div>
                            <div class="RM_excellent_count-title RM_normal">BÌNH THƯỜNG</div>
                            <div class="RM_excellent_count-opp">${type_count[1]["Bình thường"]}</div>
                        </li>
                    `
                }
                if(i === 3) {
                    overview.innerHTML += `
                        <li class="RM_excellent_count">
                            <div class="RM_excellent_count-you">${type_count[0]["Tệ"]}</div>
                            <div class="RM_excellent_count-title RM_bad">TỆ</div>
                            <div class="RM_excellent_count-opp">${type_count[1]["Tệ"]}</div>
                        </li>
                    `
                }
            }
            this.doom_img_item = doom_main_$$(".RM_img_item")
            this.doom_rate_item = doom_main_$$(".RM_rate_item")
        },

        toggle_rate(preI, newI) {
            this.doom_rate_item[preI-1]?.classList.toggle("RM_sellected")
            this.doom_rate_item[newI-1]?.classList.toggle("RM_sellected")
            this.scrollToView(this.doom_rate_item[newI-1])
        },

        tonggle_img(preI, newI) {
            if(newI < 0) {
                newI = this.doom_img_item.length - 1
                this.cur_img = newI + 1
                this.tonggle_img(preI, newI)
                return
            } else if(newI > this.doom_img_item.length - 1) {
                newI = 0
                this.cur_img = newI - 1
                this.tonggle_img(preI, newI)
                return
            }
            if(newI >= 0 && newI <= this.doom_img_item.length - 1) {
                // console.log(this.doom_rate_item)
                this.doom_img_counter.innerHTML = newI
                this.doom_img_item[preI].style.display = "none"
                this.doom_img_item[newI].style.display = "block"
                this.toggle_rate(preI, newI)
            }
        },

        scrollToView(element) {
            if(!element) return
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: "smooth",
                    block: "nearest",
                })
            }, 200)
        },

        handle_event() {
            this.arrow_left.onclick = () => {
                this.tonggle_img(this.cur_img, this.cur_img - 1)
                this.cur_img--
            }
            this.arrow_right.onclick = () => {
                this.tonggle_img(this.cur_img, this.cur_img + 1)
                this.cur_img++
                
            }
            this.doom_rate_item.forEach((item, i) => {
                item.onclick = () => {
                    this.tonggle_img(this.cur_img, i+1)
                    this.cur_img = i + 1
                }
            })
            document.onkeyup = (e) => {
                if(e.code === "ArrowUp" || e.code === "KeyW") {
                    this.tonggle_img(this.cur_img, this.cur_img - 1)
                    this.cur_img--
                } else if(e.code === "ArrowDown" || e.code === "KeyS") {
                    this.tonggle_img(this.cur_img, this.cur_img + 1)
                    this.cur_img++
                }
            }
        },

        start(side=1) {
            this.render(side)
            this.handle_event()
        }
    })
    
}