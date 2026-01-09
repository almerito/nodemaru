<?php

namespace App\Http\Controllers;

use App\Models\ShaderCategory;
use Illuminate\Http\Request;

class NodeController extends Controller
{
    public function index()
    {
        // 1. Fetch Categories active and ordered
        $categories = ShaderCategory::where('is_active', true)
            ->orderBy('order')
            ->with(['subcategories' => function ($query) {
                $query->where('is_active', true)->orderBy('order');
            }])
            ->get();

        $categories->load(['shaders' => function ($query) {
            $query->where('is_active', true)
                  ->orderBy('order')
                  ->with(['category', 'subcategory']);
        }]);

        // Transform data to easy frontend structure
        $data = $categories->map(function ($category) {
            // Get shaders that belong to this category
            $categoryShaders = $category->shaders;

            // Group shaders by subcategory
            $subcategories = $category->subcategories->map(function ($sub) use ($categoryShaders) {
                $sub->shaders = $categoryShaders->where('shader_subcategory_id', $sub->id)->values();
                return $sub;
            });

            // Shaders without subcategory
            $orphanShaders = $categoryShaders->whereNull('shader_subcategory_id')->values();

            unset($category->shaders); // Remove the flat list to avoid duplication/bloat
            
            $category->subcategories = $subcategories;
            $category->orphan_shaders = $orphanShaders->isNotEmpty() ? $orphanShaders : null;
            
            return $category;
        });

        return response()->json($data);
    }

    /**
     * Get set_function code for specified shader names
     * Used by HydraCompiler to inject custom shader definitions
     */
    public function getSetFunctions(Request $request)
    {
        $names = $request->input('types', []); // Frontend sends as 'types' but they are names
        
        if (empty($names)) {
            return response()->json([]);
        }

        $shaders = \App\Models\Shader::whereIn('name', $names)
            ->whereNotNull('set_function')
            ->where('set_function', '!=', '')
            ->pluck('set_function', 'name');

        return response()->json($shaders);
    }
}
