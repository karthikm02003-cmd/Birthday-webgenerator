from flask import Flask, render_template, request, redirect, url_for, send_from_directory
import os
import uuid

app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'mp4', 'mov', 'avi', 'mkv'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and \
           filename.split('.')[-1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    username = request.form['username']
    media_file = request.files['media']
    
    if media_file and allowed_file(media_file.filename):
        filename = f"{uuid.uuid4()}{os.path.splitext(media_file.filename)[1]}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        
        try:
            media_file.save(file_path)
        except Exception as e:
            return f"An error occurred while saving the file: {str(e)}", 500
            
        return render_template('greeting.html', username=username, filename=filename)
    
    return "Invalid file type. Supported formats: Images (JPEG, PNG, GIF, SVG, WEBP) and Videos (MP4, MOV, AVI, MKV)", 400

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

if __name__ == '__main__':
    app.run(debug=True)