<?php
/**
 * Database Migration Script for Nodemaru Visual Composer
 * 
 * This script creates/updates the database schema.
 * Run this script on the remote server to set up the database.
 * 
 * Usage: 
 *   php migrate.php [--seed]
 *   
 * Options:
 *   --seed    Add sample data for testing
 */

require_once __DIR__ . '/config.php';

echo "=================================================\n";
echo "  Nodemaru Visual Composer - Database Migration\n";
echo "=================================================\n\n";

$db = getDatabase();

// Migration tracking table
echo "[1/5] Creating migrations table...\n";
$db->exec('
    CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
');

// Function to check if migration was already run
function migrationExecuted($db, $name) {
    $stmt = $db->prepare('SELECT id FROM migrations WHERE name = :name');
    $stmt->bindValue(':name', $name, SQLITE3_TEXT);
    $result = $stmt->execute();
    return $result->fetchArray() !== false;
}

// Function to mark migration as executed
function markMigration($db, $name) {
    $stmt = $db->prepare('INSERT INTO migrations (name) VALUES (:name)');
    $stmt->bindValue(':name', $name, SQLITE3_TEXT);
    $stmt->execute();
}

// ====== Migrations ======

// Migration 1: Create users table
$migrationName = '001_create_users_table';
if (!migrationExecuted($db, $migrationName)) {
    echo "[2/5] Creating users table...\n";
    $db->exec('
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT,
            provider TEXT DEFAULT "local",
            google_id TEXT,
            avatar_url TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ');
    $db->exec('CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)');
    $db->exec('CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)');
    markMigration($db, $migrationName);
    echo "   ✓ Users table created\n";
} else {
    echo "[2/5] Users table already exists, skipping...\n";
}

// Migration 2: Add user_id to presets table
$migrationName = '002_add_user_id_to_presets';
if (!migrationExecuted($db, $migrationName)) {
    echo "[3/5] Adding user_id column to presets...\n";
    
    // Check if presets table exists first
    $result = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='presets'");
    if ($result->fetchArray()) {
        // Check if column already exists
        $pragma = $db->query("PRAGMA table_info(presets)");
        $hasUserIdColumn = false;
        while ($col = $pragma->fetchArray(SQLITE3_ASSOC)) {
            if ($col['name'] === 'user_id') {
                $hasUserIdColumn = true;
                break;
            }
        }
        
        if (!$hasUserIdColumn) {
            $db->exec('ALTER TABLE presets ADD COLUMN user_id INTEGER');
            $db->exec('CREATE INDEX IF NOT EXISTS idx_presets_user_id ON presets(user_id)');
            echo "   ✓ user_id column added to presets\n";
        } else {
            echo "   ✓ user_id column already exists\n";
        }
    } else {
        // Create presets table with user_id from scratch
        $db->exec('
            CREATE TABLE IF NOT EXISTS presets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                author TEXT NOT NULL,
                data TEXT NOT NULL,
                user_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ');
        $db->exec('CREATE INDEX IF NOT EXISTS idx_presets_user_id ON presets(user_id)');
        echo "   ✓ Presets table created with user_id\n";
    }
    
    markMigration($db, $migrationName);
} else {
    echo "[3/5] Presets user_id migration already done, skipping...\n";
}

// Migration 3: Add is_public flag to presets
$migrationName = '003_add_is_public_to_presets';
if (!migrationExecuted($db, $migrationName)) {
    echo "[4/5] Adding is_public column to presets...\n";
    
    $result = $db->query("SELECT name FROM sqlite_master WHERE type='table' AND name='presets'");
    if ($result->fetchArray()) {
        $pragma = $db->query("PRAGMA table_info(presets)");
        $hasColumn = false;
        while ($col = $pragma->fetchArray(SQLITE3_ASSOC)) {
            if ($col['name'] === 'is_public') {
                $hasColumn = true;
                break;
            }
        }
        
        if (!$hasColumn) {
            $db->exec('ALTER TABLE presets ADD COLUMN is_public INTEGER DEFAULT 1');
            echo "   ✓ is_public column added\n";
        } else {
            echo "   ✓ is_public column already exists\n";
        }
    }
    
    markMigration($db, $migrationName);
} else {
    echo "[4/5] is_public migration already done, skipping...\n";
}

// Migration 4: Create sessions table for better session management (optional)
$migrationName = '004_create_sessions_table';
if (!migrationExecuted($db, $migrationName)) {
    echo "[5/5] Creating sessions table (optional, for stateless API)...\n";
    $db->exec('
        CREATE TABLE IF NOT EXISTS api_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token TEXT UNIQUE NOT NULL,
            expires_at DATETIME NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    ');
    $db->exec('CREATE INDEX IF NOT EXISTS idx_sessions_token ON api_sessions(token)');
    $db->exec('CREATE INDEX IF NOT EXISTS idx_sessions_expires ON api_sessions(expires_at)');
    markMigration($db, $migrationName);
    echo "   ✓ Sessions table created\n";
} else {
    echo "[5/5] Sessions table already exists, skipping...\n";
}

// Optional: Seed data
if (in_array('--seed', $argv ?? [])) {
    echo "\n[SEED] Creating test user...\n";
    
    $testEmail = 'test@example.com';
    $stmt = $db->prepare('SELECT id FROM users WHERE email = :email');
    $stmt->bindValue(':email', $testEmail, SQLITE3_TEXT);
    $result = $stmt->execute();
    
    if (!$result->fetchArray()) {
        $stmt = $db->prepare('
            INSERT INTO users (username, email, password_hash, provider) 
            VALUES (:username, :email, :password_hash, "local")
        ');
        $stmt->bindValue(':username', 'Test User', SQLITE3_TEXT);
        $stmt->bindValue(':email', $testEmail, SQLITE3_TEXT);
        $stmt->bindValue(':password_hash', password_hash('password123', PASSWORD_DEFAULT), SQLITE3_TEXT);
        $stmt->execute();
        echo "   ✓ Test user created: test@example.com / password123\n";
    } else {
        echo "   ✓ Test user already exists\n";
    }
}

$db->close();

echo "\n=================================================\n";
echo "  Migration completed successfully!\n";
echo "=================================================\n";
echo "\nDatabase location: " . DB_PATH . "\n";
?>
