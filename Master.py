def is_valid_move(current_pos, new_pos, input):
    current_x = current_pos[0]
    current_y = current_pos[1]
    new_x = new_pos[0]
    new_y = new_pos[1]
    board = input["board"]

    if not (0 <= current_x <= 4 and 0 <= current_y <= 4 and
            0 <= new_x     <= 4 and 0 <= new_y     <= 4 and
            board[new_y][new_x] == 0):
        return False
    else:
        dx = abs(new_x-current_x)
        dy = abs(new_y-current_y)
        if (current_x+current_y)%2==0:
            return (dx + dy == 1) or (dx * dy == 1)
        return (dx + dy == 1)

def ganh(move, input):

    valid_remove = []
    opp_pos = input["opp_pos"]
    dir_check = [False] * 4
    at_8intction = (move[0]+move[1])%2==0

    for x0, y0 in opp_pos:
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
        input["board"][y][x] = 0
        input["opp_pos"].remove((x, y))

    return valid_remove
def chet(move, input):

    your_pos = input["your_pos"]
    opp_side = -input["your_side"]
    board = input["board"]

    valid_remove = []
    if (move[0]+move[1])%2==0: bool = lambda dx, dy: {dx,dy} - {-2,2,0} == set()
    else: bool = lambda dx, dy: {dx,dy} - {-2,2} == {0}

    for x0, y0 in your_pos:
        dx, dy = x0-move[0], y0-move[1]
        if bool(dx,dy):
            x, y = (int(move[0]+dx/2), int(move[1]+dy/2))
            if board[y][x] == opp_side:
                valid_remove.append((x, y))
                board[y][x] = 0
                input["opp_pos"].remove((x, y))

    return valid_remove
def vay(input):
    
    opp_pos = input["opp_pos"]
    board = input["board"]

    valid_remove = []

    valid_move_pos = set()
    for pos in opp_pos:
        if (pos[0]+pos[1])%2==0:
            move_list = ((1,0), (-1,0), (0,1), (0,-1), (1,1), (-1,-1), (-1,1), (1,-1))
        else:
            move_list = ((1,0), (-1,0), (0,1), (0,-1))
        for i in range(len(move_list)):
            new_valid_x = pos[0] + move_list[i][0]
            new_valid_y = pos[1] + move_list[i][1]
            if 0<=new_valid_x<=4 and 0<=new_valid_y<=4 and board[new_valid_y][new_valid_x]==0:
                valid_move_pos.add((new_valid_x, new_valid_y))
    if not valid_move_pos:
        for x, y in opp_pos:
            valid_remove.append((x, y))
            board[y][x] = 0
        opp_pos = []

    return valid_remove

def main(input):

    # {'your_pos': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'your_side': -1,
    #  'opp_pos': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'board': [[-1, -1, -1, -1, -1],
    #            [-1,  0,  0,  0, -1],
    #            [ 1,  0,  0,  0, -1],
    #            [ 1,  0,  0,  0,  1],
    #            [ 1,  1,  1,  1,  1]]}

    your_pos = input["your_pos"]

    max_kill_count = -1

    movements = [(0,-1), (0,1), (1,0), (-1,0), (-1,1), (1,-1), (1,1), (-1,-1)]
    for pos in your_pos:
        for movement in movements:
            new_pos_x = pos[0] + movement[0]
            new_pos_y = pos[1] + movement[1]
            move = (new_pos_x, new_pos_y)
            if is_valid_move(pos, move, input):
                kill_count = len(ganh(move, input)) + len(chet(move, input))
                if kill_count == 0:
                    kill_count += len(vay(input))
                # Always kill if can
                if kill_count > max_kill_count:
                    max_kill_count = kill_count
                    selected_pos = pos
                    new_pos = move

    move = {"selected_pos": selected_pos, "new_pos": new_pos}
    return move