const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const saveBtn = $(".coding_module-nav--saveBtn.btn")
const terminal = $(".utility_block-element.terminal")
const rule = $(".utility_block-element.rule")
const loader = $(".coding_module-nav--saveBtn.loader")

const ruleBtn = $(".utility_nav-block--item.rule")
const terminalBtn = $(".utility_nav-block--item.terminal")
const animation = $(".utility_nav-block .animation")
const animationChild = $(".utility_nav-block .animation .children")
// const terminalLoader = $(".")

var audio = document.querySelector(".bot_display-video--result");
audio.volume = 0.1;

var editor = ace.edit("coding_module-coding_block");

editor.setOptions({
    mode: "ace/mode/python",
    selectionStyle: "text",
    theme: "ace/theme/dracula",
});

saveBtn.onclick = () => {
    const code = editor.getValue()
    loader.style.display = "block"
    saveBtn.style.display = "none"

    toggleMode("terminal")
    terminal.style.backgroundColor = "#252525"
    terminalBtn.style.color = "#fff"
    ruleBtn.style.color = "#ccc"
    animationChild.style.right = "0";
    animationChild.style.width = terminalBtn.clientWidth + "px";
    terminal.innerHTML = `>>> loading...`

    fetch("/upload_code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(code.replaceAll('\r', '')),
    })
    .then(res => res.json())
    .then(data => {
        const a = data.replaceAll('\n', '<br>').replaceAll('    ', '&emsp;')
        terminal.innerHTML = `>>> ${a}`
    })
    .catch(err => terminal.innerHTML = `>>> ${err}`)
    .finally(() => {
        loader.style.display = "none"
        saveBtn.style.display = "block"
        terminal.style.backgroundColor = "#000"
    })
    
}

const defaultValue = `
import random

def is_valid_move(move, current_side, board):
    current_x = move["selected_pos"][0]
    current_y = move["selected_pos"][1]
    new_x = move["new_pos"][0]
    new_y = move["new_pos"][1]

    if (current_x%1==0 and current_y%1==0 and new_x%1==0 and new_y%1==0 and # Checking if pos is integer
        0 <= current_x <= 4 and 0 <= current_y <= 4 and # Checking if move is out of bounds
        0 <= new_x     <= 4 and 0 <= new_y     <= 4 and
        board[new_y][new_x] == 0 and board[current_y][current_x] == current_side): # Checking if selected position and new position is legal
        dx = abs(new_x-current_x)
        dy = abs(new_y-current_y)
        if (dx + dy == 1): return True # Checking if the piece has moved one position away
        return (current_x+current_y)%2==0 and (dx * dy == 1)
    return False

def main(player):

    while True:
        selected_pos = random.choice(player.your_pos)
        board = player.board
        new_pos_select = random_move(selected_pos)
        new_pos = (new_pos_select[0], new_pos_select[1])
        move = {"selected_pos": selected_pos, "new_pos": new_pos}
        if is_valid_move(move, player.your_side, board):
            return move

def random_move(position):
    movement = [(0, -1), (0, 1), (1, 0), (-1, 0), (-1, 1), (1, -1), (1, 1), (-1, -1)]  #possible moves
    movement_select = random.choice(movement)  #Randomize movement
    new_pos_x = position[0] + movement_select[1]
    new_pos_y = position[1] + movement_select[0]
    new_pos = (new_pos_x, new_pos_y)
    return new_pos
`
const session = editor.getSession();
session.setMode('ace/mode/python');

fetch("/get_code")
.then(res => res.json())
.then(data => {
        if(data) {
            console.log(JSON.stringify(data));
            session.setValue(data)
        } else {
            session.setValue(defaultValue);
        }
    })
    .catch(err => console.error(err))

const guides = [
    {
        display: "none",
        content: "chỗ để viết code tạo bot",
        pos: `
            top: 48%;
            left: 35%;
        `,
        style: `border: 2px blue;`,
        arrow_pos: `
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;            
            border-left: 10px solid #fff; 
        `,
    },
    {
        display: "none",
        content: "video minh họa bot từ code bạn viết ra",
        pos: `
            top: 52%;
            left: 14%;
        `,
        style: `border-color: blue;`,
        arrow_pos: `
            position: absolute;
            left: 50%;
            bottom: 100%;
            transform: translateX(-50%);
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            
            border-bottom: 10px solid #fff;
        `,
    },
    {
        display: "none",
        content: "lấy những hàm của thư viện random ra.",
        pos: `
            top: 4%;
            left: 48%;
        `,
        arrow_pos: `
            position: absolute;
            left: 45%;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;            
            border-top: 10px solid #fff;
        `,
    },
    {
        display: "none",
        content: "lấy vị trí trước và sau khi di chuyển của quân cơ",
        pos: `
            top: 18%;
            left: 28%;
        `,
        arrow_pos: `
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;            
            border-left: 10px solid #fff; 
        `,
    },
    {
        display: "none",
        content: "kiểm tra xem nước đi có hợp lệ hay không (quân cờ phải di chuyển trong bàn cờ kích thước 5x5)",
        pos: `
            top: 32%;
            left: 28%;
        `,
        arrow_pos: `
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;            
            border-left: 10px solid #fff; 
        `,
    },
    {
        display: "none",
        content: "từ các nước đi ngẫu nhiên có được từ hàm random_move. Nếu có nước đi hợp lệ thì lấy",
        pos: `
            top: 60%;
            left: 28%;
        `,
        arrow_pos: `
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;            
            border-left: 10px solid #fff; 
        `,
    },
    {
        display: "none",
        content: "tạo ra các nước đi ngẫu nhiên",
        pos: `
            top: 80%;
            left: 28%;
        `,
        arrow_pos: `
            position: absolute;
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;            
            border-left: 10px solid #fff; 
        `,
    }
]

function toggleMode(mode) {
    if(mode == "terminal") {
        terminal.style.display = "block"
        rule.style.display = "none"
    } else {
        rule.style.display = "flex"
        terminal.style.display = "none"
    }
}

ruleBtn.onclick = (e) => {
    console.dir(animation)
    ruleBtn.style.color = "#fff"
    terminalBtn.style.color = "#ccc"
    animationChild.style.right = `${100 - (e.target.clientWidth / animation.clientWidth * 100)}%`;
    animationChild.style.width = e.target.clientWidth + "px";
    toggleMode("rule")
}

terminalBtn.onclick = (e) => {
    terminalBtn.style.color = "#fff"
    ruleBtn.style.color = "#ccc"
    animationChild.style.right = "0";
    animationChild.style.width = e.target.clientWidth + "px";
    toggleMode("terminal")
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
    if(pre_i != -1 && pre_i != i) guideBoxes[pre_i].style.display = "none"
    if(pre_i === i && i > 0) {
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

guides.forEach((guide, index) => {
    box.innerHTML += `
        <div class="guide_box" style="${guide.pos + (guide?.style ? guide.style : "")} display: ${guide.display}">
            <div class="guide_box--content">${guide.content}</div>
                <div class="guide_box--arrow" style="${guide.arrow_pos}"></div>
        </div>
    `
})

guideBox_navLeft.onclick = () => showGuideBox(i > 0 ? --i : i)
guideBox_navRight.onclick = () => showGuideBox(i + 1 < $$(".guide_box").length ? ++i : i)