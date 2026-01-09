<?php

namespace App\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class Shader extends Model
{
    use CrudTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'shaders';
    protected $primaryKey = 'id';
    public $timestamps = true;
    protected $guarded = ['id'];

    protected $fillable = [
        'name',
        'label',
        'shader_category_id',
        'shader_subcategory_id',
        'shader_author_id',
        'has_input',
        'has_output',
        'has_param_input',
        'has_param_output',
        'accept_nodes',
        'accept_params',
        'params',
        'options',
        'set_function',
        'is_active',
        'order',
    ];

    protected $casts = [
        'has_input' => 'boolean',
        'has_output' => 'boolean',
        'has_param_input' => 'boolean',
        'has_param_output' => 'boolean',
        'accept_nodes' => 'array',
        'accept_params' => 'array',
        'params' => 'array',
        'options' => 'array',
        'set_function' => 'array',
        'is_active' => 'boolean',
        'order' => 'integer',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function category()
    {
        return $this->belongsTo(ShaderCategory::class, 'shader_category_id');
    }

    public function subcategory()
    {
        return $this->belongsTo(ShaderSubcategory::class, 'shader_subcategory_id');
    }

    public function author()
    {
        return $this->belongsTo(ShaderAuthor::class, 'shader_author_id');
    }

    /*
    |--------------------------------------------------------------------------
    | SCOPES
    |--------------------------------------------------------------------------
    */

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order', 'asc');
    }

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    protected $appends = ['category_name', 'subcategory_name'];

    public function getCategoryNameAttribute()
    {
        return $this->category?->name;
    }

    public function getSubcategoryNameAttribute()
    {
        return $this->subcategory?->name;
    }
}
