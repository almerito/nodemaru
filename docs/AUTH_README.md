# User Authentication System

This document explains how to set up and use the user authentication system for Nodemaru Visual Composer.

## Features

- **User Registration**: Register with username, email, and password
- **User Login**: Login with email and password
- **Google SSO**: Sign in with Google account
- **Session Management**: Persistent sessions for logged-in users
- **Protected Save**: Only logged-in users can save presets to the cloud
- **Public Access**: Load, import, and export work for anonymous users

## File Structure

```
api/
├── config.php       # Configuration (loads from .env file)
├── auth.php         # Authentication API (login, register, logout, session)
├── presets.php      # Preset API (now with authentication for save)
├── migrate.php      # Database migration script
└── presets.sqlite   # SQLite database (auto-created)

src/core/
└── AuthManager.js   # Frontend authentication manager

.env.example         # Environment template (copy to .env)
.env                 # Your local environment config (gitignored)
update-db.sh         # Linux/Mac database update script
update-db.bat        # Windows database update script
```

## Setup Instructions

### 1. Database Setup

Run the migration script to create/update the database schema:

**On Linux/Mac:**
```bash
chmod +x update-db.sh
./update-db.sh
```

**On Windows:**
```batch
update-db.bat
```

**Or directly with PHP:**
```bash
php api/migrate.php
```

Add `--seed` flag to create a test user:
```bash
php api/migrate.php --seed
# Creates: test@example.com / password123
```

### 2. Environment Configuration

Copy the `.env.example` file to `.env` and edit it with your settings:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
# Database path (relative to api/ folder or absolute)
DB_PATH=presets.sqlite

# Google OAuth (get from https://console.cloud.google.com/apis/credentials)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://yoursite.com/api/auth.php?action=google_callback

# App settings
APP_NAME=Nodemaru Visual Composer
PASSWORD_MIN_LENGTH=6
```

### 3. Configure Google OAuth (Optional)

To enable Google Sign-In:

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing one
3. Create OAuth 2.0 credentials (Web Application type)
4. Add authorized redirect URI: `https://yoursite.com/api/auth.php?action=google_callback`
5. Copy the Client ID and Client Secret
6. Add them to your `.env` file (see above)

### 4. Server Requirements

- PHP 7.4 or higher
- SQLite3 extension enabled
- cURL extension (for Google OAuth)
- Write permissions on `api/` directory

### 5. Deploy to Production

1. Upload all files to your web server
2. Create `.env` file on the server with production values
3. Run the migration script
4. Build the frontend: `npm run build`
5. Upload the `dist/` folder contents

## API Endpoints

### Authentication (`api/auth.php`)

| Action | Method | Description |
|--------|--------|-------------|
| `?action=register` | POST | Register new user |
| `?action=login` | POST | Login with email/password |
| `?action=logout` | GET | Logout current user |
| `?action=session` | GET | Get current session info |
| `?action=google_login` | GET | Redirect to Google OAuth |
| `?action=google_callback` | GET | Google OAuth callback |

### Presets (`api/presets.php`)

| Action | Method | Auth Required | Description |
|--------|--------|---------------|-------------|
| `?action=list` | GET | No | List all public presets |
| `?action=load&id=X` | GET | No | Load preset by ID |
| `?action=save` | POST | **Yes** | Save new preset |
| `?action=update` | POST | **Yes** | Update own preset |
| `?action=delete&id=X` | GET | **Yes** | Delete own preset |
| `?action=my_presets` | GET | **Yes** | List user's presets |

## Frontend Integration

The authentication is integrated into the Editor:

- **Toolbar**: Shows Login/Register buttons for guests, username and Logout for authenticated users
- **Save Button**: Prompts for login if not authenticated
- **Load/Export/Import**: Work without authentication

### JavaScript API

```javascript
import { authManager } from './core/AuthManager.js';

// Check if logged in
if (authManager.isLoggedIn()) {
    console.log('User:', authManager.getUser());
}

// Listen to auth changes
authManager.onAuthChange((user, isLoggedIn) => {
    console.log('Auth changed:', isLoggedIn, user);
});

// Login
const result = await authManager.login('email@example.com', 'password');

// Register
const result = await authManager.register('Username', 'email@example.com', 'password');

// Logout
await authManager.logout();

// Google login (redirects)
authManager.loginWithGoogle();
```

## Security Notes

1. **Session-based auth**: Uses PHP sessions with cookies
2. **Password hashing**: Uses `password_hash()` with default algorithm
3. **CSRF**: Consider adding CSRF tokens for production
4. **HTTPS**: Always use HTTPS in production
5. **Admin password**: Change or remove the legacy admin password in `presets.php`

## Troubleshooting

### "You must be logged in to save presets"
- Make sure cookies are enabled in your browser
- Check that the session is working (API call to `?action=session`)

### Google login not working
- Verify OAuth credentials are correctly set in `config.php`
- Check that redirect URI matches exactly
- Ensure cURL extension is enabled

### Database errors
- Check write permissions on `api/` directory
- Make sure SQLite3 extension is enabled
- Run migration script again
