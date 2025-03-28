<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Session;

class UserFullDetailsCheck
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @param $option
     * @return mixed
     */
    public function handle($request, Closure $next, $option)
    {
        $userData = Session::get('employee');
        if ($userData['token']['is_admin'] == true || (isset($userData['token']['permissionData'])  && in_array($option, array_column($userData['token']['permissionData'], 'permission')))) {
            return $next($request);
        } else {
            abort(403, 'Permissions denied.');
        }
    }
}
