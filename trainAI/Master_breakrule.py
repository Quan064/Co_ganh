class intervention():
    global game_state

    __res = {}
    def get_result(self):
        return self.__res.copy()
    def __delitem__(self, key):
        del self.__res[key]
    def clear(self):
        self.__res.clear()

    def remove_blue(self, x, y):
        if (x, y) in game_state["positions"][1]:
            self.__res.update({f'{x},{y}' : 'remove_blue'})
        else: raise ValueError(f"There is no blue piece in ({x}, {y})")
    def remove_red(self, x, y):
        if (x, y) in game_state["positions"][-1]:
            self.__res.update({f'{x},{y}' : 'remove_red'})
        else: raise ValueError(f"There is no red piece in ({x}, {y})")

    def insert_blue(self, x, y):
        if game_state["board"][y][x] == 0:
            self.__res.update({f'{x},{y}' : 'insert_blue'})
        else: raise ValueError(f"There already has a piece in ({x}, {y})")
    def insert_red(self, x, y):
        if game_state["board"][y][x] == 0:
            self.__res.update({f'{x},{y}' : 'insert_red'})
        else: raise ValueError(f"There already has a piece in ({x}, {y})")

    def set_value(self, x, y, value):
        self.__res.update({f'{x},{y},{value}' : 'set_value'})

    def action(self):
        for key, action in self.__res.items():
            x, y = int(key[0]), int(key[2])
            match action:
                case 'remove_blue':
                    game_state["board"][y][x] = 0
                    game_state["positions"][1].remove((x, y))
                case 'remove_red':
                    game_state["board"][y][x] = 0
                    game_state["positions"][-1].remove((x, y))
                case 'insert_blue':
                    game_state["board"][y][x] = 1
                    game_state["positions"][1].append((x, y))
                case 'insert_red':
                    game_state["board"][y][x] = -1
                    game_state["positions"][-1].append((x, y))
        self.clear()

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

    board_pointF = (0,0,1,0,0,0,7,2,5,0,4,2,10,2,4,0,5,2,7,0,0,0,1,0,0)
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
    global move
    move = {}

    your_board = int("0b"+"".join("1" if ele == -1 else "0" for row in player.board for ele in row),2)
    opp_board = int("0b"+"".join("1" if ele == 1 else "0" for row in player.board for ele in row),2)

    minimax(player.your_pos, player.opp_pos, your_board, opp_board)
    return move

def minimax(your_pos, opp_pos, your_board, opp_board, depth=0, alpha=(-9,), beta=(9,)):

    if depth%2==0:
        if your_board == 0 or opp_board == 0:
            return (-8, depth, 0)
        if depth == 4:
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