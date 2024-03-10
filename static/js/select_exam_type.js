// select_exam_type.js
$(document).ready(function() {
    $('#proceedBtn').click(function() {
        var selectedExam = $('input[name="examType"]:checked').val();
        console.log("Selected Exam:", selectedExam); // For debugging
        if (selectedExam) {
            // Send AJAX request to Flask backend to save the selected exam type
            $.ajax({
                url: '/start_exam',
                type: 'POST',
                data: { examType: selectedExam },
                success: function(response) {
                    console.log("Selected exam type saved successfully.");
                    // Redirect to the General_instruction page
                    window.location.href = "/general_instruction";
                },
                error: function(xhr, status, error) {
                    console.error("Error saving selected exam type:", error);
                    alert("Error saving selected exam type. Please try again.");
                }
            });
        } else {
            alert("Please select an exam type.");
        }
    });
});
