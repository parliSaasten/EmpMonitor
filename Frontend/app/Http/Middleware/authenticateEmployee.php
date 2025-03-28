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
            if (Session::has(env('Employee'))) {
                return $next($request);
            } else {
                // to check is it ajax call or not
                if ($request->ajax()) {
                    return response()->json(array('error' => 'Session Expire'), 499);
                } else {
                    return redirect("/login");
                }
            }
        } catch (\Exception $e) {
            Log::error("Error occured in the function handle due to---" . $e->getMessage());
        }
        return $next($request);
    }
}
