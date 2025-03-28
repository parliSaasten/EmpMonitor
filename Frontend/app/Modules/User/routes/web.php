<?php
use App\Modules\User\Controllers\UserController;
use App\Modules\User\Controllers\UserDetailsController;
use App\Modules\User\Controllers\EmployeeController;
use App\Modules\User\Controllers\EmployeeDetailsController;

Route::group(['module' => 'User', 'middleware' => ['web'], 'namespace' => 'App\Modules\User\Controllers'], function () {
    Route::get('/login', [UserController::class,'login']);
    Route::post('/login', [UserController::class,'login']);
    Route::get('/admin-login', [UserController::class,'adminLogin']);
    Route::post('/admin-login', [UserController::class,'adminLogin']);
    Route::get('/loginpageWhitelabel/{username?}/{password?}', [UserController::class,'loginpageWhitelabel']);
    
    Route::group(['middleware' => ['authenticateAdmin']], function () {
        Route::group(array('prefix' => '{role}'), function ($role) {
            Route::get('/permission-denied', [UserController::class,'permissionDenied']);
            Route::any('/license-count-exceed', [UserController::class,'licenseCountExceed']);
            Route::post('/Emp-Delete', [UserController::class,'Employeedelete'])->middleware('permissionCheck_RoleWise:CanEmployeeDelete');
            Route::get('/logout', [UserController::class,'logout'])->name('logout');
            ///
            Route::post('/register-Employee', [UserController::class,'EmployeeRegistration']);
            Route::get('/EmployeeDetail', [UserController::class,'EmployeeDetails']);
            Route::get('/get-employee-details', [UserDetailsController::class,'employeeFullDetailsPage'])->name('getEmployeeDetails');
            Route::get('/show_details', [UserController::class,'show_details']);
            Route::post('/show_details', [UserController::class,'show_details']);
            Route::post('/get-browser-history-data', [UserDetailsController::class,'getBrowserHistory']);

                ///
 
                Route::get('/dashboard', [UserController::class,'dashboard'])->name('dashboard')->middleware('permissionCheck_RoleWise:CanDashboardView');
                Route::get('/productivity', [ProductivityController::class,'productivityRanking'])->name('productivity')->middleware('permissionCheck_RoleWise:CanSettingsProductivityRuleBrowse');
                Route::post('/productivity', [ProductivityController::class,'productivityRanking']);
                Route::post('/productivity-update', [ProductivityController::class,'productivityUpdate'])->middleware('permissionCheck_RoleWise:CanSettingsProductivityRuleModify');
                Route::post('custom-productivity-update', [ProductivityController::class,'customProductivityUpdate'])->middleware('permissionCheck_RoleWise:CanSettingsProductivityRuleModify');
                Route::post('/update-bulk-productive', [ProductivityController::class,'UpdateBulk'])->middleware('permissionCheck_RoleWise:CanSettingsProductivityRuleModify');
                Route::post('/export-data', [ProductivityController::class,'ExportData'])->middleware('permissionCheck_RoleWise:CanSettingsProductivityRuleDownload');
                Route::post('/new-domain-url', [ProductivityController::class,'NewDomainURL'])->middleware('permissionCheck_RoleWise:CanAddDomain');
                Route::get('/employee-details', [UserController::class,'EmpDetails'])->name('employee-details');
                Route::post('/Emp-edit', [UserController::class,'editEmployee'])->middleware('permissionCheck_RoleWise:CanEmployeeModify');
                Route::post('/Delete-multiple', [UserController::class,'DeleteMultiple'])->middleware('permissionCheck_RoleWise:CanEmployeeDelete');
                Route::post('/Multiple-Active', [UserController::class,'MultipleActive'])->middleware('permissionCheck_RoleWise:CanEmployeeModify');
                Route::post('/Suspend-Multiple', [UserController::class,'SuspendMultiple'])->middleware('permissionCheck_RoleWise:CanEmployeeModify');
                //ManagerUserDetails - end
               
                Route::post('/assign-manager-teamLead-Employee', [UserController::class,'AssignMangerTL'])->middleware('permissionCheck_RoleWise:CanEmployeeAssignEmployee');
                // TimeAttendanceController routes
                Route::get('/track-user-setting', [UserController::class,'TrackUserSettingView'])->middleware('permissionCheck_RoleWise:CanEmployeeUserSetting');
                Route::post('/track-user-setting', [UserController::class,'TrackUserSetting'])->middleware('permissionCheck_RoleWise:CanSettingsMonitoringConfigurationModify');
                Route::post('/Advance-track-user-setting', [UserController::class,'AdvanceTrackUserSetting'])->middleware('permissionCheck_RoleWise:CanSettingsMonitoringConfigurationModify');
                Route::post('/upload-logo', [UserController::class,'userBlockLogo']);
                Route::get('/user-block-logo', [UserController::class,'getLogo']);
                Route::post('/user-logout', [UserController::class,'agentEmpLogout']);
                Route::post('/get-productivity', [UserDetailsController::class,'getProductivity'])->middleware('permissionCheck_RoleWise:CanReportProductivityView');
                Route::post('/get-time-sheets-data', [UserDetailsController::class,'getTimeSheetData'])->middleware('permissionCheck_RoleWise:CanTimesheetView');
                Route::post('/get-browser-history', [UserDetailsController::class,'getBrowserHistory'])->middleware('permissionCheck_RoleWise:CanEmployeeWebusageView');
                Route::post('/get-browser-history-mobile', [UserDetailsController::class,'getBrowserHistoryMobile'])->middleware('permissionCheck_RoleWise:CanEmployeeWebusageView');
                Route::post('/get-application-history', [UserDetailsController::class,'getApplicationsUsed'])->middleware('permissionCheck_RoleWise:CanEmployeeApplicationUsageView');
                Route::post('/get-key-logger-data', [UserDetailsController::class,'getKeyLoggerData'])->middleware('permissionCheck_RoleWise:CanEmployeeKeystrokesView');
                Route::post('/get-mobile-application-history', [UserDetailsController::class,'getMobileUsed'])->middleware('permissionCheck_RoleWise:CanEmployeeApplicationUsageView');
                Route::post('/get-break-data-history', [UserDetailsController::class,'getBreakData'])->middleware('permissionCheck_RoleWise:CanEmployeeApplicationUsageView');
                Route::post('/screen-record-video', [UserDetailsController::class,'getScreenRecorderVideoData'])->middleware('permissionCheck_RoleWise:CanRecordVideo');
                Route::post('/active-offline-productivity',[UserDetailsController::class,'activeOfflineProductivity']);
                //registration for employee
                Route::get('/emp-attendance', [UserController::class,'empAttendanceSheet'])->name('employeeAttendance')->middleware('permissionCheck_RoleWise:CanAttendanceView');
                Route::post('/attendance-list-employees', [UserController::class,'attendanceListEmployees']);
                Route::post('/attendance-list-employees-download', [UserController::class,'attendanceListEmployees'])->middleware('permissionCheck_RoleWise:CanAttendanceDownload');
                     
            }); 
        });


        Route::group(['middleware' => ['authenticateEmployee']], function () {
            Route::group(array('prefix' => '{role}'), function ($role) {
                Route::get('/myTimeline', [EmployeeController::class,'employeeFullDetailsPage'])->name('myTimeline');
                Route::get('/get-details', [EmployeeController::class,'employeeFullDetailsPage']);
                Route::get('/employee-logout', [EmployeeController::class,'logoutEmployee'])->name('employee-logout');
            });
        });

});




