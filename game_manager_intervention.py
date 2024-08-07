import requests
from copy import deepcopy
import traceback
from fdb.firestore_config import fdb
import sys
from io import StringIO
import builtins
from tool import valid_move, distance
import random
from pprint import pprint
from trainAI.Master import main as Bot
# from fdb.uti.upload import upload_video_to_storage

class Player:
    your_pos = None
    opp_pos = None
    your_side = None
    board = None
    move_counter = 0
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

# Board manipulation
def Raise_exception(move, current_side, board):
    if not (move.__class__ == dict and tuple(move.keys()) == ('selected_pos', 'new_pos') and move['selected_pos'].__class__ == tuple and move['new_pos'].__class__ == tuple):
        raise Exception(r"The return value must be in the form: {'selected_pos': (x, y), 'new_pos': (x, y)} " + f"(not {move})")

    current_x, current_y = move["selected_pos"]
    new_x, new_y = move["new_pos"]

    if current_x%1!=0 or current_y%1!=0 or new_x%1!=0 or new_y%1!=0:
        raise Exception(f"Position must be an integer (not {[i for i in (current_x, current_y, new_x, new_y) if i%1!=0]})")
    elif not (0 <= current_x <= 4 and 0 <= current_y <= 4 and 0 <= new_x <= 4 and 0 <= new_y <= 4):
        raise Exception(f"x / y must be within the range 0 to 4 (not {[i for i in (current_x, current_y, new_x, new_y) if not 0 <= i <= 4]})")
    elif board[new_y][new_x] != 0:
        raise Exception("new_pos must be empty")
    elif board[current_y][current_x] != current_side:
        raise Exception("selected_pos should be your position")
    elif abs(current_x - new_x)|abs(current_y - new_y)!=1 or (current_x+current_y)%2 & (new_x+new_y)%2:
        raise Exception("Can only move into adjacent cells")

def ganh_chet(move, opp_pos, side, opp_side):
    
    valid_remove = []
    board = game_state["board"]
    at_8intction = (move[0]+move[1])%2==0

    for x0, y0 in opp_pos:
        dx, dy = x0-move[0], y0-move[1]
        if -1<=dx<=1 and -1<=dy<=1 and (0 in (dx,dy) or at_8intction):
            if ((0<=move[0]-dx<=4 and 0<=move[1]-dy<=4 and board[move[1]-dy][move[0]-dx] == opp_side) or #ganh
                (0<=x0+dx<=4 and 0<=y0+dy<=4 and board[y0+dy][x0+dx] == side)): # chet
                valid_remove.append((x0, y0))

    return valid_remove
def vay(opp_pos):

    board = game_state["board"]
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

    return opp_pos.copy()

# System
def activation(user_code, break_rule_code, name):
    # f = StringIO()
    # org_stdout = sys.stdout
    # sys.stdout = f

    globals_exec = {"valid_move": valid_move,
                    "distance": distance,
                    "random": random,
                    "pprint": pprint,
                    '__builtins__': {k:v for k, v in builtins.__dict__.items() if k not in ['eval', 'exec', 'input', '__import__', 'open']}}

    try:
        local = {}
        local_break = {}
        exec(user_code, globals_exec, local)
        exec(break_rule_code, globals_exec, local_break)
        game_res = run_game(Bot, local["main"], local_break["break_rule"], name)

        # sys.stdout = org_stdout
        # return False, game_res, f.getvalue()
    except:
        print(traceback.format_exc())
        # sys.stdout = org_stdout
        # return True, None, f.getvalue()
