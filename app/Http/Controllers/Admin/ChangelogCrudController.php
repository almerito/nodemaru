<?php

namespace App\Http\Controllers\Admin;

use App\Http\Requests\ChangelogRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class ChangelogCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class ChangelogCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    public function setup()
    {
        CRUD::setModel(\App\Models\Changelog::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/changelog');
        CRUD::setEntityNameStrings('changelog', 'changelogs');
    }

    protected function setupListOperation()
    {
        CRUD::column('version');
        CRUD::column('content')->type('html')->limit(100); 
        CRUD::column('created_at');
        CRUD::column('updated_at');
    }

    protected function setupCreateOperation()
    {
        CRUD::setValidation(ChangelogRequest::class);

        CRUD::field('version')->type('text');
        CRUD::field('content')->type('tinymce'); 
    }

    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }
}
