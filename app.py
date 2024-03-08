# app.py

from flask import Flask, render_template, request, redirect, url_for, jsonify

app = Flask(__name__)

# Sample questions data
questions = {
    "math": [
        {"id": 1, "question": "What is 2 + 2?", "options": ["3", "4", "5", "6"], "correct_answer": "4"},
        {"id": 2, "question": "What is 5 * 5?", "options": ["20", "25", "30", "35"], "correct_answer": "25"}
    ],
    "science": [
        {"id": 1, "question": "What is the chemical symbol for water?", "options": ["H2O", "CO2", "O2", "CH4"], "correct_answer": "H2O"},
        {"id": 2, "question": "What is the freezing point of water?", "options": ["0°C", "100°C", "-273°C", "25°C"], "correct_answer": "0°C"}
    ],
    "history": [
        {"id": 1, "question": "Who was the first President of the United States?", "options": ["George Washington", "Thomas Jefferson", "Abraham Lincoln", "John Adams"], "correct_answer": "George Washington"},
        {"id": 2, "question": "In what year did World War II end?", "options": ["1941", "1943", "1945", "1947"], "correct_answer": "1945"}
    ]
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    # Here you can add logic to verify the login credentials
    username = request.form['username']
    # Assuming authentication is successful for demonstration purpose
    # Redirect to the welcome page with the username as a parameter
    return redirect(url_for('welcome', username=username))

@app.route('/welcome')
def welcome():
    username = request.args.get('username')
    return render_template('welcome.html', username=username)

@app.route('/select_exam_type')
def select_exam_type():
    return render_template('select_exam_type.html')

@app.route('/exam_conduct/<exam_type>')
def exam_conduct(exam_type):
    print("Received exam type:", exam_type)  # Add this line for debugging
    # Example time limit in seconds
    time_limit = 60 * 60  # 1 hour
    exam_questions = questions.get(exam_type, [])
    print("Questions for exam type:", exam_questions)  # Add this line for debugging
    return render_template('exam_conduct.html', exam_type=exam_type, questions=exam_questions, time_limit=time_limit)


@app.route('/get_questions')
def get_questions():
    # Fetch questions data based on exam type or from a database
    exam_type = request.args.get('exam_type')
    print("Received exam type:", exam_type)  # For debugging
    exam_questions = questions.get(exam_type, [])
    print("Questions for exam type:", exam_questions)  # For debugging
    return jsonify(exam_questions)

if __name__ == '__main__':
    app.run(debug=True)
