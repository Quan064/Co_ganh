# Cờ gánh
## Giới thiệu
Đây là dự án AI tập sự của @Quan064 và @tuanvule
## Mục tiêu
Mục tiêu của chương trình là chiến thắng đối thủ robot_alpha1 trong một ván cờ Gánh hoặc đạt hạng cao trong bảng xếp hạng bot bằng cách đưa ra nước đi tối ưu của mỗi lượt.
> [!WARNING]
> Ngôn ngữ lập trình: Python
## Luật chơi
https://www.youtube.com/watch?v=FU3auCFYGJc&t=2s
## Thư viện cần thiết
```
pip install Flask Flask-Bcrypt Flask-Login Flask-SQLAlchemy Flask-WTF WTForms pillow moviepy
```
## Input
- *Player.your_pos*: vị trí tất cả quân cờ của bản thân [(*x*, *y*), . . .]
- *Player.opp_pos*: vị trí tất cả quân cờ của đối thủ  [(*x*, *y*), . . .]
- *Player.your_side*: màu quân cờ của bản thân (1:🔵)
- *Player.board*: bàn cờ (-1:🔴 / 1:🔵 / 0:∅)
### Ràng buộc
- 0 ≤ *x*, *y* ≤ 4
- *Player.your_side* in (-1, 1)
- {j for i in *Player.board* for j in i} == {0, 1, -1}
### Khởi đầu ván đấu
Người chơi nhận quân cờ xanh
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
Người chơi nhận quân cờ đỏ
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
Một **Dick** của:
- *selected_pos*: vị trí của quân cờ được chọn
- *new_pos*: vị trí sau khi di chuyển của quân cờ đó
> {"selected_pos": (0, 0), "new_pos": (1, 0)}

> [!NOTE]
> Diễn biến ván đấu được cập nhật tại folder **static/upload_img**
## Cách chơi
> [!WARNING]
> Hiện không khả dụng!!! Vui lòng sử dụng cách **Chạy thử** bên dưới ⇩⇩⇩
1. Viết bot (cài đặt thư viện nếu chưa có!)
2. Run file main
3. Tạo tài khoản
4. vào create_bot và viết code tạo bot
5. Chọn Đấu với bot hệ thống (nút Run) và đợi
6. xem kết quả qua video
### Chạy thử
Một cách tiện hơn để chạy thử là chỉnh sửa trực tiếp trên file **CGEngine.py** rồi run file **game_manager.py**
> [!NOTE]
> Xem trận đấu tại **static/upload_video/result_(...).mp4**

[![Watch the video](https://img.youtube.com/vi/GsxwOXEXcoI/hqdefault.jpg)](https://youtu.be/GsxwOXEXcoI)

## Code mẫu
```
# Remember that board[y][x] is the tile at (x, y) when printing
    
def main(player):
    for x,y, in player.your_pos:
        move = ((0,-1),(0,1),(1,0),(-1,0)) 
        for mx, my in move:
            if 0 <= x+mx <=4 and 0 <= y+my <= 4 and player.board[y+my][x+mx] == 0: #check if new position is valid
                return {"selected_pos": (x,y), "new_pos": (x+mx, y+my)}

```
