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

def ganh(move, oponent_position):

    valid_remove = []
    dir_check = [False] * 4

    for x0, y0 in oponent_position:
        x, y = x0-move[0], y0-move[1]
        if -1<=x<=1 and -1<=y<=1:
            for i in range(4):
                if (x==0, y==0, x==y, -x==y)[i]:
                    if dir_check[i]:
                        opp_remove = ((move[0]+x, move[1]+y), (move[0]-x, move[1]-y))
                        valid_remove.extend(opp_remove)
                    else: dir_check[i] = True
                    break

    return valid_remove
def chet(move, input):

    your_side = input["your_side"]
    opp_side = -your_side
    board = input["board"]

    valid_remove = []

    if (move[0]+move[1])%2==0:
        oth_chet = ((2,0), (-2,0), (0,2), (0,-2), (2,2), (-2,-2), (-2,2), (2,-2))
        pos_remove = ((1,0), (-1,0), (0,1), (0,-1), (1,1), (-1,-1), (-1,1), (1,-1))
    else:
        oth_chet = ((2,0), (-2,0), (0,2), (0,-2))
        pos_remove = ((1,0), (-1,0), (0,1), (0,-1))
    for i in range(len(oth_chet)):
        new_oth_chetx = move[0] + oth_chet[i][0]
        new_oth_chety = move[1] + oth_chet[i][1]
        removex = move[0] + pos_remove[i][0]
        removey = move[1] + pos_remove[i][1]
        if 0<=new_oth_chetx<=4 and 0<=new_oth_chety<=4 and board[new_oth_chety][new_oth_chetx]==your_side and board[removey][removex]==opp_side:
            valid_remove.append((removex, removey))

    return valid_remove
def vay(input):
    
    oponent_position = input["oponent_position"]
    board = input["board"]

    valid_remove = []

    valid_move_pos = set()
    for pos in oponent_position:
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
        for x, y in oponent_position:
            valid_remove.append((x, y))

    return valid_remove

def check_point(input):
    point = len(input["your_pieces"]) - len(input["oponent_position"])
    return point

# Ưu thế:
# Vị trí
# Hạn chế nước đi của đối phương
# Ăn quân
# Không bị ăn quân
# 

def main(input):

    # {'your_pieces': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'your_side': -1,
    #  'oponent_position': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'board': [[-1, -1, -1, -1, -1],
    #            [-1,  0,  0,  0, -1],
    #            [ 1,  0,  0,  0, -1],
    #            [ 1,  0,  0,  0,  1],
    #            [ 1,  1,  1,  1,  1]]}

    your_pieces = input["your_pieces"]
    oponent_position = input["oponent_position"]

    max_kill_count = -1

    movements = [(0,-1), (0,1), (1,0), (-1,0), (-1,1), (1,-1), (1,1), (-1,-1)]
    for pos in your_pieces:
        for movement in movements:
            new_pos_x = pos[0] + movement[0]
            new_pos_y = pos[1] + movement[1]
            move = (new_pos_x, new_pos_y)
            if is_valid_move(pos, move, input):
                kill_count = len(ganh(move, oponent_position)) + len(chet(move, input))
                if kill_count == 0:
                    kill_count += len(vay(input))
                # Always kill if can
                if kill_count > max_kill_count:
                    max_kill_count = kill_count
                    selected_pos = pos
                    new_pos = move

    move = {"selected_pos": selected_pos, "new_pos": new_pos}
    return move