const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const board = $(".board")
const boardValue = board.getBoundingClientRect()
const chessGrapX = boardValue.width / 4
const chessGrapY = boardValue.height / 4

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

board.innerHTML += gridHTML

for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {

        if(grid[i][j] === -1) {
            board.innerHTML += `<div style="background-color: red; top:${chessGrapY*i - 30}px; left:${chessGrapX*j - 30}px;" class="chess"></div>`
        } else if(grid[i][j] === 1) {
            board.innerHTML += `<div style="background-color: blue; top:${chessGrapY*i - 30}px; left:${chessGrapX*j - 30}px;" class="chess"></div>`
        }
    }
}