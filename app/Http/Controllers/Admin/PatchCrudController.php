<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\PatchRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class PatchCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class PatchCrudController extends CrudController
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
        CRUD::setModel(\App\Models\Patch::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/patch');
        CRUD::setEntityNameStrings('patch', 'patches');
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
        CRUD::column('label')->type('text');
        
        CRUD::column('user_id')
            ->type('select')
            ->label('User')
            ->entity('user')
            ->attribute('name')
            ->model('App\Models\User');

        CRUD::column('is_public')->type('boolean');
        CRUD::column('created_at')->type('datetime');
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        CRUD::setValidation(PatchRequest::class);

        CRUD::field('label')->type('text')->label('Label');
        CRUD::field('description')->type('textarea')->label('Description');
        
        CRUD::field('user_id')
            ->type('select')
            ->label('User')
            ->entity('user') // Method in your Model
            ->attribute('name') // Attribute to show
            ->model('App\Models\User') // Model
            ->default(backpack_user()->id); // Default to current user

        CRUD::field('is_public')->type('switch')->label('Public')->default(true);
        CRUD::field('data')->type('json')->view_namespace('json-field-for-backpack::fields')->hint('JSON content');
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
