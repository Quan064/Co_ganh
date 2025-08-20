from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from game_manager import activation
from game_manager_debug import activation_debug
import trainAI.Master
import json
import secrets
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_admin import firestore
from fdb.firestore_config import fdb
import trainAI.MasterUser
import requests
from importlib import reload
from tool import valid_move, distance
from io import StringIO
import traceback
import sys
import time
import builtins
import uuid 
import random
import math

doc_ref_room = fdb.collection("room")
doc_ref_post = fdb.collection("post")
doc_ref_task = fdb.collection("task")
doc_ref_simulation = fdb.collection("simulation")
doc_ref_code = fdb.collection("code")
doc_ref_user = fdb.collection("user")
doc_ref_bot = fdb.collection("bot")

def _import(name, *args, **kwargs):
    if name in ('os','subprocess','pickle','marshal','ctypes','shutil','glob','socket','tempfile','urllib','main','index','game_manager','game_manager_debug','game_manager_debug copy','trainAI.Master','trainAI.MasterUser'):
        raise ValueError(f"Module '{name}' is blocked.")
    return __import__(name, *args, **kwargs)

custom_builtins = builtins.__dict__.copy()
custom_builtins['__import__'] = _import
del custom_builtins['open']
del custom_builtins['input']

class Player:
    def __init__(self, dict: dict):
        for key, value in dict.items():
            setattr(self, key, value)

# globals_exec = {"valid_move": valid_move,
#                 "distance": distance,
#                 "random": random,
#                 "math": math,
#                 '__builtins__': {k:v for k, v in builtins.__dict__.items() if k not in ['eval', 'exec', 'input', '__import__', 'open']}}

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = secrets.token_hex(16)
app.config['WTF_CSRF_ENABLED'] = False
app.config['CORS_HEADERS'] = 'Content-Type'
app.app_context().push()

bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

app.config['MAX_CONTENT_LENGTH'] = 16_000_00  #Max file size
app.config['UPLOAD_FOLDER'] = "static/botfiles"

allowed_origins = [
    "http://localhost:3000",
    "https://coganh-419711.de.r.appspot.com",
    "https://coganh-cloud-tixakavkna-as.a.run.app"
]

CORS(app, resources={r"/*": {"origins": allowed_origins}})
# CORS(app, resources={r"/*": {"origins": "https://coganh-419711.de.r.appspot.com"}})

# def safe_exec(code, input):
#     func_to_del = ['eval', 'exec', 'input', '__import__', 'open']
#     allowed_builtins = {k:v for k, v in builtins.__dict__.items() if k not in func_to_del}
#     locals = {}
#     exec(code, {"valid_move": valid_move, "distance": distance, '__builtins__': allowed_builtins}, locals)
#     return locals["main"](*input)

def query_chunk(doc_ref, chunk_index, chunk_size):
    docs = []
    chunk_index = int(chunk_index)
    chunk_size = int(chunk_size)
    lis = list(doc_ref)
    if chunk_index == 0:
        for doc in lis[0 : chunk_size + 1]:
            data = doc.to_dict()
            data["id"] = doc.id
            docs.append(data)
    else:
        for doc in lis[(chunk_index-1)*chunk_size : chunk_index * chunk_size + 1]:
            data = doc.to_dict()
            data["id"] = doc.id
            docs.append(data)
    return docs


@app.route('/run_task', methods=["POST"])
def run_task():
    res = request.get_json()
    inp_oup = eval(res["inp_oup"])
    code = res["code"]
    org_stdout = sys.stdout
    err = ""

    user_output = []
    for i in inp_oup[:2]:
        f = StringIO()
        sys.stdout = f
        try:
            local = {'__builtins__': custom_builtins}

            exec(code, local, local)
            Uoutput = local["main"](*i["input"])
            comparision = i["output"] == Uoutput
            if comparision:
                user_output.append({
                    "log": f.getvalue(),
                    "output_status" : "AC",
                    "output" : str(Uoutput),
                })
            else:
                user_output.append({
                    "log": f.getvalue(),
                    "output_status" : "WA",
                    "output" : str(Uoutput)
                })
        except:
            err = traceback.format_exc()
            status = "SE"
            break
    sys.stdout = org_stdout
    
    if any(i["output_status"]=="WA" for i in user_output):
        status = "WA"
    else:
        status = "AC"

    if err:
        return_data = {
            "status": "SE",
            "output": [i["output"] for i in inp_oup],
            "err": err,
        }
    else:
        return_data = {
            "status": status,
            "output": [str(i["output"]) for i in inp_oup],
            "user_output": user_output,
        }

    # print(return_data)

    return return_data

