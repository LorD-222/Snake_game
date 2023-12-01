from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')  # Убедитесь, что файл 'index.html' находится в папке 'templates'

if __name__ == '__main__':
    # Указываем host='0.0.0.0' для доступности сервера на всех сетевых интерфейсах
    app.run(debug=True, host='0.0.0.0')
