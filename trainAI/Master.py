import os
from filelock import FileLock

def ganh_chet(move, opp_pos, your_board, opp_board):
    valid_remove = []

    for x0, y0 in opp_pos:
        dx, dy = x0-move[0], y0-move[1] 
        if -1<=dx<=1 and -1<=dy<=1 and (0 in (dx,dy) or (move[0]+move[1])%2==0):
            ganhx, ganhy = move[0]-dx, move[1]-dy
            chetx, chety = x0+dx, y0+dy
            if ((0<=ganhx<=4 and 0<=ganhy<=4 and opp_board&(1<<24-5*ganhy-ganhx) != 0) or # ganh
                (0<=chetx<=4 and 0<=chety<=4 and your_board&(1<<24-5*chety-chetx) != 0)): # chet
                valid_remove.append((x0, y0))

    for x, y in valid_remove:
        opp_board ^= (1<<24-5*y-x)
        opp_pos.remove((x, y))

    return opp_board, opp_pos
def vay(opp_pos, your_board, opp_board):
    
    for pos in opp_pos:
        if (pos[0]+pos[1])%2==0:
            move_list = ((1,0), (-1,0), (0,1), (0,-1), (1,1), (-1,-1), (-1,1), (1,-1))
        else:
            move_list = ((1,0), (-1,0), (0,1), (0,-1))
        for move in move_list:
            new_valid_x = pos[0] + move[0]
            new_valid_y = pos[1] + move[1]
            if 0<=new_valid_x<=4 and 0<=new_valid_y<=4 and (your_board|opp_board)&(1<<24-5*new_valid_y-new_valid_x) == 0:
                return opp_board, opp_pos

    return 0, []
def check_pos_point(your_pos, opp_pos):

    board_pointF = (1,1,2,1,1,1,8,3,6,1,5,3,11,3,5,1,6,3,8,1,1,1,2,1,1)
    move_count = (
        (5,4,3,2,1,4,4,3,2,1,3,3,3,2,1,2,2,2,2,1,1,1,1,1,1),
        (4,5,4,3,2,3,4,3,3,2,3,3,3,2,2,2,2,2,2,1,1,1,1,1,1),
        (3,4,5,4,3,3,4,4,4,3,3,3,3,3,3,2,2,2,2,2,1,1,1,1,1),
        (2,3,4,5,4,2,3,3,4,3,2,2,3,3,3,1,2,2,2,2,1,1,1,1,1),
        (1,2,3,4,5,1,2,3,4,4,1,2,3,3,3,1,2,2,2,2,1,1,1,1,1),
        (4,3,3,2,1,5,4,3,2,1,4,3,3,2,1,3,3,2,2,1,2,2,2,1,1),
        (4,4,4,3,2,4,5,4,3,2,4,4,4,3,2,3,3,3,3,2,2,2,2,2,2),
        (3,3,4,3,3,3,4,5,4,3,3,3,4,3,3,2,3,3,3,2,2,2,2,2,2),
        (2,3,4,4,4,2,3,4,5,4,2,3,4,4,4,2,3,3,3,3,2,2,2,2,2),
        (1,2,3,3,4,1,2,3,4,5,1,2,3,3,4,1,2,2,3,3,1,1,2,2,2),
        (3,3,3,2,1,4,4,3,2,1,5,4,3,2,1,4,4,3,2,1,3,3,3,2,1),
        (3,3,3,2,2,3,4,3,3,2,4,5,4,3,2,3,4,3,3,2,3,3,3,2,2),
        (3,3,3,3,3,3,4,4,4,3,3,4,5,4,3,3,4,4,4,3,3,3,3,3,3),
        (2,2,3,3,3,2,3,3,4,3,2,3,4,5,4,2,3,3,4,3,2,2,3,3,3),
        (1,2,3,3,3,1,2,3,4,4,1,2,3,4,5,1,2,3,4,4,1,2,3,3,3),
        (2,2,2,1,1,3,3,2,2,1,4,3,3,2,1,5,4,3,2,1,4,3,3,2,1),
        (2,2,2,2,2,3,3,3,3,2,4,4,4,3,2,4,5,4,3,2,4,4,4,3,2),
        (2,2,2,2,2,2,3,3,3,2,3,3,4,3,3,3,4,5,4,3,3,3,4,3,3),
        (2,2,2,2,2,2,3,3,3,3,2,3,4,4,4,2,3,4,5,4,2,3,4,4,4),
        (1,1,2,2,2,1,2,2,3,3,1,2,3,3,4,1,2,3,4,5,1,2,3,3,4),
        (1,1,1,1,1,2,2,2,2,1,3,3,3,2,1,4,4,3,2,1,5,4,3,2,1),
        (1,1,1,1,1,2,2,2,2,1,3,3,3,2,2,3,4,3,3,2,4,5,4,3,2),
        (1,1,1,1,1,2,2,2,2,2,3,3,3,3,3,3,4,4,4,3,3,4,5,4,3),
        (1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,2,3,3,4,3,2,3,4,5,4),
        (1,1,1,1,1,1,2,2,2,2,1,2,3,3,3,1,2,3,4,4,1,2,3,4,5)
    )

    your_cm = tuple(zip(*[move_count[x+5*y] for x, y in your_pos]))
    opp_cm = tuple(zip(*[move_count[x+5*y] for x, y in opp_pos]))

    sum = 0
    for i in range(25):
        sub = max(your_cm[i], default=0) - max(opp_cm[i], default=0)
        if sub > 0: sum += board_pointF[i]
        elif sub < 0: sum -= board_pointF[i]

    return sum