@app.route('/upload_task', methods=['POST'])
def upload_task():
    task = request.get_json()
    try:
        inp_oup = task["inp_oup"]
        for i in range(len(inp_oup)):
            for j in range(len(inp_oup[i]["input"])):
                task["inp_oup"][i]["input"][j] = eval(inp_oup[i]["input"][j])
            task["inp_oup"][i]["output"] = eval(inp_oup[i]["output"])
        task["inp_oup"] = str(task["inp_oup"])
        doc_ref_task.document().set(task)
        return json.dumps({
            "code": 200,
            "tast": task
        })
    except Exception as e:
        return json.dumps({
            "code": 400,
            "err": str(e)
        })

        
@app.route('/get_pos_of_playing_chess', methods=['POST'])
def get_pos_of_playing_chess():
    res = request.get_json()
    player = Player(res["data"])
    choosen_bot = res["choosen_bot"]
    player.your_pos, player.opp_pos = [tuple(i) for i in player.opp_pos], [tuple(i) for i in player.your_pos]

    move = __import__(f"trainAI.{choosen_bot}", fromlist=[None]).main(player)
    return move

@app.route('/get_rate', methods=['POST'])
def get_rate():
    data = request.get_json()
    move_list = data["move_list"]
    img_data = data["img_data"]

    rate = []
    for i in range(len(move_list)):
        move_list[i]['your_pos'], move_list[i]['opp_pos'] = ([tuple(j) for j in move_list[i]['your_pos']], [tuple(j) for j in move_list[i]['opp_pos']])[::move_list[i]['side']]
        rate.append(trainAI.MasterUser.main(move_list[i], move_list[i]['side']))
        img_data["img"][i].append(rate[i])

    img_url = requests.post("http://quan064.pythonanywhere.com//generate_debug_image", json=img_data).text
    return json.dumps({"rate": rate, "img_url": img_url})

@app.route('/update_rank_board', methods=['POST'])
def update_rank_board():
    docs = doc_ref_bot.where(filter=FieldFilter("fightable", "==", True)).order_by('elo', direction=firestore.Query.DESCENDING).limit(5).stream()
    results = []
    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        d["code"] = ""
        results.append(d)

    return results

@app.route('/handle_login', methods=['POST'])
def handle_login():
    data = request.get_json()
    username, password = data["username"], data["password"]
    user_doc = doc_ref_user.where(filter=FieldFilter("username", "==", username)).where(filter=FieldFilter("password", "==", password)).stream()
    user = {}

    for doc in user_doc:
        id = doc.id
        user = doc.to_dict()
        user["id"] = id

    if user["id"]:
        return json.dumps({
            "status": 200,
            "userData": user
        })
    else:
        return json.dumps({
            "status": 404,
        })
    
@app.route('/get_all_user_name')
def get_all_user_name():
    users = doc_ref_user.stream()
    res = []
    for doc in users:
        user = doc.to_dict()
        res.append(user["username"])

    return res

@app.route('/get_all_post')
def get_all_post():
    chunk_index = request.args.get("page")
    chunk_size = request.args.get("size")
    posts = query_chunk(doc_ref_post.where(filter=FieldFilter("is_public", "==", True)).stream(), chunk_index, chunk_size)
    # posts = doc_ref_post.stream()
    # res = []
    # for doc in posts:
    #     post = doc.to_dict()
    #     post["id"] = doc.id
    #     res.append(post)

    return posts

