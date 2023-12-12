import random

diag_pos = ((1,1), (1, 3), (3,1), (3,3), (2,2), (0,0), (4,4), (0,4), (4,0))

def is_valid_move(move, input):
    current_x = move["selected_pos"][0]
    current_y = move["selected_pos"][1]
    new_x = move["new_pos"][0]
    new_y = move["new_pos"][1]
    side = input["your_side"]
    board = input["board"]

    dx = abs(new_x-current_x)
    dy = abs(new_y-current_y)
    if (current_x%1!=0 or current_y%1!=0 or new_x%1!=0 or new_y%1!=0 or
        current_x < 0 or current_x > 4 or current_y < 0 or current_y > 4 or
        new_x     < 0 or new_x     > 4 or new_y     < 0 or new_y     > 4 or
        board[new_y][new_x] != 0 or board[current_y][current_x] != side):
        return False
    elif (current_y, current_x) in ((1,1), (1, 3), (3,1), (3,3), (2,2), (0,0), (4,4), (0,4), (4,0)):
        return (dx + dy == 1) or (dx * dy == 1)
    return (dx + dy == 1)
def ganh(move, opp_side, board):

    valid_remove = []

    if move in diag_pos:
        ganh_pair = (((1,0), (-1,0)), ((0,1), (0,-1)), ((1,1), (-1,-1)), ((-1,1), (1,-1)))
    else:
        ganh_pair = (((1,0), (-1,0)), ((0,1), (0,-1)))

    for pair in ganh_pair:
        remove_posx_1 = move[0] + pair[0][0]
        remove_posy_1 = move[1] + pair[0][1]
        remove_posx_2 = move[0] + pair[1][0]
        remove_posy_2 = move[1] + pair[1][1]
        if 0<=remove_posx_1<=4 and 0<=remove_posy_1<=4 and board[remove_posy_1][remove_posx_1]==opp_side and \
           0<=remove_posx_2<=4 and 0<=remove_posy_2<=4 and board[remove_posy_2][remove_posx_2]==opp_side:
            valid_remove.extend(((remove_posx_1, remove_posy_1), (remove_posx_2, remove_posy_2)))

    return valid_remove
def chet(move, oponent_position, side, opp_side, board, ganh_checked):

    valid_remove = []

    if ganh_checked:

        if move in diag_pos:
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
            if 0<=new_oth_chetx<=4 and 0<=new_oth_chety<=4 and board[new_oth_chety][new_oth_chetx]==side and board[removey][removex]==opp_side:
                valid_remove.append((removex, removey))

        if not valid_remove:
            # check VAY
            valid_move_pos = set()
            for pos in oponent_position:
                if pos in diag_pos:
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

def main(input):

    # {'your_pieces': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'your_side': -1,
    #  'oponent_position': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'board': [[-1, -1, -1, -1, -1],
    #            [-1,  0,  0,  0, -1],
    #            [ 1,  0,  0,  0, -1],
    #            [ 1,  0,  0,  0,  1],
    #            [ 1,  1,  1,  1,  1]],
    #  'ganh_checked' : False}

    your_pieces = input["your_pieces"]
    oponent_position = input["oponent_position"]
    your_side = input["your_side"]
    opp_side = -your_side
    board = input["board"]
    ganh_checked = input["ganh_checked"]

    while True:

        max_kill_count = 0

        selected_pos = random.choice(your_pieces)
        movements = [(0,-1), (0,1), (1,0), (-1,0), (-1,1), (1,-1), (1,1), (-1,-1)]
        movement_select = random.choice(movements)
        new_pos_x = selected_pos[0] + movement_select[1]
        new_pos_y = selected_pos[1] + movement_select[0]
        new_pos = (new_pos_x, new_pos_y)

        for pos in your_pieces:
            for movement in movements:
                new_pos_x = pos[0] + movement[0]
                new_pos_y = pos[1] + movement[1]
                if 0<=new_pos_x<=4 and 0<=new_pos_y<=4 and board[new_pos_y][new_pos_y]==0:
                    kill_count = 0
                    move = (new_pos_x, new_pos_y)
                    kill_count += len(ganh(move, opp_side, board))
                    kill_count += len(chet(move, oponent_position, your_side, opp_side, board, ganh_checked))
                    if kill_count > max_kill_count:
                        max_kill_count = kill_count
                        selected_pos = pos
                        new_pos = move

        move = {"selected_pos": selected_pos, "new_pos": new_pos}
        if is_valid_move(move, input):
            return move
        # else: raise Exception("ERROR!!! code lại đê")