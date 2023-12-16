from PIL import Image, ImageDraw

image = Image.new("RGB", (600, 600), "WHITE")
draw = ImageDraw.Draw(image)

draw.line((100, 100, 500, 100), fill="black", width=3)
draw.line((100, 200, 500, 200), fill="black", width=3)
draw.line((100, 300, 500, 300), fill="black", width=3)
draw.line((100, 400, 500, 400), fill="black", width=3)
draw.line((100, 500, 500, 500), fill="black", width=3)
draw.line((100, 100, 100, 500), fill="black", width=3)

draw.line((200, 100, 200, 500), fill="black", width=3)
draw.line((300, 100, 300, 500), fill="black", width=3)
draw.line((400, 100, 400, 500), fill="black", width=3)
draw.line((500, 100, 500, 500), fill="black", width=3)
draw.line((100, 100, 500, 500), fill="black", width=3)
draw.line((100, 500, 500, 100), fill="black", width=3)

draw.line((100, 300, 300, 100), fill="black", width=3)
draw.line((300, 100, 500, 300), fill="black", width=3)
draw.line((500, 300, 300, 500), fill="black", width=3)
draw.line((300, 500, 100, 300), fill="black", width=3)

image2 = image.copy()

image2.show()