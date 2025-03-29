// Authentication logic for TaskEase
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth forms if they exist on the page
    if (document.getElementById('loginForm')) {
        initLoginForm();
    }
    if (document.getElementById('signupForm')) {
        initSignupForm();
    }
});

function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = loginForm.email.value;
        const password = loginForm.password.value;
        const rememberMe = loginForm['remember-me'].checked;
        
        // Show loading state
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Logging in...';
        
        try {
            // Mock authentication - in a real app this would call your backend
            await mockLogin(email, password, rememberMe);
            
            // Store user session
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            
            // Redirect to dashboard or previous page
            const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '../index.html';
            window.location.href = redirectUrl;
        } catch (error) {
            showAuthError(error.message);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

function initSignupForm() {
    const signupForm = document.getElementById('signupForm');
    
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const firstName = signupForm.firstName.value;
        const lastName = signupForm.lastName.value;
        const email = signupForm.email.value;
        const password = signupForm.password.value;
        const confirmPassword = signupForm.confirmPassword.value;
        const accountType = signupForm.accountType.value;
        const acceptedTerms = signupForm.terms.checked;
        
        // Validate password match
        if (password !== confirmPassword) {
            showAuthError("Passwords don't match");
            return;
        }
        
        // Validate terms acceptance
        if (!acceptedTerms) {
            showAuthError("You must accept the terms and conditions");
            return;
        }
        
        // Show loading state
        const submitButton = signupForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Creating account...';
        
        try {
            // Mock registration - in a real app this would call your backend
            await mockSignup(firstName, lastName, email, password, accountType);
            
            // Store user session
            localStorage.setItem('isAuthenticated', 'true');
            localStorage.setItem('userEmail', email);
            localStorage.setItem('accountType', accountType);
            localStorage.setItem('userName', `${firstName} ${lastName}`);
            
            // Redirect to appropriate dashboard
            const redirectUrl = accountType === 'taskWorker' ? '../tasks/browse.html' : '../tasks/create.html';
            window.location.href = redirectUrl;
        } catch (error) {
            showAuthError(error.message);
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Mock authentication functions
async function mockLogin(email, password, rememberMe) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simple validation for demo purposes
            if (email && password.length >= 8) {
                resolve({ success: true });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 1000);
    });
}

async function mockSignup(firstName, lastName, email, password, accountType) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simple validation for demo purposes
            if (firstName && lastName && email && password.length >= 8) {
                resolve({ success: true });
            } else {
                reject(new Error('Please fill all fields correctly'));
            }
        }, 1500);
    });
}

function showAuthError(message) {
    // Remove any existing error messages
    const existingError = document.querySelector('.auth-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and display new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'auth-error bg-red-50 border-l-4 border-red-500 p-4 mb-4';
    errorElement.innerHTML = `
        <div class="flex">
            <div class="flex-shrink-0">
                <i class="fas fa-exclamation-circle text-red-500"></i>
            </div>
            <div class="ml-3">
                <p class="text-sm text-red-700">${message}</p>
            </div>
        </div>
    `;
    
    // Insert error message at the top of the form
    const form = document.querySelector('form');
    form.insertBefore(errorElement, form.firstChild);
}

// Check authentication status
function checkAuth() {
    return localStorage.getItem('isAuthenticated') === 'true';
}

// Get current user
function getCurrentUser() {
    if (checkAuth()) {
        return {
            email: localStorage.getItem('userEmail'),
            name: localStorage.getItem('userName'),
            accountType: localStorage.getItem('accountType')
        };
    }
    return null;
}

// Logout function
function logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accountType');
    localStorage.removeItem('userName');
    window.location.href = 'auth/login.html';
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        mockLogin,
        mockSignup,
        checkAuth,
        getCurrentUser,
        logout
    };
}