from copy import deepcopy

def is_valid_move(current_pos, new_pos, board):

    if not (0 <= new_pos[0] <= 4 and 0 <= new_pos[1] <= 4 and board[new_pos[1]][new_pos[0]] == 0):
        return False
    else:
        dx = abs(new_pos[0]-current_pos[0])
        dy = abs(new_pos[1]-current_pos[1])
        if (current_pos[0]+current_pos[1])%2==0:
            return (dx + dy == 1) or (dx * dy == 1)
        return (dx + dy == 1)
def ganh_chet(move, opp_pos, your_side, opp_side, board):

    valid_remove = []
    at_8intction = (move[0]+move[1])%2==0

    for x0, y0 in opp_pos:
        dx, dy = x0-move[0], y0-move[1]
        if -1<=dx<=1 and -1<=dy<=1 and (0 in (dx,dy) or at_8intction):
            if ((0<=move[0]-dx<=4 and 0<=move[1]-dy<=4 and board[move[1]-dy][move[0]-dx] == opp_side) or #ganh
                (0<=x0+dx<=4 and 0<=y0+dy<=4 and board[y0+dy][x0+dx] == your_side)): # chet
                valid_remove.append((x0, y0))

    for x, y in valid_remove:
        board[y][x] = 0
        opp_pos.remove((x, y))

    return valid_remove
def vay(opp_pos, board):
    
    for pos in opp_pos:
        if (pos[0]+pos[1])%2==0:
            move_list = ((1,0), (-1,0), (0,1), (0,-1), (1,1), (-1,-1), (-1,1), (1,-1))
        else:
            move_list = ((1,0), (-1,0), (0,1), (0,-1))
        for move in move_list:
            new_valid_x = pos[0] + move[0]
            new_valid_y = pos[1] + move[1]
            if 0<=new_valid_x<=4 and 0<=new_valid_y<=4 and board[new_valid_y][new_valid_x]==0:
                return []

    for x, y in opp_pos: board[y][x] = 0
    opp_pos = []
    return opp_pos

def main(input_):
    global move
    move = {"selected_pos": None, "new_pos": None}
    minimax(deepcopy(input_))
    return move

CheckGamepoint = lambda your_pos, opp_pos: (len(your_pos) - len(opp_pos))*10
def minimax(input_, depth=0, isMaximizingPlayer=True):

    if isMaximizingPlayer:
        bestVal = float("-inf")
        your_pos = input_["your_pos"]
        opp_pos = input_["opp_pos"]
        your_side = input_["your_side"]
        opp_side = -your_side
    else:
        bestVal = float("inf")
        opp_pos = input_["your_pos"]
        your_pos = input_["opp_pos"]
        opp_side = input_["your_side"]
        your_side = -opp_side
    board = input_["board"]

    if depth == 4:
        return CheckGamepoint(your_pos, opp_pos) - depth

    movements = ((0,-1), (0,1), (1,0), (-1,0), (-1,1), (1,-1), (1,1), (-1,-1))
    for pos in your_pos:
        for movement in movements:
            invalid_move = (pos[0] + movement[0], pos[1] + movement[1])
            if is_valid_move(pos, invalid_move, board):

                pre_board = deepcopy(board)
                pre_your_pos = your_pos.copy()
                pre_opp_pos = opp_pos.copy()

                # Update move to board
                board[invalid_move[1]][invalid_move[0]] = your_side
                board[pos[1]][pos[0]] = 0
                # Update move to positions
                index_move = your_pos.index(pos)
                your_pos[index_move] = invalid_move

                ganh_chet(invalid_move, opp_pos, your_side, opp_side, board)
                vay(opp_pos, board)

                value = minimax(deepcopy(input_), depth+1, not isMaximizingPlayer)
                old_bestVal = bestVal
                bestVal = (min, max)[isMaximizingPlayer](bestVal, value)
                if depth == 0 and bestVal > old_bestVal:
                    move["selected_pos"] = pos
                    move["new_pos"] = invalid_move

                # Undo move
                board[:], your_pos[:], opp_pos[:] = pre_board, pre_your_pos, pre_opp_pos

    return bestVal