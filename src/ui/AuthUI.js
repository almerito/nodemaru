/**
 * AuthUI.js
 * Handles Authentication UI events (Login, Register, Profile, Toast)
 */

import { authManager } from '../core/AuthManager.js';

export class AuthUI {
    constructor(editor) {
        this.editor = editor;
        this.setupEvents();
    }

    // Public method delegated from Editor
    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return; // Safety check
        const toast = document.createElement('div');
        toast.classList.add('toast', type);
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Internal method to update UI state
    updateAuthUI(user, isLoggedIn) {
        const authGuestSection = document.getElementById('auth-guest');
        const authUserSection = document.getElementById('auth-user');
        const userDisplayName = document.getElementById('user-display-name');

        if (authGuestSection && authUserSection && userDisplayName) {
            if (isLoggedIn && user) {
                authGuestSection.style.display = 'none';
                authUserSection.style.display = 'flex';
                userDisplayName.textContent = user.username || user.email.split('@')[0];
            } else {
                authGuestSection.style.display = 'flex';
                authUserSection.style.display = 'none';
                userDisplayName.textContent = '';
            }
        }
    }

    setupEvents() {
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const profileModal = document.getElementById('profile-modal');

        // Listen to auth state changes - bind 'this'
        authManager.onAuthChange((user, isLoggedIn) => this.updateAuthUI(user, isLoggedIn));

        // Initial UI update
        this.updateAuthUI(authManager.getUser(), authManager.isLoggedIn());

        // Check for auth callback params in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('auth_success') === '1') {
            this.showToast('Login successful!', 'success');
            window.history.replaceState({}, document.title, window.location.pathname);
            authManager.checkSession();
        } else if (urlParams.get('auth_error')) {
            this.showToast('Login failed: ' + urlParams.get('auth_error'), 'error');
            window.history.replaceState({}, document.title, window.location.pathname);
        }

        // Open Login Modal
        document.getElementById('btn-login')?.addEventListener('click', () => {
            loginModal.classList.remove('hidden');
            document.getElementById('login-email').focus();
        });

        // Open Register Modal
        document.getElementById('btn-register')?.addEventListener('click', () => {
            registerModal.classList.remove('hidden');
            document.getElementById('register-first-name')?.focus();
        });

        // Close modals
        document.querySelectorAll('.btn-close-modal').forEach(btn => {
            btn.addEventListener('click', () => {
                loginModal.classList.add('hidden');
                registerModal.classList.add('hidden');
                profileModal?.classList.add('hidden');
            });
        });

        // Switch between login/register
        document.getElementById('switch-to-register')?.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('hidden');
            registerModal.classList.remove('hidden');
        });

        document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.classList.add('hidden');
            loginModal.classList.remove('hidden');
        });

        // Login Form Submit
        document.getElementById('login-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            const submitBtn = document.getElementById('btn-login-submit');

            errorDiv.style.display = 'none';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const result = await authManager.login(email, password);

            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            if (result.success) {
                loginModal.classList.add('hidden');
                this.showToast('Login successful!', 'success');
                document.getElementById('login-form').reset();
            } else {
                errorDiv.textContent = result.error || 'Login failed';
                errorDiv.style.display = 'block';
            }
        });

        // Register Form Submit
        document.getElementById('register-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('register-first-name')?.value.trim() || '';
            const lastName = document.getElementById('register-last-name')?.value.trim() || '';
            const nickname = document.getElementById('register-nickname')?.value.trim() || '';
            const email = document.getElementById('register-email').value.trim();
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const errorDiv = document.getElementById('register-error');
            const submitBtn = document.getElementById('btn-register-submit');

            errorDiv.style.display = 'none';

            // Validation
            if (!firstName || !lastName || !nickname) {
                errorDiv.textContent = 'All fields are required';
                errorDiv.style.display = 'block';
                return;
            }

            if (password !== passwordConfirm) {
                errorDiv.textContent = 'Passwords do not match';
                errorDiv.style.display = 'block';
                return;
            }

            if (password.length < 6) {
                errorDiv.textContent = 'Password must be at least 6 characters';
                errorDiv.style.display = 'block';
                return;
            }

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const result = await authManager.register({
                first_name: firstName,
                last_name: lastName,
                nickname: nickname,
                email: email,
                password: password
            });

            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            if (result.success) {
                registerModal.classList.add('hidden');
                this.showToast('Account created successfully!', 'success');
                document.getElementById('register-form').reset();
            } else {
                errorDiv.textContent = result.error || 'Registration failed';
                errorDiv.style.display = 'block';
            }
        });

        // Google Login Buttons
        document.getElementById('btn-google-login')?.addEventListener('click', () => {
            authManager.loginWithGoogle();
        });

        document.getElementById('btn-google-register')?.addEventListener('click', () => {
            authManager.loginWithGoogle();
        });

        // Logout Button
        document.getElementById('btn-logout')?.addEventListener('click', async () => {
            const result = await authManager.logout();
            if (result.success) {
                this.showToast('Logged out successfully', 'info');
            }
        });

        // Profile Edit - Click on username to open profile modal
        document.getElementById('user-display-name')?.addEventListener('click', async () => {
            if (!authManager.isLoggedIn()) return;

            // Load profile data
            const profileResult = await authManager.getProfile();
            if (profileResult.success && profileResult.user) {
                const user = profileResult.user;
                // Safety check for elements
                if (document.getElementById('profile-first-name')) {
                    document.getElementById('profile-first-name').value = user.first_name || '';
                    document.getElementById('profile-last-name').value = user.last_name || '';
                    document.getElementById('profile-nickname').value = user.nickname || '';
                    document.getElementById('profile-email').value = user.email || '';
                    document.getElementById('profile-password').value = '';
                    document.getElementById('profile-password-confirm').value = '';
                    document.getElementById('profile-error').style.display = 'none';
                }
                profileModal.classList.remove('hidden');
            } else {
                this.showToast('Failed to load profile', 'error');
            }
        });

        // Profile Form Submit
        document.getElementById('profile-form')?.addEventListener('submit', async (e) => {
            e.preventDefault();
            const firstName = document.getElementById('profile-first-name').value.trim();
            const lastName = document.getElementById('profile-last-name').value.trim();
            const nickname = document.getElementById('profile-nickname').value.trim();
            const password = document.getElementById('profile-password').value;
            const passwordConfirm = document.getElementById('profile-password-confirm').value;
            const errorDiv = document.getElementById('profile-error');
            const submitBtn = document.getElementById('btn-profile-submit');

            errorDiv.style.display = 'none';

            // Validation
            if (!firstName || !lastName || !nickname) {
                errorDiv.textContent = 'First name, last name, and nickname are required';
                errorDiv.style.display = 'block';
                return;
            }

            // Password validation (only if provided)
            if (password) {
                if (password !== passwordConfirm) {
                    errorDiv.textContent = 'Passwords do not match';
                    errorDiv.style.display = 'block';
                    return;
                }
                if (password.length < 6) {
                    errorDiv.textContent = 'Password must be at least 6 characters';
                    errorDiv.style.display = 'block';
                    return;
                }
            }

            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            const profileData = {
                first_name: firstName,
                last_name: lastName,
                nickname: nickname
            };

            // Only include password if provided
            if (password) {
                profileData.password = password;
            }

            const result = await authManager.updateProfile(profileData);

            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');

            if (result.success) {
                profileModal.classList.add('hidden');
                this.showToast('Profile updated successfully!', 'success');
            } else {
                errorDiv.textContent = result.error || 'Failed to update profile';
                errorDiv.style.display = 'block';
            }
        });
    }
}
