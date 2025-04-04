<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;

class UserDetailsController extends Controller
{
    protected $helper;
    protected $API_URL_3;
    protected $VERSION_3;

    public function __construct()
    {
        $this->API_URL_3 = env('API_HOST_V3');
        $this->VERSION_3 = env('API_VERSION_3');
        $this->helper = new helper();
    }

    public function employeeFullDetailsPage(Request $request)
    {
        try {
            $data['user_id'] = $request->query('id');
            $api_url = env('MAIN_API').'admin/employees/'.$data['user_id'];
            $method = 'get-with-token';
            $response = $this->helper->postApiCall($method, $api_url, []);
            $result['code'] = 200;
            $result['data'] = $response['data'];
            $result['msg'] = $response['message']; 
                 return view("User::EmployeeDetail.EmployeeFullDetails",
                 ["user_details" => $result]);
         } catch (\Exception $e) {
            return Redirect::back()->withErrors(['msg', 'No response or No User Found.']);
        }
    }

    public function getWebAppHistory(Request $request)
    {
         try {
            $api_url = "";
             if(Session::has('employee_session')) {
                $api_url = env('MAIN_API').'employee/web-app-activity?'.$request->data;
            }else{
                $api_url = env('MAIN_API').'admin/web-app-activity?'.$request->data;
            }
            $method = 'get-with-token';
            $response = $this->helper->postApiCall($method, $api_url, null);
            $result['code'] = 200;
            $result['data'] = $response['data'];
            $result['msg'] = $response['message']; 
            return $result;
        } catch (\Exception $e) {
             return $this->helper->errorHandler($e, ' UserDetailsController =>getBrowserHistory => Method-get ');
        }
    } 
}
