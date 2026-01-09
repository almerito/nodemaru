<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class Patch extends Model
{
    use CrudTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'patches';
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $guarded = ['id'];

    protected $fillable = [
        'user_id',
        'label',
        'description',
        'is_public',
        'data',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'data' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopeMyPatches($query)
    {
         if (backpack_auth()->check()) {
            return $query->where('user_id', backpack_auth()->user()->id);
         }
         return $query;
    }
}
