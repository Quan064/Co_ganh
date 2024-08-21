import random
from tool import valid_move

def main(player):
    while True:
        try:
            selected_pos = x, y = random.choice(player.your_pos)
            new_pos = random.choice(valid_move(x, y, player.board))
            return {"selected_pos": selected_pos, "new_pos": new_pos}
        except: pass