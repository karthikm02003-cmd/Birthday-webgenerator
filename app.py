from flask import Flask, render_template, request, redirect, url_for
import os
import uuid
import random

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.static_folder = 'static'  # Ensures CSS is served correctly

# In-memory storage for generated pages
generated_pages = {}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    name = request.form['name']
    page_id = str(uuid.uuid4().hex)
    upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], page_id)
    os.makedirs(upload_dir, exist_ok=True)
    
    files_saved = []
    for file in request.files.getlist('media'):
        if file.filename == '':
            continue
        filename = os.path.basename(file.filename)
        file.save(os.path.join(upload_dir, filename))
        files_saved.append(filename)
    
    generated_pages[page_id] = {'name': name, 'files': files_saved}
    return redirect(url_for('view_page', id=page_id))

@app.route('/bday/<id>')
def view_page(id):
    if id not in generated_pages:
        return "Page not found", 404
    data = generated_pages[id]
    name = data['name']
    files = data['files']
    
    html_content = f'''
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Happy Birthday {name}!</title>
        <link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}">
    </head>
    <body>
        <h1 class="birthday-message">Happy Birthday {name}!</h1>
        
        <!-- Confetti -->
        {confetti_html()}
        
        <!-- Balloons -->
        {balloons_html()}
        
        <!-- Media -->
        {media_html(files, id)}
    </body>
    </html>
    '''
    return html_content

def confetti_html():
    html = ''
    for _ in range(30):
        x = f"{random.uniform(0, 100):.0f}vw"
        y = f"{random.uniform(0, 100):.0f}vh"
        html += f'<div class="confetti" style="left: {x}; top: {y};"></div>\n'
    return html

def balloons_html():
    html = ''
    for _ in range(5):
        x = f"{random.uniform(0, 100):.0f}vw"
        y = f"{random.uniform(0, 100):.0f}vh"
        html += f'<div class="balloon" style="left: {x}; top: {y};"></div>\n'
    return html

def media_html(files, id):
    html = ''
    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            html += f'<img src="static/uploads/{id}/{filename}" alt="{filename}" class="birthday-image">\n'
        elif filename.lower().endswith(('.mp4', '.webm')):
            html += f'<video controls src="static/uploads/{id}/{filename}" class="birthday-video"></video>\n'
    return html

if __name__ == '__main__':
    app.run(debug=True)