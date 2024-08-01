from flask import Flask, request, jsonify
import moviepy.editor as mpe
from PIL import Image, ImageDraw, ImageFont
import numpy as np
import os
from fdb.uti.upload import upload_file, upload_files
import asyncio
from datetime import datetime

app = Flask(__name__)
absolute_path = os.getcwd()


def init():
    global font, rect, red_piece, blue_piece, piece_layer, move_tracker, blue_remove_tracker, red_remove_tracker, bad, brilliant, good, ordinary

    rect = Image.new('RGBA', (41, 41), (0, 0, 0, 0))
    red_piece = Image.new('RGBA', (41, 41), (0, 0, 0, 0))
    blue_piece = Image.new('RGBA', (41, 41), (0, 0, 0, 0))
    piece_layer = Image.new('RGBA', (600, 600), (0, 0, 0, 0))
    fire = Image.open(absolute_path + "/mysite/fire.png")

    move_tracker = Image.new('RGBA', (41, 41), (0, 0, 0, 0))
    draw = ImageDraw.Draw(red_piece)
    draw.ellipse((0, 0, 40, 40), fill="red", outline="red")
    draw = ImageDraw.Draw(blue_piece)
    draw.ellipse((0, 0, 40, 40), fill="blue", outline="blue")
    draw = ImageDraw.Draw(move_tracker)
    draw.ellipse((0, 0, 40, 40), fill=None, outline="green", width=5)
    blue_remove_tracker = Image.alpha_composite(blue_piece, fire)
    red_remove_tracker = Image.alpha_composite(red_piece, fire)

    brilliant = Image.new('RGBA', (43, 51), (0, 0, 0, 0))
    good = Image.new('RGBA', (43, 51), (0, 0, 0, 0))
    ordinary = Image.new('RGBA', (43, 51), (0, 0, 0, 0))
    bad = Image.new('RGBA', (43, 51), (0, 0, 0, 0))

    draw = ImageDraw.Draw(brilliant)
    draw.ellipse((0, 10, 40, 50), fill=None, outline="green", width=5)
    draw.ellipse((22, 0, 42, 20), fill="#2DC4A6")
    draw.line((35, 3, 35, 12), fill="white", width=3)
    draw.ellipse((33, 15, 36, 18), fill="white")
    draw.line((29, 3, 29, 12), fill="white", width=3)
    draw.ellipse((28, 15, 31, 18.5), fill="white")
    draw = ImageDraw.Draw(good)
    draw.ellipse((0, 10, 40, 50), fill=None, outline="green", width=5)
    draw.ellipse((22, 0, 42, 20), fill="#00B400")
    draw.line((27, 11, 32, 16), fill="white", width=3)
    draw.line((32, 16, 39, 7), fill="white", width=3)
    draw = ImageDraw.Draw(ordinary)
    draw.ellipse((0, 10, 40, 50), fill=None, outline="green", width=5)
    draw.ellipse((22, 0, 42, 20), fill="#bbb")
    draw.line((25, 10, 39, 10), fill="white", width=4)
    draw = ImageDraw.Draw(bad)
    draw.ellipse((0, 10, 40, 50), fill=None, outline="green", width=5)
    draw.ellipse((22, 0, 42, 20), fill="red", width=5)
    draw.line((27, 5, 37, 15), fill="white", width=3)
    draw.line((37, 5, 27, 15), fill="white", width=3)

    for x, y in ((0,2), (0,3), (4,3), (0,4), (1,4), (2,4), (3,4), (4,4)):
        piece_layer.paste(blue_piece, (x*100+80, y*100+80), blue_piece)
    for x, y in ((0,0), (1,0), (2,0), (3,0), (4,0), (0,1), (4,1), (4,2)):
        piece_layer.paste(red_piece, (x*100+80, y*100+80), red_piece)

    font = ImageFont.truetype(absolute_path + "/mysite/seguiemj.ttf", size=20)

