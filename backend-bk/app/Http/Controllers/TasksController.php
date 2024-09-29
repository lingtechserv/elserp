<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class TasksController extends Controller
{
    // Get all tasks
    public function index()
    {
        $tasks = Task::all();
        return response()->json($tasks);
    }

    // Get tasks for a specific user
    public function userTasks($userId)
    {
        $tasks = Task::where('user_id', $userId)->get();
        return response()->json($tasks);
    }

    // Create a new task
    public function store(Request $request)
{
    // Log the request data
    Log::info('Incoming Request Data', $request->all());

    $validator = Validator::make($request->all(), [
        'title' => 'required',
        'start_date' => 'required|date',
        'end_date' => 'required|date',
        'description' => 'nullable',
        'status' => 'nullable',
        'user_id' => 'required|exists:users,id',
    ]);

    if ($validator->fails()) {
        // Log validation errors
        Log::error('Validation Errors', $validator->errors()->toArray());
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $task = Task::create($request->all());
    return response()->json(['message' => 'Task created successfully', 'task' => $task], 201);
}

    // Update a task by ID
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'description' => 'nullable',
            'status' => 'nullable',
            'user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task = Task::findOrFail($id);
        $task->update($request->all());
        return response()->json(['message' => 'Task updated successfully', 'task' => $task]);
    }
}
