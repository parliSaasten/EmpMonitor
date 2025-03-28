<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Session;
use App\Modules\User\helper;


class CheckLicenseCount{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request 
     * @param \Closure $next
     * @return mixed
     */
    public function handle($request, Closure $next){  
        $this->helper = new helper(); 

        $this->API_BASE_URL = env('API_HOST_V3') . 'api/' . env('API_VERSION_3');
        $api_url = $this->API_BASE_URL . '/settings/reseller-stats';
        try {  
            if(!Session::has('leftOverLicenses')){ 
                $response = $this->helper->postApiCall('get', $api_url, []);
                $response = $this->helper->responseHandlerWithoutStatusCode($response); 
                $licenseLeft = $response["data"]["total_licenses_count"] - $response["data"]["total_licenses_used_by_me"];
                Session::put('leftOverLicenses', $licenseLeft);
            }
            //add code for unlimited plan  - ResellerController/getResellerLicenses function
             $licenseLeft = Session::get('leftOverLicenses');  
             if($licenseLeft >= 0){ 
                return $next($request);
            }else{ 
                return redirect("/admin/license-count-exceed");
            }

        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, 'Check License Count Middleware');
        }  
    }


}
