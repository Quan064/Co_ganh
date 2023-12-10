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
def enable_ganh(move, opp_side, board):

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
            return ((remove_posx_1, remove_posy_1), (remove_posx_2, remove_posy_2))
        else:
            return False

def main(input):

    # {'your_pieces': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'your_side': -1,
    #  'oponent_position': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'board': [[-1,-1, 0,-1, 0],
    #            [ 0,-1,-1,-1, 0],
    #            [-1, 0, 0,-1, 1],
    #            [ 0, 1, 1, 1, 1],
    #            [ 1, 1, 0, 1, 0]]}

    your_pieces = input["your_pieces"]
    oponent_position = input["oponent_position"]
    your_side = input["your_side"]
    opp_side = -your_side

    # Random move
    selected_pos = random.choice(your_pieces)
    movement = [(0,-1), (0,1), (1,0), (-1,0), (-1,1), (1,-1), (1,1), (-1,-1)]
    movement_select = random.choice(movement)
    new_pos_x = selected_pos[0] + movement_select[1]
    new_pos_y = selected_pos[1] + movement_select[0]
    new_pos = (new_pos_x, new_pos_y)

    move = {"selected_pos": selected_pos, "new_pos": new_pos}
    if is_valid_move(move, input):
        return move
    else: raise Exception("ERROR!!! code lại đê")