<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Authenticate the user using session-based authentication
        Auth::login($user);

        return response()->json([
            'message' => 'Login successful',
            // You can add other information here if needed
        ]);
    }

    public function logout(Request $request)
    {
        // Perform session-based logout
        Auth::logout();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        return response()->json($user);
    }

    public function getRolesAndPermissions(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not found'], 401);
        }

        $roles = $user->getRoleNames(); // Retrieve user roles using Spatie
        $permissions = $user->getPermissionsViaRoles(); // Retrieve permissions via roles

        return response()->json([
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'title' => $user->title,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function assignPermissions()
    {
        // Fetch all permissions
        $permissions = Permission::all();

        // Fetch roles
        $role1 = Role::findById(1);
        $role2 = Role::findById(2);

        // Assign all permissions to role ID 1
        $role1->syncPermissions($permissions);

        // Filter permissions to exclude those containing 'delete' for role ID 2
        $filteredPermissions = $permissions->reject(function ($permission) {
            return str_contains($permission->name, 'delete');
        });

        // Assign filtered permissions to role ID 2
        $role2->syncPermissions($filteredPermissions);

        return response()->json(['message' => 'Permissions assigned successfully']);
    }

    public function getUserDetails(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        return response()->json([
            'id' => $user->id, // Include user ID
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'title' => $user->title,
            // Include any other user details you need
        ]);
    }

    public function updatePasswords(Request $request)
    {
        $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'required|integer|exists:users,id',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $userIds = $request->user_ids;
        $password = Hash::make($request->password);

        // Update the password for the users
        User::whereIn('id', $userIds)->update(['password' => $password]);

        return response()->json(['message' => 'Passwords updated successfully']);
    }
}
