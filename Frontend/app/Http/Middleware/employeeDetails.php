<?php

namespace App\Http\Middleware;

use App\Http\Middleware\Redirect;
use Closure;
use Illuminate\Support\Facades\Session;

class employeeDetails
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next, $param)
    {
        $Messaage = "Permission Denied";
        if (Session::get("admin")['token']['is_admin']) {
            return $next($request);
        } else {
            $Access = "";
            switch ($param) {
                case "CanEmployeeDelete" :
                    {
                        (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_delete', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Messaage), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeModify":
                    {
                        (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_modify', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Messaage), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeView" :
                    {
                        (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_view', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = redirect('/employee-details')->with(Session::flash('message', $Messaage), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeChangeRole":
                {
                    (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_change_role', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Messaage), 410);
                    return $Access;
                }
                case "CanEmployeeUserSetting" :
                    {
                        (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_user_setting', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = redirect('/employee-details')->with(Session::flash('message', $Messaage), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeAssignEmployee"  :
                    {
                        (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_assign_employee', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Messaage), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeCreate":
                    {
                        (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_create', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Messaage), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeBrowse" :
                {
                    (isset(Session::get('admin')['token']['permissionData']) && in_array('employee_browse', array_column(Session::get('admin')['token']['permissionData'], 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Messaage), 410);
                    return $Access;
                }
                break;
                case "Admin" : {
                    Session::get("admin")['token']['is_admin']  ? $Access = $next($request) : $Access = response()->json(array('error' => $Messaage), 410);
                    return $Access;
                }
            }
        }
    }

}
