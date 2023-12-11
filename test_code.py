import os
import random
import CGEngine

UserBot = None
UserBot2 = None

def activation(option="player", session_name="Quan064"):
    exec(f"import static.botfiles.botfile_{session_name} as UserBot", globals())
    if option == "bot":
        exec("UserBot2 = CGEngine")
    elif option == "player":
        player_file_list = [i[:-3] for i in os.listdir(r"static\botfiles") if i != '__pycache__']
        load_rand_player = random.choice(player_file_list)
        exec(f"import static.botfiles.{load_rand_player} as UserBot2", globals())
    print(UserBot2)

activation()