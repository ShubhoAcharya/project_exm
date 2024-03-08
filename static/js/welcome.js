function proceed() {
    // Here you can define the URL of the page to proceed
    window.location.href = "another_page.html";
}

// Extract the username from the URL parameter
var urlParams = new URLSearchParams(window.location.search);
var username = urlParams.get('username');

// Display the username on the welcome page
document.getElementById("username").textContent = username;
