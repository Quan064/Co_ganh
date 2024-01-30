# Cờ gánh
## Mục tiêu
Mục tiêu của chương trình là chiến thắng đối thủ robot_alpha1 trong một ván cờ Gánh.
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
A 