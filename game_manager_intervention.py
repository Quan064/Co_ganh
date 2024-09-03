import requests
from copy import deepcopy
import traceback
from fdb.firestore_config import fdb
import sys
from io import StringIO
import builtins
from func_timeout import func_timeout
# from fdb.uti.upload import upload_video_to_storage

def _import(name, *args, **kwargs):
    if name in ('os','subprocess','pickle','marshal','ctypes','shutil','glob','socket','tempfile','urllib','main','index','game_manager','game_manager_debug','game_manager_debug copy','trainAI.Master','trainAI.MasterUser'):
        raise ValueError(f"Module '{name}' is blocked.")
    return __import__(name, *args, **kwargs)

class Player:
    your_pos = None
    opp_pos = None
    your_side = None
    board = None
    move_counter = 0
    global_var = None
class intervention():
    global game_state

    __res = []
    def view_command(self):
        return [i.copy() for i in self.__res]

    def remove_blue(self, x, y, trackOn=True):
        if game_state["board"][y][x] != 1: raise ValueError(f"There is no blue piece in ({x}, {y})")
        if  trackOn.__class__ != bool: raise ValueError(f"trackOn must be string (not {trackOn.__class__})")
        self.__res.append({"action":'remove_blue', "pos":(x, y), "trackOn":trackOn})
        game_state["board"][y][x] = 0
        game_state["positions"][1].remove((x, y))
        return game_state
    def remove_red(self, x, y, trackOn=True):
        if game_state["board"][y][x] != -1: raise ValueError(f"There is no red piece in ({x}, {y})")
        if  trackOn.__class__ != bool: raise ValueError(f"trackOn must be string (not {trackOn.__class__})")
        self.__res.append({"action":'remove_red', "pos" : (x, y), "trackOn":trackOn})
        game_state["board"][y][x] = 0
        game_state["positions"][-1].remove((x, y))
        return game_state

    def insert_blue(self, x, y, trackOn=True):
        if game_state["board"][y][x] != 0: raise ValueError(f"There already has a piece in ({x}, {y})")
        if  trackOn.__class__ != bool: raise ValueError(f"trackOn must be string (not {trackOn.__class__})")
        self.__res.append({"action":'insert_blue', "pos":(x, y), "trackOn":trackOn})
        game_state["board"][y][x] = 1
        game_state["positions"][1].append((x, y))
        remove = set( vay(game_state["positions"][-1]) )
        remove.update( ganh_chet((x, y), game_state["positions"][-1], 1, -1) )
        remove.update( vay(game_state["positions"][-1]) )
        for i in remove:
            self.remove_red(*i)
        return game_state
    def insert_red(self, x, y, trackOn=True):
        if game_state["board"][y][x] != 0: raise ValueError(f"There already has a piece in ({x}, {y})")
        if  trackOn.__class__ != bool: raise ValueError(f"trackOn must be string (not {trackOn.__class__})")
        self.__res.append({"action":'insert_red', "pos":(x, y), "trackOn":trackOn})
        game_state["board"][y][x] = -1
        game_state["positions"][-1].append((x, y))
        remove = set( vay(game_state["positions"][1]) )
        remove.update( ganh_chet((x, y), game_state["positions"][1], -1, 1) )
        remove.update( vay(game_state["positions"][1]) )
        for i in remove:
            self.remove_blue(*i)
        return game_state

    def blue_win(self):
        game_state["result"] = "win"
    def red_win(self):
        game_state["result"] = "lost"
    def draw(self):
        game_state["result"] = "draw"

    def set_value(self, x, y, value, size=20, fill=[255,255,255,255], stroke_width=1, stroke_fill=[0,0,0,255]):
        if value.__class__ != str: raise ValueError(f"value must be string (not {value.__class__})")
        if size.__class__ != int: raise ValueError(f"size must be int (not {size.__class__})")
        if fill.__class__ != list or len(fill) != 4: raise ValueError(f"fill must be list of [r, g, b, a]")
        if stroke_width.__class__ != int: raise ValueError(f"stroke_width must be int (not {stroke_width.__class__})")
        if stroke_fill.__class__ != list or len(stroke_fill) != 4: raise ValueError(f"stroke_fill must be list of [r, g, b, a]")
        self.__res.append({"action":'set_value', "pos":(x, y), "value":value, "size":size, "fill":fill, "stroke_width":stroke_width, "stroke_fill":stroke_fill})

    def action(self):
        if not game_state["result"]:
            if game_state["move_counter"] == 200 or (not game_state["positions"][1] and not game_state["positions"][-1]):
                game_state["result"] = "draw"
            elif not game_state["positions"][1]:
                game_state["result"] = "lost"
            elif not game_state["positions"][-1]:
                game_state["result"] = "win"
        self.__res.clear()

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
def activation(user_code, break_rule_code, master_code, name):
    f = StringIO()
    org_stdout = sys.stdout
    sys.stdout = f

    custom_builtins = builtins.__dict__.copy()
    custom_builtins['__import__'] = _import
    del custom_builtins['open']
    del custom_builtins['input']

    try:
        local = {'__builtins__': custom_builtins}
        local_break = {'__builtins__': custom_builtins}
        local_master = {'__builtins__': custom_builtins}
        exec(user_code, local, local)
        exec(break_rule_code, local_break, local_break)
        exec(master_code, local_master, local_master)
        game_res = run_game(local_master["main"], local["main"], local_break["break_rule"], name)

        sys.stdout = org_stdout
        return False, game_res, f.getvalue()
    except:
        print(traceback.format_exc())
        sys.stdout = org_stdout
        return True, None, f.getvalue()
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
    player1.global_var = player2.global_var = global_var = {}
    
    func_timeout(8, break_rule, args=(deepcopy(game_state), intervention, global_var))
    body = {
        "username": session_name,
        "img": [],
        "setup": intervention().view_command()
    }
    intervention().action()

    while not game_state["result"]:

        game_state["move_counter"] += 1
        print(f"__________{game_state['move_counter']}__________")

        if player1.your_side == game_state["current_turn"]:
            player1.move_counter = game_state["move_counter"]
            game_state["move"] = func_timeout(8, UserBot, args=(deepcopy(player1),))
        else:
            player2.move_counter = game_state["move_counter"]
            game_state["move"] = func_timeout(8, Bot, args=(deepcopy(player2),))
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
        remove = set( vay(opp_pos) )
        remove.update( ganh_chet(move_new_pos, opp_pos, game_state["current_turn"], -game_state["current_turn"]) )
        remove.update( vay(opp_pos) )
        for i in remove:
            if game_state["current_turn"]==1:
                intervention().remove_red(*i)
            else:
                intervention().remove_blue(*i)

        if game_state["move_counter"] == 200 or (not game_state["positions"][1] and not game_state["positions"][-1]):
            game_state["result"] = "draw"
        elif not game_state["positions"][1]:
            game_state["result"] = "lost"
        elif not game_state["positions"][-1]:
            game_state["result"] = "win"

        func_timeout(8, break_rule, args=(deepcopy(game_state), intervention, global_var))
        body["img"].append([*move_selected_pos, *move_new_pos, intervention().view_command()])
        intervention().action()

        game_state["current_turn"] *= -1

    new_url = requests.post("http://quan064.pythonanywhere.com//generate_video", json=body).text
    return game_state["result"], game_state["move_counter"], new_url