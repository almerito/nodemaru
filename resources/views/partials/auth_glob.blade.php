@php
    $userData = Auth::user() ? [
        'id' => Auth::id(),
        'name' => Auth::user()->name,
        'email' => Auth::user()->email,
        'roles' => Auth::user()->roles->pluck('name'),
    ] : null;
@endphp
<script>
    window.user = @json($userData);
</script>
