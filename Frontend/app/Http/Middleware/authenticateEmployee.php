<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;


class authenticateEmployee
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
        try {
             if (Session::has('employee_session')) {
                return $next($request);
            } else {
                    return redirect("/login");
            }
        } catch (\Exception $e) {
            Log::error("Error occured in the function handle due to---" . $e->getMessage());
        }
        return $next($request);
    }
}
