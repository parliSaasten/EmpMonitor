<?php

namespace App\Http\Middleware;

use App\Modules\User\helper;
use Closure;
use Illuminate\Support\Facades\Session;

class permissionCheckHRMS_RoleWise
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @param $permission_key
     * @param $method_call
     * @return mixed
     */
    public function handle($request, Closure $next, $permission_key, $method_call)
    {
        \Session::flash('ErrorStatus', false );
        $this->helper = new helper();
        $ErrorMessage = "You don't have permission to do this action.";
        if (Session::has('admin') && env('Admin') == $this->helper->getHostName() ) {
//        if (Session::has('admin') && env('Admin') == $this->helper->getHostName() || Session::has('Employee') && env('Employee') == $this->helper->getHostName()) {
            return $next($request);
        } else {
            $Access = '';
            $RolePermissionData =Session::has('employee') && env('Employee') == $this->helper->getHostName() ? Session::get(env('Employee'))['token']['permissionData'] : Session::get(env('Manager'))['token']['permissionData'];
            if ($method_call === "Ajax") (isset($RolePermissionData) && in_array($permission_key, array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $ErrorMessage), 410);
            else {
                if (isset($RolePermissionData) && in_array($permission_key, array_column($RolePermissionData, 'permission'))) $Access = $next($request);
                else {
                    \Session::flash('ErrorStatus', true );
                    return $next($request);
                }
            }
        }
        return $Access;
    }
}
