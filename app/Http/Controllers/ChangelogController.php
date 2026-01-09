<?php

namespace App\Http\Controllers;

use App\Models\Changelog;
use Illuminate\Http\Request;

class ChangelogController extends Controller
{
    public function index(Request $request)
    {
        $changelogs = Changelog::orderBy('created_at', 'desc')->paginate(20);
        
        if ($request->ajax()) {
            return response()->json($changelogs);
        }

        return abort(404);
    }
}
