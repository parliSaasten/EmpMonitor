<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests;
use App\Modules\User\helper;
use File;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{

    protected $client;
    protected $API_URL;
    protected $helper;
    protected $VERSION;
    protected $API_URL_3;
    protected $VERSION_3;

    public function __construct()
    {
        $this->client = new Client();
        $this->API_URL = env('API_HOST');
        $this->helper = new helper();
        $this->VERSION = env('API_VERSION');
        $this->API_URL_3 = env('API_HOST_V3');
        $this->VERSION_3 = env('API_VERSION_3');
        $this->user = $this->helper->getHostName();
    }

  
    public function loginpageWhitelabel(Request $request, $username = null, $password = null)
    {
        try {  
            
            $username = base64_decode($username);
            $password = base64_decode($password);
            if (isset($username) && isset($password)) { 
                $api_url = env('MAIN_API').'admin/login';
                $method = "post";  
                $amemberData = array(
                    "email" => $username,
                    "password" => $password, 
                ); 
               
                $adminAuthResponse = $this->helper->postApiCall($method, $api_url, $amemberData);
                $admin = array( 
                        'token' => $adminAuthResponse['data']['token'],
                        'id' => $adminAuthResponse['data']['id'],
                        'name' => $adminAuthResponse['data']['first_name'],
                        'email' => $adminAuthResponse['data']['email'],
                        // 'employee_code' => $adminAuthResponse['data']['employee_code'],
                        // 'time_zone' => $adminAuthResponse['data']['time_zone'],
                        'role' => $adminAuthResponse['data']['role'],
                        'photo_path' => '../' . env('DEFAULT_IMAGE'), 
                    );
                    Session::put('admin_session', $admin);
                    return redirect('admin/employee-details');
                    } else {
                         return redirect('admin-login')->with('error', 'Invalid authentication');
                    }  
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => loginpageWhitelabel => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
            return redirect('admin-login')->with('error', 'Something went wrong. Please contact support Team');
        }
    }

    

    //curl-execution
    public function curl_execution($url)
    {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        return $result;
    }
 
    //forgot-password
    public function forgotPassword(Request $request)
    {
        $result = [];
        $data = $request->all();
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/password/forgot-password';

            $method = "post";
            $response = $this->helper->postApiCall($method, $api_url, $data);
            if ($response['data']['code'] == 200) {
                $result['code'] = 200;
                $result['data'] = $response['data']['data'];
                $result['msg'] = $response['data']['message'];
            } else {
                $result['code'] = $response['data']['code'];
                $result['msg'] = $response['data']['code'] == 400 ? $response['data']['message'] : $response['data']['error'];
            }
            return $result;
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => forgotPassword => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
            $result['code'] = 500;
            $result['msg'] = "Something went wrong...";
            return $result;
        }
    }

    //on getting the email & token
    public function resetPage(Request $request)
    {
        if (Session::has('admin')) return redirect('/dashboard');
        else {
            $email = $request->email;
            $token = $request->token;
            return view("User::adminLogin")->with('reset', $request->all());
        }
    }

    //login
    public function login(Request $request)
    {
         if ($request->isMethod('get')) { 
         return view("User::adminLogin")->with('reset', []);
        } else if ($request->isMethod('post')) {
            $rules = array(
                "email" => 'required | email',
                "password" => 'required'
            );
            try {
                 $validator = Validator::make($request->all(), $rules);
                if ($validator->fails()) {
                    return redirect()->back()->withErrors($validator)->withInput();
                } else {
                    $method = "post";
                    $loginData = array(
                        "email" => $request->email,
                        "password" => $request->password,
                      );
 
                      $api_url = env('MAIN_API').'employee/login';
                     try {
                        $response = $this->client->post($api_url, [
                            'form_params' => $loginData,
                            'headers' => [
                                'user-agent' => $_SERVER['HTTP_USER_AGENT'],
                                'Content-Type' => 'application/x-www-form-urlencoded',
                            ]
                        ]);
                    } catch (\GuzzleHttp\Exception\RequestException $e) {  
                        Log::info('Exception ' . $e->getLine() . " => Function Name =>Login  => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
                        $parsedMessage = json_decode($e->getResponse()->getBody()->getContents());
                        return redirect('login')->with('error', $parsedMessage->message);
                    }
                    if ($response->getStatusCode() == 200) { 
                        $response = json_decode($response->getBody()->getContents(), true);
                       if ($response['role'] == 'employee') {  
                            Session::put('employee_session', $response); 
                             return redirect('/employee/myTimeline?id='.$response['id']);
                        } else {
                            return redirect('login')->with('error', $response['error']);
                        }

                    }
                }
            } catch (\Exception $e) {

                Log::info('Exception ' . $e->getLine() . " => Function Name =>Login  => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
                return redirect('login')->with('error', $e->getMessage());
            }
        }
    }
     
    //reset password
    public function resetPassword(Request $request)
    {
        $result = [];
        $data = $request->all();
        try {
            $rules = array(
                "new_password" => 'required|max:20|min:8',
                "confirm_password" => 'required_with:passwd|same:new_password',
            );
            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                return $validator->errors();
            } else {
                $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/password/reset-password';

                $method = "put";
                $response = $this->helper->postApiCall($method, $api_url, $data);
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
        } catch (\Exception $e) {
            Log::info('Exception ' . $e->getLine() . " => Function Name => resetPassword => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
            $result['code'] = 500;
            $result['msg'] = "Something went wrong...";
            return $result;
        }
    }
 
    //employee registration
    public function EmployeeRegistration(Request $request)
    {
        $rules = array(
            "name" => 'required|max:32|min:2|regex:/([a-zA-Zء-ي]+)([0-9٠-٩]*)/',
            "Full_Name" => 'required|regex:/([a-zA-Zء-ي]+)/',
            "email" => 'required|email|regex:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/',
            // "password" => 'required |regex:/^(?=.*\d)(?=.*[!-\/:-@\[-`{-~]).{8,}$/',
            // "confirmPassword" => 'required_with:passwd|same:password',
            "empCode" => 'required|', 
            "TimeZoneOffset" => 'required',
        );

        try {
            $customMessage = [
                'name.max' => __('messages.firstName_length'),
                // 'passwd.regex' => __('messages.Password_formate'),
                // 'c_passwd.required_with' => __('messages.confirm_password'),
                // 'c_passwd.same' => __('messages.Password_missmatch'),
                'username.regex' => __('messages.Username_alphanumeric'),
                'first_name.regex' => __('messages.special_characters'),
            ];
            $validator = Validator::make($request->all(), $rules, $customMessage);
            if ($validator->fails()) {
                return $validator->errors();
            } else { 
                $api_url = env('MAIN_API').'admin/register';
                $method = 'post_with_token';
                $data['firstName'] = $request->input('name');
                $data['lastName'] = $request->input('Full_Name');
                $data['email'] = strtolower($request->input('email'));
                $data['password'] = $request->input('password');
                $data['employeeCode'] = $request->input('empCode'); 
                $data['mobileNumber'] = $request->input('number'); 
                $data['timeZone'] = $request->input("TimeZoneOffset"); 
               
                $response = $this->helper->postApiCall($method, $api_url, $data); 
                if ($response['statusCode'] == 201) {
                    $result['code'] = 200;
                    $result['msg'] = 'success';
                    $result['data'] = ($response['data']); 
                    return $result;
                } else {
                    return $this->helper->responseHandler($response);
                }
            }
        } catch (\Exception $e) {
            return $this->ExceptionErrorHandler($e, "400", ' UserController => EmployeeRegistration => Method-post');
        }
    }


    /**
     * logout
     * * This is used to logout application and clearing the session and cookies
     * @param mixed $request
     * @return void
     */
    public function logout(Request $request)
    { 
        $this->destroyAuthToken(); 
        Session::forget($this->helper->getHostName()); 
        Session::forget('admin_session'); 
        return redirect('admin-login'); 
    }

 
    public function destroyAuthToken()
    {
        try {
//            To make the Token expire once User gets logout the site
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/auth/logout';
            $this->helper->postApiCall("get", $api_url, 0);
        } catch (\Exception $e) {
            return $this->ExceptionErrorHandler($e, "400", ' UserController => logout => Method-post');
        }
    }

    public function logouut()
    {
        if (Session::has('admin')) Session::forget('admin');
        if (Session::has('plan')) Session::forget('plan');
        return redirect('/');
    }
 

    

    public function error()
    {
        return redirect()->back()->with('alert', 'Sorry, already existed');
    }

   
    public function EmpDetails(Request $request)
    {
        if ($request->isMethod('get')) {
            return view('User::EmployeeDetail.employeDetail', [ 
            ]);
        }
    }
   
    public function EmployeeDetails(Request $request)
    {
        $data['day'] = date("Y-m-d");
        $data['limit'] = count($request->all()) != 0 ? $request->input('showEntries') : 10;
        $data['skip'] = count($request->all()) != 0 ? $request->input('skipvalue') : 0;
        $data['name'] = count($request->all()) != 0 ? ($request->input('searchText') != null ? $request->input('searchText') : "") : "";
        
        $api_url = env('MAIN_API').'admin/employees?skip='.$data['skip']."&limit=".$data['limit'];
        $method = "get-with-token"; 
        if ($request->input('sortName') != '' && count($request->all()) != 0) {
            $data['sortColumn'] = $request->input('sortName');
            $data['sortOrder'] = $request->input('sortOrder');
        }
        try {
            $response = $this->helper->postApiCall($method, $api_url,[]);
             if ($response) {
                $result['code'] = 200;
                $result['msg'] = 'success'; 
                $result['data'] = $response;
                return $result;
            }
        } catch (\Exception $e) {
             return $this->ExceptionErrorHandler($e, 201, ' UserController => EmployeeDetails => Method-post');
        }
    }


    function multi_unique($src)
    {
        $output = array_map(
            "unserialize",
            array_unique(array_map("serialize", $src))
        );
        return $output;
    }
   

     public function editEmployee(Request $request)
    {
        $result = [];
        $rules = array(
            "name" => 'required|max:32|min:1|regex:/([a-zA-Zء-ي]+)([0-9٠-٩]*)/', ///([0-9٠-٩]*)([a-zA-Zء-ي]+)([0-9٠-٩]*)/
            "Full_name" => 'required|max:32|min:1|regex:/([a-zA-Zء-ي]+)([0-9٠-٩]*)/',
            "email" => 'required|email|regex:/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/',
            "password" => 'required |regex:/^(?=.*\d)(?=.*[!-\/:-@\[-`{-~]).{8,}$/',
            "confirmPassword" => 'required_with:passwd|same:password',
            "EmpCode" => 'required|',
            "locId" => 'required|regex:/[1-9]*[0-9٠-٩]/',
            "depId" => 'required|regex:/[0-9٠-٩]/',
            "roleId" => 'required',
        );
        try {
            $customMessage = [
                'name.required' => __('messages.inputRequired'),
                'Full_name.required' => __('messages.inputRequired'),
                'email.required' => __('messages.inputRequired'),
                'password.required' => __('messages.inputRequired'),
                'EmpCode.required' => __('messages.inputRequired'),
                'locId.required' => __('messages.inputRequired'),
                'depId.required' => __('messages.inputRequired'),
                'roleId.required' => __('messages.inputRequired'),
                'name.max' => __('messages.firstName_length'),
                'password.regex' => __('messages.Password_formate'),
                'confirmPassword.required_with' => __('messages.confirm_password'),
                'confirmPassword.same' => __('messages.Password_missmatch'),
                'username.regex' => __('messages.Username_alphanumeric'),
                'first_name.regex' => __('messages.special_characters'),
            ];
            $validator = Validator::make($request->all(), $rules, $customMessage);
            if ($validator->fails()) {
                return $validator->errors();
            } else {
                if ($request->input('number') != null) {
                    $contact = $this->contactDetailsCheck($request);
                    if (count($contact['error']) != 0) return $contact['error'];
                    else if (count($contact['data']) != 0) $data['phone'] = $contact['data']['phone'];
                } else {
                    $data['phone'] = $request->input('CountryCode') . "-" . "";
                }
                $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/user/user-profile-update';
                $method = 'post';
                $data['userId'] = $request->input('hideId');
                $data['first_name'] = $request->input('name');
                $data['last_name'] = $request->input('Full_name');
                $data['email'] = strtolower($request->input('email'));
                $data['password'] = $this->encryptDecryptPswd($request, 1, 0);
                $data['emp_code'] = $request->input('EmpCode');
                $data['location'] = $request->input('location');
                $data['location_id'] = $request->input('locId');
                $data['role_id'] = $request->input('roleId');
                $data['department'] = $request->input('department');
                $data['department_id'] = $request->input('depId');
                $data['joinDate'] = $request->input('date');
                $data['address'] = $request->input('address') != null ? $request->input('address') : " ";
                $data['shift_id'] = $request->input('shiftCheck');
                $data['project_name'] =  isset($request->projectname) ? $request->input('projectname') : '';
                $data['hris_id'] =  isset($request->hris_id_edit) ? $request->input('hris_id_edit') : '';
                $data['employement_id'] = isset($request->employement_id) ? $request->input('employement_id_edit') : '';
                $data['expiry_period'] = isset($request->expiry_period) ? $request->input('expiry_period_edit') : '';
                $data['is_mobile'] = isset($request->EDmobileTracking) ? $request->input('EDmobileTracking') == 'on' ? 1 : 0 : 0;
                // $data['manager_role_id'] = $request->input('manager_role_id') != 0 ? $request->input('manager_role_id') : 0;
                // $data['assigned_manager'] = isset($request->assigned_manager) ? explode(",",$request->input('assigned_manager')): [];

                if ($request->input("timeZoneOffset") != null) {
                    $data['timezone_offset'] = $request->input("timeZoneOffset");
                    $data['timezone'] = $request->input("timeZoneName");
                }
                $data['status'] = "1";
                $response = $this->helper->postApiCall($method, $api_url, $data);

                if ($response['statusCode'] == 200) {
                    if ($response['data']['code'] == 200) {
                        $result['code'] = $response['data']['code'];
                        $result['msg'] = $response['data']['message'];
                        $result['data'] = ($response['data']);
                    } else {
                        $result['code'] = $response['data']['code'];
                        $result['msg'] = $response['data']['message'];
                        $result['error'] = strval($response['data']['error']);
                    }
                }
                //upload-image
                if ($request->file != null) {
                    //todo:upload the file.
                    $image = $request->file;
                    $pathToStorage = storage_path("images");
                    if (!file_exists($pathToStorage))
                        mkdir($pathToStorage, 0777, true);
                    $publishimage = $image->getClientOriginalName();
                    $path = $pathToStorage . "/" . $publishimage;
                    file_put_contents($path, file_get_contents($image->path()));
                    $multipartData = array(
                        "name" => "avatar",
                        "file" => $path
                    );
                    $uploadUrl = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/user/upload-profilepic-drive?user_id=' . $request->input('hideId');
                    $uploadResponse = $this->helper->postApiCall($method, $uploadUrl, $multipartData, true);
                    if ($uploadResponse['data']['code'] == 200) {
                        $result['avatar'] = $uploadResponse['data']['data']['photo_path'];
                    }else {
                        $result['code'] = $uploadResponse['data']['code'];
                        $result['msg'] = $uploadResponse['data']['message'];
                        $result['error'] = $uploadResponse['data']['error']['sqlMessage'] ?? '';
                    }
                }
                return $result;
            }
        } catch (\Exception $e) {
            return $this->ExceptionErrorHandler($e, "404", ' UserController => editEmployee => Method-delete');
        }
    }


    //  ************* deleting Single employee using delete icon *************
    public function Employeedelete(Request $request)
    {
        $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/user/user-delete-multiple';
        $method = 'delete';
        $data['user_ids'] = [$request->input('DetedId')];
        if(Session::has('leftOverLicenses')) Session::forget('leftOverLicenses');
        try {
            $response = $this->helper->postApiCall($method, $api_url, $data);
            return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\Exception $e) {
            return $this->ExceptionErrorHandler($e, 400, ' UserController => Employeedelete => Method-delete');
        }
    }
 


    public function logoutwhite(Request $request)
    {
        Session::forget('admin');
        if (Session::has('plan')) {
            Session::forget('plan');
            Session::flush();
            return redirect("admin-login");
        } else {
            Session::flush();
            return redirect('login');
        }
    }
 
    public function loginEmployee(Request $request)
    {
        if ($request->isMethod('get')) {
            if (Session::has('employee')) {
                return redirect(env('Employee') . '/myTimeline?id=' . Session::get(env('Employee'))['token']['user_id']);
            }
            return view("User::employeeLogin")->with('reset', []);
        } else if ($request->isMethod('post')) {
            $rules = array(
                "email" => 'required | email',
                "password" => 'required'
            );
            try {
                //validate login-creds
                $validator = Validator::make($request->all(), $rules);
                if ($validator->fails()) {
                    return redirect()->back()->withErrors($validator)->withInput();
                } else {
                    $loginData = array(
                        "userName" => $request->email,
                        "password" => $request->password,
                        "ip" => $request->ip
                    );

                    $api_url = $this->API_URL . 'api/v1/emp/auth';
                    $response = $this->client->post($api_url, [
                        'form_params' => $loginData,
                        'headers' => [
                            'user-agent' => $_SERVER['HTTP_USER_AGENT'],
                            'Content-Type' => 'application/x-www-form-urlencoded',
                        ]
                    ]);

                    if ($response->getStatusCode() == 200) {
                        $response = json_decode($response->getBody()->getContents(), true);
                        if ($response['code'] == 200) {
                            if ($response['photo_path'] == 'undefined') $response['photo_path'] = env('DEFAULT_IMAGE');
                            elseif (substr($response['photo_path'], 0, 5) === "https") $response['photo_path'] = $response['photo_path'];
                            else $response['photo_path'] = env('API_HOST') . $response['photo_path'];

                            $employee = array(
                                'token' => $response
                            );
                            Session::put(env('Employee'), $employee);

                            return redirect(env('Employee') . '/myTimeline?id=' . Session::get(env('Employee'))['token']['user_id']);
                            return view('User::Employee.NewEmployeeDashboard');
                        } else if ($response['code'] == 400) {
                            return redirect('employee-login')->with('error', $response['message']);
                        } else {
                            return redirect('employee-login')->with('error', $response['error']);
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::info('Exception ' . $e->getLine() . " => Function Name => loginEmployee => code =>" . $e->getCode() . " => message =>  " . $e->getMessage());
                return redirect('employee-login')->with('error', $e->getMessage());
            }
        }
    }
 
     public function getUserTrackDetails(Request $request, $id)
    {
        $api = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/settings/get-emp-setting-trac';
        $method = "post";
        $data['employee_id'] = $id;
        try {
            $response = $this->helper->postApiCall($method, $api, $data);
            if ($response['data']['code'] == 200) {
                if (!(isset($response['data']['data']['custom_tracking_rule']['tracking']['domain']))) {
                    $response['data']['data']['custom_tracking_rule']['tracking']['domain']['suspendKeystrokesPasswords'] = "true";
                }
            }
            $result['code'] = $response['data']['code'];
            $result['msg'] = $response['data']['message'];
            $result['data'] = $response['data']['data'];
        } catch (\Exception $e) {
            return $this->ExceptionErrorHandler($e, 205, ' UserController => TrackUserSetting => Method-post');
        }
        return ($result);
    }

 

    public function ExceptionErrorHandler($exception, $code, $functionName)
    {
        Log::info('Exception ' . $exception->getLine() . " => Function Name => " . $functionName . " => code =>" . $exception->getCode() . " => message =>  " . $exception->getMessage());
        $result['code'] = $code;
        $result['msg'] = "Please, Reload and try again...";
        $result['ErrorMessage'] = $exception->getMessage();
        return $result;
    }

    public function guzzleErrorHandler($guzzleException, $functionName)
    {
        $response = $guzzleException->getResponse();
        $result['code'] = 403;
        $result['msg'] = $response->reasonPhrase;
        Log::info("GuzzleException => Function Name => " . $functionName . "=> code =>" . $result['code'] . " => message =>  " . $result['msg']);
        return $result;
    }
 

    public function permissionDenied()
    {
        return view('User::permissionDenied');
    }
 
    public function show_details(Request $request)
    {
        $api_url = env('MAIN_API').'admin/employees/'.$request->userId;
        $method = 'get-with-token';
        try {
            $response = $this->helper->postApiCall($method, $api_url, []);
            $result['code'] = 200;
            $result['data'] = $response['data'];
            $result['msg'] = $response['message'];
            return $result;
        } catch (\Exception $e) {
            return $this->ExceptionErrorHandler($e, "400", ' UserController => show_details => Method-post');
        }
    }
    public function adminLogin(Request $request)
    {
        //         if not exists copy else no
        $logoPath = 'assets/images/logos/' . md5($_SERVER['HTTP_HOST']) . '.png';
        if (!(\Illuminate\Support\Facades\File::exists(public_path($logoPath)))) {
            Storage::disk('logos')->copy('assets/images/logos/EmpLogo.png', $logoPath);
        }
        $faviconPath = 'assets/images/favicons/' . md5($_SERVER['HTTP_HOST']) . '.png';
        if (!(\Illuminate\Support\Facades\File::exists(public_path($faviconPath)))) {
            Storage::disk('logos')->copy('assets/images/favicons/EmpFavicon.png', $faviconPath);
        }

        if ($request->isMethod('get')) {

            if (Session::has('admin')) {
                return redirect('admin/dashboard');
            }
            return view('User::loginWhitelabel');
        } else if ($request->isMethod('post')) {
            $validator = Validator::make($request->all(), [
                'password' => 'required|max:255',
                'username' => 'required',
            ]);
            if ($validator->fails()) {
                return redirect('admin-login')
                    ->withErrors($validator)
                    ->withInput();
            } else {
                $username = base64_encode($request->username);
                $password = base64_encode($request->password);
                $isClient = $request->isClient;
                if ($isClient === "true") {
                    return redirect('/resellerClientLogin/' . $username . '/' . $password . '/' . $isClient);
                } else {
                    return redirect('/loginpageWhitelabel/' . $username . '/' . $password);
                }
            }
        }
    }
 

}