def run_game(Bot, UserBot, break_rule, session_name): # Main
    global game_state

    player1 = Player()
    player2 = Player()
    player1.your_side = 1
    player2.your_side = -1

    game_state = {
        "current_turn": 1,
        "board": [[-1, -1, -1, -1, -1],
                  [-1,  0,  0,  0, -1],
                  [ 1,  0,  0,  0, -1],
                  [ 1,  0,  0,  0,  1],
                  [ 1,  1,  1,  1,  1]],
        "positions": [None,
                      [(0,2), (0,3), (4,3), (0,4), (1,4), (2,4), (3,4), (4,4)],
                      [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)]],
        "move_counter": 0,
        "result": None
    }
    player1.board = player2.board = game_state["board"]
    player1.your_pos = player2.opp_pos = game_state["positions"][1]
    player2.your_pos = player1.opp_pos = game_state["positions"][-1]

    body = {
        "username": session_name,
        "img": []
    }

    break_rule(game_state, intervention)
    body["setup"] = intervention().get_result()
    intervention().action()

    while not game_state["result"]:

        game_state["move_counter"] += 1
        print(f"__________{game_state['move_counter']}__________")

        if player1.your_side == game_state["current_turn"]:
            player1.move_counter = game_state["move_counter"]
            game_state["move"] = UserBot(deepcopy(player1))
        else:
            player2.move_counter = game_state["move_counter"]
            game_state["move"] = Bot(deepcopy(player2))
        Raise_exception(game_state["move"], game_state["current_turn"], game_state["board"])

        move_new_pos = game_state["move"]["new_pos"]
        move_selected_pos = game_state["move"]["selected_pos"]

        # Update move to board
        game_state["board"][move_new_pos[1]][move_new_pos[0]] = game_state["current_turn"]
        game_state["board"][move_selected_pos[1]][move_selected_pos[0]] = 0

        # Update move to positions
        index_move = game_state["positions"][game_state["current_turn"]].index(move_selected_pos)
        game_state["positions"][game_state["current_turn"]][index_move] = move_new_pos

        opp_pos = game_state["positions"][-game_state["current_turn"]]
        remove = vay(opp_pos)
        remove.extend( ganh_chet(move_new_pos, opp_pos, game_state["current_turn"], -game_state["current_turn"]) )
        remove.extend( vay(opp_pos) )
        for i in remove:
            if game_state["current_turn"]==1:
                intervention().remove_red(*i)
            else:
                intervention().remove_blue(*i)

        break_rule(deepcopy(game_state), intervention)
        body["img"].append([*move_selected_pos, *move_new_pos, intervention().get_result()])
        intervention().action()

        if game_state["result"] == None:
            if not game_state["positions"][1]:
                game_state["result"] = "lost"
            elif not game_state["positions"][-1]:
                game_state["result"] = "win"
            elif (len(game_state["positions"][1]) + len(game_state["positions"][-1]) <= 2) or game_state["move_counter"] == 200:
                game_state["result"] = "draw"

        game_state["current_turn"] *= -1

    new_url = requests.post("http://quan064.pythonanywhere.com//generate_video", json=body).text
    print(new_url)
    return game_state["result"], game_state["move_counter"], new_url

if __name__ == "__main__":
    user_code = '''
def main(player):
    for x, y in player.your_pos:
        for mx, my in valid_move(x, y, player.board):
            return {"selected_pos": (x,y), "new_pos": (mx,my)}
'''

    break_rule_code = r'''
def break_rule(game_state, intervention,
    # Trạng thái lưu lại qua các lượt
    val_board = [["❄" for j in range(5)] for i in range(5)]
):
    if game_state["move_counter"] == 0:
        # Setup
        for y in range(5):
            for x in range(5):
                intervention().set_value(x, y, "❄")

    else:
        x, y = game_state["move"]["selected_pos"]
        # Vỡ băng khi di chuyển
        match val_board[y][x]:
            case "❄":
                val_board[y][x] = "🧊"
            case "🧊":
                val_board[y][x] = "💧"

        # Chết khi vỡ hết băng
        x, y = game_state["move"]["new_pos"]
        if val_board[y][x] == "💧":
            if game_state["board"][y][x] == 1:
                intervention().remove_blue(x, y)
            else:
                intervention().remove_red(x, y)

        # Cài đặt trạng thái
        for y in range(5):
            for x in range(5):
                intervention().set_value(x, y, val_board[y][x])
'''

    activation(user_code, break_rule_code, "1234")