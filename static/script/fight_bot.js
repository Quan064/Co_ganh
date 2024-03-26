const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playerList = $(".side_bar-player-list")
const newPoint = $(".info_elo-fluc--new")
const arrow = $(".info_elo-fluc--arrow")
const fightBtn = $(".fight_btn")
let selectedPlayer
let dem = 0
let newValue = 0

// fetch("get_users")
// .then(res => res.json())
// .then(data => {
//     data.forEach(user => {
//         playerList.innerHTML += `
//             <li class="player" data-name=${user.username} data-elo=${user.elo}>
//                 <div class="player-avatar"><p>${user.username[0].toUpperCase()}</p></div>
//                 <div class="player-info">
//                 <div class="player-info--name">${user.username}</div>
//                 <div class="player-info--elo">${user.elo}</div>
//                 </div>
//             </li>
//         `
//     })
// })

const players = $$(".player")
const enemy = $(".enemy")
const enemyAva = $(".enemy_ava")
const enemyName = $(".enemy-name")
const enemyElo = $(".enemy-elo")
// <img src="https://static.vecteezy.com/system/resources/thumbnails/003/682/252/small/pink-blue-v-alphabet-letter-logo-icon-design-with-swoosh-for-business-and-company-vector.jpg" class="player-avatar"></img>
players.forEach((player) => {
    player.onclick = () => {
        players.forEach(p => p.style.backgroundColor = "")
        player.style.backgroundColor = "#232E3B"
        selectedPlayer = {
            name: player.dataset.name,
            elo: player.dataset.elo,
        }
        enemyAva.innerHTML = selectedPlayer.name[0].toUpperCase()
        enemyName.innerHTML = selectedPlayer.name
        enemyElo.innerHTML = selectedPlayer.elo
    }
})

const video = $(".fight_screen-video")
const loading = $(".fight_screen-loading")
const standBy = $(".fight_screen-standby")
const info = $(".info")
const info_status = $(".info_status")
const info_elo_fluc_new = $(".info_elo-fluc--new")

const user = $(".user")
const userElo = $(".user-elo")

fightBtn.onclick = () => {
    video.style.display = "none";
    standBy.style.display = "none";
    loading.style.display = "block";
    user.style.backgroundColor = "#121212"
    enemy.style.backgroundColor = "#121212"
    video.innerHTML = `<source type="video/mp4">
    // Your browser does not support the video tag.`
    fetch("/fighting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlayer),
    })
    .then(res => res.json())
    .then(data => {
        const stt = {
            status: data.status,
            max_move_win: data.max_move_win,
        }
        
        info_status.innerHTML = "You " + stt.status
        if(stt.status === "win") {
            info_status.style.backgroundColor = "#007BFF"
            user.style.backgroundColor = "#007BFF"
            enemy.style.backgroundColor = "red"
            info_elo_fluc_new.style.color = "#007BFF"
            newValue = parseInt(userElo.innerHTML) + Math.abs(parseInt(userElo.innerHTML) - parseInt(enemyElo.innerHTML)) * 0.2
        } else if(stt.status === "loose") {
            info_status.style.backgroundColor = "red"
            user.style.backgroundColor = "red"
            enemy.style.backgroundColor = "#007BFF"
            info_elo_fluc_new.style.color = "red"
            newValue = parseInt(userElo.innerHTML) - Math.abs((parseInt(enemyElo.innerHTML) - parseInt(enemyElo.innerHTML)) * 0.2)
        } else {
            info_status.style.backgroundColor = "#333"
            user.style.backgroundColor = "#333"
            enemy.style.backgroundColor = "#333"
            info_elo_fluc_new.style.color = "#fff"
            newValue = parseInt(userElo.innerHTML)
        }
    })
    .catch(err => console.log(err))
    .finally(() => {
        loading.style.display = "none"
        video.innerHTML = `<source src="/static/upload_video/result.mp4" type="video/mp4">
        // Your browser does not support the video tag.`
        video.load()
        video.style.display = "block"
        setTimeout(() => info.style.display = "block", 1000)
    })
}


arrow.onanimationend = () => {
    // console.log(newValue)
    let a = setInterval(() => {
        newPoint.innerHTML = dem;
        if(dem >= newValue) {
            clearInterval(a)
        }
        dem+=4;
    }, 1)
}
