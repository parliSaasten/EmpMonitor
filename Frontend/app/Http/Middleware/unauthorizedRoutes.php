<?php

namespace App\Http\Middleware;

use Closure;
use App\Modules\User\helper;


class unauthorizedRoutes
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
        $helper = new helper();
    if($helper->getHostName() != env('Admin')) abort(403, 'Permissions denied.');
       return $next($request);
    }
}
