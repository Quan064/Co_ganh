game_state = {"board" : [[0, 0, 0, 0, 0],
                         [0, 0,-1, 0, 0],
                         [0,-1, 1,-1, 0],
                         [0, 0,-1, 0, 0],
                         [0, 0, 0, 0, 0]]}
positions = [None,
            [(2,2)],
            [(2,1),(1,2),(3,2),(2,3)]]

def ganh(move, opp_side):

    valid_remove = []
    board = game_state["board"]
    dir_check = [False] * 4
    at_8intction = (move[0]+move[1])%2==0
    count = 0

    for x0, y0 in positions[opp_side]:
        count += 1
        dx, dy = x0-move[0], y0-move[1]
        if -1<=dx<=1 and -1<=dy<=1:
            for i in range(4):
                if (dx==0, dy==0, at_8intction and dx==dy, at_8intction and -dx==dy)[i]:
                    if dir_check[i]:
                        opp_remove = ((x0, y0), (move[0]-dx, move[1]-dy))
                        valid_remove.extend(opp_remove)
                    else: dir_check[i] = True
                    break
    for x, y in valid_remove:
        board[y][x] = 0
        positions[opp_side].remove((x, y))
    return valid_remove

print(ganh((2,2), -1))