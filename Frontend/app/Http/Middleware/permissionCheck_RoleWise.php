<?php

namespace App\Http\Middleware;

use App\Modules\User\helper;
use Closure;
//use MongoDB\Driver\Session;
use Illuminate\Support\Facades\Session;


class permissionCheck_RoleWise
{
    /**
     * @var helper
     */
    private $helper;

    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @param $param
     * @return mixed
     */
    public function handle($request, Closure $next, $param)
    {

        $this->helper = new helper();
        $Message = __('messages.permissionDenied');
        if (Session::has('admin') && env('Admin') == $this->helper->getHostName()) {

            return $next($request);
        } else {


            if (Session::has(env('Manager')) && env('Manager') == $this->helper->getHostName()) {
                $RolePermissionData = Session::get(env('Manager'))['token']['permissionData'];
            } else if (Session::has('employee')) {
                $RolePermissionData = Session::get('employee')['token']['permissionData'];
            }
            $Access = '';
            switch ($param) {
                case "CanEmployeeDelete" :
                    {
                        (isset($RolePermissionData) && in_array('employee_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.employee')), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeModify":
                    {
                        (isset($RolePermissionData) && in_array('employee_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.employee')), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeView" :
                    {

                        (isset($RolePermissionData) && in_array('employee_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeChangeRole":
                {
                    (isset($RolePermissionData) && in_array('employee_change_role', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.updateRoleErr')), 410);
                    return $Access;
                }
                case "CanEmployeeUserSetting" :
                    {
                        (isset($RolePermissionData) && in_array('employee_user_setting', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.viewUserSetting')), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeAssignEmployee"  :
                    {
                        (isset($RolePermissionData) && in_array('employee_assign_employee', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.assignUser')), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeCreate":
                    {
                        (isset($RolePermissionData) && in_array('employee_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.create') . ' ' . __('messages.employee')), 410);
                        return $Access;
                    }
                    break;
                case "CanEmployeeBrowse" :
                    {
                        (isset($RolePermissionData) && in_array('employee_browse', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.browse') . ' ' . __('messages.employee')), 410);
                        return $Access;
                    }
                    break;
                case "Admin" :
                    {
                        Session::get("admin")['token']['is_admin'] ? $Access = $next($request) : $Access = response()->json(array('error' => $Message), 410);
                        return $Access;
                    }
                    break;

                case 'CanTimesheetDownload':
                    {
                        (isset($RolePermissionData) && in_array('timesheet_download', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.downloads')), 410);
                        return $Access;
                    }
                    break;
                case 'CanReportWebApplicationUsedDownload':
                    {
                        (isset($RolePermissionData) && in_array('report_web_application_used_download', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.downloads')), 410);
                        return $Access;
                    }
                    break;
                case 'CanReportProductivityDownload':
                    {
                        (isset($RolePermissionData) && in_array('report_productivity_download', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.downloads')), 410);
                        return $Access;
                    }
                    break;
                case 'CanProjectCreate':
                    {
                        (isset($RolePermissionData) && in_array('project_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.add') . ' ' . __('messages.projects')), 410);
                        return $Access;
                    }
                    break;
                case 'CanProjectDelete':
                    {
                        (isset($RolePermissionData) && in_array('project_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.projects')), 410);
                        return $Access;
                    }
                    break;
                case 'CanProjectModify':
                    {
                        (isset($RolePermissionData) && in_array('project_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.projects')), 410);
                        return $Access;
                    }
                    break;
                case 'CanReportProductivityView':
                    {
                        if (Session::has(env('Manager')) && Session::get(env('Manager'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_productivity_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.productivity')), 410);
                        } else if (Session::has(env('Employee')) && Session::get(env('Employee'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_productivity_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        } else {
                            (isset($RolePermissionData) && in_array('employee_productivity_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.productivity')), 410);
                        }
                        return $Access;
                    }
                    break;
                case 'CanTimesheetView':
                    {
                        if (Session::has(env('Manager')) && Session::get(env('Manager'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[2])[1]) {
                            (isset($RolePermissionData) && in_array('me_timesheet_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.timesheets')), 410);
                        } else if (Session::has(env('Employee')) && Session::get(env('Employee'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[2])[1]) {
                            (isset($RolePermissionData) && in_array('me_timesheet_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        } else {
                            (isset($RolePermissionData) && in_array('timesheet_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.timesheets')), 410);
                        }
                        return $Access;
                    }
                    break;
                case 'CanLocateMeView':
                    {
                        (isset($RolePermissionData) && in_array('locate_me_employe_read', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.locateMe')), 410);
                        return $Access;
                    }
                    break;
                case 'CanEmployeeScreenView':
                    {
//                        dd(Session::get(env('Employee')),$request->input('userId'));
                        if (Session::has(env('Manager')) && Session::get(env('Manager'))['token']['user_id'] == $request->input('userId')) {
                            (isset($RolePermissionData) && in_array('me_screenshots_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        } else if (Session::has(env('Employee')) && Session::get(env('Employee'))['token']['user_id'] == $request->input('userId')) {
                            (isset($RolePermissionData) && in_array('me_screenshots_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        } else {
                            (isset($RolePermissionData) && in_array('employee_screenshot_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        }

                        return $Access;
                    }
                    break;
                case 'CanRecordVideo':
                    {
                        if (Session::has(env('Manager')) && Session::get(env('Manager'))['token']['user_id'] == $request->input('userId')) {
                            (isset($RolePermissionData) && in_array('me_screen_record_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.videoRecorder')), 410);
                        } else if (Session::has(env('Employee')) && Session::get(env('Employee'))['token']['user_id'] == $request->input('userId')) {
                            (isset($RolePermissionData) && in_array('me_screen_record_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.videoRecorder')), 410);
                        } else {
                            (isset($RolePermissionData) && in_array('screen_record_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.videoRecorder')), 410);
                        }
                        return $Access;
                    }
                    break;
                case 'CanEmployeeWebusageView':
                    {
                        if (Session::has(env('Manager')) && Session::get(env('Manager'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_web_usage_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.browser') . ' ' . __('messages.history')), 410);
                        } else if (Session::has(env('Employee')) && Session::get(env('Employee'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_web_usage_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        } else {
                            (isset($RolePermissionData) && in_array('employee_webusage_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.browser') . ' ' . __('messages.history')), 410);
                        }
                        return $Access;
                    }
                    break;
                case 'CanEmployeeApplicationUsageView':
                    {
                        if (Session::has(env('Manager')) && Session::get(env('Manager'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_application_usage_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.app') . ' ' . __('messages.history')), 410);
                        } else if (Session::has(env('Employee')) && Session::get(env('Employee'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_application_usage_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        } else {
                            (isset($RolePermissionData) && in_array('employee_application_usage_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.app') . ' ' . __('messages.history')), 410);
                        }
                        return $Access;
                    }
                    break;
                case 'CanEmployeeKeystrokesView':
                    {
                        if (Session::has(env('Manager')) && Session::get(env('Manager'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_keystrokes_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.keystroke')), 410);
                        } else if (Session::has(env('Employee')) && Session::get(env('Employee'))['token']['user_id'] == explode('=', explode('&', $request->all()['data'])[0])[1]) {
                            (isset($RolePermissionData) && in_array('me_keystrokes_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.ss')), 410);
                        } else {
                            (isset($RolePermissionData) && in_array('employee_keystrokes_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.view') . ' ' . __('messages.keystroke')), 410);
                        }
                        return $Access;
                    }
                    break;
                case 'CanSettingsLocationsCreate':
                    {
                        (isset($RolePermissionData) && in_array('settings_locations_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.add') . ' ' . __('messages.Location')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsLocationsModify':
                    {
                        (isset($RolePermissionData) && in_array('settings_locations_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.Location')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsDepartmentsCreate':
                    {
                        (isset($RolePermissionData) && in_array('settings_departments_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.add') . ' ' . __('messages.department')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsDepartmentsDelete':
                    {
                        (isset($RolePermissionData) && in_array('settings_departments_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.department')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsLocationsDelete':
                    {
                        (isset($RolePermissionData) && in_array('settings_locations_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.Location')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsStorageCreate':
                    {
                        (isset($RolePermissionData) && in_array('settings_storage_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.add') . ' ' . __('messages.storage')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsStorageModify':
                    {
                        (isset($RolePermissionData) && in_array('settings_storage_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.storage')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsStorageDelete':
                    {
                        (isset($RolePermissionData) && in_array('settings_storage_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.storage')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsProductivityRuleModify':
                    {
                        (isset($RolePermissionData) && in_array('settings_productivity_rule_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsMonitoringConfigurationModify':
                    {
                        (isset($RolePermissionData) && in_array('settings_monitoring_configuration_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.setting')), 410);
                        return $Access;
                    }
                    break;
                case 'CanDashboardView':
                    {
                        (isset($RolePermissionData) && in_array('dashboard_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanProjectView':
                    {
                        (isset($RolePermissionData) && in_array('project_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanReportWebApplicationUsedView':
                    {
                        (isset($RolePermissionData) && in_array('report_web_application_used_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsLocationsBrowse':
                    {
                        (isset($RolePermissionData) && in_array('settings_locations_browse', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsStorageBrowse':
                    {
                        (isset($RolePermissionData) && in_array('settings_storage_browse', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsMonitoringConfigurationBrowse':
                    {
                        (isset($RolePermissionData) && in_array('settings_monitoring_configuration_browse', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettingsProductivityRuleBrowse':
                    {
                        (isset($RolePermissionData) && in_array('settings_productivity_rule_browse', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanReportProductivityViews':
                    {
                        (isset($RolePermissionData) && in_array('report_productivity_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanTimesheetViews':
                    {
                        (isset($RolePermissionData) && in_array('timesheet_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanRolesBrowse':
                    {
                        (isset($RolePermissionData) && in_array('roles_browse', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanRolesCreate':
                    {
                        (isset($RolePermissionData) && in_array('roles_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.create') . ' ' . __('messages.role')), 410);
                        return $Access;
                    }
                    break;
                case 'CanRolesModify':
                    {
                        (isset($RolePermissionData) && in_array('roles_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.role')), 410);
                        return $Access;
                    }
                    break;
                case 'CanRolesDelete':
                    {
                        (isset($RolePermissionData) && in_array('roles_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.role')), 410);
                        return $Access;
                    }
                    break;
                case 'CanAutoEmailView':
                    {
                        (isset($RolePermissionData) && in_array('auto_email_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanAutoEmailEdit':
                    {
                        (isset($RolePermissionData) && in_array('auto_email_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.AutoEmailReport')), 410);
                        return $Access;
                    }
                    break;
                case 'CanAutoEmailAdd':
                    {
                        if (isset($request->type) && $request->type == 1) {
                            (isset($RolePermissionData) && in_array('auto_email_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.add') . ' ' . __('messages.AutoEmailReport')), 410);

                        } else {
                            $Access = $next($request);
                        }

                        return $Access;
                    }
                    break;
                case 'CanAutoEmailDelete':
                    {
                        (isset($RolePermissionData) && in_array('auto_email_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.AutoEmailReport')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettings_monitoring_configurationCreate':
                    {
                        (isset($RolePermissionData) && in_array('settings_monitoring_configuration_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.create') . ' ' . __('messages.group')), 410);
                        return $Access;
                    }
                    break;
                case 'CanAttendanceView':
                    {
                        (isset($RolePermissionData) && in_array('attendance_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanAttendanceDownload':
                    {
                        (isset($RolePermissionData) && in_array('attendance_download', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.downloads')), 410);
                        return $Access;
                    }
                    break;
                case 'CanShiftCreate':
                    {
                        (isset($RolePermissionData) && in_array('shift_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.create') . ' ' . __('messages.shift')), 410);
                        return $Access;
                    }
                    break;
                case 'CanShiftDelete':
                    {
                        (isset($RolePermissionData) && in_array('shift_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.shift')), 410);
                        return $Access;
                    }
                    break;
                case 'CanShiftModify':
                    {
                        (isset($RolePermissionData) && in_array('shift_modify', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit') . ' ' . __('messages.shift')), 410);
                        return $Access;
                    }
                    break;
                case 'CanShiftBrowse':
                    {
                        (isset($RolePermissionData) && in_array('shift_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanSettings_monitoring_configurationDelete':
                    {
                        (isset($RolePermissionData) && in_array('settings_monitoring_configuration_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete') . ' ' . __('messages.group')), 410);
                        return $Access;
                    }
                    break;
                case 'CanAlertView':
                    {
                        (isset($RolePermissionData) && in_array('alert_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanPolicyView':
                    {
                        (isset($RolePermissionData) && in_array('policy_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanAlertCreate':
                    {
                        (isset($RolePermissionData) && in_array('alert_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanPolicyDelete':
                    {
                        (isset($RolePermissionData) && in_array('policy_delete', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.delete')), 410);
                        return $Access;
                    }
                    break;
                case 'CanPolicyEdit':
                    {
                        (isset($RolePermissionData) && in_array('policy_edit', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case 'CanLocaleEdit':
                    {
                        (isset($RolePermissionData) && in_array('localize_edit', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit')), 410);

//                        (isset($RolePermissionData) && in_array('', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . " edit this page."), 410);
                        return $Access;
                    }
                    break;
                case "CanStoreLogsView" :
                    {
                        (isset($RolePermissionData) && in_array('report_system_logs_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case "CanStoreLogsDownload" :
                    {
                        if (isset($request->excelPDF)) {
                            (isset($RolePermissionData) && in_array('report_system_logs_download', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.downloads')), 410);
                            return $Access;
                        } else  return $next($request);
                    }
                    break;
                case "CanWebAppView" :
                    {
                        (isset($RolePermissionData) && in_array('report_consolidated_webapp_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case "CanWebAppDownload" :
                    {
                        if (isset($request->makeExcel)) {
                            (isset($RolePermissionData) && in_array('report_consolidated_webapp_download', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.downloads')), 410);
                            return $Access;
                        } else  return $next($request);
                    }
                    break;
                case "CanAddDomain" :
                    {
                        (isset($RolePermissionData) && in_array('add_productivity_ranking', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.create')), 410);
                        return $Access;
                    }
                    break;
                case "CanSettingsProductivityRuleDownload" :
                    {
                        (isset($RolePermissionData) && in_array('productivity_rule_download', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.downloads')), 410);
                        return $Access;
                    }
                    break;
                case "CanViewRequestList" :
                    {
                        (isset($RolePermissionData) && in_array('activity_alter_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;
                case "CanCreateRequestList" :
                    {
                        (isset($RolePermissionData) && in_array('activity_alter_create', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.create')), 410);
                        return $Access;
                    }
                    break;

                case "CanEmployeeInsightsView" :
                    {
                        (isset($RolePermissionData) && in_array('employee_insights_view', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = redirect('/' . env('Manager') . '/permission-denied')->with(Session::flash('message', $Message . __('messages.pageView')), 410);
                        return $Access;
                    }
                    break;

                case "CanProcessRequestList" :
                    {
                        (isset($RolePermissionData) && in_array('activity_alter_process', array_column($RolePermissionData, 'permission'))) ? $Access = $next($request) : $Access = response()->json(array('error' => $Message . __('messages.edit')), 410);
                        return $Access;
                    }
                    break;

            }
        }
    }
}
