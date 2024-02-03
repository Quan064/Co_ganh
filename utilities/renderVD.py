import cv2
import os
import moviepy.editor as mpe

def condition(a):
    num = ""
    for i in range(10,13):
        if(a[i].isdigit()):
            num += a[i]
    return int(num)


def render():
    # biến đổi tập ảnh thành video
    image_folder = "static\\upload_img\\"
    video_path = "static\\upload_video\\"
    video_name = "video.mp4"
    result = "result.mp4"

    images = [img for img in os.listdir(image_folder)]
    images.sort(key=condition)

    frame = cv2.imread(os.path.join(image_folder, images[0]))
    height, width, layers = frame.shape

    video = cv2.VideoWriter(video_path + video_name, 0, 1, (width,height))

    for image in images:
        video.write(cv2.imread(os.path.join(image_folder, image)))

    video.release()

    # chèn nhạc vô video
    my_clip = mpe.VideoFileClip(video_path + video_name)
    audio_background = mpe.AudioFileClip('audio.mp3').set_duration(my_clip.duration)
    my_clip = my_clip.set_audio(audio_background)
    my_clip.write_videofile(video_path + result)
