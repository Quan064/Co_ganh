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

import itertools

with open('source_code/move.txt', 'w') as f:
    for i in itertools.product(range(3), repeat=25):
        if 4 <= i.count(1)+i.count(2) <= 16:
            f.write(','.join(map(str, i)) + ': \n')