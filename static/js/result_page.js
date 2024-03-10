$(document).ready(function() {
    // Fetch the exam type from exam_type.txt and display it
    $.get('/exam_type.txt', function(data) {
        var examType = data.trim();
        $('#examType').text('Exam Type: ' + examType);
    }).fail(function() {
        console.error('Failed to retrieve exam type from exam_type.txt');
        $('#examType').text('Exam Type: N/A');
    });

    // Fetch the attempted and unattempted question counts from user_answers.txt
    $.get('/user_answers.txt', function(data) {
        var userAnswers = data.split('\n').filter(Boolean); // Remove empty lines
        var attemptedCount = userAnswers.length;
        var totalQuestionsCount = 20; // Assuming there are 20 questions in the exam

        // Calculate unattempted questions count
        var unattemptedCount = totalQuestionsCount - attemptedCount;

        // Display the attempted and unattempted counts
        $('#attemptedCount').text('Attempted Questions: ' + attemptedCount);
        $('#unattemptedCount').text('Unattempted Questions: ' + unattemptedCount);

        // Fetch the questions and correct answers from Question_doc.py
        $.get('/get_questions', { exam_type: 'math' }, function(questions) {
            var correctCount = 0;
            var incorrectCount = 0;
            var totalMarks = 0;

            // Iterate through user's answers and compare with correct answers
            userAnswers.forEach(function(userAnswer) {
                var questionNumber = parseInt(userAnswer.split(':')[0].split(' ')[1]);
                var selectedAnswer = userAnswer.split(':')[1].trim();
                var correctAnswer = questions[questionNumber - 1].correct_answer;

                if (selectedAnswer === correctAnswer) {
                    correctCount++;
                    totalMarks++;
                } else {
                    incorrectCount++;
                    totalMarks -= 0.25; // Deduct 0.25 for each incorrect answer
                }
            });

            // Display correct, incorrect counts, and total marks
            $('#correctCount').text('Correct Answers: ' + correctCount);
            $('#incorrectCount').text('Incorrect Answers: ' + incorrectCount);
            $('#totalMarks').text('Total Marks: ' + totalMarks);
        }).fail(function() {
            console.error('Failed to retrieve questions for the exam type');
            $('#correctCount').text('Correct Answers: N/A');
            $('#incorrectCount').text('Incorrect Answers: N/A');
            $('#totalMarks').text('Total Marks: N/A');
        });
    }).fail(function() {
        console.error('Failed to retrieve user answers from user_answers.txt');
        $('#attemptedCount').text('Attempted Questions: N/A');
        $('#unattemptedCount').text('Unattempted Questions: N/A');
    });

    // Bind click event to the "Back to Home" button
    $('#BacktoHome').click(function() {
        // Redirect to the home page
        window.location.href = "/";  // Assuming the home page URL is "/"
    });
});
