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
 */
function handleList($db) {
    // Check if nickname column exists (for backward compatibility)
    $columnsResult = $db->query("PRAGMA table_info(users)");
    $columns = [];
    while ($col = $columnsResult->fetchArray(SQLITE3_ASSOC)) {
        $columns[] = $col['name'];
    }
    $hasNickname = in_array('nickname', $columns);
    
    if ($hasNickname) {
        $result = $db->query('
            SELECT p.id, p.name, p.author, p.user_id, p.created_at, 
                   COALESCE(u.nickname, u.username) as owner_name
            FROM presets p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.is_public = 1 OR p.is_public IS NULL
            ORDER BY p.created_at DESC
        ');
    } else {
        $result = $db->query('
            SELECT p.id, p.name, p.author, p.user_id, p.created_at, u.username as owner_name
            FROM presets p
            LEFT JOIN users u ON p.user_id = u.id
            WHERE p.is_public = 1 OR p.is_public IS NULL
            ORDER BY p.created_at DESC
        ');
    }
    
    $presets = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $presets[] = $row;
    }
    
    successResponse(['presets' => $presets]);
}

/**
 * Load a specific preset by ID (anonymous allowed)
 */
function handleLoad($db) {
    $id = intval($_GET['id'] ?? 0);
    
    if ($id <= 0) {
        errorResponse('Invalid preset ID');
    }
    
    $stmt = $db->prepare('
        SELECT p.*, u.username as owner_name
        FROM presets p
        LEFT JOIN users u ON p.user_id = u.id
        WHERE p.id = :id AND (p.is_public = 1 OR p.is_public IS NULL)
    ');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $preset = $result->fetchArray(SQLITE3_ASSOC);
    
    if ($preset) {
        successResponse(['preset' => $preset]);
    } else {
        errorResponse('Preset not found', 404);
    }
}

/**
 * Save a new preset (REQUIRES LOGIN)
 */
function handleSave($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    // Check authentication
    $user = getCurrentUser();
    if (!$user) {
        errorResponse('You must be logged in to save presets', 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || empty($input['name']) || empty($input['data'])) {
        errorResponse('Missing required fields (name, data)');
    }

    $name = trim($input['name']);
    $author = trim($input['author'] ?? $user['username']) ?: $user['username'];
    $data = $input['data'];
    $isPublic = isset($input['is_public']) ? ($input['is_public'] ? 1 : 0) : 1;

    // Validate data is valid JSON
    if (is_array($data)) {
        $data = json_encode($data);
    }

    $stmt = $db->prepare('
        INSERT INTO presets (name, author, data, user_id, is_public) 
        VALUES (:name, :author, :data, :user_id, :is_public)
    ');
    $stmt->bindValue(':name', $name, SQLITE3_TEXT);
    $stmt->bindValue(':author', $author, SQLITE3_TEXT);
    $stmt->bindValue(':data', $data, SQLITE3_TEXT);
    $stmt->bindValue(':user_id', $user['id'], SQLITE3_INTEGER);
    $stmt->bindValue(':is_public', $isPublic, SQLITE3_INTEGER);
    
    if ($stmt->execute()) {
        $newId = $db->lastInsertRowID();
        successResponse([
            'id' => $newId, 
            'message' => 'Preset saved successfully'
        ]);
    } else {
        errorResponse('Failed to save preset', 500);
    }
}

/**
 * Update an existing preset (REQUIRES LOGIN + ownership)
 */
function handleUpdate($db) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        errorResponse('Method not allowed', 405);
    }
    
    $user = getCurrentUser();
    if (!$user) {
        errorResponse('You must be logged in to update presets', 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $id = intval($input['id'] ?? 0);
    
    if ($id <= 0) {
        errorResponse('Invalid preset ID');
    }
    
    // Check ownership
    $stmt = $db->prepare('SELECT user_id FROM presets WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $preset = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$preset) {
        errorResponse('Preset not found', 404);
    }
    
    if ($preset['user_id'] !== $user['id']) {
        errorResponse('You can only update your own presets', 403);
    }
    
    $name = trim($input['name'] ?? '');
    $data = $input['data'] ?? null;
    $isPublic = isset($input['is_public']) ? ($input['is_public'] ? 1 : 0) : null;
    
    // Build update query dynamically
    $updates = [];
    $params = [];
    
    if (!empty($name)) {
        $updates[] = 'name = :name';
        $params[':name'] = $name;
    }
    
    if ($data !== null) {
        if (is_array($data)) {
            $data = json_encode($data);
        }
        $updates[] = 'data = :data';
        $params[':data'] = $data;
    }
    
    if ($isPublic !== null) {
        $updates[] = 'is_public = :is_public';
        $params[':is_public'] = $isPublic;
    }
    
    if (empty($updates)) {
        errorResponse('No fields to update');
    }
    
    $updates[] = 'updated_at = CURRENT_TIMESTAMP';
    
    $sql = 'UPDATE presets SET ' . implode(', ', $updates) . ' WHERE id = :id';
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    
    foreach ($params as $key => $value) {
        $type = is_int($value) ? SQLITE3_INTEGER : SQLITE3_TEXT;
        $stmt->bindValue($key, $value, $type);
    }
    
    if ($stmt->execute()) {
        successResponse(['message' => 'Preset updated successfully']);
    } else {
        errorResponse('Failed to update preset', 500);
    }
}

/**
 * Delete a preset (REQUIRES LOGIN + ownership, or admin password)
 */
function handleDelete($db) {
    $id = intval($_GET['id'] ?? 0);
    
    if ($id <= 0) {
        errorResponse('Invalid preset ID');
    }
    
    // Check for admin password (from .env)
    $adminPassword = $_GET['password'] ?? '';
    $isAdmin = ($adminPassword !== '' && $adminPassword === env('ADMIN_PASSWORD', ''));
    
    if (!$isAdmin) {
        // Check user authentication
        $user = getCurrentUser();
        if (!$user) {
            errorResponse('You must be logged in to delete presets', 401);
        }
        
        // Check ownership
        $stmt = $db->prepare('SELECT user_id FROM presets WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $preset = $result->fetchArray(SQLITE3_ASSOC);
        
        if (!$preset) {
            errorResponse('Preset not found', 404);
        }
        
        if ($preset['user_id'] !== null && $preset['user_id'] !== $user['id']) {
            errorResponse('You can only delete your own presets', 403);
        }
    }
    
    $stmt = $db->prepare('DELETE FROM presets WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    
    if ($stmt->execute()) {
        successResponse(['message' => 'Preset deleted successfully']);
    } else {
        errorResponse('Failed to delete preset', 500);
    }
}

/**
 * List user's own presets (REQUIRES LOGIN)
 */
function handleMyPresets($db) {
    $user = getCurrentUser();
    if (!$user) {
        errorResponse('You must be logged in to view your presets', 401);
    }
    
    $stmt = $db->prepare('
        SELECT id, name, author, is_public, created_at, updated_at
        FROM presets
        WHERE user_id = :user_id
        ORDER BY updated_at DESC
    ');
    $stmt->bindValue(':user_id', $user['id'], SQLITE3_INTEGER);
    $result = $stmt->execute();
    
    $presets = [];
    while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
        $presets[] = $row;
    }
    
    successResponse(['presets' => $presets]);
}
?>
