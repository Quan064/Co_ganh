import random
import os
from PIL import Image, ImageDraw
from importlib.machinery import SourceFileLoader
import CGEngine

# ROW = y
# COLUMN = x
# ==> board[y][x] == board[ROW][COLUMN]

diag_pos = ((1,1), (1, 3), (3,1), (3,3), (2,2), (0,0), (4,4), (0,4), (4,0))
game_state = {"current_turn": 1,
              "board": [[-1, -1, -1, -1, -1],
                        [-1,  0,  0,  0, -1],
                        [ 1,  0,  0,  0, -1],
                        [ 1,  0,  0,  0,  1],
                        [ 1,  1,  1,  1,  1]]}
positions = [None,
             [(0,2), (0,3), (4,3), (0,4), (1,4), (2,4), (3,4), (4,4)],
             [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)]]
ganh_checked = [None, False, False]

# Board manipulation
def is_valid_move(move, current_side, board):
    current_x = move["selected_pos"][0]
    current_y = move["selected_pos"][1]
    new_x = move["new_pos"][0]
    new_y = move["new_pos"][1]

    dx = abs(new_x-current_x)
    dy = abs(new_y-current_y)
    if (current_x%1!=0 or current_y%1!=0 or new_x%1!=0 or new_y%1!=0 or # Checking if pos is integer
        current_x < 0 or current_x > 4 or current_y < 0 or current_y > 4 or # Checking if move is out of bounds
        new_x     < 0 or new_x     > 4 or new_y     < 0 or new_y     > 4 or
        board[new_y][new_x] != 0 or board[current_y][current_x] != current_side): # Checking if selected position and new position is legal
        return False
    elif move["selected_pos"] in diag_pos: # Checking if the piece has moved one position away
        return (dx + dy == 1) or (dx * dy == 1)
    return (dx + dy == 1)
def ganh(move, opp_side):
    global game_state, ganh_checked, positions

    valid_remove = []
    board = game_state["board"]

    if move in diag_pos:
        ganh_pair = (((1,0), (-1,0)), ((0,1), (0,-1)), ((1,1), (-1,-1)), ((-1,1), (1,-1)))
    else:
        ganh_pair = (((1,0), (-1,0)), ((0,1), (0,-1)))
    # Loops through each pair and conclude the opponent piece
    for pair in ganh_pair:
        remove_posx_1 = move[0] + pair[0][0]
        remove_posy_1 = move[1] + pair[0][1]
        remove_posx_2 = move[0] + pair[1][0]
        remove_posy_2 = move[1] + pair[1][1]
        if 0<=remove_posx_1<=4 and 0<=remove_posy_1<=4 and board[remove_posy_1][remove_posx_1]==opp_side and \
           0<=remove_posx_2<=4 and 0<=remove_posy_2<=4 and board[remove_posy_2][remove_posx_2]==opp_side:
            opp_remove = ((remove_posx_1, remove_posy_1), (remove_posx_2, remove_posy_2))
            valid_remove.extend(opp_remove)
            for x, y in opp_remove:
                board[y][x] = 0
                positions[opp_side].remove((x, y))
            ganh_checked[-opp_side] = True

    return valid_remove
def chet(move, side, opp_side):
    global game_state, ganh_checked, positions

    if ganh_checked[side]: # Must have at least 1 GANH to CHET

        valid_remove = []
        board = game_state["board"]

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
                board[removey][removex] = 0
                positions[opp_side].remove((removex, removey))

        # check VAY
        valid_move_pos = set()
        for pos in positions[opp_side]:
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
            for x, y in positions[opp_side]:
                valid_remove.append((x, y))
                board[y][x] = 0
            positions[opp_side] = []

        return valid_remove
    else:
        return []

# System
def activation(option, session_name):
    cwd = os.getcwd()
    current_user_file = f'botfile_{session_name}.py'
    UserBot = SourceFileLoader(current_user_file, os.path.join(cwd, f"static/botfiles/{current_user_file}")).load_module()
    if option == "bot":
        player2 = CGEngine
    elif option == "player":
        player_file_list = os.listdir(os.path.join(cwd, "static/botfiles"))
        load_rand_player = random.choice(player_file_list)

        pfile_name = load_rand_player.rsplit(".", 1)[0]
        if pfile_name == current_user_file:
            activation(option, session_name)
        else:
            UserBot2 = SourceFileLoader(pfile_name, f"static/botfiles/{load_rand_player}").load_module()
            player2 = UserBot2
    
    return run_game(UserBot, player2)
def run_game(UserBot, Bot2, trainAI=False): # Main
    global game_state, positions
    player1 = {"side": random.choice([-1,1]), "operator": UserBot}
    player2 = {"side": -player1["side"], "operator": Bot2}
    player1_info = {"your_pieces": positions[player1["side"]],
                    "your_side": player1["side"],
                    "oponent_position": positions[player2["side"]], 
                    "board": game_state["board"].copy()}
    player2_info = {"your_pieces": positions[player2["side"]], 
                    "your_side": player2["side"],
                    "oponent_position": positions[player1["side"]], 
                    "board": game_state["board"].copy()}
    winner = False
    move_counter = 1
    init_img(positions)

    while not winner:
    
        player1_info["board"] = game_state["board"].copy()
        player2_info["board"] = game_state["board"].copy()

        if player1["side"] == game_state["current_turn"]:
            move = player1["operator"].main(player1_info)
        elif player2["side"] == game_state["current_turn"]:
            move = player2["operator"].main(player2_info)

        if not is_valid_move(move, game_state["current_turn"], game_state["board"]):
            raise Exception(f"Invalid move {move_counter}")
        
        # Update move to board
        game_state["board"][move["new_pos"][1]][move["new_pos"][0]] = game_state["current_turn"]
        game_state["board"][move["selected_pos"][1]][move["selected_pos"][0]] = 0
        # Update move to positions
        positions[game_state["current_turn"]].remove((move["selected_pos"][0], move["selected_pos"][1]))
        positions[game_state["current_turn"]].append((move["new_pos"][0], move["new_pos"][1]))

        new_pos = move["new_pos"]
        ganh_remove = ganh(new_pos, -game_state["current_turn"])
        chet_remove = chet(new_pos, game_state["current_turn"], -game_state["current_turn"])

        generate_image(positions, move_counter, move, ganh_remove, chet_remove)

        if not positions[1]:
            winner = "Đỏ thắng"
        elif not positions[-1]:
            winner = "Xanh thắng"
        elif (len(positions[1]) + len(positions[-1]) < 4): # or move_counter == 200:
            winner = "Hòa"
        game_state["current_turn"] *= -1
        move_counter += 1

        if trainAI:
            trainAI(game_state["board"])

    return winner, move_counter-1
