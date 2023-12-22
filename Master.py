from game_manager import ganh, chet

def is_valid_move(current_pos, new_pos, input):
    current_x = current_pos[0]
    current_y = current_pos[1]
    new_x = new_pos[0]
    new_y = new_pos[1]
    board = input["board"]

    if not (0 <= current_x <= 4 and 0 <= current_y <= 4 and
            0 <= new_x     <= 4 and 0 <= new_y     <= 4 and
            board[new_y][new_x] == 0):
        return False
    else:
        dx = abs(new_x-current_x)
        dy = abs(new_y-current_y)
        if (current_x+current_y)%2==0:
            return (dx + dy == 1) or (dx * dy == 1)
        return (dx + dy == 1)

def main(input):

    your_pos = input["your_pos"]
    board = input["board"]
    your_pos = input["your_pos"]
    opp_pos = input["opp_pos"]
    opp_side = -input["your_side"]

    max_kill_count = -1

    movements = [(0,-1), (0,1), (1,0), (-1,0), (-1,1), (1,-1), (1,1), (-1,-1)]
    for pos in your_pos:
        for movement in movements:
            new_pos_x = pos[0] + movement[0]
            new_pos_y = pos[1] + movement[1]
            move = (new_pos_x, new_pos_y)
            if is_valid_move(pos, move, input):
                kill_count = len(ganh(move, board, opp_pos)) + len(chet(move, board, opp_pos, your_pos, opp_side))
                # Always kill if can
                if kill_count > max_kill_count:
                    max_kill_count = kill_count
                    selected_pos = pos
                    new_pos = move

    move = {"selected_pos": selected_pos, "new_pos": new_pos}
    return move