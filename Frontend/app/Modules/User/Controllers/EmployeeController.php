<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Modules\User\helper;
use File;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class EmployeeController extends Controller
{

    protected $client;
    protected $API_URL;
    protected $helper;
    protected $VERSION;

    public function __construct()
    {
        $this->client = new Client();
        $this->API_URL = env('API_HOST');
        $this->helper = new helper();
        $this->API_URL_3 = env('API_HOST_V3');
        $this->VERSION_3 = env('API_VERSION_3');

    }

    //      Response Handlers ( local response helpers )
    public function responseHandler($response)
    {
        if ($response['data']['code'] == 200) {
            $result['code'] = 200;
            $result['data'] = $response['data']['data'];
            $result['msg'] = $response['data']['message'];
        } else if ($response['data']['code'] == 401) {
            $result['code'] = $response['data']['code'];
            $result['data'] = $response['data']['data'];
            $result['msg'] = $response['data']['message'];
        } else {
            $result['code'] = $response['data']['code'];
            $result['msg'] = $response['data']['code'] == 400 ? $response['data']['message'] : $result['msg'] = $response['data']['code'] == 404 ? $response['data']['message'] : $response['data']['error'];
        }
        return $result;
    }

    public function responseHandlerWithoutStatusCode($response)
    {
        if ($response['code'] == 200) {
            $result['code'] = 200;
            $result['data'] = $response['data'];
            $result['msg'] = $response['message'];
        } else {
            $result['code'] = $response['code'];
            $result['msg'] = $response['code'] == 400 ? $response['message'] : $response['error'];
        }
        return $result;
    }

    public function employeeFullDetailsPage(Request $request)
    { 
        try { 
            $data['user_id'] = $request->query('id');
            $api_url = env('MAIN_API').'employee/employees/'.$data['user_id'];
            $method = 'get-with-token';
            $response = $this->helper->postApiCall($method, $api_url, []);
            $result['code'] = 200;
            $result['data'] = $response['data'];
            $result['msg'] = $response['message']; 
            return view("User::EmployeeDetail.EmployeeFullDetails",
            ["user_details" => $result]);
        } catch (\Exception $e) {
            dd('hj',$e);
            return Redirect::back()->withErrors(['msg', 'No response or No User Found.']);
        }
    }

    public function logoutEmployee()
    {
        try {
            //To make the Token expire once User gets logout the site
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/auth/logout';
            $this->helper->postApiCall("get", $api_url, 0);
        } catch (\Exception $e) {}
        Session::forget('employee');
        return redirect('login');
    }


    public function profileSetting(Request $request)
    {
        $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/user/get-user';
        $data['user_id'] = Session::get($this->helper->getRoleValue())['token']['user_id'];
        $method = "post";

        try {
            if (Session::get(env('Employee')) != null) {
                $response = $this->helper->postApiCall($method, $api_url, $data);
            } else if (Session::has(env('Manager'))) {
                $response = $this->helper->postApiCall($method, $api_url, []);
            }

            if ($response['data']['code'] == 200) {
                return view(
                    "User::Employee.EmployeeProfile",
                    [
                        "show_details" => ($response['data']),
                        "userId" => $data['user_id']
                    ]
                );
            } else {

                return Redirect::back()->withErrors(['msg', 'No response. Try again after sometime']);
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => profileSetting => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
            //    return redirect()
            return Redirect::back()->withErrors(['msg', __('messages.exception')]);
        }
    }


    public function changePassword(Request $request)
    {
        $rules = [
            "new_password" => 'required|max:20|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!,*()@%&]).{6,20}$/',
            "confirmation_password" => 'required_with:new_password|same:new_password',
        ];

        try {
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                $data['validator'] = $validator->errors();
                $data['code'] = "406";
                return $data;
            } else {
                $result = [];
                $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/user/update-user';
                $method = "put";
                $data = $request->all();
                if (Session::has(env('Employee'))) {
                    $response = $this->helper->postApiCall($method, $api_url, $data);
                } else if (Session::has(env('Manager'))) {
                    $response = $this->helper->postApiCall($method, $api_url, $data);
                }


                if (isset($response['code']) && $response['code'] == 404) {
                    $result['code'] = 404;
                    $result['message'] = $response['error'];

                    if (strpos($response['error'], 'New password must be valid.') !== false) {
                        $result['message'] = "Password should have 6 to 20 char and must have 1 special character, capital letter, small letter and and numeric value";
                    }
                } else if (isset($response['code']) && $response['code'] == 200) {

                    $result['code'] = 200;
                    $result['message'] = "Successfully updated your password";
                }
            }
        } catch (\Exception $e) {
            $result['code'] = 500;
            $result['message'] = $response['data']['data']['message'];
            Log::info("Exception in changePassword " . $e->getMessage());
        }
        return $result;
    }
    // Get employee Location

    public function getEmployeeLocation(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/location/get-geolocation?employee_id=' . Session::get(env('Employee'))['token']['user_id'];
            try {
                $response = $this->helper->postApiCall('get', $api_url, []);
                $location = [];
                if ($response['code'] == 200) {
                    $location = $response['data'];
                }
                return view("User::emp_current_location")->with(['location' => $location]);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ProductivityComparisonController => getLocation => Method-get ');
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => getEmployeeLocation => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
        }
    }
    public function employeeResellerDashboard(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/external/get-employee-assigned-company';
            try {
                $response = $this->helper->postApiCall('get', $api_url, []);
                if ($response['code'] == 200) {
                    $resellerData = $response;
                }
                return view("User::Employee.employee_reseller_dashboard")->with(['resellerData' => $resellerData]);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                Log::info('Exception ' . $e->getLine() . " => Function Name => employeeResellerDashboard => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
                return Redirect::back()->withErrors(['msg', __('messages.exception')]);
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => employeeResellerDashboard => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
        }
    }
    public function employeeClientLogin(Request $request)
    {

        $api_url =$this->API_URL_3 . 'api/' . $this->VERSION_3 . '/auth/client-employee-login';
        try {
            $response = $this->helper->postApiCall('post', $api_url, $request->only(['organization_id']));
            Session::put('locale', $response['data']['language']);
            $role = str_replace(' ', '', strtolower('Reseller'));
            Session::put('role', $role);
            $admin = array(
                'token' => array(
                    'user_id' => $response['data']['organization_id'],
                    'my_self' => $response['data']['user_id'],
                    'data' => $response['data']['data'],
                    'is_admin' => $response['data']['is_admin'],
                    'is_manager' => $response['data']['is_manager'],
                    'is_teamlead' => $response['data']['is_teamlead'],
                    'organization_id' => $response['data']['organization_id'],
                    'email' => $response['data']['email'],
                    'product_tour_status' => 1,
                    'login' => $response['data']['username'],
                    'photo_path' => '../assets/images/avatars/avatar1.png',
                ),
                'system_activity_logs' => 1,
            );
            foreach ($response['data']['feature'] as $feature) {
                if ($feature['status'] === 1) {
                    $admin[$feature['name']] = 1;
                } else {
                    $admin[$feature['name']] = 0;
                }
            }

            Session::put($role, $admin);
            Session::put('expirePlaneDate', $response['data']['expire_date']);
            Session::put('client', true);

            return $this->helper->responseHandlerWithoutStatusCode($response['data']);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            try {
                $errorResponse = json_decode(preg_split("/\r\n|\n|\r/", $e->getMessage())[1], true);
                return $errorResponse;
            } catch (\Exception $th) {
            }
            $response = $e->getResponse();
            $responseBodyAsString = $response->getBody()->getContents();
            return json_decode($responseBodyAsString);
        }
    }
    public function checkResellerEmployeestatus()
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/external/get-employee-assigned-company';
            try {
                $response = $this->helper->postApiCall('get', $api_url, []);
                if ($response['code'] == 200 && $response['data'] !== []) {
                    return true ;
                }
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                Log::info('Exception ' . $e->getLine() . " => Function Name => checkResellerEmployeestatus => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
                return false;
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => checkResellerEmployeestatus2 => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
            return false;
        }
    }
    public function getEmployeementTypeView(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/hrms/get-employment-type';
            try {
                $response = $this->helper->postApiCall('get', $api_url, []);
                return view("User::employment_type")->with(['employeeType' => $response]);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ProductivityComparisonController => getLocation => Method-get ');
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => getEmployeeLocation => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
        }
    }
    public function addEmployeementType(Request $request)
    {
        try {
            $data['name'] = $request->input('name');
            $data['no_of_days'] = $request->input('no_of_days');
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/hrms/create-employment-type';
            try {
                $response = $this->helper->postApiCall('post', $api_url, $data);
               return $response;
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ProductivityComparisonController => getLocation => Method-get ');
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => getEmployeeLocation => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
        }
    }
    public function editEmployeementType(Request $request)
    {
        try {
            $data['id'] = $request->input('id');
            $data['name'] = $request->input('name');
            $data['no_of_days'] = $request->input('no_of_days');
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/hrms/edit-employment-type';
            try {
                $response = $this->helper->postApiCall('put', $api_url, $data);
                return $response;
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ProductivityComparisonController => getLocation => Method-get ');
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => getEmployeeLocation => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
        }
    }
    public function deleteEmployeementType(Request $request)
    {
        try {
            $data['id'] = $request->input('id');
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/hrms/delete-employment-type';
            try {
                $response = $this->helper->postApiCall('delete', $api_url, $data);
                return $response;
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ProductivityComparisonController => getLocation => Method-get ');
            }
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => getEmployeeLocation => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
        }
    }
}
