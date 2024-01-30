# Cờ gánh
## Giới thiệu
Đây là dự án AI tập sự của @Quan064 và @tuanvule
## Mục tiêu
Mục tiêu của chương trình là chiến thắng đối thủ robot_alpha1 trong một ván cờ Gánh bằng cách đưa ra nước đi tối ưu của mỗi lượt.
> [!WARNING]
> Ngôn ngữ lập trình: Python
## Luật chơi
https://www.youtube.com/watch?v=FU3auCFYGJc&t=2s
## Input
- *Player.your_pos*: vị trí tất cả quân cờ của bản thân
- *Player.opp_pos*: vị trí tất cả quân cờ của đối thủ
- *Player.your_side*: màu cờ của bản thân (-1:🔴 / 1:🔵)
- *Player.board*: bàn cờ (-1:🔴 / 1:🔵 / 0:∅)
### Khởi đầu ván đấu
```
Player.your_pos = [(0,2), (0,3), (4,3), (0,4), (1,4), (2,4), (3,4), (4,4)]
Player.opp_pos = [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)]
Player.your_side = 1
Player.board = [[-1, -1, -1, -1, -1],
                [-1,  0,  0,  0, -1],
                [ 1,  0,  0,  0, -1],
                [ 1,  0,  0,  0,  1],
                [ 1,  1,  1,  1,  1]]
```
Hoặc
```
Player.your_pos = [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)]
Player.opp_pos = [(0,2), (0,3), (4,3), (0,4), (1,4), (2,4), (3,4), (4,4)]
Player.your_side = -1
Player.board = [[-1, -1, -1, -1, -1],
                [-1,  0,  0,  0, -1],
                [ 1,  0,  0,  0, -1],
                [ 1,  0,  0,  0,  1],
                [ 1,  1,  1,  1,  1]]
```
## Output
A **Dick** of:
- *selected_pos*: vị trí của quân cờ được chọn
- *new_pos*: vị trí sau khi di chuyển của quân cờ đó
> {"selected_pos": (0, 0), "new_pos": (1, 0)}

> [!NOTE]
> Diễn biến ván đấu được cập nhật tại folder **static/upload_img**
## Cách submit
Run file main -> tạo tài khoản -> nộp file -> xong!
> [!TIP]
> Một cách tiện hơn để chạy thử là chỉnh sửa trực tiếp trên file **CGEngine.py** rồi run file **game_manager.py**
> - Di chuyển lượt bằng mũi tên trái phải trên bàn phím
> **Lưu ý:** phải tắt cửa sổ pop up bằng dấu X ở bên trong cửa sổ
## Code mẫu
```
import random

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

def main(player):

    while True:
        selected_pos = random.choice(player.your_pos)
        board = player.board
        new_pos_select = random_move(selected_pos)
        new_pos = (new_pos_select[0], new_pos_select[1])
        move = {"selected_pos": selected_pos, "new_pos": new_pos}
        if is_valid_move(move, player.your_side, board):
            return move

def random_move(position):
    movement = [(0, -1), (0, 1), (1, 0), (-1, 0), (-1, 1), (1, -1), (1, 1), (-1, -1)]  #possible moves
    movement_select = random.choice(movement)  #Randomize movement
    new_pos_x = position[0] + movement_select[1]
    new_pos_y = position[1] + movement_select[0]
    new_pos = (new_pos_x, new_pos_y)
    return new_pos
```
