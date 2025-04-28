<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\helper;
use DateTime;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class TimeAttendanceController extends Controller
{
    protected $client;
    protected $API_URL;
     protected $helper;

    public function __construct()
    {
        $this->client = new Client();
        $this->API_URL = env('API_HOST');
        $this->helper = new helper();
     }

    public function attendanceHistory(Request $request)
    {   
        try {   
            if ($request->isMethod('get')) {
                try {
                    $employeesList = $this->helper->employeesList();
                    return view("User::TimeAttendance.attendanceHistory", ['employeesList' => $employeesList]);
                } catch (\Exception $e) {
                    return $this->helper->errorHandler($e, ' TimeAttendanceController => attendanceHistory => Method-get ');
                }
               
            }
          else  if ($request->isMethod('post')) {
                $data = $request->input('data');
                parse_str($data, $parsedData);
    
                $api_url = env('MAIN_API').'admin/attendance';
                $method = "post_with_token";
                $startDate = date('Y-m-d\T00:00:00\Z', strtotime($parsedData['start_date']));
                $endDate = date('Y-m-d\T23:59:59\Z', strtotime($parsedData['end_date']));
                $limit = isset($parsedData['limit']) ? $parsedData['limit'] : 10;
                $employeeId=$parsedData['employee_id'];
                $data = [
                    "start_date" => $startDate,
                    "end_date" => $endDate,
                    "skip" => 0,
                    "limit" => $limit,
                    "employee_id" => $employeeId
                ];
                if (!empty($parsedData['name'])) {
                    $data["name"] = $parsedData['name'];
                }
                $response = $this->helper->postApiCall($method, $api_url, $data);
                $result['code'] = $response['data']['code'];
                $result['data'] = $response['data']['data'];
                $result['msg'] = $response['data']['message'];
                return $result;
            } 
                return view("User::TimeAttendance.attendanceHistory");
              
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' TimeAttendanceController => attendanceReports => Method-get ');
        }
    }
 
    public function attendanceHistoryEmployee(Request $request)
    {
        try {   
            if ($request->isMethod('post')) {
                $data = $request->input('data');
                parse_str($data, $parsedData);
                $session_user = '';
                if(Session::has('admin_session')) $session_user = Session::get('admin_session')['role'];
                else if(Session::has('employee_session')) $session_user = Session::get('employee_session')['role'];
     
                $api_url = env('MAIN_API').$session_user.'/attendance';
                $method = "post_with_token";
                $data = array(
                    "start_date" => $parsedData['start_date'],
                    "end_date" => $parsedData['end_date'],  
                    "skip" => 0, 
                    "limit" => 10, 
                );  
                
                $response = $this->helper->postApiCall($method, $api_url, $data);
                $result['code'] = $response['data']['code'];
                $result['data'] = $response['data']['data'];
                $result['msg'] = $response['data']['message'];
                return $result;
            } 
                return view("User::TimeAttendance.attendanceHistory");
              
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' TimeAttendanceController => attendanceReports => Method-get ');
        }
    }


    public function guzzleErrorHandler($guzzleException, $functionName)
    {
        $response = $guzzleException->getResponse();
        $result['code'] = 403;
        $result['msg'] = $response->reasonPhrase;
        Log::info("GuzzleException => Function Name => " . $functionName . "=> code =>" . $result['code'] . " => message =>  " . $result['msg']);
        return $result;
    }
 

}