def generate_image(redTurn, selected_x, selected_y, new_x, new_y, intervention, rate=""):
    move_layer = Image.new('RGBA', (600, 600), (0, 0, 0, 0))

    piece_layer.paste(rect, (selected_x*100+80, selected_y*100+80))
    if redTurn:
        piece_layer.paste(red_piece, (new_x*100+80, new_y*100+80))
    else:
        piece_layer.paste(blue_piece, (new_x*100+80, new_y*100+80))

    move_layer.paste(move_tracker, (selected_x*100+80, selected_y*100+80))
    move_layer.paste(move_tracker, (new_x*100+80, new_y*100+80))

    if rate == "Tốt nhất":
        move_layer.paste(brilliant, (new_x*100+80, new_y*100+70))
    elif rate == "Tốt":
        move_layer.paste(good, (new_x*100+80, new_y*100+70))
    elif rate == "Tệ":
        move_layer.paste(bad, (new_x*100+80, new_y*100+70))
    elif rate == "Bình thường":
        move_layer.paste(ordinary, (new_x*100+80, new_y*100+70))

    for key, action in intervention.items():
        key = key.split(",", 3)
        key[0] = int(key[0])
        key[1] = int(key[1])
        match action:
            case "remove_blue":
                piece_layer.paste(rect, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(blue_remove_tracker, (key[0]*100+80, key[1]*100+80))

            case "remove_red":
                piece_layer.paste(rect, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(red_remove_tracker, (key[0]*100+80, key[1]*100+80))

            case "insert_blue":
                piece_layer.paste(blue_piece, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(move_tracker, (key[0]*100+80, key[1]*100+80))

            case "insert_red":
                piece_layer.paste(red_piece, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(move_tracker, (key[0]*100+80, key[1]*100+80))

            case "set_value":
                draw = ImageDraw.Draw(move_layer)
                text_bbox = draw.textbbox((0, 0), key[2], font=font)

                x = key[0]*100+100 - (text_bbox[2] - text_bbox[0]) / 2
                y = key[1]*100+100 - (text_bbox[3] - text_bbox[1]) / 2

                draw.text((round(x), round(y)), key[2], font=font, embedded_color=True, stroke_width=1, stroke_fill="black")

    return move_layer


@app.route("/generate_debug_image", methods=['POST'])
def generate_debug_image():

    data = request.get_json()
    duration = len(data["img"])

    init()

    board_layer = Image.new("RGBA", (600, 600), "WHITE")
    draw = ImageDraw.Draw(board_layer)
    for i in ((100,100,500,100),(100,200,500,200),(100,300,500,300),(100,400,500,400),(100,500,500,500),(100,100,100,500),(200,100,200,500),(300,100,300,500),(400,100,400,500),(500,100,500,500),(100,100,500,500),(100,500,500,100),(100,300,300,100),(300,100,500,300),(500,300,300,500),(300,500,100,300)):
        draw.line(i, fill="black", width=3)

    move_layer = Image.new('RGBA', (600, 600), (0, 0, 0, 0))
    for key, action in data["setup"].items():
        key = key.split(",", 3)
        key[0] = int(key[0])
        key[1] = int(key[1])
        match action:
            case "remove_blue":
                piece_layer.paste(rect, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(blue_remove_tracker, (key[0]*100+80, key[1]*100+80))
            case "remove_red":
                piece_layer.paste(rect, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(red_remove_tracker, (key[0]*100+80, key[1]*100+80))
            case "insert_blue":
                piece_layer.paste(blue_piece, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(move_tracker, (key[0]*100+80, key[1]*100+80))
            case "insert_red":
                piece_layer.paste(red_piece, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(move_tracker, (key[0]*100+80, key[1]*100+80))
            case "set_value":
                draw = ImageDraw.Draw(move_layer)
                text_bbox = draw.textbbox((0, 0), key[2], font=font)
                x = key[0]*100+100 - (text_bbox[2] - text_bbox[0]) / 2
                y = key[1]*100+100 - (text_bbox[3] - text_bbox[1]) / 2
                draw.text((round(x), round(y)), key[2], font=font, embedded_color=True, stroke_width=1, stroke_fill="black")

    Image.alpha_composite(Image.alpha_composite(board_layer, piece_layer), move_layer).save(absolute_path + f"/mysite/img/chessboard_1_{data['username']}.png", "PNG")
    date = datetime.now().strftime("%H%M%S")
    files = [(absolute_path + f"/mysite/img/chessboard_1_{data['username']}.png", f"imgs/img_1_{data['username']}_{date}.png")]
    board = [16959, 33064511]
    cache = {(16959, 33064511, str(data["setup"])):(absolute_path + f"/mysite/img/chessboard_1_{data['username']}.png", f"imgs/img_1_{data['username']}_{date}.png")}

    for i in range(duration):
        board[i%2] = board[i%2]^(1<<24-5*data["img"][i][1]-data["img"][i][0])|(1<<24-5*data["img"][i][3]-data["img"][i][2])
        for key, action in data["img"][i][4].items():
            key = key.split(",", 3)
            key[0] = int(key[0])
            key[1] = int(key[1])
            match action:
                case "remove_blue":
                    board[0] ^= 1<<24-5*key[1]-key[0]
                case "remove_red":
                    board[1] ^= 1<<24-5*key[1]-key[0]
                case "insert_blue":
                    board[0] |= 1<<24-5*key[1]-key[0]
                case "insert_red":
                    board[1] |= 1<<24-5*key[1]-key[0]

        move_layer = generate_image(i%2, *data["img"][i])
        if (tup_board := (*tuple(board), str(data["img"][i][4]))) in cache:
            files.append(cache[tup_board])
        else:
            Image.alpha_composite(Image.alpha_composite(board_layer, piece_layer), move_layer).save(absolute_path + f"/mysite/img/chessboard_{i+2}_{data['username']}.png", "PNG")
            date = datetime.now().strftime("%H%M%S")
            files.append((absolute_path + f"/mysite/img/chessboard_{i+2}_{data['username']}.png", f"imgs/img_{i+2}_{data['username']}_{date}.png"))
            cache[tup_board] = (absolute_path + f"/mysite/img/chessboard_{i+2}_{data['username']}.png", f"imgs/img_{i+2}_{data['username']}_{date}.png")

    img_url = asyncio.run(upload_files(files))
    for i in cache.values(): os.remove(i[0])
    return jsonify(img_url)

@app.route("/generate_video", methods=['POST'])
def generate_video():

    data = request.get_json()

    init()

    board_layer = Image.new("RGBA", (600, 600), "WHITE")
    draw = ImageDraw.Draw(board_layer)
    for i in ((100,100,500,100),(100,200,500,200),(100,300,500,300),(100,400,500,400),(100,500,500,500),(100,100,100,500),(200,100,200,500),(300,100,300,500),(400,100,400,500),(500,100,500,500),(100,100,500,500),(100,500,500,100),(100,300,300,100),(300,100,500,300),(500,300,300,500),(300,500,100,300)):
        draw.line(i, fill="black", width=3)

    move_layer = Image.new('RGBA', (600, 600), (0, 0, 0, 0))
    for key, action in data["setup"].items():
        key = key.split(",", 3)
        key[0] = int(key[0])
        key[1] = int(key[1])
        match action:
            case "remove_blue":
                piece_layer.paste(rect, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(blue_remove_tracker, (key[0]*100+80, key[1]*100+80))
            case "remove_red":
                piece_layer.paste(rect, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(red_remove_tracker, (key[0]*100+80, key[1]*100+80))
            case "insert_blue":
                piece_layer.paste(blue_piece, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(move_tracker, (key[0]*100+80, key[1]*100+80))
            case "insert_red":
                piece_layer.paste(red_piece, (key[0]*100+80, key[1]*100+80))
                move_layer.paste(move_tracker, (key[0]*100+80, key[1]*100+80))
            case "set_value":
                draw = ImageDraw.Draw(move_layer)
                text_bbox = draw.textbbox((0, 0), key[2], font=font)
                x = key[0]*100+100 - (text_bbox[2] - text_bbox[0]) / 2
                y = key[1]*100+100 - (text_bbox[3] - text_bbox[1]) / 2
                draw.text((round(x), round(y)), key[2], font=font, embedded_color=True, stroke_width=1, stroke_fill="black")

    combined = Image.alpha_composite(Image.alpha_composite(board_layer, piece_layer), move_layer)
    video = [ mpe.ImageClip(np.array(combined)).set_duration(1) ]

    for i in range(len(data["img"])):
        move_layer = generate_image(i%2, *data["img"][i])
        combined = Image.alpha_composite(board_layer, piece_layer)
        combined = Image.alpha_composite(combined, move_layer)
        video.append( mpe.ImageClip(np.array(combined)).set_duration(1) )

    video = mpe.concatenate_videoclips(video)

    audio_background = mpe.AudioFileClip(absolute_path + '/mysite/audio.mp3').set_duration(i+2)
    video.set_audio(audio_background)
    video.write_videofile(absolute_path + "/mysite/result.mp4", 1)
    video.close()

    date = datetime.now().strftime("%H%M%S")
    url = upload_file(absolute_path + "/mysite/result.mp4", f"videos/video_{data['username']}_{date}.mp4")
    os.remove(absolute_path + "/mysite/result.mp4")
    return url