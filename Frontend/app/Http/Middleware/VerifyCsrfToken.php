<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;

class VerifyCsrfToken extends Middleware
{
    /**
     * The URIs that should be excluded from CSRF verification.
     *
     * @var array<int, string>
     */
    // protected $except = [];
    public function handle($request, Closure $next){
        $response = $next($request);
        if ($this->isReading($request) || $this->runningUnitTests()) {
            return $response;
        }
        $response->headers->setCookie(
            Cookie::make(
                'XSRF-TOKEN',
                $request->session()->token(),
                60,
                '/',
                null,
                config('session.secure'),
                true // Set httpOnly to true
            )
        );
        return $response;
    }
}
