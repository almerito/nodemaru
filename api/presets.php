<?php
/**
 * Preset Management API for Nodemaru Visual Composer
 * 
 * Actions:
 * - list:   List all public presets (anonymous allowed)
 * - load:   Load a specific preset by ID (anonymous allowed)
 * - save:   Save a new preset (REQUIRES LOGIN)
 * - update: Update an existing preset (REQUIRES LOGIN + ownership)
 * - delete: Delete a preset (REQUIRES LOGIN + ownership, or admin password)
 */

require_once __DIR__ . '/config.php';

setCorsHeaders();
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Validate origin for mutation requests (CSRF protection)
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'DELETE'])) {
    requireValidOrigin();
}

// Database setup
$db = getDatabase();

// Ensure presets table exists with user_id column
$db->exec('
    CREATE TABLE IF NOT EXISTS presets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        author TEXT NOT NULL,
        data TEXT NOT NULL,
        user_id INTEGER,
        is_public INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
');

// Route handling
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        handleList($db);
        break;

    case 'load':
        handleLoad($db);
        break;

    case 'save':
        handleSave($db);
        break;

    case 'update':
        handleUpdate($db);
        break;

    case 'delete':
        handleDelete($db);
        break;

    case 'my_presets':
        handleMyPresets($db);
        break;

    default:
        errorResponse('Unknown action. Use: list, load, save, update, delete, my_presets');
        break;
}

$db->close();

// ====== Handler Functions ======



/**
 * List all public presets (anonymous allowed)
 * Supports pagination: limit (default 20), offset (default 0)
 */
function handleList($db) {
    // Pagination parameters
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    
    // Clamp limit
    if ($limit < 1) $limit = 20;
    if ($limit > 100) $limit = 100;

    // Check if nickname column exists (for backward compatibility)
    $columnsResult = $db->query("PRAGMA table_info(users)");
    $columns = [];
    while ($col = $columnsResult->fetchArray(SQLITE3_ASSOC)) {
        $columns[] = $col['name'];
    }
    $hasNickname = in_array('nickname', $columns);
    
    $query = $hasNickname 
        ? 'SELECT p.id, p.name, p.author, p.user_id, p.created_at, 
           COALESCE(u.nickname, u.username) as owner_name
           FROM presets p
           LEFT JOIN users u ON p.user_id = u.id
           WHERE p.is_public = 1 OR p.is_public IS NULL
           ORDER BY p.created_at DESC
           LIMIT :limit OFFSET :offset'
        : 'SELECT p.id, p.name, p.author, p.user_id, p.created_at, u.username as owner_name
           FROM presets p
           LEFT JOIN users u ON p.user_id = u.id
           WHERE p.is_public = 1 OR p.is_public IS NULL
           ORDER BY p.created_at DESC
           LIMIT :limit OFFSET :offset';

    $stmt = $db->prepare($query);
    $stmt->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $stmt->bindValue(':offset', $offset, SQLITE3_INTEGER);
    $result = $stmt->execute();
    
    $presets = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $presets[] = $row;
    }
    
    successResponse(['presets' => $presets]);
}

/**
 * List user's own presets (REQUIRES LOGIN)
 * Supports pagination
 */
function handleMyPresets($db) {
    $user = getCurrentUser();
    if (!$user) {
        errorResponse('You must be logged in to view your presets', 401);
    }
    
    // Pagination parameters
    $limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
    $offset = isset($_GET['offset']) ? intval($_GET['offset']) : 0;
    
    if ($limit < 1) $limit = 20;
    if ($limit > 100) $limit = 100;

    $stmt = $db->prepare('
        SELECT id, name, author, is_public, created_at, updated_at
        FROM presets
        WHERE user_id = :user_id
        ORDER BY updated_at DESC
        LIMIT :limit OFFSET :offset
    ');
    $stmt->bindValue(':user_id', $user['id'], SQLITE3_INTEGER);
    $stmt->bindValue(':limit', $limit, SQLITE3_INTEGER);
    $stmt->bindValue(':offset', $offset, SQLITE3_INTEGER);
    $result = $stmt->execute();
    
    $presets = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $presets[] = $row;
    }
    
    successResponse(['presets' => $presets]);
}
?>
