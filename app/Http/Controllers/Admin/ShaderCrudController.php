<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ShaderRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class ShaderCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ShaderCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        CRUD::setModel(\App\Models\Shader::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/shader');
        CRUD::setEntityNameStrings('shader', 'shaders');
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        CRUD::column('id')->type('number');
        CRUD::column('order')->type('number');
        CRUD::column('name')->type('text');
        
        CRUD::column('shader_category_id')
            ->type('select')
            ->label('Category')
            ->entity('category')
            ->attribute('label')
            ->model('App\Models\ShaderCategory');

        CRUD::column('shader_subcategory_id')
            ->type('select')
            ->label('Subcategory')
            ->entity('subcategory')
            ->attribute('label')
            ->model('App\Models\ShaderSubcategory');

        CRUD::column('is_active')->type('boolean');
        
        CRUD::orderBy('order', 'ASC');
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(ShaderRequest::class);

        // --- General ---
        CRUD::field('name')->tab('General')->type('text')->label('Name')->wrapper(['class' => 'col-md-3 pe-4 mb-4']);
        CRUD::field('label')->tab('General')->type('text')->label('Label')->wrapper(['class' => 'col-md-3 pe-4 mb-4']);

        CRUD::field('type')->tab('General')->type('select_from_array')->label('Type')->options(['system', 'shader'])->wrapper(['class' => 'col-md-3 pe-4 mb-4']);
        CRUD::field('classname')->tab('General')->type('text')->label('Class Name')->wrapper(['class' => 'col-md-3 mb-4']);
        
        CRUD::field('shader_category_id')
            ->tab('General')
            ->type('select')
            ->label('Category')
            ->entity('category')
            ->attribute('label')
            ->model('App\Models\ShaderCategory')
            ->wrapper(['class' => 'col-md-3 pe-4 mb-4']);

        CRUD::field('shader_subcategory_id')
            ->tab('General')
            ->type('select')
            ->label('Subcategory') // TODO: Dependent select based on category
            ->entity('subcategory')
            ->attribute('full_path_label')
            ->model('App\Models\ShaderSubcategory')
            ->wrapper(['class' => 'col-md-3 pe-4 mb-4']);

        CRUD::field('shader_author_id')
            ->tab('General')
            ->type('select')
            ->label('Author')
            ->entity('author')
            ->attribute('name')
            ->model('App\Models\ShaderAuthor')
            ->wrapper(['class' => 'col-md-3 pe-4 mb-4']);

        CRUD::field('order')->tab('General')->type('number')->default(0)->wrapper(['class' => 'col-md-3 mb-4']);
        CRUD::field('is_active')->tab('General')->type('switch')->default(true);

        // --- I/O ---
        CRUD::field('has_input')->tab('I/O')->type('switch')->label('Has Input');
        CRUD::field('has_output')->tab('I/O')->type('switch')->label('Has Output');
        CRUD::field('has_param_input')->tab('I/O')->type('switch')->label('Has Param Input');
        CRUD::field('has_param_output')->tab('I/O')->type('switch')->label('Has Param Output');

        // --- Logic (JSON) ---
        CRUD::field('accept_nodes')->tab('Logic')->type('array_json')->wrapper(['class' => 'col-md-3 pe-4']);
        CRUD::field('accept_params')->tab('Logic')->type('array_json')->wrapper(['class' => 'col-md-3 pe-4']);
        CRUD::field('refuse_nodes')->tab('Logic')->type('array_json')->wrapper(['class' => 'col-md-3 pe-4']);
        CRUD::field('refuse_params')->tab('Logic')->type('array_json')->wrapper(['class' => 'col-md-3']);
        CRUD::field('params')->tab('Logic')->type('json')->view_namespace('json-field-for-backpack::fields')->wrapper(['class' => 'my-4']);
        CRUD::field('set_function')->tab('Logic')->type('json')->view_namespace('json-field-for-backpack::fields');
        CRUD::field('helpers')->tab('Logic')->type('json')->view_namespace('json-field-for-backpack::fields');
        CRUD::field('options')->tab('Logic')->type('json')->view_namespace('json-field-for-backpack::fields');
    }

    /**
     * Define what happens when the Update operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-update
     * @return void
     */
    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }
}
