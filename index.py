from flask import Flask, request
import moviepy.editor as mpe
from PIL import Image, ImageDraw
import numpy as np
import os
import fdb.firestore_config
from fdb.uti.upload import upload_video_to_storage
import webbrowser
import time
# import cv2

app = Flask(__name__)

absolute_path = os.getcwd()


def declare(side):
    global positions, point, frame, video, img_url

    positions = [None,
                [(0,2), (0,3), (4,3), (0,4), (1,4), (2,4), (3,4), (4,4)],
                [(0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)]]

    point = []

    frame = Image.open(absolute_path + "/mysite/chessboard.png")
    frame_cop = frame.copy()
    draw = ImageDraw.Draw(frame_cop)

    for x, y in positions[side]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="blue", outline="blue")
    for x, y in positions[-side]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="red", outline="red")

    frame_cop = np.array(frame_cop)
    video = [mpe.ImageClip(frame_cop).set_duration(1)]
    img_url = []

def generate_image(positions, move, remove, username, isDebug, debugTurn, rate, side): #tạo ảnh / video
    frame_cop = frame.copy()
    draw = ImageDraw.Draw(frame_cop)

    for x, y in remove:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill=None, outline="#FFC900", width=4)
    for x, y in positions[side]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="blue", outline="blue")
    for x, y in positions[-side]:
        draw.ellipse((x*100+80, y*100+80, x*100+120, y*100+120), fill="red", outline="red")
    new_x = move["new_pos"][0]
    new_y = move["new_pos"][1]
    old_x = move["selected_pos"][0]
    old_y = move["selected_pos"][1]
    draw.ellipse((new_x*100+80, new_y*100+80, new_x*100+120, new_y*100+120), fill=None, outline="green", width=5)
    draw.ellipse((old_x*100+80, old_y*100+80, old_x*100+120, old_y*100+120), fill=None, outline="green", width=5)

    if rate != "":
        if rate == "Tốt nhất":
            draw.ellipse((new_x*100+102, new_y*100+70, new_x*100+122, new_y*100+90), fill="#2DC4A6")
            draw.line((new_x*100+102+13, new_y*100+73, new_x*100+102+13, new_y*100+82), fill="white", width=3)
            draw.ellipse((new_x*100+102+11, new_y*100+85, new_x*100+102+14, new_y*100+88), fill="white")
            draw.line((new_x*100+102+7, new_y*100+73, new_x*100+102+7, new_y*100+82), fill="white", width=3)
            draw.ellipse((new_x*100+102+6, new_y*100+85, new_x*100+102+9, new_y*100+88.5), fill="white")
        elif rate == "Tốt":
            draw.ellipse((new_x*100+102, new_y*100+70, new_x*100+122, new_y*100+90), fill="#00B400")
            draw.line((new_x*100+102+5, new_y*100+70+11, new_x*100+112, new_y*100+86), fill="white", width=3)
            draw.line((new_x*100+112, new_y*100+86, new_x*100+112+7, new_y*100+77), fill="white", width=3)
        elif rate == "Tệ":
            draw.ellipse((new_x*100+102, new_y*100+70, new_x*100+122, new_y*100+90), fill="red", width=5)
            draw.line((new_x*100+107, new_y*100+75, new_x*100+117, new_y*100+85), fill="white", width=3)
            draw.line((new_x*100+117, new_y*100+75, new_x*100+107, new_y*100+85), fill="white", width=3)
        elif rate == "Bình thường":
            draw.ellipse((new_x*100+102, new_y*100+70, new_x*100+122, new_y*100+90), fill="#bbb")
            draw.line((new_x*100+102+3, new_y*100+70+10, new_x*100+122-3, new_y*100+90-10), fill="white", width=4)

    if isDebug:
        frame_cop.save(absolute_path + f"/mysite/img/chessboard_{debugTurn}_{username}.png", "PNG")
        url = upload_video_to_storage(absolute_path + f"/mysite/img/chessboard_{debugTurn}_{username}.png", f"imgs/img_{debugTurn}_{username}.png")
        img_url.append(url)
    else:
        frame_cop = np.array(frame_cop)
        video.append(mpe.ImageClip(frame_cop).set_duration(1))

def home():
    return 'Hello, World!'

@app.route("/generate_debug_image", methods=['POST'])
def generate_debug_image():
    data = request.get_json()
    if "side" in data:
        declare(data["side"])
    else:
        declare(1)
        data["side"] = 1
    debug_turn = 1
    img_url.clear()
    for [positions, move, remove, rate] in data["img"]:
        generate_image(positions, move, remove, data['username'], True, debug_turn, rate, data["side"])
        debug_turn += 1
    return img_url

@app.route("/generate_video", methods=['POST'])
def generate_video():
    data = request.get_json()
    declare(1)
    for [positions, move, remove] in data["img"]:
        generate_image(positions, move, remove, data['username'], False, 0, "", 1)

    concat_video = mpe.concatenate_videoclips(video, method="compose")

    audio_background = mpe.AudioFileClip(absolute_path + '/mysite/audio.mp3').set_duration(concat_video.duration)
    my_clip = concat_video.set_audio(audio_background)
    my_clip.write_videofile(absolute_path + "/mysite/result.mp4", 1)
    my_clip.close()

    url = upload_video_to_storage(absolute_path + "/mysite/result.mp4", f"videos/video_{data['username']}.mp4")
    video.clear()
    return url

@app.route('/about')
def about():
    return 'About'