@app.route('/get_all_user')
def get_all_user():
    print("user")
    users = doc_ref_user.stream()
    res = []
    for doc in users:
        user = doc.to_dict()
        user["id"] = doc.id
        res.append(user)

    return res

@app.route('/delete_post/<post_id>')
def delete_post(post_id):
    doc_ref_post.document(post_id).delete()

    return {"message": "success"}

@app.route('/accept_post/<post_id>')
def accept_post(post_id):
    doc_ref_post.document(post_id).update({"is_public": True})

    return {"message": "success"}

@app.route('/delete_task/<task_id>')
def delete_task(task_id):
    doc_ref_task.document(task_id).delete()

    return {"message": "success"}

@app.route('/accept_task/<task_id>')
def accept_task(task_id):
    doc_ref_task.document(task_id).update({"is_public": True})

    return {"message": "success"}


@app.route('/get_all_task')
def get_all_task():
    # res = doc_ref_task.stream()
    
    # tasks = []

    # for doc in res:
    #     task = doc.to_dict()
    #     task["id"] = doc.id
    #     tasks.append(task)

    chunk_index = request.args.get("page")
    chunk_size = request.args.get("size")
    tasks = query_chunk(doc_ref_task.stream(), chunk_index, chunk_size)

    return tasks

@app.route('/get_user_bots', methods=['POST'])
def get_user_bots():
    username = request.get_json()

    docs2 = doc_ref_bot.where(filter=FieldFilter("fightable", "==", True)).where(filter=FieldFilter("owner", "==", username)).stream()
    results2 = []
    sum_elo = 0
    for doc in docs2:
        id = doc.id
        d = doc.to_dict()
        sum_elo = d["elo"] + sum_elo
        d["id"] = id
        d["code"] = ""
        results2.append(d)

    docs = doc_ref_bot.where(filter=FieldFilter("fightable", "==", True)).where(filter=FieldFilter("owner", "!=", username)).order_by('elo').start_at({"elo": int(sum_elo / len(results2)- 50)}).limit(10).stream()
    print(int(sum_elo / len(results2) - 50))
    results = []
    for doc in docs:
        id = doc.id
        d = doc.to_dict()
        d["id"] = id
        d["code"] = ""
        results.append(d)

    data = {
        "enemy_bots": results,
        "user_bots": results2
    }
    return data

@app.route('/get_rank_board')
def get_rank_board():
    docs = doc_ref_bot.where(filter=FieldFilter("fightable", "==", True)).order_by('elo', direction=firestore.Query.DESCENDING).limit(5).stream()
    results = []
    for doc in docs:
        d = doc.to_dict()
        d["id"] = doc.id
        d["code"] = ""
        results.append(d)
    return results

def handle_change_elo(status, player_1, player_2):
    pre_player_1E = player_1["elo"]
    pre_player_2E = player_2["elo"]
    if (status == "win"):
        if (player_1["elo"] < player_2["elo"]):
            pre = player_1["elo"]
            player_1["elo"] = player_2["elo"] + 10
            player_2["elo"] = pre
        else:
            player_1["elo"] = player_1["elo"] + 10
    elif (status == "lost"):
        if (player_1["elo"] > player_2["elo"]):
            pre = player_2["elo"]
            player_2["elo"] = player_2["elo"] + 10
            player_1["elo"] = pre
        else:
            player_1["elo"] = player_1["elo"] + 10
    else:
        if (player_1["elo"] <= 0):
            player_1["elo"] = 0
        elif (player_2["elo"] <= 0):
            player_2["elo"] = 0
    doc_ref_bot.document(player_1["id"]).update({"elo": player_2["elo"]})
    doc_ref_bot.document(player_2["id"]).update({"elo": player_2["elo"]})
    pre_player_1E = pre_player_1E - player_1["elo"]
    pre_player_2E = pre_player_2E - player_2["elo"]
    return pre_player_1E, pre_player_2E
    


