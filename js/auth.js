document.addEventListener('DOMContentLoaded', function() {
    //yele chai signup form submission handle garx
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.getElementById('role').value;

            const userData = { username, email, password, role };

            fetch('php/signup.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    window.location.href = 'login.html'; //login page ma rederict garx
                } else {
                    alert(data.message);
                }
            });
        });
    }

        // Signup page redirection handle garx
        const signupButton = document.getElementById('signup-button');
        if (signupButton) {
            signupButton.addEventListener('click', function() {
                window.location.href = 'signup.html';  // signup page ma redirect garx
            });
        }

    //yele chai login form submission handle garx
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const loginData = { email, password };

            fetch('php/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = data.redirect; // role anusar page ma redirect garc either admin/ either index ma
                } else {
                    alert(data.message);
                }
            });
        });
    }
});
