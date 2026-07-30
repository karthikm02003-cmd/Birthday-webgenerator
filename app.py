from flask import Flask, render_template, request, redirect, url_for
import os
import uuid

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(app.static_folder, 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        name = request.form['name']
        files = request.files.getlist('media')
        unique_id = uuid.uuid4().hex[:8]
        upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], unique_id)
        os.makedirs(upload_dir, exist_ok=True)
        for file in files:
            file.save(os.path.join(upload_dir, file.filename))
        with open(os.path.join(upload_dir, 'name.txt'), 'w') as f:
            f.write(name)
        return redirect(url_for('birthday_page', id=unique_id))
    return render_template('index.html')

@app.route('/bday/<id>')
def birthday_page(id):
    upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], id)
    with open(os.path.join(upload_dir, 'name.txt'), 'r') as f:
        name = f.read().strip()
    files = [f for f in os.listdir(upload_dir) if os.path.splitext(f)[1].lower() in ['.jpg', '.png', '.mp4', '.mov']]
    return render_template('bday.html', name=name, files=files, id=id)

if __name__ == '__main__':
    app.run(debug=True)