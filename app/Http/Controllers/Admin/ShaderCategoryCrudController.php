<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ShaderCategoryRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class ShaderCategoryCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ShaderCategoryCrudController extends CrudController
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
        CRUD::setModel(\App\Models\ShaderCategory::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/shader-category');
        CRUD::setEntityNameStrings('shader category', 'shader categories');
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
        CRUD::column('name')->type('text');
        CRUD::column('label')->type('text');
        CRUD::column('color')->type('color');
        CRUD::column('order')->type('number');
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
        CRUD::setValidation(ShaderCategoryRequest::class);

        CRUD::field('name')
            ->type('text')
            ->label('Name (slug)')
            ->hint('Identificativo univoco, es: source, color, geometry');

        CRUD::field('label')
            ->type('text')
            ->label('Label')
            ->hint('Nome visualizzato, es: Source, Color, Geometry');

        CRUD::field('color')
            ->type('color')
            ->label('Color')
            ->default('#3498db');

        CRUD::field('order')
            ->type('number')
            ->label('Order')
            ->default(0)
            ->hint('Ordine di visualizzazione');

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