@app.route('/fight_bot', methods=['POST'])
def fight_bot():
    try:
        data = request.get_json()
        user_bot_doc = doc_ref_bot.document(data["your_bot_id"])
        enemy_bot_doc = doc_ref_bot.document(data["enemy_bot_id"])
        user_bot = user_bot_doc.get().to_dict()
        user_bot["id"] = data["your_bot_id"]
        enemy_bot = enemy_bot_doc.get().to_dict()
        enemy_bot["id"] = data["enemy_bot_id"]
        err, game_res, output = activation(enemy_bot["code"], user_bot["code"], data["you"])
        if err:
            res = {
                "code": 400,
                "output": output
            }
        else:
            res = {
                "code": 200,
                "status": game_res[0],
                "max_move_win": game_res[1],
                "new_url": game_res[2],
                "output": output
            }
            C_user_elo, C_enemy_elo = handle_change_elo(game_res[0], user_bot, enemy_bot)
            enemy_bot["code"] = ""
            enemy_bot["fight_history"] = []
            user_bot["code"] = ""
            user_bot["fight_history"] = []
            user_bot_doc.update({
                "fight_history": firestore.ArrayUnion([{
                    "enemy": enemy_bot,
                    "status": game_res[0],
                    "move": game_res[1],
                    "time": data["time"],
                    "elo_change": C_user_elo,
                }])
            })
            enemy_status = "win" if game_res[0] == "lost" else "lost"
            enemy_bot_doc.update({
                "fight_history": firestore.ArrayUnion([{
                    "enemy": user_bot,
                    "status": enemy_status if game_res[0] != "draw" else "draw",
                    "move": game_res[1],
                    "time": data["time"],
                    "elo_change": C_enemy_elo,
                }])
            })
    except Exception as err:
        print(err)
        res = {
            "code": 400,
            "output": str(err)
        }

    return json.dumps(res)


@app.route('/get_posts')
def get_posts():

    chunk_index = request.args.get("page")
    chunk_size = request.args.get("size")
    posts = query_chunk(doc_ref_post.where(filter=FieldFilter("is_public", "==", True)).stream(), chunk_index, chunk_size)
    return posts

@app.route('/get_unpublic_posts')
def get_unpublic_posts():

    chunk_index = request.args.get("page")
    chunk_size = request.args.get("size")
    posts = query_chunk(doc_ref_post.where(filter=FieldFilter("is_public", "==", False)).stream(), chunk_index, chunk_size)

    return posts

@app.route('/get_unpublic_user_posts')
def get_unpublic_user_posts():
    chunk_index = request.args.get("page")
    chunk_size = request.args.get("size")
    username = request.args.get("username")
    print(chunk_index, chunk_size, username)
    posts = query_chunk(doc_ref_post.where(filter=FieldFilter("author", "==", username)).where(filter=FieldFilter("is_public", "==", False)).stream(), chunk_index, chunk_size)

    return posts

@app.route('/get_post_by_id/<post_id>')
def get_post_by_id(post_id):
    data = ""
    docs = doc_ref_post.where(filter=FieldFilter("post_id", "==", post_id)).stream()
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
    return data

@app.route('/get_post_by_username/<username>')
def get_post_by_username(username):
    data = ""
    docs = doc_ref_post.where(filter=FieldFilter("author", "==", username)).stream()
    for doc in docs:
        data = doc.to_dict()
        data["id"] = doc.id
    return data

@app.route('/get_unpublic_tasks')
def get_unpublic_tasks():

    chunk_index = request.args.get("page")
    chunk_size = request.args.get("size")
    tasks = query_chunk(doc_ref_task.where(filter=FieldFilter("is_public", "==", False)).stream(), chunk_index, chunk_size)

    return tasks

@app.route('/get_unpublic_user_tasks')
def get_unpublic_user_tasks():
    chunk_index = request.args.get("page")
    chunk_size = request.args.get("size")
    username = request.args.get("username")
    tasks = query_chunk(doc_ref_task.where(filter=FieldFilter("author", "==", username)).where(filter=FieldFilter("is_public", "==", False)).stream(), chunk_index, chunk_size)

    return tasks

