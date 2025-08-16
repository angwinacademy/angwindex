// Authentication module
let isAuthenticated = false;

function attemptLogin() {
    const password = document.getElementById('passwordInput').value;
    const errorDiv = document.getElementById('loginError');
    
    debugModule.updateDebugInfo(`Login attempt with password length: ${password.length}`);
    
    if (password === CONFIG.DASHBOARD_PASSWORD) {
        sessionStorage.setItem('tutoring_auth', 'authenticated');
        isAuthenticated = true;
        showDashboard();
        errorDiv.style.display = 'none';
        debugModule.updateDebugInfo('Login successful');
    } else {
        errorDiv.textContent = 'Incorrect password. Please try again.';
        errorDiv.style.display = 'block';
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
        debugModule.updateDebugInfo('Login failed - incorrect password');
        
        // Shake animation
        const loginContainer = document.querySelector('.login-container');
        loginContainer.style.animation = 'shake 0.5s';
        setTimeout(() => {
            loginContainer.style.animation = '';
        }, 500);
    }
}

function logout() {
    sessionStorage.removeItem('tutoring_auth');
    isAuthenticated = false;
    showLogin();
    document.getElementById('passwordInput').value = '';
    debugModule.updateDebugInfo('User logged out');
}

function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainDashboard').style.display = 'block';
    isAuthenticated = true;
    
    debugModule.updateDebugInfo('Dashboard shown, loading data...');
    
    // Load data from Google Sheets
    dataModule.loadGoogleSheetsData();
}

function checkAuthentication() {
    debugModule.updateDebugInfo('Page loaded, checking authentication');
    
    // Check if already authenticated
    const savedAuth = sessionStorage.getItem('tutoring_auth');
    if (savedAuth === 'authenticated') {
        showDashboard();
    } else {
        showLogin();
    }
}

function setupAuthEventListeners() {
    document.getElementById('loginBtn').addEventListener('click', attemptLogin);
    document.getElementById('passwordInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    // Auto-focus password input
    setTimeout(() => {
        const passwordInput = document.getElementById('passwordInput');
        if (passwordInput) {
            passwordInput.focus();
        }
    }, 100);
}