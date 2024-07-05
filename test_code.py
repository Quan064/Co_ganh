import random

while True:
    board = [[random.randint(-1, 1) for j in range(5)] for i in range(5)]
    your_pos = [(x, y) for y in range(5) for x in range(5) if board[y][x] == 1]
    opp_pos = [(x, y) for y in range(5) for x in range(5) if board[y][x] == -1]

    loop = False
    for move in your_pos:
        for x0, y0 in opp_pos:
            dx, dy = x0-move[0], y0-move[1]
            if -1<=dx<=1 and -1<=dy<=1 and (0 in (dx,dy) or (move[0]+move[1])%2==0):
                if ((0<=move[0]-dx<=4 and 0<=move[1]-dy<=4 and board[move[1]-dy][move[0]-dx] == -1) or #ganh
                    (0<=x0+dx<=4 and 0<=y0+dy<=4 and board[y0+dy][x0+dx] == 1)): # chet
                    loop = True

    if loop: continue

    if len(your_pos) <= 8 and len(opp_pos) <= 8:
        break

print(str(board).replace("],", "],\n"))
print(your_pos)
print(opp_pos)