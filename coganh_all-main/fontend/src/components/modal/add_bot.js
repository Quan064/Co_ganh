import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../../context/appContext'

export default function Add_bot({set_new_bot, set_code, set_selected_bot, set_is_open_add_bot}) {
    const { user } = useContext(AppContext)
    const btn_Ref = useRef(null)
    const [bot_name, set_bot_name] = useState(user.username + (new Date).getMilliseconds())

    useEffect(() => {
        btn_Ref.current.onclick = () => {
            fetch(`http://192.168.1.249:5000/create_bot?owner=${user.username}&bot_name=${bot_name}`)
            .then(res => res.json())
            .then(data => {
                set_new_bot((new Date).getMilliseconds())
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
                set_selected_bot(data)
                set_is_open_add_bot(false)
            })
            .catch(err => console.log(err))
        }
    }, [bot_name])

    return (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-slate-700 z-[1000000000000] rounded-lg flex flex-col items-center py-10">
            <p className="text-3xl my-10">Nhập tên bot</p>
            <input value={bot_name} onChange={(e) => set_bot_name(e.target.value)} className="bg-slate-700 outline-none border border-white focus:border-blue-500 rounded-md px-5 py-2"></input>
            <div ref={btn_Ref} className="px-5 py-1 text-2xl bg-blue-600 rounded mt-auto cursor-pointer select-none hover:brightness-90">Tạo</div>
        </div>
    )
}
