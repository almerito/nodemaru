<?php

namespace App\Http\Controllers;

use App\Models\AdminMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminMessageController extends Controller
{
    /**
     * Get all recent messages for the current user (read and unread)
     */
    public function index()
    {
        $userId = Auth::id();
        if (!$userId) return response()->json([]);

        // Get last 50 messages with read status for current user
        $messages = AdminMessage::with(['users' => function($q) use ($userId) {
                $q->where('user_id', $userId)->select('read_at'); 
            }])
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

        // Map to simpler structure
        $mappedMessages = $messages->map(function($msg) {
            $isRead = $msg->users->isNotEmpty();
            return [
                'id' => $msg->id,
                'title' => $msg->title,
                'message' => $msg->message,
                'link' => $msg->link,
                'created_at' => $msg->created_at,
                'is_read' => $isRead,
                'read_at' => $isRead ? $msg->users->first()->pivot->read_at : null
            ];
        });

        $unreadCount = $mappedMessages->where('is_read', false)->count();

        return response()->json([
            'count' => $unreadCount,
            'messages' => $mappedMessages
        ]);
    }

    /**
     * Mark a single message as read
     */
    public function markRead($id)
    {
        $userId = Auth::id();
        if (!$userId) return response()->json(['error' => 'Unauthorized'], 401);

        $message = AdminMessage::find($id);
        if ($message) {
            // Attach user to pivot with read_at timestamp
            // syncWithoutDetaching avoids duplicates if clicked multiple times
            $message->users()->syncWithoutDetaching([
                $userId => ['read_at' => now()]
            ]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Mark all messages as read
     */
    public function markAllRead()
    {
        $userId = Auth::id();
        if (!$userId) return response()->json(['error' => 'Unauthorized'], 401);

        // Find all unread messages
        $unreadMessages = AdminMessage::unread($userId)->get();

        $pivotData = [];
        $now = now();
        
        foreach ($unreadMessages as $msg) {
            $pivotData[$msg->id] = ['read_at' => $now];
        }

        if (!empty($pivotData)) {
            // Bulk attach via User model relationship for efficiency? 
            // Or just loop sync. 
            // Let's use User->adminMessages relationship if defined, or loop.
            // But wait, AdminMessage->users() is defined. 
            // We can do it manually or via relation.
            
            // Efficient: User::find($userId)->adminMessages()->syncWithoutDetaching($pivotData);
            // I need to add the relation to User model too, but for now I can loop or use raw DB.
            // Let's just loop for simplicity or use the pivot table directly?
            // Safer to use Eloquent.
            
            $user = Auth::user();
            // Assuming we added 'adminMessages' to User or just do straightforward loop
             foreach ($unreadMessages as $msg) {
                 $msg->users()->syncWithoutDetaching([$userId => ['read_at' => $now]]);
             }
        }

        return response()->json(['success' => true]);
    }
}
