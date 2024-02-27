a = r'''Traceback (most recent call last):
  File "c:\Users\Hello\OneDrive\Code Tutorial\Python\Co_ganh\game_manager.py", line 130, in activation
    try: return run_game(UserBot, Bot2)
  File "c:\Users\Hello\OneDrive\Code Tutorial\Python\Co_ganh\game_manager.py", line 147, in run_game
    move = UserBot.main(deepcopy(player1))
  File "c:\Users\Hello\OneDrive\Code Tutorial\Python\Co_ganh\static\botfiles\botfile_Quan064.py", line 23, in main
    3/0
ZeroDivisionError: division by zero
'''
b = r'''Traceback (most recent call last):
  File "c:\Users\Hello\OneDrive\Code Tutorial\Python\Co_ganh\game_manager.py", line 130, in activation
    try: return run_game(UserBot, Bot2)
  File "c:\Users\Hello\OneDrive\Code Tutorial\Python\Co_ganh\game_manager.py", line 151, in run_game  
    move_new_pos = move["new_pos"]
TypeError: 'NoneType' object is not subscriptable
'''

print("\n".join(i for i in a.replace("\n    ", "\t").split("\n") if not "game_manager" in i).replace("\t", "\n    "))