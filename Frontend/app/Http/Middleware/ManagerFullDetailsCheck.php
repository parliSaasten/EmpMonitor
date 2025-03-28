<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Session;

class ManagerFullDetailsCheck
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
        $managerData = Session::get('admin');
        if ($managerData['token']['is_admin'] == true || (isset($managerData['token']['permissionData'])  && in_array($option, array_column($managerData['token']['permissionData'], 'permission')))) {
            return $next($request);
        } else {
            abort(403, 'Permissions denied.');
        }
    }
}
