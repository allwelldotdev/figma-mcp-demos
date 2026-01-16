document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');

            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();

            if (!username || !password) {
                alert('Please enter both username and password.');
                return;
            }

            console.log('Login attempt:', { username });
            alert(`Login attempt for user: ${username}`);

            // Reset form
            loginForm.reset();
        });
    }
});
