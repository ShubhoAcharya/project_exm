$(document).ready(function() {
    $('#startExamBtn').click(function() {
        var selectedExam = $('input[name="examType"]:checked').val();
        console.log("Selected Exam:", selectedExam); // For debugging
        if (selectedExam) {
            // Fetch questions for the selected exam type
            $.get('/get_questions', { exam_type: selectedExam }, function(data) {
                // Redirect to the exam conduct page with the selected exam type
                window.location.href = "/exam_conduct/" + selectedExam;
            });
        } else {
            alert("Please select an exam type.");
        }
    });
});
