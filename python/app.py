from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import numpy as np

app = Flask(__name__)
app.config['SECRET_KEY'] = 'gizli-anahtar'
socketio = SocketIO(app, cors_allowed_origins="*")

# 15x10 matris (15 sütun, 10 satır) - manual/page.tsx ile uyumlu
grid = np.zeros((10, 15), dtype=int).tolist()
previous_matrix = np.zeros((10, 15), dtype=int).tolist()

# Grid güncelleme fonksiyonu (yalnızca previous_matrix'i eşitlemek için)
def update_grid():
    global previous_matrix
    for row in range(10):
        for col in range(15):
            if previous_matrix[row][col] != grid[row][col]:
                previous_matrix[row][col] = grid[row][col]

# Ana sayfa
@app.route('/')
def index():
    return render_template('debug.html', grid=grid)

@socketio.on('connect')
def handle_connect():
    emit('init_grid', grid)

@socketio.on('pixel_update')
def handle_pixel_update(data):
    global grid
    x = data['x']
    y = data['y']
    value = data['value']
    
    grid[y][x] = value
    update_grid()
    emit('pixel_changed', data, broadcast=True)

@socketio.on('reset_grid')
def handle_reset():
    global grid
    global previous_matrix
    
    grid = np.zeros((10, 15), dtype=int).tolist()
    previous_matrix = np.zeros((10, 15), dtype=int).tolist()
    
    update_grid()
    emit('init_grid', grid, broadcast=True)

@socketio.on('matrix_selected')
def handle_matrix_selected(data):
    matrix = data['matrix']
    global grid
    for y in range(len(matrix)):
        for x in range(len(matrix[0])):
            grid[y][x] = matrix[y][x]
    
    update_grid()
    emit('init_grid', grid, broadcast=True)

if __name__ == '__main__':
    print("Sunucu başlatılıyor...")
    print("http://localhost:5000 adresine gidin")
    try:
        socketio.run(app, debug=True, port=5000, host="0.0.0.0")
    except Exception as e:
        print(f"Sunucu başlatılırken hata oluştu: {e}")