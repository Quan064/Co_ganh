# def main(board, your_pos, opp_pos, move):
#     for pos in opp_pos:
#         if (pos[0]+pos[1])%2==0:
#             move_list = ((1,0), (-1,0), (0,1), (0,-1), (1,1), (-1,-1), (-1,1), (1,-1))
#         else:
#             move_list = ((1,0), (-1,0), (0,1), (0,-1))
#         for move in move_list:
#             new_valid_x = pos[0] + move[0]
#             new_valid_y = pos[1] + move[1]
#             if 0<=new_valid_x<=4 and 0<=new_valid_y<=4 and board[new_valid_y][new_valid_x] == 0:
#                 return False
#     return True

# print(main(
#     *[[[ 0,  0,  0,  0,  0],
#   [ 0,  0,  0,  0,  0],
#   [ 1,  0,  0, 0,  0],
#   [ -1,  1,  0,  0,  0],
#   [ -1,  -1,  1, 0,  0]],
# [(0, 2), (1, 3), (2, 4)],
# [(0, 3), (0, 4), (1, 4)],
# (3, 3)]
# ))

print(bin(33063936))
11111
10001
00001
00000
00000
# 0 0 0 1 0
# 0 0 0 1 0
# 0 0 0 0 0
# 0 0 1 1 0
#-1 0 0 0 0

# with open("trainAI/source_code/bit_board.txt") as f:
#     for i in  f.read().split("\n"):
#         try:
#             i.split('  ')[1].split(' ')[3]
#         except: print(i)