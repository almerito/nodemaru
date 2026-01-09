<!-- Login Modal -->
<div class="modal fade" id="loginModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Login</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="loginForm">
                    <div class="mb-3">
                        <label for="loginEmail" class="form-label">Email</label>
                        <input type="email" class="form-control bg-dark text-white border-secondary" id="loginEmail" name="email" required placeholder="your@email.com">
                    </div>
                    <div class="mb-3">
                        <label for="loginPassword" class="form-label">Password</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="loginPassword" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-info w-100 fw-bold">Login</button>
                    
                    <div class="d-flex align-items-center my-3">
                        <div class="flex-grow-1 border-bottom border-secondary"></div>
                        <span class="mx-2 text-muted">or</span>
                        <div class="flex-grow-1 border-bottom border-secondary"></div>
                    </div>

                    <a href="{{ route('auth.google') }}" class="btn btn-light w-100 d-flex align-items-center justify-content-center">
                        <img src="https://www.google.com/favicon.ico" alt="Google" width="16" height="16" class="me-2">
                        Continue with Google
                    </a>
                </form>
            </div>
            <div class="modal-footer border-secondary justify-content-center">
                <small class="text-muted">Don't have an account? <a href="#" data-bs-toggle="modal" data-bs-target="#registerModal">Register</a></small>
            </div>
        </div>
    </div>
</div>

<!-- Register Modal -->
<div class="modal fade" id="registerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Create Account</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="registerForm">
                    <div class="row">
                        <div class="col-md-12 mb-3">
                            <label for="regName" class="form-label">Name *</label>
                            <input type="text" class="form-control bg-dark text-white border-secondary" id="regName" name="name" required placeholder="Display Name">
                        </div>
                    </div>
                    <div class="mb-3">
                        <label for="regEmail" class="form-label">Email *</label>
                        <input type="email" class="form-control bg-dark text-white border-secondary" id="regEmail" name="email" required placeholder="your@email.com">
                    </div>
                    <div class="mb-3">
                        <label for="regPassword" class="form-label">Password *</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="regPassword" name="password" required placeholder="Min. 6 characters">
                    </div>
                    <div class="mb-3">
                        <label for="regPasswordConfirm" class="form-label">Confirm Password *</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="regPasswordConfirm" name="password_confirmation" required>
                    </div>
                    
                    <button type="submit" class="btn btn-info w-100 fw-bold">Create Account</button>

                    <div class="d-flex align-items-center my-3">
                        <div class="flex-grow-1 border-bottom border-secondary"></div>
                        <span class="mx-2 text-muted">or</span>
                        <div class="flex-grow-1 border-bottom border-secondary"></div>
                    </div>

                    <a href="{{ route('auth.google') }}" class="btn btn-light w-100 d-flex align-items-center justify-content-center">
                        <img src="https://www.google.com/favicon.ico" alt="Google" width="16" height="16" class="me-2">
                        Continue with Google
                    </a>
                </form>
            </div>
            <div class="modal-footer border-secondary justify-content-center">
                 <small class="text-muted">Already have an account? <a href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a></small>
            </div>
        </div>
    </div>
</div>

<!-- Profile Modal -->
<div class="modal fade" id="profileModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content bg-dark text-white border-secondary">
            <div class="modal-header border-secondary">
                <h5 class="modal-title">Edit Profile</h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="profileForm">
                    <div class="mb-3">
                        <label for="profileName" class="form-label">Name</label>
                        <input type="text" class="form-control bg-dark text-white border-secondary" id="profileName" name="name" value="{{ Auth::user() ? Auth::user()->name : '' }}" required>
                    </div>
                    <div class="mb-3">
                        <label for="profileEmail" class="form-label">Email</label>
                        <input type="email" class="form-control bg-dark text-white border-secondary" id="profileEmail" name="email" value="{{ Auth::user() ? Auth::user()->email : '' }}" required>
                    </div>
                    <hr class="border-secondary my-4">
                    <h6 class="mb-3">Change Password (leave empty to keep current)</h6>
                    <div class="mb-3">
                        <label for="profilePassword" class="form-label">New Password</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="profilePassword" name="password" minlength="8">
                    </div>
                    <div class="mb-3">
                        <label for="profilePasswordConfirm" class="form-label">Confirm New Password</label>
                        <input type="password" class="form-control bg-dark text-white border-secondary" id="profilePasswordConfirm" name="password_confirmation">
                    </div>
                    <button type="submit" class="btn btn-info w-100 fw-bold">Update Profile</button>
                </form>
            </div>
        </div>
    </div>
</div>
