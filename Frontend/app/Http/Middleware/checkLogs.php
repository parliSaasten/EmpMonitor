<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Session;


class checkLogs
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        
        if(Session('admin')['token']['login'] == "empv3demo")
        return $next($request);
        else 
        abort(403, 'Permissions denied.');

    }
}
