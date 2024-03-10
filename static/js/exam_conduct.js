$(document).ready(function() {
    var currentQuestionIndex = 0;
    var questions = [];
    var examDuration = 60 * 60; // 60 minutes in seconds

    // Function to initialize questions
    function initializeQuestions(examType) {
        // Retrieve questions data from the server-side based on the selected exam type
        $.get('/get_questions', { exam_type: examType }, function(data) {
            questions = data;
            showQuestion(currentQuestionIndex);
        }).fail(function() {
            // Handle failure to retrieve questions
            console.error('Failed to retrieve questions for exam type:', examType);
            $('#error').text('Failed to retrieve questions. Please try again later.');
        });
    }

    // Initialize questions using the exam type from the exam_type.txt file
    $.get('/exam_type.txt', function(data) {
        var examType = data.trim();
        initializeQuestions(examType);
    }).fail(function() {
        // Handle failure to retrieve exam type
        console.error('Failed to retrieve exam type from exam_type.txt');
        $('#error').text('Failed to retrieve exam type. Please try again later.');
    });

    // Function to show a specific question
    function showQuestion(index) {
        var questionNumber = index + 1;
        $('#question').html('<p class="question-number">Question ' + questionNumber + '</p>' +
            '<p class="marking-scheme">Correct Answer: +1, Incorrect Answer: -0.25</p>' +
            questions[index].question);
        var optionsHtml = '';
        questions[index].options.forEach(function(option) {
            optionsHtml += '<label><input type="radio" name="answer" value="' + option + '"> ' + option + '</label><br>';
        });
        $('#options').html(optionsHtml);
    }

    // Function to handle back button click
    $('#backBtn').click(function() {
        // Move to the previous question or stay on the first question if already at the beginning
        currentQuestionIndex--;
        if (currentQuestionIndex < 0) {
            currentQuestionIndex = 0;
        }
        showQuestion(currentQuestionIndex);
    });

    // Function to handle save and next button click
    $('#saveAndNextBtn').click(function() {
        // Save the selected answer for the current question (if any)
        var selectedAnswer = $('input[name="answer"]:checked').val();
        if (selectedAnswer !== undefined) {
            console.log('Question ' + (currentQuestionIndex + 1) + ': ' + selectedAnswer);
            // Save the selected answer
            saveAnswer(currentQuestionIndex + 1, selectedAnswer);
        }

        // Display the next question or end the exam if no more questions
        if (currentQuestionIndex < questions.length - 1) {
            // Move to the next question
            currentQuestionIndex++;
            showQuestion(currentQuestionIndex);
        } else {
            // End of the exam, you can add logic here
            console.log('End of the exam');
            // Automatically submit the exam after the specified duration
            setTimeout(function() {
                $('#submitBtn').click();
            }, examDuration * 1000); // Convert seconds to milliseconds
        }
    });

    // Function to handle clear responses button click
    $('#clearResponsesBtn').click(function() {
        // Clear all selected radio button responses
        $('input[type="radio"]').prop('checked', false);
    });

    // Function to save the answer to user_answers.txt
    function saveAnswer(questionNumber, answer) {
        var data = 'Question ' + questionNumber + ': ' + answer + '\n';
        $.post('/save_answer', { data: data }, function(response) {
            console.log(response);
        }).fail(function() {
            console.error('Failed to save answer.');
        });
    }

    // Function to update the timer
    function updateTimer() {
        var currentTime = new Date().getTime(); // Current time in milliseconds
        var endTime = currentTime + examDuration * 1000; // End time in milliseconds

        // Update the timer every second
        var timerInterval = setInterval(function() {
            var now = new Date().getTime(); // Current time in milliseconds
            var distance = endTime - now; // Remaining time in milliseconds

            // Calculate minutes and seconds
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Display the timer
            $('#timeRemaining').text(('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));

            // Check if the timer has expired
            if (distance < 0) {
                clearInterval(timerInterval); // Stop the timer
                $('#submitBtn').click(); // Automatically submit the exam
            }
        }, 1000); // Update every second
    }

    // Call updateTimer to start the countdown
    updateTimer();

    // Function to handle submit button click
    $('#submitBtn').click(function() {
        // Redirect to the result page when the submit button is clicked
        window.location.href = "/result";
    });
});
