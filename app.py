"""
WildGuard AI – IoT Wildlife Monitoring & Alert System
Flask backend with SQLite, APIs, and automatic dependency download.
"""
import os, sqlite3, datetime, base64, io, json
from flask import Flask, render_template, request, jsonify, session, send_from_directory
from PIL import Image
import requests
from utils.helpers import ensure_static_libs

app = Flask(__name__)
app.secret_key = 'wildguard_secret_2025'

# ---------- Database Init ----------
DB_PATH = os.path.join('database', 'wildguard.db')
def init_db():
    os.makedirs('database', exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)''')
    c.execute('''CREATE TABLE IF NOT EXISTS detections
                 (id INTEGER PRIMARY KEY AUTOINCREMENT, animal TEXT, confidence REAL,
                  timestamp TEXT, image_path TEXT, alert_status INTEGER DEFAULT 1)''')
    conn.commit()
    conn.close()

init_db()

# ---------- Routes ----------
@app.route('/')
def dashboard():
    return render_template('index.html')

@app.route('/login')
def login_page():
    return render_template('login.html')

@app.route('/register')
def register_page():
    return render_template('register.html')

@app.route('/forgot-password')
def forgot_password():
    return render_template('forgot_password.html')

@app.route('/static/<path:path>')
def static_files(path):
    return send_from_directory('static', path)

# ---------- API ----------
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, password))
        conn.commit()
        return jsonify({'message': 'User registered successfully'})
    except sqlite3.IntegrityError:
        return jsonify({'error': 'Username already exists'}), 409
    finally:
        conn.close()

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=? AND password=?", (username, password))
    user = c.fetchone()
    conn.close()
    if user:
        session['user'] = username
        return jsonify({'message': 'Login successful', 'user': username})
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logged out'})

@app.route('/api/detections', methods=['GET'])
def get_detections():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT * FROM detections ORDER BY timestamp DESC LIMIT 200")
    rows = c.fetchall()
    conn.close()
    detections = []
    for row in rows:
        detections.append({
            'id': row[0],
            'animal': row[1],
            'confidence': row[2],
            'timestamp': row[3],
            'image_path': row[4],
            'alert_status': row[5]
        })
    return jsonify(detections)

@app.route('/api/detections', methods=['POST'])
def add_detection():
    data = request.json
    animal = data.get('animal')
    confidence = data.get('confidence', 0.0)
    timestamp = data.get('timestamp', datetime.datetime.utcnow().isoformat())
    image_data = data.get('image')   # base64 data URL
    alert_status = data.get('alert_status', 1)
    if not animal:
        return jsonify({'error': 'Animal type required'}), 400

    image_path = None
    if image_data:
        # decode and save
        header, encoded = image_data.split(',', 1)
        img_bytes = base64.b64decode(encoded)
        img = Image.open(io.BytesIO(img_bytes))
        filename = f"wild_det_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S_%f')}.png"
        save_path = os.path.join('static', 'uploads', filename)
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        img.save(save_path)
        image_path = 'uploads/' + filename

    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("INSERT INTO detections (animal, confidence, timestamp, image_path, alert_status) VALUES (?,?,?,?,?)",
              (animal, confidence, timestamp, image_path, alert_status))
    conn.commit()
    new_id = c.lastrowid
    conn.close()
    return jsonify({'id': new_id, 'message': 'Detection saved'}), 201

@app.route('/api/detections/<int:id>', methods=['DELETE'])
def delete_detection(id):
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("SELECT image_path FROM detections WHERE id=?", (id,))
    row = c.fetchone()
    if row and row[0]:
        try:
            os.remove(os.path.join('static', row[0]))
        except:
            pass
    c.execute("DELETE FROM detections WHERE id=?", (id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Deleted'})

@app.route('/api/simulate', methods=['GET'])
def simulate_status():
    # Return dynamic device status
    return jsonify({
        'battery': 85,
        'solar_charging': True,
        'temperature': 24.5,
        'network': 4,
        'storage_used': 32,
        'camera_health': 'Operational',
        'pir_sensor': 'Active',
        'coordinates': {'lat': 37.7749, 'lng': -122.4194}
    })

# ---------- Startup ----------
if __name__ == '__main__':
    ensure_static_libs()   # download Bootstrap, Leaflet, Chart.js if missing
    app.run(debug=True, host='0.0.0.0', port=5000)