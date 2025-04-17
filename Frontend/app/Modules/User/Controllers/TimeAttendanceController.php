<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\helper;
use DateTime;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TimeAttendanceController extends Controller
{
    protected $client;
    protected $API_URL;
    protected $API_URL_3;
    protected $helper;

    public function __construct()
    {
        $this->client = new Client();
        $this->API_URL = env('API_HOST');
        $this->helper = new helper();
        $this->API_URL_3 = env('API_HOST_V3');
        $this->VERSION_3 = env('API_VERSION_3');
    }

    public function attendanceHistory(Request $request)
    {   
        try {   
            if ($request->isMethod('post')) {
                $data = $request->input('data');
                parse_str($data, $parsedData);
    
                $api_url = env('MAIN_API').'admin/attendance';
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
 
    public function attendanceHistoryEmployee(Request $request)
    {
        try {   
            if ($request->isMethod('post')) {
                $data = $request->input('data');
                parse_str($data, $parsedData);
    
                $api_url = env('MAIN_API').'admin/attendance';
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
