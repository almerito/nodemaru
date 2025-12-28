<?php
/**
 * Authentication API for Nodemaru Visual Composer
 * Handles user registration, login, logout, profile update, and Google OAuth
 */

require_once __DIR__ . '/config.php';

setCorsHeaders();
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Validate origin for all POST requests (CSRF protection)
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    requireValidOrigin();
}

// Initialize database and create users table if needed
$db = getDatabase();
$db->exec('
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT,
        provider TEXT DEFAULT "local",
        google_id TEXT,
        avatar_url TEXT,
        first_name TEXT,
        last_name TEXT,
        nickname TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
');

// Create index for faster lookups
$db->exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
$db->exec('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)');

// Route handling
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'csrf_token':
        // Return CSRF token for client
        handleCsrfToken();
        break;
    
    case 'register':
        handleRegister($db);
        break;
    
    case 'login':
        handleLogin($db);
        break;
    
    case 'logout':
        handleLogout();
        break;
    
    case 'session':
        handleSession($db);
        break;
    
    case 'profile':
        handleProfile($db);
        break;
    
    case 'update_profile':
        handleUpdateProfile($db);
        break;
    
    case 'google_login':
        handleGoogleLogin();
        break;
    
    case 'google_callback':
        handleGoogleCallback($db);
        break;
    
    default:
        errorResponse('Unknown action. Use: csrf_token, register, login, logout, session, profile, update_profile, google_login');
        break;
}

$db->close();

// ====== Handler Functions ======

/**
 * Return CSRF token for client-side requests
 */
function handleCsrfToken() {
    $token = generateCsrfToken();
    successResponse(['csrf_token' => $token]);
}

/**
 * Register a new user with email and password
 */
function handleRegister($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $firstName = trim($input['first_name'] ?? '');
    $lastName = trim($input['last_name'] ?? '');
    $nickname = trim($input['nickname'] ?? '');
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    // Validation
    if (empty($firstName)) {
        errorResponse('First name is required');
    }
    
    if (empty($lastName)) {
        errorResponse('Last name is required');
    }
    
    if (empty($nickname)) {
        errorResponse('Nickname is required');
    }
    
    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        errorResponse('Valid email is required');
    }
    
    if (strlen($password) < PASSWORD_MIN_LENGTH) {
        errorResponse('Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters');
    }
    
    // Check if email already exists
    $stmt = $db->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    if ($result->fetchArray()) {
        errorResponse('Email already registered');
    }
    
    // Create display username from first name and last name
    $username = $firstName . ' ' . $lastName;
    
    // Create user
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    
    $stmt = $db->prepare('
        INSERT INTO users (username, email, password_hash, provider, first_name, last_name, nickname) 
        VALUES (:username, :email, :password_hash, "local", :first_name, :last_name, :nickname)
    ');
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $stmt->bindValue(':password_hash', $passwordHash, SQLITE3_TEXT);
    $stmt->bindValue(':first_name', $firstName, SQLITE3_TEXT);
    $stmt->bindValue(':last_name', $lastName, SQLITE3_TEXT);
    $stmt->bindValue(':nickname', $nickname, SQLITE3_TEXT);
    
    if ($stmt->execute()) {
        $userId = $db->lastInsertRowID();
        
        // Auto-login after registration
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_username'] = $username;
        $_SESSION['user_nickname'] = $nickname;
        $_SESSION['user_provider'] = 'local';
        
        successResponse([
            'user' => [
                'id' => $userId,
                'username' => $username,
                'email' => $email,
                'first_name' => $firstName,
                'last_name' => $lastName,
                'nickname' => $nickname,
                'provider' => 'local'
            ]
        ], 'Registration successful');
    } else {
        errorResponse('Failed to create user', 500);
    }
}

/**
 * Login with email and password
 */
