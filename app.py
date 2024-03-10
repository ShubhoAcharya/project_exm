from flask import Flask, render_template, request, redirect, url_for, jsonify, send_from_directory
import os

app = Flask(__name__)

# Function to save selected exam type to a document
def save_selected_exam(selected_exam, file_path):
    filename = os.path.join(file_path, "exam_type.txt")
    try:
        # Save the selected exam type to the file
        with open(filename, "w") as file:
            file.write(selected_exam)
        print("Selected exam type saved successfully.")
    except Exception as e:
        print("Error saving selected exam type:", str(e))
        # Print the current working directory for debugging
        print("Current working directory:", os.getcwd())

# Function to clear the user_answers.txt file
def clear_user_answers():
    with open('user_answers.txt', 'w') as file:
        file.write('')
    print("User answers cleared successfully.")

# Import questions from Question_doc module
from Question_doc import questions

# Function to calculate the correct and incorrect answers
def calculate_results(exam_type):
    correct_answers = 0
    incorrect_answers = 0
    total_questions = len(questions.get(exam_type, []))

    with open('user_answers.txt', 'r') as file:
        user_answers = file.readlines()

    for user_answer in user_answers:
        question_number, user_response = user_answer.strip().split(':')
        question_number = int(question_number.split()[1])

        # Get the correct answer for the question
        question = next((q for q in questions.get(exam_type, []) if q['id'] == question_number), None)
        if question:
            correct_answer = question['correct_answer']
            if user_response.strip() == correct_answer:
                correct_answers += 1
            else:
                incorrect_answers += 1

    # Calculate total marks
    total_marks = correct_answers + (1 * correct_answers) - (0.2 * incorrect_answers)

    return correct_answers, incorrect_answers, total_questions, total_marks

@app.route('/')
def Home():
    return render_template('Home.html')

@app.route('/index')
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

@app.route('/general_instruction')
def general_instruction():
    return render_template('general_instruction.html')

@app.route('/exam_conduct')
def exam_conduct():
    # Retrieve the selected exam type from the exam_type.txt file
    with open('exam_type.txt', 'r') as file:
        selected_exam = file.read().strip()
    # Example time limit in seconds
    time_limit = 60 * 60  # 1 hour
    exam_questions = questions.get(selected_exam, [])
    return render_template('exam_conduct.html', exam_type=selected_exam, questions=exam_questions, time_limit=time_limit)

@app.route('/get_questions')
def get_questions():
    # Fetch questions data based on exam type or from a database
    exam_type = request.args.get('exam_type')
    exam_questions = questions.get(exam_type, [])
    return jsonify(exam_questions)

@app.route('/start_exam', methods=['GET', 'POST'])
def start_exam():
    if request.method == 'POST':
        selected_exam = request.form['examType']
        project_directory = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current script
        save_selected_exam(selected_exam, project_directory)  # Save in the current working directory
        
        # Clear user answers when the exam starts
        clear_user_answers()
        
        return redirect(url_for('exam_conduct'))
    else:
        return redirect(url_for('general_instruction'))

@app.route('/exam_type.txt')
def serve_exam_type():
    return send_from_directory(app.root_path, 'exam_type.txt')

# Function to save the answer to user_answers.txt
@app.route('/save_answer', methods=['POST'])
def save_answer():
    data = request.form.get('data')
    if data:
        question_number, answer = data.split(':')
        question_number = question_number.strip().split()[-1]  # Extract the question number
        question_number = int(question_number)
        
        # Check if an answer for the current question already exists
        with open('user_answers.txt', 'r') as file:
            lines = file.readlines()
        with open('user_answers.txt', 'w') as file:
            for line in lines:
                q_num = int(line.split(':')[0].split()[-1])
                if q_num != question_number:
                    file.write(line)
            # Write the new answer
            file.write(data.strip() + '\n')
            
        return 'Answer saved successfully.', 200
    else:
        return 'Failed to save answer.', 400
    
@app.route('/result')
def result():
    # Retrieve the selected exam type from the exam_type.txt file
    with open('exam_type.txt', 'r') as file:
        exam_type = file.read().strip()
    
    # Calculate results
    correct_answers, incorrect_answers, total_questions, total_marks = calculate_results(exam_type)
    
    # Calculate the number of attempted questions
    with open('user_answers.txt', 'r') as file:
        attempted_questions = len(file.readlines())
    
    return render_template('result_page.html', exam_type=exam_type, correct_answers=correct_answers, 
                           incorrect_answers=incorrect_answers, total_questions=total_questions,
                           attempted_questions=attempted_questions, total_marks=total_marks)


@app.route('/result_data')
def result_data():
    # Retrieve the selected exam type from the exam_type.txt file
    with open('exam_type.txt', 'r') as file:
        exam_type = file.read().strip()
    
    # Calculate results
    correct_answers, incorrect_answers, total_questions, total_marks = calculate_results(exam_type)
    
    return jsonify({
        'examType': exam_type,
        'correctAnswers': correct_answers,
        'incorrectAnswers': incorrect_answers,
        'totalQuestions': total_questions,
        'attemptedQuestions': len(open('user_answers.txt').readlines()),
        'totalMarks': total_marks
    })

if __name__ == '__main__':
    app.run(debug=True)
