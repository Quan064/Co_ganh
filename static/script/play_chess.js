const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const board = $(".board")
const boardValue = board.getBoundingClientRect()
const chessGrapX = boardValue.width / 4 + 2
const chessGrapY = boardValue.height / 4 + 2
let isMouseDown = false
const d1 = [[1,0],[0,1],[0,-1],[-1,0]]
const d2 = [[1,0],[0,1],[0,-1],[-1,0],[-1,-1],[-1,1],[1,1],[1,-1]]
let selectedChess

const gridHTML = `
<div class="grid">
<div class="row1"></div>
<div class="row2"></div>            
<div class="row3"></div>
<div class="row4"></div>
</div>
<div class="grid">
<div class="row1"></div>
<div class="row2"></div>            
<div class="row3"></div>
<div class="row4"></div>
</div>
<div class="grid">
<div class="row1"></div>
<div class="row2"></div>            
<div class="row3"></div>
<div class="row4"></div>
</div>
<div class="grid">
<div class="row1"></div>
<div class="row2"></div>            
<div class="row3"></div>
<div class="row4"></div>
</div>
`



const grid = [
    [-1,-1,-1,-1,-1],
    [-1, 0, 0, 0,-1],
    [1, 0, 0, 0, -1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1]
]

// function renderBoard() {
// }
board.innerHTML = gridHTML

for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
        board.innerHTML += `<div data-choosable="false" data-posx="${j}" data-posy="${i}" class="box" style="top:${chessGrapY*i - 42}px; left:${chessGrapX*j - 42}px;"></div>`
        if(grid[i][j] === -1) {
            board.innerHTML += `<div data-posx="${j}" data-posy="${i}" style="background-color: red; top:${chessGrapY*i - 34}px; left:${chessGrapX*j - 34}px;" class="chess enemy"></div>`
        } else if(grid[i][j] === 1) {
            board.innerHTML += `<div data-posx="${j}" data-posy="${i}" style="background-color: blue; top:${chessGrapY*i - 34}px; left:${chessGrapX*j - 34}px;" class="chess player"></div>`
        }
    }
}

function swap(chess, box) {
    chess.style.left = box.offsetLeft + 10 + "px"
    chess.style.top = box.offsetTop + 10 + "px"
    chess.dataset.posx = box.dataset.posx
    chess.dataset.posy = box.dataset.posy
}

const boxes = $$(".box")

function clearBox() {
    boxes.forEach(box => {
        box.dataset.choosable = "false"
    })
}

function getBotmove() {
    let data = {
        your_pos : [],
        your_side : -1,
        opp_pos : [],
        board : grid,
    }

    grid.forEach((row,i) => {
        row.forEach((__,j) => {
            if(grid[i][j] === 1) data.your_pos.push([j,i])
            if(grid[i][j] === -1) data.opp_pos.push([j,i])
        })
    })

    fetch("/get_pos_of_playing_chess", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
    .then(res => res.json(data))
    .then(data => {
        console.log(data)
    })
}

boxes.forEach((e) => {
    e.onclick = () => {
        if(e.dataset.choosable === "true" && selectedChess) {
            const chessX = Number(selectedChess.dataset.posx)
            const chessY = Number(selectedChess.dataset.posy)
            const boxX = Number(e.dataset.posx)
            const boxY = Number(e.dataset.posy)
            let path = grid[chessY][chessX]
            grid[chessY][chessX] = grid[boxY][boxX]
            grid[boxY][boxX] = path
            swap(selectedChess, e)
            clearBox()
            getBotmove()
        }
    }
})

const chess = $$(".chess.player")

chess.forEach(e => {
    e.onclick = () => getPos(e)
});

const type = [
    [1,0,1,0,1],
    [0,1,0,1,0],
    [1,0,1,0,1],
    [0,1,0,1,0],
    [1,0,1,0,1]
]

function getPos(e) {
    const eX = Number(e.dataset.posx)
    const eY = Number(e.dataset.posy)

    selectedChess = e

    clearBox()

    if(type[eX][eY] === 0) {
        d1.forEach(pos => {
            let newPosX = eX + pos[0]
            let newPosY = eY + pos[1]
            if(newPosX >= 0 && newPosX < 5 && newPosY >= 0 && newPosY < 5 && grid[newPosY][newPosX] === 0) {
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
            if(newPosX >= 0 && newPosX < 5 && newPosY >= 0 && newPosY < 5 && grid[newPosY][newPosX] === 0) {
                let box = Array.from(boxes).filter(e => Number(e.dataset.posx) === newPosX && Number(e.dataset.posy) === newPosY)
                box.forEach(e => {
                    e.dataset.choosable = "true"
                })
            }
        })
    }
}
