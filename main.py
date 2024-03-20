from dataclasses import dataclass
from flask import Flask, flash, request, redirect, url_for, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm 
from wtforms import SubmitField, PasswordField, StringField
from wtforms.validators import Length, ValidationError, EqualTo, DataRequired
from flask_bcrypt import Bcrypt
from game_manager import activation
import webbrowser
from threading import Timer
import json


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SECRET_KEY'] = 'pkH{XQup/)QikTx'
app.app_context().push()

#Flask Alchemy initialization
bcrypt = Bcrypt(app)
db = SQLAlchemy(app)

app.config['MAX_CONTENT_LENGTH'] = 16_000_00  #Max file size
app.config['UPLOAD_FOLDER'] = "static/botfiles"

login_manager = LoginManager(app)
login_manager.login_view='login'
login_manager.login_message_category = "info"
login_manager.login_message = "Xin hãy đăng nhập để truy cập"


# user = User.query.filter_by(username='tlv23').first()
# user.elo = '100000'
# db.session.commit()

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@dataclass
class User(db.Model, UserMixin): 
    username:str
    elo:str
    fightable:str

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    elo = db.Column(db.Integer)
    fightable = db.Column(db.Boolean)


class LoginForm(FlaskForm):
    username = StringField("Tên đăng nhập:", validators=[DataRequired(), Length(min=4, max=20)])
    password =  PasswordField("Mật khẩu", validators=[DataRequired(), Length(min=4, max=20)])
    submit = SubmitField("Đăng Nhập")


class RegisterForm(FlaskForm):
    username = StringField('Tên đăng nhập:', validators=[DataRequired(), Length(min=4, max=20)])
    password =  PasswordField('Mật khẩu:',  validators=[DataRequired(), Length(min=4, max=20)])
    conf_pass =  PasswordField('Xác nhận mật khẩu:', validators=[DataRequired(), EqualTo("password", message='Mật khẩu xác nhận không trùng khớp')])
    submit = SubmitField(label='Tạo tài khoản')

    def validate_username(self, username_to_check):
        if User.query.filter_by(username=username_to_check.data).first(): #_existing_user_username
            raise ValidationError('Tên đăng nhập đã được sử dụng')


@app.route('/')
def home_page():
    return render_template('home.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user:
            if bcrypt.check_password_hash(user.password, form.password.data):
                login_user(user)
                flash("Đăng nhập thành công", category='success')
                return redirect(url_for('menu'))
            else: flash("Mật khẩu không hợp lệ! Vui lòng thử lại", category='danger')
        else: flash("Tên đăng nhập không hợp lệ! Vui lòng thử lại", category='danger')
    return render_template('login.html', form=form)


@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = bcrypt.generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, password=hashed_password, elo=0, fightable=False)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('login'))
    for err_msg in form.errors.values(): #If there are errors from the validations
        flash(err_msg[0], category="danger")
    return render_template('register.html', form=form)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash("Bạn đã đăng xuất!!!", category='info')
    return redirect(url_for('home_page'))


@app.route('/menu')
@login_required
def menu():
    return render_template('menu.html', current_user=current_user)

@app.route('/upload_code', methods=['POST'])
@login_required
def upload_code():
    name = current_user.username
    code = request.get_json()
    with open(f"static/botfiles/botfile_{name}.py", mode="w", encoding="utf-8") as f:
        f.write(code)
    try: 
        winner, max_move_win = activation("trainAI.Master", name) # người thắng / số lượng lượt chơi
        user = User.query.filter_by(username=current_user.username).first()
        user.fightable = True
        db.session.commit()
        return json.dumps("success")
    except Exception as err:
        err = str(err).replace(r"c:\Users\Hello\OneDrive\Code Tutorial\Python", "...")
        user.fightable = False
        db.session.commit()
        return json.dumps(str(err)) # Giá trị Trackback Error

@app.route('/create_bot')
@login_required
def create_bot():
    return render_template('create_bot.html')

@app.route('/get_code')
@login_required
def get_code():
    name = current_user.username
    with open(f"static/botfiles/botfile_{name}.py", mode="r", encoding="utf-8") as f:
        return json.dumps(f.read())

@app.route('/bot_fight_page')
@login_required
def bot_fight_page():
    users = [(i.username, i.elo) for i in User.query.all()]
    return render_template('bot_fight_page.html', users = users)

@app.route('/play_chess_page')
@login_required
def play_chess_page():
    return render_template('play_chess_page.html')

@app.route('/fighting', methods=['POST'])
@login_required
def fighting():
    name = current_user.username
    player = request.get_json()
    winner, max_move_win = activation("static.botfiles.botfile_"+player['name'], name)
    data = {
        "max_move_win": max_move_win,
        "status": winner,
    }
    return json.dumps(data)

@app.route('/get_users')
@login_required
def get_users():
    users = User.query.all()
    return users
    
if __name__ == '__main__':
    open_browser = lambda: webbrowser.open_new("http://127.0.0.1:5000")
    Timer(1, open_browser).start()
    app.run(port=5000, debug=True, use_reloader=False)