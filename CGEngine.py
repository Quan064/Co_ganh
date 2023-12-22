
import random

# Remember that board[y][x] is the tile at (x, y) when printing
    
def is_valid_move(move, side, board):
    current_x = move["selected_pos"][0]
    current_y = move["selected_pos"][1]
    new_x = move["new_pos"][0]
    new_y = move["new_pos"][1]

    dx = abs(new_x-current_x)
    dy = abs(new_y-current_y)
    if (current_x%1!=0 or current_y%1!=0 or new_x%1!=0 or new_y%1!=0 or # Checking if pos is integer
        current_x < 0 or current_x > 4 or current_y < 0 or current_y > 4 or # Checking if move is out of bounds
        new_x     < 0 or new_x     > 4 or new_y     < 0 or new_y     > 4 or
        board[new_y][new_x] != 0 or board[current_y][current_x] != side): # Checking if selected position and new position is legal
        return False
    elif (current_y, current_x) in ((1,1), (1, 3), (3,1), (3,3), (2,2), (0,0), (4,4), (0,4), (4,0)): # Checking if the piece has moved one position away (Using the Manhattan distance formula)
        return (dx + dy == 1) or (dx * dy == 1)
    return (dx + dy == 1)
    

def main(input):

    # {'your_pos': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'your_side': -1,
    #  'opp_pos': [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)],
    #  'board': [[-1,-1, 0,-1, 0],
    #            [ 0,-1,-1,-1, 0],
    #            [-1, 0, 0,-1, 1],
    #            [ 0, 1, 1, 1, 1],
    #            [ 1, 1, 0, 1, 0]]}

    while True:
        selected_pos = random.choice(input["your_pos"])
        board = input["board"]
        new_pos_select = random_move(selected_pos)
        new_pos = (new_pos_select[0], new_pos_select[1])
        move = {"selected_pos": selected_pos, "new_pos": new_pos}
        if is_valid_move(move, input["your_side"], board):
            return move

            

# Function of the game manager
def random_move(position):
    movement = [(0, -1), (0, 1), (1, 0), (-1, 0), (-1, 1), (1, -1), (1, 1), (-1, -1)]  #possible moves
    movement_select = random.choice(movement)  #Randomize movement
    new_pos_x = position[0] + movement_select[1]
    new_pos_y = position[1] + movement_select[0]
    new_pos = (new_pos_x, new_pos_y)
    return new_pos

