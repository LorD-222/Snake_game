from flask import Flask, render_template
from flask import send_from_directory


app = Flask(__name__)

# @app.route('/')
@app.route('/snake_game')
def index():
    return render_template('index.html')  # Убедитесь, что файл 'index.html' находится в папке 'templates'

@app.route('/snake_static/<path:filename>')
def snake_static(filename):
    # Обслуживаем статические файлы из папки 'snake_static'
    return send_from_directory('snake_static', filename)

if __name__ == '__main__':
    # Указываем host='0.0.0.0' для доступности сервера на всех сетевых интерфейсах
    app.run(debug=True, host='0.0.0.0')