@app.route('/get_task_by_id/<task_id>')
def get_task_by_id(task_id):
    docs = doc_ref_task.document(task_id).get().to_dict()
    return docs

@app.route('/get_visualize/<id>')
def get_visualize(id):
    visualize = doc_ref_simulation.document(id).get().to_dict()

    return visualize

@app.route('/submit_code', methods=['POST'])
def submit_code():
    res = request.get_json()
    task = doc_ref_task.document(res["id"])
    code = res["code"]
    username = res["username"]
    inp_oup = eval(res["inp_oup"])
    org_stdout = sys.stdout
    soAc = 0
    err = ""
    compile_data = {
        "update_data": {

        },

        "return_data": {

        }
    }
    user_output = []
    start = time.time()
    for i in inp_oup:
        f = StringIO()
        sys.stdout = f
        try:
            local = {'__builtins__': custom_builtins}

            exec(code, local, local)
            Uoutput = local["main"](*i["input"])
            comparision = i["output"] == Uoutput

            if comparision:
                user_output.append({
                    "log": f.getvalue(),
                    "output_status" : "AC",
                    "output" : str(Uoutput),
                })
                soAc+=1
            else:
                user_output.append({
                    "log": f.getvalue(),
                    "output_status" : "WA",
                    "output" : str(Uoutput)
                })
        except:
            err = traceback.format_exc()
            status = "SE"
            break
    end = time.time()
    sys.stdout = org_stdout

    if not err:
        if any(i["output_status"]=="WA" for i in user_output):
            status = "WA"
        else:
            status = "AC"

    compile_data["update_data"] = {
        "code": code,
        "status": status,
        "test_finished": f"{soAc}/{len(user_output)}",
        "submit_time": res["time"],
        "run_time": (end-start) * 10**3,
    }

    if err:
        compile_data["return_data"] = {
            "status": "SE",
            "output": [str(i["output"]) for i in inp_oup],
            "err": err,
        }
    else:
        compile_data["return_data"] = {
            "status": status,
            "output": [str(i["output"]) for i in inp_oup],
            "user_output": user_output,
            "test_finished": f"{soAc}/{len(user_output)}",
            "run_time": (end-start) * 10**3,
        }

    update_data = compile_data["update_data"]
    return_data = compile_data["return_data"]

    if return_data["status"] == "AC":
        task.update({
            f"challenger.{username}.submissions": firestore.ArrayUnion([update_data]),
            f"challenger.{username}.current_submit": update_data,
            "submission_count": firestore.Increment(1),
            "accepted_count": firestore.Increment(1),
        })
    else:
        task.update({
            f"challenger.{username}.submissions": firestore.ArrayUnion([update_data]),
            f"challenger.{username}.current_submit": update_data,
            "submission_count": firestore.Increment(1),
        })

    return return_data

@app.route('/get_task/<id>')
def get_task(id):
    res = doc_ref_task.document(id).get().to_dict()
    res["id"] = id

    return res

@app.route('/get_user_bot/<name>')
def get_user_code(name):
    user_bot = doc_ref_bot.where(filter=FieldFilter("owner", "==", name)).stream()
    data = []
    for doc in user_bot:
        data.append(doc.to_dict())
    return data