def main(player):
    global move, cache
    move = {}

    your_board = int("0b"+"".join("1" if ele == -1 else "0" for row in player.board for ele in row),2)
    opp_board = int("0b"+"".join("1" if ele == 1 else "0" for row in player.board for ele in row),2)

    dirname = os.path.dirname(__file__)
    lock = FileLock(os.path.join(dirname, f"source_code/bit_board.txt.lock"))
    with lock:
        with open(os.path.join(dirname, "source_code/bit_board.txt")) as f:
            cache = {i.split("  ")[0]:i.split("  ")[1] for i in f.read().split("\n")}
        # NOTE:
        # cache[state][0]:
        #     8 : 🔴 thắng
        #    -8 : 🔵 thắng
        #
        # cache[state][1] = n:
        #   -lẻ : 🔴 thắng sau n lượt
        #  chẵn : 🔵 thắng sau n lượt

    v = minimax(player.your_pos, player.opp_pos, your_board, opp_board)

    cache[f"{your_board} {opp_board}"] = ' '.join(str(i) for i in v)
    lock = FileLock(os.path.join(dirname, f"source_code/bit_board.txt.lock"))
    with lock:
        with open(os.path.join(dirname, f"source_code/bit_board.txt"), mode="w") as f:
            f.write("\n".join("  ".join(i) for i in cache.items()))

    return move

def minimax(your_pos, opp_pos, your_board, opp_board, depth=0, alpha=(-9,), beta=(9,)):

    if depth%2==0:
        if (state := f"{your_board} {opp_board}") in cache and depth:
            temp = [int(i) for i in cache[state].split(' ')]
            return temp[0], temp[1] - depth if temp[1]<0 else temp[1] + depth if temp[1]>0 else 0, temp[2]

        if your_board == 0 or opp_board == 0:
            return (-8, depth, 0)
        if depth == 2:
            return (len(your_pos) - len(opp_pos)), 0, check_pos_point(your_pos, opp_pos)

        bestVal = (-9,)

        your_pos.sort(key=lambda i: i[0] + 10*(4-i[1]))
        for pos in your_pos:
            for movement in ((-1,1), (0,1), (1,1), (-1,0), (1,0), (-1,-1), (0,-1), (1,-1)):
                invalid_move = (pos[0] + movement[0], pos[1] + movement[1])
                if 0 <= invalid_move[0] <= 4 and 0 <= invalid_move[1] <= 4 and (your_board|opp_board)&(1<<24-5*invalid_move[1]-invalid_move[0]) == 0 and \
                    ((True, sum(pos)%2==0)[movement[0]*movement[1]]):

                    # Update move to board
                    your_new_board = your_board^(1<<24-5*pos[1]-pos[0])|(1<<24-5*invalid_move[1]-invalid_move[0])
                    # Update move to positions
                    your_new_pos = your_pos.copy()
                    your_new_pos[your_pos.index(pos)] = invalid_move

                    opp_new_board, opp_new_pos = vay(opp_pos.copy(), your_new_board, opp_board)
                    opp_new_board, opp_new_pos = ganh_chet(invalid_move, opp_new_pos, your_new_board, opp_new_board)
                    opp_new_board, opp_new_pos = vay(opp_new_pos, your_new_board, opp_new_board)

                    value = minimax(opp_new_pos, your_new_pos, opp_new_board, your_new_board, depth+1, alpha, beta)
                    if depth == 0 and value > bestVal:
                        move["selected_pos"] = pos
                        move["new_pos"] = invalid_move
                    bestVal = max(bestVal, value)

                    alpha = max(alpha, value)
                    if alpha >= beta:
                        return bestVal

        return bestVal

    else:
        if your_board == 0 or opp_board == 0:
            return (8, -depth, 0)

        bestVal = (9,)

        your_pos.sort(key=lambda i: 4-i[0] + 10*i[1])
        for pos in your_pos:
            for movement in ((1,-1), (0,-1), (-1,-1), (1,0), (-1,0), (1,1), (0,1), (-1,1)):
                invalid_move = (pos[0] + movement[0], pos[1] + movement[1])
                if 0 <= invalid_move[0] <= 4 and 0 <= invalid_move[1] <= 4 and (your_board|opp_board)&(1<<24-5*invalid_move[1]-invalid_move[0]) == 0 and \
                    ((True, sum(pos)%2==0)[movement[0]*movement[1]]):

                    # Update move to board
                    your_new_board = your_board^(1<<24-5*pos[1]-pos[0])|(1<<24-5*invalid_move[1]-invalid_move[0])
                    # Update move to positions
                    your_new_pos = your_pos.copy()
                    your_new_pos[your_pos.index(pos)] = invalid_move

                    opp_new_board, opp_new_pos = vay(opp_pos.copy(), your_new_board, opp_board)
                    opp_new_board, opp_new_pos = ganh_chet(invalid_move, opp_new_pos, your_new_board, opp_new_board)
                    opp_new_board, opp_new_pos = vay(opp_new_pos, your_new_board, opp_new_board)

                    value = minimax(opp_new_pos, your_new_pos, opp_new_board, your_new_board, depth+1, alpha, beta)
                    bestVal = min(bestVal, value)

                    beta = min(beta, value)
                    if alpha >= beta:
                        return bestVal

        return bestVal