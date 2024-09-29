<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Display a listing of the resource
    public function index()
    {
        $settings = Setting::all();
        return response()->json($settings);
    }

    // Store a newly created resource in storage
    public function store(Request $request)
{
    $request->validate([
        'module' => 'required|string|max:255',
        'settings' => 'required|array',
    ]);

    $setting = Setting::create([
        'module' => $request->module,
        'settings' => json_encode($request->settings), // Encode the array as JSON
    ]);

    return response()->json($setting, 201);
}

    // Display the specified resource
    public function show($id)
    {
        $setting = Setting::find($id);
        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }
        return response()->json($setting);
    }

    // Update the specified resource in storage
    public function update(Request $request, $id)
{
    \Log::info('Request Payload:', $request->all());

    $setting = Setting::find($id);
    if (!$setting) {
        return response()->json(['message' => 'Setting not found'], 404);
    }

    $request->validate([
        'module' => 'sometimes|required|string|max:255',
        'settings' => 'sometimes|required|string', // Validate as a string
    ]);

    if ($request->has('module')) {
        $setting->module = $request->module;
    }

    if ($request->has('settings')) {
        $setting->settings = $request->settings; // Store the JSON string directly
    }

    $setting->save();

    return response()->json($setting);
}


    // Remove the specified resource from storage
    public function destroy($id)
    {
        $setting = Setting::find($id);
        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        $setting->delete();
        return response()->json(['message' => 'Setting deleted']);
    }
}
