// Function to handle regular login (without fetch)
function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // You can add logic to handle login here
    // For now, we just log the values to the console
    console.log("Username:", username);
    console.log("Password:", password);

    // Redirect to the welcome page with the username as a parameter
    window.location.href = "/welcome?username=" + username;
}

// Function to handle exiting
function exit() {
    window.location.href = "/";
}


// Function to toggle password visibility with eye icon
function togglePasswordVisibility() {
    var passwordInput = document.getElementById("password");
    var passwordIcon = document.getElementById("passwordIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.classList.remove("fa-eye");
        passwordIcon.classList.add("fa-eye-slash");
    } else {
        passwordInput.type = "password";
        passwordIcon.classList.remove("fa-eye-slash");
        passwordIcon.classList.add("fa-eye");
    }
}
