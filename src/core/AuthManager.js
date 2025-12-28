/**
 * Authentication Manager for Nodemaru Visual Composer
 * Handles user authentication, registration, login, logout, profile update, and Google OAuth
 */

class AuthManager {
    constructor() {
        this.apiUrl = './api/auth.php';
        this.user = null;
        this.listeners = [];

        // Check session on initialization
        this.checkSession();
    }

    /**
     * Add listener for auth state changes
     * @param {Function} callback - Called with (user, isLoggedIn)
     */
    onAuthChange(callback) {
        this.listeners.push(callback);
    }

    /**
     * Notify all listeners of auth state change
     */
    notifyListeners() {
        const isLoggedIn = this.user !== null;
        this.listeners.forEach(cb => cb(this.user, isLoggedIn));
    }

    /**
     * Check current session
     * @returns {Promise<Object|null>} User object or null
     */
    async checkSession() {
        try {
            const response = await fetch(`${this.apiUrl}?action=session`, {
                credentials: 'include'
            });
            const result = await response.json();

            if (result.success && result.loggedIn) {
                this.user = result.user;
            } else {
                this.user = null;
            }

            this.notifyListeners();
            return this.user;
        } catch (e) {
            console.error('Session check failed:', e);
            this.user = null;
            this.notifyListeners();
            return null;
        }
    }

    /**
     * Register a new user
     * @param {Object} userData - { first_name, last_name, nickname, email, password }
     * @returns {Promise<Object>} Result with success status and user/error
     */
    async register(userData) {
        try {
            const response = await fetch(`${this.apiUrl}?action=register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(userData)
            });

            const result = await response.json();

            if (result.success) {
                this.user = result.user;
                this.notifyListeners();
            }

            return result;
        } catch (e) {
            return { success: false, error: 'Network error: ' + e.message };
        }
    }

    /**
     * Login with email and password
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>} Result with success status and user/error
     */
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}?action=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (result.success) {
                this.user = result.user;
                this.notifyListeners();
            }

            return result;
        } catch (e) {
            return { success: false, error: 'Network error: ' + e.message };
        }
    }

    /**
     * Logout current user
     * @returns {Promise<Object>} Result with success status
     */
    async logout() {
        try {
            const response = await fetch(`${this.apiUrl}?action=logout`, {
                credentials: 'include'
            });

            const result = await response.json();

            this.user = null;
            this.notifyListeners();

            return result;
        } catch (e) {
            this.user = null;
            this.notifyListeners();
            return { success: false, error: 'Network error: ' + e.message };
        }
    }

    /**
     * Get user profile
     * @returns {Promise<Object>} User profile data
     */
    async getProfile() {
        try {
            const response = await fetch(`${this.apiUrl}?action=profile`, {
                credentials: 'include'
            });

            return await response.json();
        } catch (e) {
            return { success: false, error: 'Network error: ' + e.message };
        }
    }

    /**
     * Update user profile
     * @param {Object} profileData - { first_name, last_name, nickname, password? }
     * @returns {Promise<Object>} Result with success status and updated user/error
     */
    async updateProfile(profileData) {
        try {
            const response = await fetch(`${this.apiUrl}?action=update_profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(profileData)
            });

            const result = await response.json();

            if (result.success) {
                this.user = result.user;
                this.notifyListeners();
            }

            return result;
        } catch (e) {
            return { success: false, error: 'Network error: ' + e.message };
        }
    }

    /**
     * Initiate Google OAuth login
     * Opens a popup or redirects to Google login
     */
    loginWithGoogle() {
        // Redirect to Google OAuth flow
        window.location.href = `${this.apiUrl}?action=google_login`;
    }

    /**
     * Check if user is currently logged in
     * @returns {boolean}
     */
    isLoggedIn() {
        return this.user !== null;
    }

    /**
     * Get current user
     * @returns {Object|null}
     */
    getUser() {
        return this.user;
    }

    /**
     * Get user display name (nickname preferred, then username, then email prefix)
     * @returns {string}
     */
    getDisplayName() {
        if (this.user) {
            return this.user.nickname || this.user.username || this.user.email.split('@')[0];
        }
        return 'Guest';
    }

    /**
     * Get user full name
     * @returns {string}
     */
    getFullName() {
        if (this.user && this.user.first_name && this.user.last_name) {
            return `${this.user.first_name} ${this.user.last_name}`;
        }
        return this.getDisplayName();
    }
}

// Global instance
const authManager = new AuthManager();

export { AuthManager, authManager };
