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
        if(Session::has('admin_session')){
            return $next($request);
        }else{
            return redirect('admin-login');
        }

    }
}
