import RPi.GPIO as GPIO
import time
import random

# GPIO pinleri (BCM değil, fiziksel pin numaraları kullanılıyor)
PIN_DATA = 35     # DATA
PIN_CLOCK = 18    # CLOCK
PIN_STROBE = 37   # STROBE (Latch)
PIN_OE = 29       # Output Enable (aktif yüksek)

# GPIO ayarları
GPIO.setmode(GPIO.BOARD)
GPIO.setup(PIN_DATA, GPIO.OUT)
GPIO.setup(PIN_CLOCK, GPIO.OUT)
GPIO.setup(PIN_STROBE, GPIO.OUT)
GPIO.setup(PIN_OE, GPIO.OUT)

# Pinlerin ilk durumları
GPIO.output(PIN_DATA, GPIO.LOW)
GPIO.output(PIN_CLOCK, GPIO.LOW)
GPIO.output(PIN_STROBE, GPIO.LOW)
GPIO.output(PIN_OE, GPIO.HIGH)  # Aktif etmek için HIGH yapılmalı

def shift_out(data_bits):
    """40 bitlik veriyi kaydırma kayıtlarına gönderir."""
    GPIO.output(PIN_OE, GPIO.LOW)  # Önce geçici olarak çıkışı kapat

    for bit in reversed(data_bits):  # MSB'den LSB'ye
        GPIO.output(PIN_DATA, GPIO.HIGH if bit else GPIO.LOW)
        GPIO.output(PIN_CLOCK, GPIO.HIGH)
        time.sleep(0.00001)
        GPIO.output(PIN_CLOCK, GPIO.LOW)

    GPIO.output(PIN_STROBE, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(PIN_STROBE, GPIO.LOW)

    GPIO.output(PIN_OE, GPIO.HIGH)  # Çıkışı aktif et

def generate_shift_data(matrix):
    """18x18 matristen 40 bitlik shift register datası üretir."""
    bits = [0] * 40

    for row in range(18):
        for col in range(18):
            if matrix[row][col] == 1:
                bits[col] = 1              # Drain MOSFET'leri (bit 0-17)
                bits[18 + row] = 1         # Supply MOSFET'leri (bit 18-35)

    bits[36] = 0  # Solenoid için ayrılmış, kullanılmıyor
    bits[37] = 0
    bits[38] = 0
    bits[39] = 0
    return bits

def process_matrix(matrix):
    data = generate_shift_data(matrix)
    shift_out(data)

# Başlangıçta rastgele bir matris
display_matrix = [[random.randint(0, 1) for _ in range(18)] for _ in range(18)]

if __name__ == "__main__":
    previous_matrix = [[-1] * 18 for _ in range(18)]
    try:
        while True:
            if display_matrix != previous_matrix:
                process_matrix(display_matrix)
                previous_matrix = [row[:] for row in display_matrix]
            time.sleep(0.003)
    finally:
        GPIO.cleanup()