@app.route('/create_bot')
def create_bot():
    owner = request.args.get("owner")
    bot_name = request.args.get("bot_name")
    data = {
        "code": """
# NOTE: tool
# valid_move(x, y, board): trả về các nước đi hợp lệ của một quân cờ - ((x, y), ...)
# distance(x1, y1, x2, y2): trả về số nước đi ít nhất từ (x1, y1) đến (x2, y2) - n

# NOTE: player
# player.your_pos: vị trí tất cả quân cờ của bản thân - [(x, y), ...]
# player.opp_pos: vị trí tất cả quân cờ của đối thủ - [(x, y), ...]
# player.your_side: màu quân cờ của bản thân - 1:🔵
# player.board: bàn cờ - -1:🔴 / 1:🔵 / 0:∅

# Remember that player.board[y][x] is the tile at (x, y) when printing
def main(player):
    move = [[-1,0],[0,-1],[0,1],[1,0]]
    for x,y in player.your_pos:
        for mx,my in move:
            if 0 <= x+mx <= 4 and 0 <= y+my <= 4 and player.board[y+my][x+mx] == 0:
                return {"selected_pos": (x,y), "new_pos": (x+mx, y+my)}
""",
        "owner": owner,
        "fightable": False,
        "fight_history": [],
        "bot_name": bot_name,
        "elo": 0,
        "bot_id": str(uuid.uuid1().int),
        "is_public": False,
    }

    doc_ref_bot.add(data)

    return data

@app.route('/remove_bot')
def remove_bot():
    owner = request.args.get("owner")
    bot_name = request.args.get("bot_name")
    user_bot = doc_ref_bot.where(filter=FieldFilter("owner", "==", owner)).where(filter=FieldFilter("bot_name", "==", bot_name)).stream()
    for doc in user_bot:
        doc.reference.delete()
    return {"message": "success"}
    
@app.route('/run_bot', methods=['POST'])
def run_bot():
    data = request.get_json()
    name = data["username"]
    your_bot_name = data["your_bot_name"]
    bot = data["bot"]
    code = data["code"]
    err, game_res, output = activation(bot, code, name)
    user_bot = doc_ref_bot.where(filter=FieldFilter("owner", "==", name)).where(filter=FieldFilter("bot_name", "==", your_bot_name)).stream()

    level = {
        "level1": 1,
        "level2": 2,
        "level3": 3,
        "level4": 4,
        "Master": 5,
    }


    for doc in user_bot:
        if doc.exists:
            pre_bot = doc.to_dict()
            new_level = pre_bot["level"]
            if game_res[0] == "win" and level[bot] > pre_bot["level"]:
                new_level = level[bot]
            new_data = {
                "fightable": not err,
                "code": code,
                "level": new_level
            }
            doc_ref_bot.document(doc.id).set(new_data, merge=True)
        else:
            doc_ref_bot.document().set({
                "code": code,
                "owner": name,
                "fightable": not err,
                "fight_history": [],
                "bot_name": name,
                "elo": 0,
                "bot_id": uuid.uuid1().int,
                "is_public": False,
                "level": level[bot] if game_res[0] == "win" else 0
            })
    if err:
        data = {
            "code": 400,
            "output": output
        }
    else:
        data = {
            "code": 200,
            "status": game_res[0],
            "max_move_win": game_res[1],
            "new_url": game_res[2],
            "output": output
        }

    return json.dumps(data) # Giá trị Trackback Error

@app.route('/debug_bot', methods=['POST'])
def debug_bot():
    res = request.get_json()
    data = res["request_data"]
    name = data["username"]
    bot = data["bot"]
    print(res)
    err, game_res, output = activation_debug(bot, data["code"], name, res['debugNum']) # người thắng / số lượng lượt chơi
    print(game_res)
    if err:
        data = {
            "code": 400,
            "output": output
        }
    else:
        data = {
            "code": 200,
            "img_url": game_res[0],
            "inp_oup": game_res[1],
            "rate": game_res[2],
            "output": output
        }
    return json.dumps(data) # Giá trị Trackback Error

@app.route('/save_bot', methods=['POST'])
def save_bot():
    data = request.get_json()
    code = data["code"]
    name = data["username"]
    bot_name = data["bot_name"]

    user_bot = doc_ref_bot.where(filter=FieldFilter("owner", "==", name)).where(filter=FieldFilter("bot_name", "==", bot_name)).stream()

    for doc in user_bot:
        if doc.exists:
            new_data = {
                "code": code
            }
            doc_ref_bot.document(doc.id).set(new_data, merge=True)
        else:
            doc_ref_bot.document().set({
                "code": code,
                "owner": name,
                "fightable": False,
                "fight_history": [],
                "bot_name": name,
                "elo": 0,
                "bot_id": uuid.uuid1().int,
                "is_public": False,
            })
    return json.dumps(code)

