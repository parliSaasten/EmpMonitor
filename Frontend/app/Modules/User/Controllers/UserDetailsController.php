<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

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

    public function getProductivity(Request $request)
    {
        try {
            $sub_url = 'api/' . $this->VERSION_3 . '/report/productivity?' . $request->input("data");
            $api_url = $this->API_URL_3 . $sub_url;
            $response = $this->helper->postApiCall('get', $api_url, null);
            if ($response['code'] == 200) {
                $result['code'] = 200;
                $result['data'] = $response['data'];
                $result['msg'] = $response['message'];
                $result['poductivity_percentage']=$response['production_data'];
                return $result;
            }
            else return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getProductivity => Method-get ');
        }
    }

    public function getTimeSheetData(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/timesheet/?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, null);
            return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getTimeSheetData => Method-get ');
        }
    }

    public function getApplicationsUsed(Request $request)
    {
        $data = $request->all();
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/employee/applications?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, $data);
            return $this->helper->responseHandlerWithLoop($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getApplicationsUsed => Method-get ');
        }
    }

    public function getBrowserHistory(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/employee/browser-history?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, null);
            return $this->helper->responseHandlerWithLoop($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController =>getBrowserHistory => Method-get ');
        }
    }

    public function getBrowserHistoryMobile(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/external/get-web-usage?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, null);
            return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController =>getBrowserHistoryMobile => Method-get ');
        }
    }


    public function getKeyLoggerData(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/employee/keystrokes?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, null);
            return $this->helper->responseHandlerWithLoop($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getKeyLoggerData => Method-get ');
        }
    }

    public function getEmployeeInformation(Request $request)
    {
        try {
            $data['user_id'] = $request->input("data");
            $api_url = $this->API_URL_3 . "api/" . $this->VERSION_3 . "/user/get-user";
            $response = $this->helper->postApiCall('post', $api_url, $data);
            $result = $this->helper->responseHandler($response);
            if ($result['code'] == 200) {
                $result['data']['photo_path'] = $this->API_URL_3 . $result['data']['photo_path'];
            }
            return $result;
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getEmployeeInformation => Method-post ');
        }
    }

    public function getConversationScore(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/employee/convesation-classification?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, null);
            return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getSentimentScore => Method-get ');
        }
    }

    public function getUrlAnalysis(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/employee/url-analysis?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, null);
            if ($response['code'] == 200) {
                $result['code'] = 200;
                $result['data'] = $response['data'];
                $result['count'] = $response['count'];
                $result['msg'] = $response['message'];
            } else if ($response['code'] == 404) {
                $result['code'] = 200;
                $result['data'] = $response['data'];
                $result['msg'] = $response['message'];
            } else {
                $result['code'] = $response['code'];
                $result['msg'] = $response['code'] == 400 ? $response['message'] : $response['error'];
            }
            return $result;
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getUrlAnalysis => Method-get ');
        }
    }

    public function getCategoryConnection(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/employee/category-connection?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, null);
            return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getSentimentScore => Method-get ');
        }
    }

    // for getting the screen recorder video data
    public function getScreenRecorderVideoData(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/user/get-screen-records';
            $data['date']= $request->input('Date');
            $data['from_hour']= $request->input('fromTime');
            $data['to_hour']= $request->input('ToTime');
            $data['user_id']= $request->input('userId');

            $response = $this->helper->postApiCall('post', $api_url, $data);
                return $this->helper->responseHandlerData($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getScreenRecorderVideoData => Method-post');
        }
    }

    // for getting the active and offline data in productivity section
    public function activeOfflineProductivity(Request $request)
    {
        try
        {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/settings/offline-activity-breakdown?date='. $request->input('Date') .'&employeeId='.$request->input('user_id');
            $response = $this->helper->postApiCall('get', $api_url, []);
            return $this->helper->responseHandlerWithResponse($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => activeOfflineProductivity => Method-get');
        }
    }



    // Get combined web app usages
    public function getWebAppDetail(Request $request)
    {
        try
        {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/employee/app-web-combined?employee_id='.$request->input('employee_id').'&startDate='.$request->input('startDate').'&endDate='.$request->input('endDate').'&type='.$request->input('type').'&category='.$request->input('category').'&limit=99999';
            $response = $this->helper->postApiCall('get', $api_url, []);
            if ($response['code'] == 200) {
                $result['code'] = 200;
                $result['data'] = $response['data'];
                $result['count'] = $response['count'];
                $result['msg'] = $response['message'];
            } else if ($response['code'] == 404) {
                $result['code'] = 200;
                $result['data'] = $response['data'];
                $result['msg'] = $response['message'];
            } else {
                $result['code'] = $response['code'];
                $result['msg'] = $response['code'] == 400 ? $response['message'] : $response['error'];
            }
            return $result;
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => activeOfflineProductivity => Method-get');
        }
    }
    // Function for mobile data
    public function getMobileUsed(Request $request)
    {
        $data = $request->all();
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/mobile/admin-dashboard/get-task-details?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, $data);
            return $response;
        } catch (\Exception $e) {
            try {
                $errorResponse = json_decode(preg_split("/\r\n|\n|\r/", $e->getMessage())[1], true);
                return $errorResponse;
            } catch (\Exception $th) {
            }
            return $this->ExceptionErrorHandler($e, "400", ' UserDetailsController => getMobileUsed => Method-post');
        }
    }
    public function getBreakData(Request $request)
    {
        $data = $request->all();
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/timesheet/break-in-out-logs?' . $request->input("data");
            $response = $this->helper->postApiCall('get', $api_url, $data);
            return $response;
        } catch (\Exception $e) {
            try {
                $errorResponse = json_decode(preg_split("/\r\n|\n|\r/", $e->getMessage())[1], true);
                return $errorResponse;
            } catch (\Exception $th) {
            }
            return $this->ExceptionErrorHandler($e, "400", ' UserDetailsController => getMobileUsed => Method-post');
        }
    }
    public function employeeDeleteTime(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/settings/time-line?employee_id='.$request->input('employee_id').'&start_time='.$request->input('start_time').'&end_time='.$request->input('end_time').'&date='.$request->input('date');
            $response = $this->helper->postApiCall('delete', $api_url, []);
            return $response;
        } catch (\Exception $e) {

            return $this->helper->errorHandler($e, ' UserDetailsController => getSentimentScore => Method-get ');
        }
    }
    public function getEmployeeDeleteTime(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/settings/time-line-history?startDate='.$request->input('startDate').'&endDate='.$request->input('endDate').'&employeeId='.$request->input('employee_id');
            $response = $this->helper->postApiCall('get', $api_url, []);
            return $response;
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getSentimentScore => Method-get ');
        }
    }
    public function getScreenRecords(Request $request)
    {
        try {
            $api_url = $this->API_URL_3 . 'api/' . $this->VERSION_3 . '/user/get-screen-records';
            $data['date']= $request->input('Date');
            $data['from_hour']= $request->input('fromTime');
            $data['to_hour']= $request->input('ToTime');
            $data['user_id']= $request->input('userId');

            $response = $this->helper->postApiCall('post', $api_url, $data);
            return $this->helper->responseHandlerData($response);
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' UserDetailsController => getScreenRecorderVideoData => Method-post');
        }
    }
}
