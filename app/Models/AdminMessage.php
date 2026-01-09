<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdminMessage extends Model
{
    use HasFactory, CrudTrait;

    protected $fillable = ['title', 'message', 'link'];

    /**
     * Users who have read this message
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'admin_message_user')
                    ->withPivot('read_at');
    }

    /**
     * Scope to get messages NOT read by the user
     */
    public function scopeUnread($query, $userId)
    {
        return $query->whereDoesntHave('users', function ($q) use ($userId) {
            $q->where('user_id', $userId);
        });
    }
}
