{{-- This file is used for menu items by any Backpack v7 theme --}}
<li class="nav-item"><a class="nav-link" href="{{ backpack_url('dashboard') }}"><i class="la la-home nav-icon"></i> {{ trans('backpack::base.dashboard') }}</a></li>
<x-backpack::menu-dropdown title="Auth" icon="la la-users">
    <x-backpack::menu-dropdown-header title="Authentication" />
    <x-backpack::menu-dropdown-item title="Users" icon="la la-user" :link="backpack_url('user')" />
    <x-backpack::menu-dropdown-item title="Roles" icon="la la-group" :link="backpack_url('role')" />
    <x-backpack::menu-dropdown-item title="Permissions" icon="la la-key" :link="backpack_url('permission')" />
</x-backpack::menu-dropdown>
<x-backpack::menu-dropdown title="Nodes" icon="la la-puzzle-piece">
    <x-backpack::menu-dropdown-item title="Categories" icon="la la-folder" :link="backpack_url('shader-category')" />
    <x-backpack::menu-dropdown-item title="Subcategories" icon="la la-folder-open" :link="backpack_url('shader-subcategory')" />
    <x-backpack::menu-dropdown-item title="Authors" icon="la la-users" :link="backpack_url('shader-author')" />
    <x-backpack::menu-dropdown-item title="Shaders" icon="la la-file-code" :link="backpack_url('shader')" />
</x-backpack::menu-dropdown>
<x-backpack::menu-item title="Patches" icon="la la-save" :link="backpack_url('patch')" />
<x-backpack::menu-item title="Changelogs" icon="la la-history" :link="backpack_url('changelog')" />
<x-backpack::menu-item title="Logs" icon="la la-terminal" :link="backpack_url('log')" />
