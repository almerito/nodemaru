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

/**
 * Load a specific preset by ID (anonymous allowed)
 */
function handleLoad($db) {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        errorResponse('Missing preset ID');
    }
    
    $stmt = $db->prepare('SELECT id, name, author, data, user_id, created_at FROM presets WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $preset = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$preset) {
        errorResponse('Preset not found', 404);
    }
    
    successResponse(['preset' => $preset]);
}

/**
 * Save a new preset (REQUIRES LOGIN)
 */
function handleSave($db) {
    $user = getCurrentUser();
    if (!$user) {
        errorResponse('You must be logged in to save presets', 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $name = trim($input['name'] ?? '');
    $author = trim($input['author'] ?? $user['username']);
    $data = $input['data'] ?? '';
    $isPublic = isset($input['is_public']) ? ($input['is_public'] ? 1 : 0) : 1;
    
    if (empty($name)) {
        errorResponse('Preset name is required');
    }
    
    if (empty($data)) {
        errorResponse('Preset data is required');
    }
    
    // Serialize data if it's an object
    if (is_array($data)) {
        $data = json_encode($data);
    }
    
    $stmt = $db->prepare('INSERT INTO presets (name, author, data, user_id, is_public) VALUES (:name, :author, :data, :user_id, :is_public)');
    $stmt->bindValue(':name', $name, SQLITE3_TEXT);
    $stmt->bindValue(':author', $author, SQLITE3_TEXT);
    $stmt->bindValue(':data', $data, SQLITE3_TEXT);
    $stmt->bindValue(':user_id', $user['id'], SQLITE3_INTEGER);
    $stmt->bindValue(':is_public', $isPublic, SQLITE3_INTEGER);
    
    if ($stmt->execute()) {
        $insertedId = $db->lastInsertRowID();
        successResponse(['id' => $insertedId], 'Preset saved successfully');
    } else {
        errorResponse('Failed to save preset');
    }
}

/**
 * Update an existing preset (REQUIRES LOGIN + ownership)
 */
function handleUpdate($db) {
    $user = getCurrentUser();
    if (!$user) {
        errorResponse('You must be logged in to update presets', 401);
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? $_GET['id'] ?? null;
    
    if (!$id) {
        errorResponse('Missing preset ID');
    }
    
    // Check ownership
    $stmt = $db->prepare('SELECT user_id FROM presets WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    $result = $stmt->execute();
    $preset = $result->fetchArray(SQLITE3_ASSOC);
    
    if (!$preset) {
        errorResponse('Preset not found', 404);
    }
    
    if ($preset['user_id'] != $user['id']) {
        errorResponse('You can only update your own presets', 403);
    }
    
    // Build update query
    $updates = [];
    $params = [];
    
    if (isset($input['name'])) {
        $updates[] = 'name = :name';
        $params[':name'] = trim($input['name']);
    }
    if (isset($input['author'])) {
        $updates[] = 'author = :author';
        $params[':author'] = trim($input['author']);
    }
    if (isset($input['data'])) {
        $data = $input['data'];
        if (is_array($data)) {
            $data = json_encode($data);
        }
        $updates[] = 'data = :data';
        $params[':data'] = $data;
    }
    if (isset($input['is_public'])) {
        $updates[] = 'is_public = :is_public';
        $params[':is_public'] = $input['is_public'] ? 1 : 0;
    }
    
    if (empty($updates)) {
        errorResponse('No fields to update');
    }
    
    $updates[] = 'updated_at = CURRENT_TIMESTAMP';
    $query = 'UPDATE presets SET ' . implode(', ', $updates) . ' WHERE id = :id';
    
    $stmt = $db->prepare($query);
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    
    if ($stmt->execute()) {
        successResponse([], 'Preset updated successfully');
    } else {
        errorResponse('Failed to update preset');
    }
}

/**
 * Delete a preset (REQUIRES LOGIN + ownership, or admin password)
 */
function handleDelete($db) {
    $user = getCurrentUser();
    $input = json_decode(file_get_contents('php://input'), true);
    $id = $input['id'] ?? $_GET['id'] ?? null;
    $adminPassword = $input['admin_password'] ?? null;
    
    if (!$id) {
        errorResponse('Missing preset ID');
    }
    
    // Check admin password from env
    $envAdminPassword = env('ADMIN_PASSWORD', '');
    $isAdmin = !empty($adminPassword) && !empty($envAdminPassword) && $adminPassword === $envAdminPassword;
    
    // Check ownership if not admin
    if (!$isAdmin) {
        if (!$user) {
            errorResponse('You must be logged in to delete presets', 401);
        }
        
        $stmt = $db->prepare('SELECT user_id FROM presets WHERE id = :id');
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $preset = $result->fetchArray(SQLITE3_ASSOC);
        
        if (!$preset) {
            errorResponse('Preset not found', 404);
        }
        
        if ($preset['user_id'] != $user['id']) {
            errorResponse('You can only delete your own presets', 403);
        }
    }
    
    $stmt = $db->prepare('DELETE FROM presets WHERE id = :id');
    $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
    
    if ($stmt->execute()) {
        successResponse([], 'Preset deleted successfully');
    } else {
        errorResponse('Failed to delete preset');
    }
}
?>