function handleLogin($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $email = trim($input['email'] ?? '');
    $password = $input['password'] ?? '';
    
    if (empty($email) || empty($password)) {
        errorResponse('Email and password are required');
    }
    
    // Check what columns exist in users table (for backward compatibility)
    $columnsResult = $db->query("PRAGMA table_info(users)");
    $columns = [];
    while ($col = $columnsResult->fetchArray(SQLITE3_ASSOC)) {
        $columns[] = $col['name'];
    }
    $hasNewColumns = in_array('first_name', $columns);
    
    // Find user - adapt query based on available columns
    if ($hasNewColumns) {
        $stmt = $db->prepare('SELECT id, username, email, password_hash, provider, first_name, last_name, nickname FROM users WHERE email = :email');
    } else {
        $stmt = $db->prepare('SELECT id, username, email, password_hash, provider FROM users WHERE email = :email');
    }
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $result = $stmt->execute();
    $user = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$user) {
        errorResponse('Invalid email or password', 401);
    }
    
    // Check if user registered with Google
    if ($user['provider'] === 'google' && empty($user['password_hash'])) {
        errorResponse('This account uses Google login. Please sign in with Google.', 401);
    }
    
    // Verify password
    if (!password_verify($password, $user['password_hash'])) {
        errorResponse('Invalid email or password', 401);
    }
    
    // Set session
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['user_username'] = $user['username'];
    $_SESSION['user_nickname'] = $user['nickname'] ?? $user['username'];
    $_SESSION['user_provider'] = $user['provider'];
    
    successResponse([
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'first_name' => $user['first_name'] ?? null,
            'last_name' => $user['last_name'] ?? null,
            'nickname' => $user['nickname'] ?? $user['username'],
            'provider' => $user['provider']
        ]
    ], 'Login successful');
}

/**
 * Logout current user
 */
function handleLogout() {
    session_destroy();
    successResponse([], 'Logged out successfully');
}

/**
 * Get current session info
 */
function handleSession($db) {
    $sessionUser = getCurrentUser();
    
    if ($sessionUser) {
        // Check what columns exist (for backward compatibility)
        $columnsResult = $db->query("PRAGMA table_info(users)");
        $columns = [];
        while ($col = $columnsResult->fetchArray(SQLITE3_ASSOC)) {
            $columns[] = $col['name'];
        }
        $hasNewColumns = in_array('first_name', $columns);
        
        // Get full user data from database - adapt query based on available columns
        if ($hasNewColumns) {
            $stmt = $db->prepare('SELECT id, username, email, first_name, last_name, nickname, provider, avatar_url FROM users WHERE id = :id');
        } else {
            $stmt = $db->prepare('SELECT id, username, email, provider, avatar_url FROM users WHERE id = :id');
        }
        $stmt->bindValue(':id', $sessionUser['id'], SQLITE3_INTEGER);
        $result = $stmt->execute();
        $user = $result->fetchArray(SQLITE3_ASSOC);
        
        if ($user) {
            // Ensure all expected fields exist
            $user['first_name'] = $user['first_name'] ?? null;
            $user['last_name'] = $user['last_name'] ?? null;
            $user['nickname'] = $user['nickname'] ?? $user['username'];
            successResponse(['user' => $user, 'loggedIn' => true]);
        } else {
            // Session user not found in DB, clear session
            session_destroy();
            successResponse(['user' => null, 'loggedIn' => false]);
        }
    } else {
        successResponse(['user' => null, 'loggedIn' => false]);
    }
}

/**
 * Get user profile (requires login)
 */
function handleProfile($db) {
    $sessionUser = getCurrentUser();
    
    if (!$sessionUser) {
        errorResponse('Not logged in', 401);
    }
    
    // Check what columns exist (for backward compatibility)
    $columnsResult = $db->query("PRAGMA table_info(users)");
    $columns = [];
    while ($col = $columnsResult->fetchArray(SQLITE3_ASSOC)) {
        $columns[] = $col['name'];
    }
    $hasNewColumns = in_array('first_name', $columns);
    
    if ($hasNewColumns) {
        $stmt = $db->prepare('SELECT id, username, email, first_name, last_name, nickname, provider, avatar_url, created_at FROM users WHERE id = :id');
    } else {
        $stmt = $db->prepare('SELECT id, username, email, provider, avatar_url, created_at FROM users WHERE id = :id');
    }
    $stmt->bindValue(':id', $sessionUser['id'], SQLITE3_INTEGER);
    $result = $stmt->execute();
    $user = $result->fetchArray(SQLITE3_ASSOC);
    
    if ($user) {
        // Ensure all expected fields exist
        $user['first_name'] = $user['first_name'] ?? null;
        $user['last_name'] = $user['last_name'] ?? null;
        $user['nickname'] = $user['nickname'] ?? $user['username'];
        successResponse(['user' => $user]);
    } else {
        errorResponse('User not found', 404);
    }
}