@app.route('/get_all_user_data/<id>')
def get_all_user_data(id):
    bot_doc = doc_ref_bot.order_by('elo', direction=firestore.Query.DESCENDING).stream()
    tasks_doc = doc_ref_task.where(filter=FieldFilter("is_public", "==", True)).stream()
    post_doc = doc_ref_post.where(filter=FieldFilter("is_public", "==", True)).stream()
    name = doc_ref_user.document(id).get().to_dict()["username"]
    data = {
        "bots": [],
        "your_tasks": [],
        "tasks": [],
        "posts": [],
        "username": name,
    }
    for index,doc in enumerate(bot_doc):
        id = doc.id
        doc = doc.to_dict()
        if doc["owner"] == name:
            doc["rank"] = index
            doc["id"] = id
            data["bots"].append(doc)
        
    for doc in tasks_doc:
        doc_id = doc.id
        doc = doc.to_dict()
        if doc["author"] == name:
            doc["id"] = doc_id
            data["your_tasks"].append(doc)
        if name in doc["challenger"]:
            submit_history = doc["challenger"][name]["submissions"]
            for i in range(len(submit_history)):
                submit_history[i]["task_name"] = doc["task_name"]
                submit_history[i]["id"] = doc_id
            
            data["tasks"].extend(submit_history)
    
    for doc in post_doc:
        doc = doc.to_dict()
        if doc["author"] == name:
            data["posts"].append(doc)

    return data

@app.route('/get_code_to_show', methods=['POST'])
def get_code_to_show():
    bot_ids = request.get_json()
    flattened_list = sum(bot_ids, [])
    bot_doc = [doc.to_dict() for doc in doc_ref_bot.where(filter=FieldFilter('bot_id', 'in', flattened_list)).stream()]
    data = bot_ids
    for i in range(len(data)):
        for j in range(len(data[i])):
            is_has_code = False
            for doc in bot_doc:
                if doc["is_public"]:
                    if data[i][j] == doc["bot_id"]:
                        data[i][j] = doc["code"]
                        is_has_code = True
                        break
            if not is_has_code:
                data[i][j] = ""
    return data

@app.route('/get_user_info/<id>')
def get_user_info(id):
    user = doc_ref_user.document(id).get().to_dict()
    user["password"] = ""

    return user

@app.route('/send_notification/<id>', methods=['POST'])
def send_notification(id):
    data = request.get_json()

    doc_ref_user.document(id).update({
        "notifications": firestore.ArrayUnion([data])
    })

    return {"message": "success"}

@app.route('/get_user_notification/<id>')
def get_user_notification(id):
    user = doc_ref_user.document(id).get().to_dict()

    return user["notifications"]

@app.route('/delete_notification/<id>', methods=['POST'])
def delete_notification(id):
    data = request.get_json()
    user = doc_ref_user.document(id).update({
        "notifications": firestore.ArrayRemove([data])
    })

    return {"message": "success"}

@app.route('/delete_all_notification/<id>', methods=['POST'])
def delete_all_notification(id):
    user = doc_ref_user.document(id).update({
        "notifications": []
    })

    return {"message": "success"}

@app.route('/change_is_public')
def change_is_public():
    id = request.args.get("bot_id")
    type = bool(int(request.args.get("type")))
    doc_ref_bot.document(id).update({
        "is_public": type
    })
    return {"message": "success"}
    

if __name__ == '__main__':
    port = 5000
    app.run(host='0.0.0.0', port=port, threaded=True)

# if __name__ == '__main__':
#     open_browser = lambda: webbrowser.open_new("http://192.168.1.249:5000")
#     Timer(1, open_browser).start()
#     app.run(port=5000, debug=True, use_reloader=False)

