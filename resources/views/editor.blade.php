@extends('layouts.app')

@section('content')
<nav class="navbar navbar-expand-lg navbar-dark bg-dark border-bottom border-secondary py-0">
    <div class="container-fluid">
        <!-- Brand -->
        <a class="navbar-brand d-flex align-items-center me-5" href="{{ url('/') }}">
            <img src="{{ Vite::asset('resources/images/logo-white.png') }}" alt="Nodemaru" height="30" class="d-inline-block align-text-top me-2">
        </a>

        <!-- Toggler -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Content -->
        <div class="collapse navbar-collapse text-white" id="navbarContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <!-- File Menu -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">File</a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li><a class="dropdown-item" href="#" id="menu-new">New</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="menu-load">Load</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-save">Save</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-save-as">Save as...</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="menu-import">Import</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-export">Export</a></li>
                    </ul>
                </li>

                <!-- Edit Menu -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">Edit</a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li><a class="dropdown-item" href="#" id="menu-add-node">Add Node</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="menu-copy">Copy</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-paste">Paste</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-cut">Cut</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-delete">Delete</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" id="menu-settings">Settings</a></li>
                    </ul>
                </li>

                <!-- About Menu -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">About</a>
                    <ul class="dropdown-menu dropdown-menu-dark">
                        <li><a class="dropdown-item" href="#" id="menu-help" data-bs-toggle="modal" data-bs-target="#helpModal">Help</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-credits" data-bs-toggle="modal" data-bs-target="#creditsModal">Credits</a></li>
                        <li><a class="dropdown-item" href="#" id="menu-changelog" data-bs-toggle="modal" data-bs-target="#changelogModal">Changelog</a></li>
                    </ul>
                </li>
            </ul>

            <!-- Patch Name -->
            <div class="navbar-text text-white mx-3 border-start border-end border-secondary px-3">
                <span id="patch-name" class="fw-bold">New Patch</span>
            </div>

            <!-- Right Side Controls -->
            <div class="d-flex align-items-center gap-2">
                <!-- User Auth -->
                @guest
                    <button class="btn btn-outline-light btn-sm" data-bs-toggle="modal" data-bs-target="#loginModal">Login</button>
                    <button class="btn btn-outline-light btn-sm" data-bs-toggle="modal" data-bs-target="#registerModal">Register</button>
                @else
                    <div class="dropdown">
                        <a class="nav-link dropdown-toggle text-white d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="bi bi-person-circle me-2"></i> {{ Auth::user()->name }}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                            <li><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#profileModal">Profile</a></li>
                            @role('admin')
                                <li><a class="dropdown-item" href="/admin">Admin Panel</a></li>
                            @endrole
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" id="logoutLink">Logout</a></li>
                        </ul>
                    </div>
                @endguest

                <!-- Divider -->
                <div class="vr mx-2 text-white"></div>
                
                <!-- Scene Controls -->
                <button class="btn btn-outline-info btn-sm" id="btn-add-node" title="Add Node">Add Node</button>
                <button class="btn btn-outline-warning btn-sm" id="btn-scenes">Scenes</button>
                <div class="vr mx-2 text-white"></div>
                <button class="btn btn-primary btn-sm" id="btn-preview">PREVIEW</button>
                <button class="btn btn-success btn-sm" id="btn-play">PLAY</button>
                <button class="btn btn-danger btn-sm" id="btn-record">RECORD</button>
            </div>
        </div>
    </div>
</nav>

<!-- Main Editor Area -->
<div class="flex-grow-1 position-relative overflow-hidden" style="background-color: #0d0d0d; min-height: 0;">
    
    <!-- NodeGraph Container (must be a div) -->
    <div id="node_graph"></div>

    <!-- Overlay UI (e.g., Node Palette if needed, or Notifications) -->
    
</div>

@include('partials.auth_modals')
@include('partials.info_modals')
@include('partials.node_selector_modal')
@include('partials.settings_modal')
@include('partials.save_load_modals')
@include('partials.auth_glob')


<!-- Hydra Canvas Layer (replaces Bootstrap modal) -->
<div id="hydra-layer" class="hydra-layer" style="display: none;">
    <button id="btn-close-hydra" class="hydra-close-btn">&times;</button>
    <div id="hydra-recording-indicator" class="hydra-recording" style="display: none;">
        <span class="rec-dot"></span>
        <span id="hydra-rec-timer">00:00</span>
    </div>
    <div id="hydra-resize-handle" class="hydra-resize-handle"></div>
    <canvas id="hydra-canvas"></canvas>
</div>

@include('partials.scenes_panel')

<!-- Node Parameters Drawer -->
<div class="offcanvas offcanvas-end bg-dark text-white" id="nodeParamsDrawer" tabindex="-1" data-bs-backdrop="false" style="width: 350px; top: 41px;">
    <div class="offcanvas-header border-bottom border-secondary py-2">
        <h6 class="offcanvas-title mb-0" id="drawerNodeTitle">Node Parameters</h6>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body p-3" id="drawerContent">
        <p class="text-muted">Select a node to view its parameters.</p>
    </div>
</div>
@endsection

</body>
</html>
