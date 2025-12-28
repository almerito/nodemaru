<?php
/**
 * Configuration for Nodemaru Visual Composer API
 * Contains database settings, Google OAuth credentials, and security functions
 * 
 * Reads configuration from .env file if available
 */

// ===========================================
// SESSION CONFIGURATION (with security)
// ===========================================
if (session_status() === PHP_SESSION_NONE) {
    // Session lifetime from env (default 48 hours = 172800 seconds)
    $sessionLifetime = intval(env('SESSION_LIFETIME', 172800));
    ini_set('session.gc_maxlifetime', $sessionLifetime);
    ini_set('session.cookie_lifetime', $sessionLifetime);
    
    // Secure session settings
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_strict_mode', 1);
    ini_set('session.cookie_samesite', 'Lax');
    
    // Use secure cookies in production (HTTPS)
    if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on') {
        ini_set('session.cookie_secure', 1);
    }
    
    session_start();
}

// ===========================================
// CSRF TOKEN FUNCTIONS
// ===========================================

/**
 * Generate a new CSRF token and store in session
 */
function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    return $_SESSION['csrf_token'];
}

/**
 * Validate CSRF token from request
 * @param string|null $token Token to validate (from header or body)
 * @return bool True if valid
 */
function validateCsrfToken($token) {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    
    // Check token expiration (1 hour)
    if (isset($_SESSION['csrf_token_time']) && (time() - $_SESSION['csrf_token_time']) > 3600) {
        unset($_SESSION['csrf_token']);
        unset($_SESSION['csrf_token_time']);
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Get CSRF token from request (checks header and POST body)
 */
function getCsrfTokenFromRequest() {
    // Check X-CSRF-Token header first
    $headers = getallheaders();
    if (isset($headers['X-CSRF-Token'])) {
        return $headers['X-CSRF-Token'];
    }
    if (isset($headers['X-Csrf-Token'])) {
        return $headers['X-Csrf-Token'];
    }
    
    // Check POST body
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['_csrf'])) {
        return $input['_csrf'];
    }
    
    // Check GET/POST parameters
    return $_REQUEST['_csrf'] ?? null;
}

/**
 * Require valid CSRF token for POST/DELETE requests
 */
function requireCsrfToken() {
    // Skip CSRF validation for GET and OPTIONS requests
    if (in_array($_SERVER['REQUEST_METHOD'], ['GET', 'OPTIONS'])) {
        return;
    }
    
    $token = getCsrfTokenFromRequest();
    if (!validateCsrfToken($token)) {
        errorResponse('Invalid or missing CSRF token', 403);
    }
}

// ===========================================
// ORIGIN VALIDATION
// ===========================================

// Allowed origins (configure in .env or here)
$ALLOWED_ORIGINS = [];
$allowedOriginsEnv = env('ALLOWED_ORIGINS', '');
if (!empty($allowedOriginsEnv)) {
    $ALLOWED_ORIGINS = array_map('trim', explode(',', $allowedOriginsEnv));
}

/**
 * Validate Origin header for CSRF protection
 * @return bool True if origin is valid
 */
function validateOrigin() {
    global $ALLOWED_ORIGINS;
    
    // Skip for local development
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $referer = $_SERVER['HTTP_REFERER'] ?? '';
    
    // If no origin or referer, could be same-origin request
    if (empty($origin) && empty($referer)) {
        return true;
    }
    
    // Parse origin/referer
    $checkUrl = !empty($origin) ? $origin : $referer;
    $parsed = parse_url($checkUrl);
    $requestOrigin = ($parsed['scheme'] ?? 'http') . '://' . ($parsed['host'] ?? '');
    if (isset($parsed['port']) && $parsed['port'] != 80 && $parsed['port'] != 443) {
        $requestOrigin .= ':' . $parsed['port'];
    }
    
    // Allow localhost for development
    if (strpos($requestOrigin, 'localhost') !== false || strpos($requestOrigin, '127.0.0.1') !== false) {
        return true;
    }
    
    // If allowed origins not configured, allow same-origin
    if (empty($ALLOWED_ORIGINS)) {
        // Get current server origin
        $serverOrigin = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') 
                      . '://' . ($_SERVER['HTTP_HOST'] ?? '');
        return $requestOrigin === $serverOrigin || strpos($referer, $serverOrigin) === 0;
    }
    
    // Check against allowed origins
    foreach ($ALLOWED_ORIGINS as $allowed) {
        if ($requestOrigin === $allowed || strpos($referer, $allowed) === 0) {
            return true;
        }
    }
    
    return false;
}

/**
 * Require valid origin for mutation requests
 */
function requireValidOrigin() {
    if (!validateOrigin()) {
        errorResponse('Invalid request origin', 403);
    }
}

