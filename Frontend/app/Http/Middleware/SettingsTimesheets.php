<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Session;
class SettingsTimesheets
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next, $permissionKey)
    {
        $userdata = Session::get('admin');
        if($userdata['token']['is_admin'] == true || (isset($userdata['token']['permissionData']) && in_array($permissionKey, array_column($userdata['token']['permissionData'], 'permission'))) ){
            return $next($request);
        }else {
            abort(403,'permission denaied');
        }
    }
}
