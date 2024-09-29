<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Form;
use App\Models\FormField;
use App\Models\Field;
use App\Models\CompletedForm;

class FormController extends Controller
{
    public function index()
    {
        $forms = Form::all();
        return response()->json($forms);
    }

    // Method to get a specific form by ID
    public function show($id)
    {
        $form = Form::find($id);
        if ($form) {
            return response()->json($form);
        } else {
            return response()->json(['message' => 'Form not found'], 404);
        }
    }

    // Method to create a new form
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'config' => 'required|json',
            'is_custom' => 'required|boolean',
        ]);

        $form = Form::create($request->all());
        return response()->json($form, 201);
    }

    // Method to update an existing form
    public function update(Request $request, $id)
    {
        $form = Form::find($id);

        if ($form) {
            $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'config' => 'sometimes|required|json',
                'is_custom' => 'sometimes|required|boolean',
            ]);

            $form->update($request->all());
            return response()->json($form);
        } else {
            return response()->json(['message' => 'Form not found'], 404);
        }
    }


    public function getFormFields($formId)
    {
        $form = Form::with('formFields')->find($formId);

        if (!$form) {
            return response()->json(['message' => 'Form not found'], 404);
        }

        return response()->json($form, 200);
    }

    public function saveField(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'type' => 'required|string',
            'config' => 'required|array',
        ]);

        $field = Field::create([
            'name' => $data['name'],
            'type' => $data['type'],
            'config' => $data['config'],
        ]);

        return response()->json(['message' => 'Field saved successfully', 'field' => $field], 200);
    }

    public function getFields()
    {
        $fields = Field::all();
        return response()->json($fields, 200);
    }

    public function getField($id)
    {
        $field = Field::find($id);

        if (!$field) {
            return response()->json(['message' => 'Field not found'], 404);
        }

        return response()->json($field, 200);
    }

    public function completedIndex()
    {
        $completedForms = CompletedForm::all();
        return response()->json($completedForms);
    }

    // Store a newly created resource in storage
    public function completedStore(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'config' => 'required|json',
        ]);

        $completedForm = CompletedForm::create([
            'type' => $request->type,
            'config' => json_decode($request->config, true),
        ]);

        return response()->json($completedForm, 201);
    }

    // Display the specified resource
    public function completedShow($id)
    {
        $completedForm = CompletedForm::find($id);
        if (!$completedForm) {
            return response()->json(['message' => 'Completed form not found'], 404);
        }
        return response()->json($completedForm);
    }

    // Update the specified resource in storage
    public function completedUpdate(Request $request, $id)
    {
        $completedForm = CompletedForm::find($id);
        if (!$completedForm) {
            return response()->json(['message' => 'Completed form not found'], 404);
        }

        $request->validate([
            'type' => 'sometimes|required|string|max:255',
            'config' => 'sometimes|required|json',
        ]);

        if ($request->has('type')) {
            $completedForm->type = $request->type;
        }

        if ($request->has('config')) {
            $completedForm->config = json_decode($request->config, true);
        }

        $completedForm->save();

        return response()->json($completedForm);
    }

    // Remove the specified resource from storage
    public function destroy($id)
    {
        $completedForm = CompletedForm::find($id);
        if (!$completedForm) {
            return response()->json(['message' => 'Completed form not found'], 404);
        }

        $completedForm->delete();
        return response()->json(['message' => 'Completed form deleted']);
    }
}
