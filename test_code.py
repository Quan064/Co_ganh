# from tempfile import NamedTemporaryFile
# from os import remove, replace
# from os.path import dirname

# datfile = 'C:/Users/Hello/OneDrive/Code Tutorial/Python/Co_ganh/static/AI.txt'

# try:
#     with open(datfile) as file, NamedTemporaryFile(mode='wt', dir=dirname(datfile), delete=False) as output:
#         tname = output.name
#         for line in file:
#             if line.startswith('17,18,19,20,21,22,23,24'):
#                 line = "new" + '\n'
#             output.write(line)
# except:
#     remove(tname)
# else:
#     replace(tname, datfile)

for i1 in range(18):
    for i2 in range(i1+1, 19):
        for i3 in range(i2+1, 20):
            for i4 in range(i3+1, 21):
                for i5 in range(i4+1, 22):
                    for i6 in range(i5+1, 23):
                        for i7 in range(i6+1, 24):
                            with open("static/AI.txt", mode="a") as f:
                                f.write(f"{i1},{i2},{i3},{i4},{i5},{i6},{i7}:\n")

# 8: 0
# 7: 1081576