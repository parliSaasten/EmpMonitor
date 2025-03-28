<?php

use Illuminate\Support\Facades\Route;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/
 

Route::get('/', function () {

    // return redirect('/reseller-login');
    $amemberAllowedHost = [
        "app.dev.empmonitor.com",
        "app.empmonitor.com",
    ];
    if (in_array($_SERVER['HTTP_HOST'], $amemberAllowedHost)) {
        if(\Illuminate\Support\Facades\Session::has('Region')) {
            return redirect('/amember-i/member');
        }
        return redirect('/amember/member');
    }
    if ($_SERVER['HTTP_HOST'] === 'staff.gettytech.com') {
        return view("User::adminLogin")->with('reset', []);
    } else {
        return redirect('/admin-login');
    }
});

Route::get('/cache-clear', function () {
    $exitCode = Artisan::call('cache:clear');
    echo "Cache Cleard: " . $exitCode;
});

Route::get('/view-clear', function () {
    $exitCode = Artisan::call('view:clear');
    echo "View Cleard: " . $exitCode;
});

Route::get('/route-clear', function () {
    $exitCode = Artisan::call('route:clear');
    echo "Route Cache Cleared: " . $exitCode;
});

Route::get('/config-clear', function () {
    $exitCode = Artisan::call('config:clear');
    echo "Config Cache Cleared: " . $exitCode;
});

Route::get('/clear', function () {
    $exitCode1 = Artisan::call('cache:clear');
    $exitCode2 = Artisan::call('view:clear');
    $exitCode3 = Artisan::call('route:clear');
    dd($exitCode1, $exitCode2, $exitCode3);
});

Route::get('/clear-all', function () {
    $exitCode1 = Artisan::call('cache:clear');
    $exitCode2 = Artisan::call('view:clear');
    $exitCode3 = Artisan::call('route:clear');
    $exitCode4 = Artisan::call('config:clear');
    dd($exitCode1, $exitCode2, $exitCode3, $exitCode4);
});

Route::get('/route-cache', function () {
    $exitCode = Artisan::call('route:cache');
    echo "Route Cached: " . $exitCode;
});

Route::get('/config-cache', function () {
    $exitCode = Artisan::call('config:cache');
    echo "Config Cached: " . $exitCode;
});

Route::get('/config-clear', function () {
    $exitCode = Artisan::call('config:clear');
    echo "Config Cache Cleared: " . $exitCode;
});
