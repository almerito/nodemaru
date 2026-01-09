<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use PDO;
use PDOException;

class PatchesSeeder extends Seeder
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

            // Fetch presets WITH user info
            // Join with users table to get the email
            $sql = "
                SELECT p.*, u.email as user_email 
                FROM presets p
                LEFT JOIN users u ON p.user_id = u.id
            ";
            $stmt = $pdo->query($sql);
            $presets = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $this->command->info("Found " . count($presets) . " presets in SQLite.");

            $count = 0;
            // Pre-fetch all local users map: email -> id
            $localUsers = DB::table('users')->pluck('id', 'email')->toArray();
            $defaultUserId = DB::table('users')->first()->id ?? 1;

            foreach ($presets as $preset) {
                // Resolve User
                $email = $preset['user_email'];
                $targetUserId = $localUsers[$email] ?? $defaultUserId;

                $data = [
                    'label' => substr($preset['name'], 0, 150),
                    'description' => $preset['author'] ? "Author: " . $preset['author'] : null,
                    'data' => $preset['data'],
                    'is_public' => $preset['is_public'] ?? true,
                    'user_id' => $targetUserId,
                    'created_at' => $preset['created_at'],
                    'updated_at' => $preset['updated_at'] ?? $preset['created_at'],
                ];

                DB::table('patches')->updateOrInsert(
                    ['label' => $data['label']], 
                    $data
                );
                
                $count++;
            }

            $this->command->info("Migrated $count patches (with user linking).");

        } catch (PDOException $e) {
            $this->command->error("Migration Failed: " . $e->getMessage());
        }
    }
}
