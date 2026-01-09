<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use PDO;
use PDOException;

class UsersSeeder extends Seeder
{
    public function run()
    {
        $sqlitePath = base_path('old/presets.sqlite');

        if (!file_exists($sqlitePath)) {
            $this->command->error("SQLite database found at: $sqlitePath");
            return;
        }

        try {
            // Connect to old SQLite DB
            $pdo = new PDO("sqlite:$sqlitePath");
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

            // Fetch users
            $stmt = $pdo->query("SELECT * FROM users");
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->command->info("Found " . count($users) . " users in SQLite.");

            // Get existing users map (email -> id) to prevent id conflicts or duplicates
            $count = 0;
            foreach ($users as $user) {
                // SQLite: id, username, email, password_hash, first_name, last_name, avatar_url, ...
                
                // Map to Laravel Users
                // name (string), email (string), password (string), ...
                
                $name = trim(($user['first_name'] ?? '') . ' ' . ($user['last_name'] ?? ''));
                if (empty($name)) $name = $user['username'] ?? 'User';

                $data = [
                    'name' => $name,
                    'email' => $user['email'],
                    'password' => $user['password_hash'] ?? Hash::make('password'), 
                    'created_at' => $user['created_at'] ?? now(),
                    'updated_at' => now(),
                ];

                // Check for existing user by email
                $existing = DB::table('users')->where('email', $user['email'])->first();
                
                if ($existing) {
                    $this->command->warn("User {$user['email']} already exists. Updating/Skipping...");
                    // Optional: Update fields?
                    // DB::table('users')->where('id', $existing->id)->update($data);
                } else {
                    DB::table('users')->insert($data);
                    $count++;
                }
            }

            $this->command->info("Migrated $count new users.");

        } catch (PDOException $e) {
            $this->command->error("Migration Failed: " . $e->getMessage());
        }
    }
}
