# Donanım lazım

from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import numpy as np
from smbus2 import SMBus

app = Flask(__name__)
app.config['SECRET_KEY'] = 'gizli-anahtar'
socketio = SocketIO(app, cors_allowed_origins="*")

grid = np.zeros((18, 18), dtype=int).tolist()

# I2C aygıt adresini tanımlayın
I2C_ADDRESS = 0x20  # MCP23017'in adresi
# bus = SMBus(1)  # I2C bus numarası

# Önceki matris
previous_matrix = np.zeros((18, 18), dtype=int).tolist()

# Piksel güncelleme fonksiyonu
# def update_pixel(pin_number, value):
#     # MCP23017 üzerinden pin güncelleme işlemi
#     port = pin_number // 16  # MCP23017'deki port (A veya B)
#     pin = pin_number % 16  # Port içindeki pin
#     olat_register = 0x14 if port == 0 else 0x15  # OLATA veya OLATB
#     bus.write_byte_data(I2C_ADDRESS, olat_register, value)

# Grid güncelleme fonksiyonu
def update_grid():
    global previous_matrix
    for row in range(18):
        for col in range(18):
            if previous_matrix[row][col] != grid[row][col]:
                pin_number = row * 18 + col
                # update_pixel(pin_number, grid[row][col])
                previous_matrix[row][col] = grid[row][col]

# Ana sayfa
@app.route('/')
def index():
    return render_template('debug.html', grid=grid)

@socketio.on('connect')
def handle_connect():
    # Bağlantı kurulduğunda mevcut grid'i gönder
    emit('init_grid', grid)

@socketio.on('pixel_update')
def handle_pixel_update(data):
    global grid
    x = data['x']
    y = data['y']
    value = data['value']
    
    # Grid'i güncelle
    grid[y][x] = value
    update_grid()  # Fiziksel pikselleri güncelle
    
    # Tüm bağlı kullanıcılara güncellenmiş pikseli bildir
    emit('pixel_changed', data, broadcast=True)

@socketio.on('reset_grid')
def handle_reset():
    global grid
    global previous_matrix
    
    # Grid'i ve önceki matrisi sıfırla
    grid = np.zeros((18, 18), dtype=int).tolist()
    previous_matrix = np.zeros((18, 18), dtype=int).tolist()
    
    update_grid()  # Fiziksel pikselleri sıfırla
    
    # Tüm bağlı kullanıcılara yeni grid'i gönder
    emit('init_grid', grid, broadcast=True)

@socketio.on('matrix_selected')
def handle_matrix_selected(data):
    matrix = data['matrix']
    global grid
    # Gelen matrisi mevcut grid'e kopyala
    for y in range(len(matrix)):
        for x in range(len(matrix[0])):
            grid[y][x] = matrix[y][x]
    
    update_grid()  # Fiziksel pikselleri güncelle
    emit('init_grid', grid, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, debug=True, port=5000, host="0.0.0.0")


# from flask import Flask, render_template
# from flask_socketio import SocketIO, emit
# import numpy as np
# 
# app = Flask(__name__)
# app.config['SECRET_KEY'] = 'gizli-anahtar'
# socketio = SocketIO(app, cors_allowed_origins="*")
# 
# 32x32'lik grid'i başlangıçta sıfırlarla dolduruyoruz
# grid = np.zeros((32, 32), dtype=int).tolist()
# 
# Debug görüntüleme için ana sayfa
# @app.route('/')
# def index():
#     return render_template('debug.html', grid=grid)

# @socketio.on('connect')
# def handle_connect():
#     # Bağlantı kurulduğunda mevcut grid'i gönder
#     emit('init_grid', grid)
# 
# @socketio.on('pixel_update')
# def handle_pixel_update(data):
#     # data içinde x, y koordinatları ve yeni değer olmalı
#     x = data['x']
#     y = data['y']
#     value = data['value']
#     
#     # Grid'i güncelle
#     grid[y][x] = value
#     
#     # Tüm bağlı kullanıcılara güncellenmiş pikseli bildir
#     emit('pixel_changed', data, broadcast=True)

# @socketio.on('reset_grid')
# def handle_reset():
#     global grid
#     # Grid'i sıfırla
#     grid = np.zeros((32, 32), dtype=int).tolist()
#     # Tüm bağlı kullanıcılara yeni grid'i gönder
#     emit('init_grid', grid, broadcast=True)

# if __name__ == '__main__':
#     socketio.run(app, debug=True, port=5000)