def trainAI(board):
    pass

def init_img(positions):
    image = Image.new("RGB", (600, 600), "WHITE")
    draw = ImageDraw.Draw(image)

    draw.line((100, 100, 500, 100), fill="black", width=3)
    draw.line((100, 200, 500, 200), fill="black", width=3)
    draw.line((100, 300, 500, 300), fill="black", width=3)
    draw.line((100, 400, 500, 400), fill="black", width=3)
    draw.line((100, 500, 500, 500), fill="black", width=3)
    draw.line((100, 100, 100, 500), fill="black", width=3)

    draw.line((200, 100, 200, 500), fill="black", width=3)
    draw.line((300, 100, 300, 500), fill="black", width=3)
    draw.line((400, 100, 400, 500), fill="black", width=3)
    draw.line((500, 100, 500, 500), fill="black", width=3)
    draw.line((100, 100, 500, 500), fill="black", width=3)
    draw.line((100, 500, 500, 100), fill="black", width=3)

    draw.line((100, 300, 300, 100), fill="black", width=3)
    draw.line((300, 100, 500, 300), fill="black", width=3)
    draw.line((500, 300, 300, 500), fill="black", width=3)
    draw.line((300, 500, 100, 300), fill="black", width=3)

    for x, y in positions[1]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="blue", outline="blue")
    for x, y in positions[-1]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="red", outline="red")

    image.save(os.getcwd()+"/static/upload_img/chessboard0.png", "PNG")
def generate_image(positions, move_counter, move, ganh_remove, chet_remove):

    image = Image.new("RGB", (600, 600), "WHITE")
    draw = ImageDraw.Draw(image)

    draw.line((100, 100, 500, 100), fill="black", width=3)
    draw.line((100, 200, 500, 200), fill="black", width=3)
    draw.line((100, 300, 500, 300), fill="black", width=3)
    draw.line((100, 400, 500, 400), fill="black", width=3)
    draw.line((100, 500, 500, 500), fill="black", width=3)
    draw.line((100, 100, 100, 500), fill="black", width=3)

    draw.line((200, 100, 200, 500), fill="black", width=3)
    draw.line((300, 100, 300, 500), fill="black", width=3)
    draw.line((400, 100, 400, 500), fill="black", width=3)
    draw.line((500, 100, 500, 500), fill="black", width=3)
    draw.line((100, 100, 500, 500), fill="black", width=3)
    draw.line((100, 500, 500, 100), fill="black", width=3)

    draw.line((100, 300, 300, 100), fill="black", width=3)
    draw.line((300, 100, 500, 300), fill="black", width=3)
    draw.line((500, 300, 300, 500), fill="black", width=3)
    draw.line((300, 500, 100, 300), fill="black", width=3)

    for x, y in ganh_remove:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill=None, outline="#FFC900", width=4)
    for x, y in chet_remove:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill=None, outline="#FFC900", width=4)
    for x, y in positions[1]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="blue", outline="blue")
    for x, y in positions[-1]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="red", outline="red")
    new_x = move["new_pos"][0]
    new_y = move["new_pos"][1]
    old_x = move["selected_pos"][0]
    old_y = move["selected_pos"][1]
    draw.ellipse((new_x*100+80, new_y*100+80, new_x*100+120, new_y*100+120), fill=("red", "blue")[move_counter%2], outline="green", width=5)
    draw.ellipse((old_x*100+80, old_y*100+80, old_x*100+120, old_y*100+120), fill=None, outline="green", width=5)

    image.save(os.getcwd()+f"/static/upload_img/chessboard{move_counter}.png", "PNG")

if __name__ == '__main__':
    from ursina import *
    app = Ursina(title="Cờ gánh", borderless=False)

    application.compressed_textures_folder = "static/upload_img"

    Master = SourceFileLoader("Master.py", os.path.join(os.getcwd(), "static/botfiles/Master.py")).load_module()
    winner, win_move_counter = run_game(Master, CGEngine, trainAi=True)

    chess_board = Sprite("chessboard0", scale=2.5)
    winner_txt = Text(winner, x=-.6, y=.48, scale=2, color=color.black)
    indexIMG = 0
    indexIMG_txt = Text("0", x=-.6, y=.43, scale=2, color=color.black)

    def input(key):
        global indexIMG

        if "arrow" in key:
            if key == "left arrow":
                indexIMG -= 1
            if key == "right arrow":
                indexIMG += 1

            if indexIMG < 0:
                indexIMG = win_move_counter
            elif indexIMG > win_move_counter:
                indexIMG = 0

            chess_board.texture = f"chessboard{indexIMG}"
            indexIMG_txt.text = str(indexIMG)

    window.size = (600,600)
    window.fps_counter.enabled = False
    window.entity_counter.enabled = False
    window.collider_counter.enabled = False

    app.run()