/**
 * Update user profile (requires login)
 */
function handleUpdateProfile($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    $sessionUser = getCurrentUser();
    
    if (!$sessionUser) {
        errorResponse('Not logged in', 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    $firstName = trim($input['first_name'] ?? '');
    $lastName = trim($input['last_name'] ?? '');
    $nickname = trim($input['nickname'] ?? '');
    $newPassword = $input['password'] ?? '';
    
    // Validation
    if (empty($firstName)) {
        errorResponse('First name is required');
    }
    
    if (empty($lastName)) {
        errorResponse('Last name is required');
    }
    
    if (empty($nickname)) {
        errorResponse('Nickname is required');
    }
    
    // Build update query
    $username = $firstName . ' ' . $lastName;
    
    if (!empty($newPassword)) {
        // Update profile with new password
        if (strlen($newPassword) < PASSWORD_MIN_LENGTH) {
            errorResponse('Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters');
        }
        
        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        
        $stmt = $db->prepare('
            UPDATE users 
            SET username = :username, first_name = :first_name, last_name = :last_name, 
                nickname = :nickname, password_hash = :password_hash, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');
        $stmt->bindValue(':password_hash', $passwordHash, SQLITE3_TEXT);
    } else {
        // Update profile without changing password
        $stmt = $db->prepare('
            UPDATE users 
            SET username = :username, first_name = :first_name, last_name = :last_name, 
                nickname = :nickname, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
        ');
    }
    
    $stmt->bindValue(':username', $username, SQLITE3_TEXT);
    $stmt->bindValue(':first_name', $firstName, SQLITE3_TEXT);
    $stmt->bindValue(':last_name', $lastName, SQLITE3_TEXT);
    $stmt->bindValue(':nickname', $nickname, SQLITE3_TEXT);
    $stmt->bindValue(':id', $sessionUser['id'], SQLITE3_INTEGER);
    
    if ($stmt->execute()) {
        // Update session
        $_SESSION['user_username'] = $username;
        $_SESSION['user_nickname'] = $nickname;
        
        successResponse([
            'user' => [
                'id' => $sessionUser['id'],
                'username' => $username,
                'email' => $sessionUser['email'],
                'first_name' => $firstName,
                'last_name' => $lastName,
                'nickname' => $nickname,
                'provider' => $sessionUser['provider']
            ]
        ], 'Profile updated successfully');
    } else {
        errorResponse('Failed to update profile', 500);
    }
}

/**
 * Initiate Google OAuth login
 */
function handleGoogleLogin() {
    $params = [
        'client_id' => GOOGLE_CLIENT_ID,
        'redirect_uri' => GOOGLE_REDIRECT_URI,
        'response_type' => 'code',
        'scope' => 'openid email profile',
        'access_type' => 'online',
        'prompt' => 'select_account'
    ];
    
    $authUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
    
    header('Location: ' . $authUrl);
    exit;
}

/**
 * Handle Google OAuth callback
 */
function handleGoogleCallback($db) {
    $code = $_GET['code'] ?? '';
    
    if (empty($code)) {
        header('Location: ../?auth_error=no_code');
        exit;
    }
    
    // Exchange code for token
    $tokenUrl = 'https://oauth2.googleapis.com/token';
    $tokenData = [
        'client_id' => GOOGLE_CLIENT_ID,
        'client_secret' => GOOGLE_CLIENT_SECRET,
        'code' => $code,
        'grant_type' => 'authorization_code',
        'redirect_uri' => GOOGLE_REDIRECT_URI
    ];
    
    $ch = curl_init($tokenUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($tokenData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);
    
    $tokenResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) {
        header('Location: ../?auth_error=token_exchange_failed');
        exit;
    }
    
    $tokenResult = json_decode($tokenResponse, true);
    $accessToken = $tokenResult['access_token'] ?? '';
    
    if (empty($accessToken)) {
        header('Location: ../?auth_error=no_token');
        exit;
    }
    
    // Get user info from Google
    $userInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
    $ch = curl_init($userInfoUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $accessToken]);
    
    $userInfoResponse = curl_exec($ch);
    curl_close($ch);
    
    $googleUser = json_decode($userInfoResponse, true);
    
    if (!isset($googleUser['id']) || !isset($googleUser['email'])) {
        header('Location: ../?auth_error=invalid_user_info');
        exit;
    }
    
    $googleId = $googleUser['id'];
    $email = $googleUser['email'];
    $name = $googleUser['name'] ?? $googleUser['email'];
    $givenName = $googleUser['given_name'] ?? '';
    $familyName = $googleUser['family_name'] ?? '';
    $avatar = $googleUser['picture'] ?? null;
    
    // Check if user exists
    $stmt = $db->prepare('SELECT id, username, email, provider, nickname FROM users WHERE google_id = :google_id OR email = :email');
    $stmt->bindValue(':google_id', $googleId, SQLITE3_TEXT);
    $stmt->bindValue(':email', $email, SQLITE3_TEXT);
    $result = $stmt->execute();
    $existingUser = $result->fetchArray(SQLITE3_ASSOC);
    
    if ($existingUser) {
        // Update google_id, avatar, and profile info if needed
        $updateStmt = $db->prepare('
            UPDATE users 
            SET google_id = :google_id, avatar_url = :avatar, 
                first_name = COALESCE(first_name, :first_name),
                last_name = COALESCE(last_name, :last_name),
                nickname = COALESCE(nickname, :nickname),
                updated_at = CURRENT_TIMESTAMP 
            WHERE id = :id
        ');
        $updateStmt->bindValue(':google_id', $googleId, SQLITE3_TEXT);
        $updateStmt->bindValue(':avatar', $avatar, SQLITE3_TEXT);
        $updateStmt->bindValue(':first_name', $givenName, SQLITE3_TEXT);
        $updateStmt->bindValue(':last_name', $familyName, SQLITE3_TEXT);
        $updateStmt->bindValue(':nickname', $existingUser['nickname'] ?? $givenName, SQLITE3_TEXT);
        $updateStmt->bindValue(':id', $existingUser['id'], SQLITE3_INTEGER);
        $updateStmt->execute();
        
        $userId = $existingUser['id'];
        $username = $existingUser['username'];
        $nickname = $existingUser['nickname'] ?? $givenName;
    } else {
        // Create new user with Google profile data
        $nickname = $givenName ?: $name;
        
        $stmt = $db->prepare('
            INSERT INTO users (username, email, provider, google_id, avatar_url, first_name, last_name, nickname) 
            VALUES (:username, :email, "google", :google_id, :avatar, :first_name, :last_name, :nickname)
        ');
        $stmt->bindValue(':username', $name, SQLITE3_TEXT);
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $stmt->bindValue(':google_id', $googleId, SQLITE3_TEXT);
        $stmt->bindValue(':avatar', $avatar, SQLITE3_TEXT);
        $stmt->bindValue(':first_name', $givenName, SQLITE3_TEXT);
        $stmt->bindValue(':last_name', $familyName, SQLITE3_TEXT);
        $stmt->bindValue(':nickname', $nickname, SQLITE3_TEXT);
        
        if (!$stmt->execute()) {
            header('Location: ../?auth_error=create_user_failed');
            exit;
        }
        
        $userId = $db->lastInsertRowID();
        $username = $name;
    }
    
    // Set session
    $_SESSION['user_id'] = $userId;
    $_SESSION['user_email'] = $email;
    $_SESSION['user_username'] = $username;
    $_SESSION['user_nickname'] = $nickname;
    $_SESSION['user_provider'] = 'google';
    
    // Redirect to app with success
    header('Location: ../?auth_success=1');
    exit;
}
?>
