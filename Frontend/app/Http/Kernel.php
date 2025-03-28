<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    /**
     * The application's global HTTP middleware stack.
     *
     * These middleware are run during every request to your application.
     *
     * @var array<int, class-string|string>
     */
    protected $middleware = [
        \App\Http\Middleware\TrustProxies::class,
        \Illuminate\Http\Middleware\HandleCors::class,
        \App\Http\Middleware\PreventRequestsDuringMaintenance::class,
        \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
        \App\Http\Middleware\TrimStrings::class,
        \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
    ];

    /**
     * The application's route middleware groups.
     *
     * @var array
     */
    protected $middlewareGroups = [
        'web' => [
            \App\Http\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
             \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \App\Http\Middleware\VerifyCsrfToken::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
         ],

        'api' => [
            'throttle:60,1',
            'bindings',
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class.':api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
    ];

    /**
     * The application's middleware aliases.
     *
     * Aliases may be used to conveniently assign middleware to routes and groups.
     *
     * @var array
     */
    protected $middlewareAliases = [
        'auth' => \App\Http\Middleware\Authenticate::class,
        'authenticateAdmin' => \App\Http\Middleware\authenticateAdmin::class,
        'authenticateEmployee' => \App\Http\Middleware\authenticateEmployee::class,
        'authenticateReseller' => \App\Http\Middleware\authenticateReseller::class,
        'role.browse' => \App\Http\Middleware\CanRolesBrowse::class,
        'role.add' => \App\Http\Middleware\CanRolesCreate::class,
        'role.edit' => \App\Http\Middleware\CanRolesModify::class,
        'role.delete' => \App\Http\Middleware\CanRolesDelete::class,
        'productivity.browse' => \App\Http\Middleware\CanSettingsProductivityRuleBrowse::class,
        'productivity.Modify' => \App\Http\Middleware\CanSettingsProductivityRuleModify::class,
        'report.view' => \App\Http\Middleware\CanReportWebApplicationUsedView::class,
        'report.download' => \App\Http\Middleware\CanReportWebApplicationUsedDownload::class,
        'report.producivityview' => \App\Http\Middleware\CanReportProductivityView::class,
        'report.producivitydownload' => \App\Http\Middleware\CanReportProductivityDownload::class,

        'userFullDetailsCheck' => \App\Http\Middleware\UserFullDetailsCheck::class,
        'managerFullDetailsCheck' => \App\Http\Middleware\ManagerFullDetailsCheck::class,
        'checkLogs'=>\App\Http\Middleware\checkLogs::class,
        'unauthorizedRoutes'=>\App\Http\Middleware\unauthorizedRoutes::class,


        'auth.basic' => \Illuminate\Auth\Middleware\AuthenticateWithBasicAuth::class,
        'bindings' => \Illuminate\Routing\Middleware\SubstituteBindings::class,
        'cache.headers' => \Illuminate\Http\Middleware\SetCacheHeaders::class,
        'can' => \Illuminate\Auth\Middleware\Authorize::class,
        'guest' => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'password.confirm' => \Illuminate\Auth\Middleware\RequirePassword::class,
        'signed' => \App\Http\Middleware\ValidateSignature::class,
        'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,
        'employeeDetails' => \App\Http\Middleware\employeeDetails::class,
        'SettingsTimesheets' => \App\Http\Middleware\SettingsTimesheets::class,
        'permissionCheck_RoleWise' => \App\Http\Middleware\permissionCheck_RoleWise::class,
        'LocaleMiddleware' => \App\Http\Middleware\LocaleMiddleware::class,
        'permissionCheckHRMS_RoleWise' => \App\Http\Middleware\permissionCheckHRMS_RoleWise::class,
        'CheckLicenseCount' => \App\Http\Middleware\CheckLicenseCount::class,
    ];

}