// ===========================================
// ENVIRONMENT LOADING
// ===========================================

// Load .env file if exists
function loadEnv($path) {
    if (!file_exists($path)) {
        return [];
    }
    
    $env = [];
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    
    foreach ($lines as $line) {
        // Skip comments
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // Parse KEY=value
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // Remove quotes if present
            if ((substr($value, 0, 1) === '"' && substr($value, -1) === '"') ||
                (substr($value, 0, 1) === "'" && substr($value, -1) === "'")) {
                $value = substr($value, 1, -1);
            }
            
            $env[$key] = $value;
            
            // Also set in $_ENV and putenv for compatibility
            $_ENV[$key] = $value;
            putenv("$key=$value");
        }
    }
    
    return $env;
}

// Try to load .env from multiple possible locations
$envPaths = [
    __DIR__ . '/.env',           // api/.env
    __DIR__ . '/../.env',        // project dist .env
    __DIR__ . '/../../.env',     // project root .env
    dirname(__DIR__) . '/.env',  // alternative project root
];

$envLoaded = false;
foreach ($envPaths as $envPath) {
    if (file_exists($envPath)) {
        loadEnv($envPath);
        $envLoaded = true;
        break;
    }
}

// Helper function to get env value with default
function env($key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        $value = $_ENV[$key] ?? $default;
    }
    return $value !== false ? $value : $default;
}

// ===========================================
// DATABASE CONFIGURATION
// ===========================================
$dbPathEnv = env('DB_PATH', 'presets.sqlite');
// Check if path is absolute (Linux starts with /, Windows starts with C:\ etc)
$isAbsolutePath = preg_match('/^[\\/]|^[a-zA-Z]:[\\/\\\\]/', $dbPathEnv);
if (!$isAbsolutePath) {
    // Path is relative, make it relative to the api directory
    $dbPathEnv = __DIR__ . '/' . $dbPathEnv;
}
define('DB_PATH', $dbPathEnv);

error_log("DB_PATH resolved to: " . DB_PATH);

// Google OAuth Configuration
define('GOOGLE_CLIENT_ID', env('GOOGLE_CLIENT_ID', 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'));
define('GOOGLE_CLIENT_SECRET', env('GOOGLE_CLIENT_SECRET', 'YOUR_GOOGLE_CLIENT_SECRET'));
define('GOOGLE_REDIRECT_URI', env('GOOGLE_REDIRECT_URI', 'https://yoursite.com/api/auth.php?action=google_callback'));

// Application Settings
define('APP_NAME', env('APP_NAME', 'Nodemaru Visual Composer'));
define('PASSWORD_MIN_LENGTH', intval(env('PASSWORD_MIN_LENGTH', 6)));

// ===========================================
// CORS Headers for API
// ===========================================
function setCorsHeaders() {
    // Get origin for CORS
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    
    // For development, allow all origins. For production, restrict this.
    if (env('APP_ENV', 'development') === 'production') {
        global $ALLOWED_ORIGINS;
        if (!empty($ALLOWED_ORIGINS) && in_array($origin, $ALLOWED_ORIGINS)) {
            header('Access-Control-Allow-Origin: ' . $origin);
        } else {
            // Default to same origin
            $serverOrigin = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http') 
                          . '://' . ($_SERVER['HTTP_HOST'] ?? '');
            header('Access-Control-Allow-Origin: ' . $serverOrigin);
        }
    } else {
        header('Access-Control-Allow-Origin: ' . $origin);
    }
    
    header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
    header('Access-Control-Allow-Credentials: true');
}

// Database Connection Helper
function getDatabase() {
    $db = new SQLite3(DB_PATH);
    $db->busyTimeout(5000);
    return $db;
}

// JSON Response Helper
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

// Error Response Helper
function errorResponse($message, $statusCode = 400) {
    jsonResponse(['success' => false, 'error' => $message], $statusCode);
}

// Success Response Helper
function successResponse($data = [], $message = null) {
    $response = ['success' => true];
    if ($message) {
        $response['message'] = $message;
    }
    jsonResponse(array_merge($response, $data));
}

// Get Current User from Session
function getCurrentUser() {
    if (isset($_SESSION['user_id']) && isset($_SESSION['user_email'])) {
        return [
            'id' => $_SESSION['user_id'],
            'email' => $_SESSION['user_email'],
            'username' => $_SESSION['user_username'] ?? '',
            'provider' => $_SESSION['user_provider'] ?? 'local'
        ];
    }
    return null;
}

// Check if user is logged in
function isLoggedIn() {
    return getCurrentUser() !== null;
}

// Require user to be logged in
function requireAuth() {
    if (!isLoggedIn()) {
        errorResponse('Authentication required', 401);
    }
}
?>
