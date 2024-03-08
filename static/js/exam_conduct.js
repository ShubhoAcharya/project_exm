// exam_conduct.js

$(document).ready(function() {
    var currentQuestionIndex = 0;
    var questions = [];
    
    // Function to initialize questions
    function initializeQuestions(examType) {
        // Retrieve questions data from the server-side based on the selected exam type
        $.get('/get_questions', { exam_type: examType }, function(data) {
            questions = data;
            showQuestion(currentQuestionIndex);
        });
    }
    
    // Initialize questions for the default exam type
    initializeQuestions('math');
    
    // Add event listener to select element to dynamically load questions based on selected exam type
    $('#examType').change(function() {
        var selectedExamType = $(this).val();
        initializeQuestions(selectedExamType);
    });
    
    // Function to show a specific question
    function showQuestion(index) {
        $('#question').text(questions[index].question);
        var optionsHtml = '';
        questions[index].options.forEach(function(option) {
            optionsHtml += '<label><input type="radio" name="answer" value="' + option + '"> ' + option + '</label><br>';
        });
        $('#options').html(optionsHtml);
    }
    
    // Function to handle save and next button click
    $('#saveAndNextBtn').click(function() {
        // Save the selected answer for the current question (if any)
        var selectedAnswer = $('input[name="answer"]:checked').val();
        console.log('Question ' + (currentQuestionIndex + 1) + ' - Selected Answer: ' + selectedAnswer);
        
        // Move to the next question or end the exam if no more questions
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion(currentQuestionIndex);
        } else {
            // End of the exam, you can add logic here
            console.log('End of the exam');
        }
    });

    // Function to handle clear responses button click
    $('#clearResponsesBtn').click(function() {
        // Clear all selected radio button responses
        $('input[type="radio"]').prop('checked', false);
    });
});
