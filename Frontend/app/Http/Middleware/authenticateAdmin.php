<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Session;
use App\Modules\User\helper;


class authenticateAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {

        // $helper = new helper();
        // $roles=['admin',env('Manager'),'employee'];
        // // dd( Session::has(env('Manager')),env('Manager'),$helper->getHostName());
        // if(!in_array($helper->getHostName(),$roles)){
        //     abort(403,'Not a valid access');
        // }

        // if($helper->getHostName() == env('Manager')&& Session::has(env('Manager')) ) {
        //     return $next($request);
        // }else if ($helper->getHostName() == env('Admin')  && Session::has(env('Admin')) ){
            return $next($request);
        // }else  {
        //     if($helper->checkHost()){
        //         return redirect(env('APP_URL') . "amember/logout");
        //     }
        //     if($helper->getHostName() == env('Manager')) return redirect('login');
        //     return redirect('admin-login');
        // }

    }
}
