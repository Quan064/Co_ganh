const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const playerList = $(".side_bar-player-list")
const newPoint = $(".info_elo-fluc--new")
const arrow = $(".info_elo-fluc--arrow")
const fightBtn = $(".fight_btn")
let selectedPlayer
let dem = 0

fetch("get_users")
.then(res => res.json())
.then(data => {
    data.forEach(user => {
        playerList.innerHTML += `
            <li class="player" data-name=${user.username} data-elo=${user.elo}>
                <div class="player-avatar"><p>${user.username[0].toUpperCase()}</p></div>
                <div class="player-info">
                <div class="player-info--name">${user.username}</div>
                <div class="player-info--elo">${user.elo}</div>
                </div>
            </li>
        `
    })
    const players = $$(".player")
    // <img src="https://static.vecteezy.com/system/resources/thumbnails/003/682/252/small/pink-blue-v-alphabet-letter-logo-icon-design-with-swoosh-for-business-and-company-vector.jpg" class="player-avatar"></img>
    players.forEach((player) => {
        player.onclick = () => {
            players.forEach(p => p.style.backgroundColor = "")
            player.style.backgroundColor = "#232E3B"
            selectedPlayer = {
                name: player.dataset.name,
                elo: player.dataset.elo,
            }
        }
    })
})

fightBtn.onclick = () => {
    fetch("/fighting", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedPlayer),
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
    })
    .catch(err => console.log(err))
}


arrow.onanimationend = () => {
    let a = setInterval(() => {
        dem+=4;
        newPoint.innerHTML = dem;
        newPoint.style.color = `rgba(50,${(dem/1000)*200},50,1)`
        if(dem >= 1000) {
            setTimeout(() => {
                newPoint.style.color = `rgba(0,255,0,1)`
            }, 1000)
            clearInterval(a)
        }
    }, 1)
}
