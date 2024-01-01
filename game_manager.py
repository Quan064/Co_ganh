import random
import os
from PIL import Image, ImageDraw
from copy import deepcopy

# ROW = y
# COLUMN = x
# ==> board[y][x] == board[ROW][COLUMN]

def declare():
    global game_state, positions, static_image, point

    game_state = {"current_turn": 1,
                  "board": [[-1, -1, -1, -1, -1],
                            [-1,  0,  0,  0, -1],
                            [ 1,  0,  0,  0, -1],
                            [ 1,  0,  0,  0,  1],
                            [ 1,  1,  1,  1,  1]]}
    positions = [None,
                [(0,2), (0,3), (4,3), (0,4), (1,4), (2,4), (3,4), (4,4)],
                [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)]]

    # Initialization board
    static_image = Image.new("RGB", (600, 600), "WHITE")
    draw = ImageDraw.Draw(static_image)

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

    point = []
# Board manipulation
def is_valid_move(move, current_side, board):
    current_x = move["selected_pos"][0]
    current_y = move["selected_pos"][1]
    new_x = move["new_pos"][0]
    new_y = move["new_pos"][1]

    if (current_x%1==0 and current_y%1==0 and new_x%1==0 and new_y%1==0 and # Checking if pos is integer
        0 <= current_x <= 4 and 0 <= current_y <= 4 and # Checking if move is out of bounds
        0 <= new_x     <= 4 and 0 <= new_y     <= 4 and
        board[new_y][new_x] == 0 and board[current_y][current_x] == current_side): # Checking if selected position and new position is legal
        dx = abs(new_x-current_x)
        dy = abs(new_y-current_y)
        if (dx + dy == 1): return True # Checking if the piece has moved one position away
        return (current_x+current_y)%2==0 and (dx * dy == 1)
    return False

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

    for x, y in valid_remove:
        board[y][x] = 0
        opp_pos.remove((x, y))

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

    valid_remove = opp_pos.copy()
    for x, y in opp_pos: board[y][x] = 0
    opp_pos[:] = []
    return valid_remove

# System
def activation(option, session_name):
    UserBot = __import__("static.botfiles.botfile_"+session_name, fromlist=[None])
    if option == "bot":
        Bot2 = __import__("CGEngine")
    elif option == "player":
        player_file_list = [i for i in os.listdir(r"static\botfiles") if i != '__pycache__']
        load_rand_player = random.choice(player_file_list)
        Bot2 = __import__("static.botfiles."+load_rand_player[:-3], fromlist=[None])

    return run_game(UserBot, Bot2)
def run_game(UserBot, Bot2): # Main
    declare()

    player1 = {"side": random.choice([-1,1]), "operator": UserBot}
    player2 = {"side": -player1["side"], "operator": Bot2}
    winner = False
    move_counter = 1

    init_img(positions)

    player1_info = {"your_pos": positions[player1["side"]],
                    "your_side": player1["side"],
                    "opp_pos": positions[player2["side"]],
                    "board": game_state["board"]}
    player2_info = {"your_pos": positions[player2["side"]],
                    "your_side": player2["side"],
                    "opp_pos": positions[player1["side"]], 
                    "board": game_state["board"]}

    while not winner:

        filled = round(move_counter/10)
        print(f"\rLoading |{'█'*filled}{'-'*(50-filled)}|{move_counter//5}% Complete", end='')

        current_turn = game_state["current_turn"]
        if player1["side"] == current_turn:
            move = player1["operator"].main(deepcopy(player1_info))
        else:
            move = player2["operator"].main(deepcopy(player2_info))

        move_new_pos = move["new_pos"]
        move_selected_pos = move["selected_pos"]

        if not is_valid_move(move, current_turn, game_state["board"]):
            raise Exception(f"Invalid move {move_counter} | {move}")
        
        # Update move to board
        game_state["board"][move_new_pos[1]][move_new_pos[0]] = current_turn
        game_state["board"][move_selected_pos[1]][move_selected_pos[0]] = 0
        # Update move to positions
        index_move = positions[current_turn].index(move_selected_pos)
        positions[current_turn][index_move] = move_new_pos

        opp_pos = positions[-current_turn]
        remove = ganh_chet(move_new_pos, opp_pos, current_turn, -current_turn)
        remove += vay(opp_pos)
        if remove: point[:] += [move_selected_pos]*len(remove)

        generate_image(positions, move_counter, move, remove)

        if not positions[1]:
            winner = "Người chơi " + (None, "thua ", "thắng ")[player1["side"]] + (None, "(Xanh)", "(Đỏ)")[player1["side"]]
        elif not positions[-1]:
            winner = "Người chơi " + (None, "thắng", "thua")[player1["side"]] + (None, "(Xanh)", "(Đỏ)")[player1["side"]]
        elif (len(positions[1]) + len(positions[-1]) < 4) or move_counter == 500:
            winner = "Hòa " + (None, "(Xanh)", "(Đỏ)")[player1["side"]]
        game_state["current_turn"] *= -1
        move_counter += 1

    return winner, move_counter-1

def init_img(positions):
    image = static_image.copy()
    draw = ImageDraw.Draw(image)

    for x, y in positions[1]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="blue", outline="blue")
    for x, y in positions[-1]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="red", outline="red")
        
    image.save(os.getcwd()+"/static/upload_img/chessboard0.png", "PNG")
def generate_image(positions, move_counter, move, remove):
    image = static_image.copy()
    draw = ImageDraw.Draw(image)

    for x, y in remove:
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
    import trainAI.Master as Master, CGEngine

    winner, win_move_counter = run_game(Master, CGEngine)
    print(f"\rLoading |{'█'*50}|100% Complete")

    app = Ursina(title="Cờ gánh", borderless=False)

    application.compressed_textures_folder = "static/upload_img"

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

    def end_():
        images = os.listdir("static\\upload_img\\")
        for file in images:
            os.remove("static\\upload_img\\"+file)

        with open("trainAI\source_code\pos_point.txt") as f:
            max_pointF = int(f.readline()[:-1])
            board_pointF = eval(f.read())
            for x, y in point:
                board_pointF[y][x] += 1
                max_pointF = max(max_pointF, board_pointF[y][x])
        with open("trainAI\source_code\pos_point.txt", "w") as f:
            f.write(str(max_pointF)+"\n")
            f.write(str(board_pointF).replace("], [", "],\n["))

        return application.quit()

    window.size = (600,600)
    window.fps_counter.enabled = False
    window.entity_counter.enabled = False
    window.collider_counter.enabled = False
    window.exit_button.on_click = end_

    app.run()