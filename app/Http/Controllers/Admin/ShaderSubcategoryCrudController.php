<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ShaderSubcategoryRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class ShaderSubcategoryCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ShaderSubcategoryCrudController extends CrudController
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
        CRUD::setModel(\App\Models\ShaderSubcategory::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/shader-subcategory');
        CRUD::setEntityNameStrings('shader subcategory', 'shader subcategories');
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
        
        CRUD::column('shader_category_id')
            ->type('select')
            ->label('Category')
            ->entity('category')
            ->attribute('label')
            ->model('App\Models\ShaderCategory');

        CRUD::column('name')->type('text');
        CRUD::column('label')->type('text');
        CRUD::column('order')->type('number');
        CRUD::column('is_active')->type('boolean');

        CRUD::orderBy('shader_category_id', 'ASC');
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
        CRUD::setValidation(ShaderSubcategoryRequest::class);

        CRUD::field('shader_category_id')
            ->type('select')
            ->label('Category')
            ->entity('category')
            ->attribute('label')
            ->model('App\Models\ShaderCategory');

        CRUD::field('name')
            ->type('text')
            ->label('Name (slug)')
            ->hint('Identificativo univoco all\'interno della categoria');

        CRUD::field('label')
            ->type('text')
            ->label('Label')
            ->hint('Nome visualizzato');

        CRUD::field('order')
            ->type('number')
            ->label('Order')
            ->default(0);

        CRUD::field('is_active')
            ->type('switch')
            ->label('Active')
            ->default(true);
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
