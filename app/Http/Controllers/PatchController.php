<?php

namespace App\Http\Controllers;

use App\Models\Patch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PatchController extends Controller
{
    /**
     * Get list of loadable patches
     */
    public function index(Request $request)
    {
        $userId = Auth::id();

        $query = Patch::where(function($q) use ($userId) {
            $q->where('is_public', true)
              ->orWhere('user_id', $userId);
        });

        if ($request->has('search')) {
            $term = $request->search;
            $query->where(function($q) use ($term) {
                $q->where('label', 'like', "%{$term}%")
                  ->orWhere('description', 'like', "%{$term}%");
            });
        }

        $patches = $query->with('user:id,name') // Eager load author name
            ->orderBy('updated_at', 'desc')
            ->select(['id', 'label', 'description', 'user_id', 'updated_at', 'is_public', 'data']) // Need data for preview!
            ->paginate(20);

        return response()->json($patches);
    }

    /**
     * Get single patch data
     */
    public function show($id)
    {
        $patch = Patch::findOrFail($id);

        // Check visibility
        if (!$patch->is_public && $patch->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Add 'saved' flag to data if not present (logic requirement)
        $data = $patch->data;
        if (is_array($data)) {
            $data['saved'] = true;
            $data['patch_id'] = $patch->id; // Inject ID for frontend tracking
            $data['author_id'] = $patch->user_id; // Inject Author ID
        }

        return response()->json([
            'id' => $patch->id,
            'label' => $patch->label,
            'data' => $data,
            'is_owner' => $patch->user_id === Auth::id()
        ]);
    }

    /**
     * Create new patch (Save As / New Save)
     */
    public function store(Request $request)
    {
        $request->validate([
            'label' => 'required|string|max:255',
            'data'  => 'required|array',
        ]);

        $data = $request->data;
        $data['saved'] = true; // Ensure flag is set

        $patch = Patch::create([
            'user_id' => Auth::id(),
            'label' => $request->label,
            'description' => $request->description,
            'is_public' => $request->has('is_public') ? $request->boolean('is_public') : true,
            'data' => $data,
        ]);

        return response()->json([
            'success' => true,
            'patch_id' => $patch->id,
            'message' => 'Patch saved successfully'
        ]);
    }

    /**
     * Update existing patch (Save)
     */
    public function update(Request $request, $id)
    {
        $patch = Patch::findOrFail($id);

        // Ownership check
        if ($patch->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized. You do not own this patch.'], 403);
        }

        $patch->label = $request->input('label', $patch->label);
        $patch->description = $request->input('description', $patch->description);
        
        if ($request->has('is_public')) {
            $patch->is_public = $request->boolean('is_public');
        }

        if ($request->has('data')) {
            $data = $request->data;
            $data['saved'] = true;
            $patch->data = $data;
        }

        $patch->save();

        return response()->json([
            'success' => true,
            'patch_id' => $patch->id,
            'message' => 'Patch updated successfully'
        ]);
    }

    /**
     * Delete existing patch
     */
    public function destroy($id)
    {
        $patch = Patch::findOrFail($id);

        if ($patch->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized. You do not own this patch.'], 403);
        }

        $patch->delete();

        return response()->json([
            'success' => true,
            'message' => 'Patch deleted successfully'
        ]);
    }
}
