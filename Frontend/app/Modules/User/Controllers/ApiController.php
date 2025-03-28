<?php

namespace App\Modules\User\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\helper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ApiController extends Controller
{
    protected $helper;
    protected $DOMAIN;

    public function __construct()
    {
        $this->helper = new helper();
        $this->DOMAIN = env('API_HOST_V3') . 'api/' . env('API_VERSION_3');
    }

    public function createLocation(Request $request)
    {
        $validator = $this->LocationValidation($request->all());
        if ($validator != []) return $validator;
        try {
            $api_url = $this->DOMAIN . '/hrms/location';
            try {
                $response = $this->helper->postApiCall("post", $api_url, $request->all());
                return $this->helper->responseHandler($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => createLocation => Method-post ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => createLocation => Method-post ');
        }
    }

    public function updateLocation(Request $request)
    {
        $validator = $this->LocationValidation($request->all());
        if ($validator != []) return $validator;
        try {
            $api_url = $this->DOMAIN . '/hrms/location';
            try {
                $response = $this->helper->postApiCall("put", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => updateLocation => Method-put ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => updateLocation => Method-put ');
        }
    }

    public function deleteLocation(Request $request)
    {
        try {
            $api_url = $this->DOMAIN . '/hrms/location';
            try {
                $response = $this->helper->postApiCall("delete", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => deleteLocation => Method-delete ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => deleteLocation => Method-delete ');
        }
    }

    public function locationList(Request $request)
    {
        try {
            $url = ($request["location_id"]) ? '?location_id=' . $request["location_id"] : "";
            $api_url = $this->DOMAIN . '/hrms/location' . $url;
            try {
                $response = $this->helper->postApiCall("get", $api_url, []);
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => locationList => Method-get ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => locationList => Method-get ');
        }
    }

    public function createDepartment(Request $request)
    {
        $validator = $this->departmentValidation($request->all());
        if ($validator != []) return $validator;
        try {
            $api_url = $this->DOMAIN . '/hrms/department';
            try {
                $response = $this->helper->postApiCall("post", $api_url, $request->all());
                return $this->helper->responseHandlerData($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => createDepartment => Method-post ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => createDepartment => Method-post ');
        }
    }

    public function updateDepartment(Request $request)
    {
        $validator = $this->departmentValidation($request->all());
        if ($validator != []) return $validator;
        try {
            $api_url = $this->DOMAIN . '/hrms/department';
            try {
                $response = $this->helper->postApiCall("put", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => updateDepartment => Method-put ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => updateDepartment => Method-put ');
        }
    }

    public function deleteDepartment(Request $request)
    {
        try {
            $api_url = $this->DOMAIN . '/hrms/department';
            try {
                $response = $this->helper->postApiCall("delete", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => deleteDepartment => Method-delete ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => deleteDepartment => Method-delete ');
        }
    }

    public function departmentList(Request $request)
    {
        try {
            $url = ($request["department_id"]) ? '?department_id=' . $request["department_id"] : "";
            $api_url = $this->DOMAIN . '/hrms/department' . $url;
            try {
                $response = $this->helper->postApiCall("get", $api_url, $request);
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => departmentList => Method-get ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => departmentList => Method-get ');
        }
    }

    public function createPolicy(Request $request)
    {
        $validator = $this->policyValidation($request->all());
        if ($validator != []) return $validator;
        try {
            $api_url = $this->DOMAIN . '/hrms/policy';
            try {
                $response = $this->helper->postApiCall("post", $api_url, $request->all());
                return $this->helper->responseHandler($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => createPolicy => Method-post ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => createPolicy => Method-post ');
        }
    }

    public function updatePolicy(Request $request)
    {
        $validator = $this->policyValidation($request->all());
        if ($validator != []) return $validator;
        try {
            $api_url = $this->DOMAIN . '/hrms/policy';
            try {
                $response = $this->helper->postApiCall("put", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => updatePolicy => Method-put ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => updatePolicy => Method-put ');
        }
    }

    public function deletePolicy(Request $request)
    {
        try {
            $api_url = $this->DOMAIN . '/hrms/policy';
            try {
                $response = $this->helper->postApiCall("delete", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => deletePolicy => Method-delete ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => deletePolicy => Method-delete ');
        }
    }

    public function policyList(Request $request)
    {
        try {
            $url = ($request["policy_id"]) ? '?policy_id=' . $request["policy_id"] : "";
            $api_url = $this->DOMAIN . '/hrms/policy' . $url;
            try {
                $response = $this->helper->postApiCall("get", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => policyList => Method-get ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => policyList => Method-get ');
        }
    }

    public function LocationValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'location' => 'required|regex:/^[a-zA-Zء-ي][a-zA-Zء-ي ]*$/',
            'location_head_id' => 'required',
            'location_hr_id' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'fax' => 'required|numeric',
            'address_one' => 'required|regex:/([a-zA-Zء-ي]+)([0-9٠-٩]*)/',
            'city' => 'required|regex:/^[a-zA-Zء-ي][a-zA-Zء-ي ]*$/',
            'state' => 'required|regex:/^[a-zA-Zء-ي][a-zA-Zء-ي ]*$/',
            'country' => 'required',
            'zip' => 'required|numeric',
        ], [
            'location.regex' => 'Location Name should contain alphabet.',
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }

    public function departmentValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'department_name' => 'required|regex:/^[a-zA-Zء-ي][a-zA-Zء-ي ]*$/',
            'location_id' => 'required',
            'department_head_id' => 'required',
        ], [
            'department_name.regex' => 'Department Name should contain alphabet.',
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }

    public function designationValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'department_id' => 'required',
            'designation_name' => 'required|regex:/^[a-zA-Zء-ي][a-zA-Zء-ي ]*$/',
        ], [
            'department_id.required' => 'Department Name is required.',
            'designation_name.regex' => 'Designation Name should contain alphabet.',
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }

    public function policyValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'title' => 'required|regex:/^[a-zA-Zء-ي][a-zA-Zء-ي ]*$/',
            'description' => 'required',
        ], [
            'title.regex' => 'Title should contain alphabet.'
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }

    public function deleteAnnouncement(Request $request)
    {
        try {
            $api_url = $this->DOMAIN . '/hrms/delete-announcements';
            try {
                $response = $this->helper->postApiCall("delete", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => deleteAnnouncement => Method-delete ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => deleteAnnouncement => Method-delete ');
        }
    }

    public function deleteExpense(Request $request)
    {
        try {
            $api_url = $this->DOMAIN . '/hrms/delete-expenses';
            try {
                $response = $this->helper->postApiCall("delete", $api_url, $request->all());
                return $this->helper->responseHandlerWithoutStatusCode($response);
            } catch (\GuzzleHttp\Exception\RequestException $e) {
                return $this->helper->guzzleErrorHandler($e, ' ApiController => deleteExpense => Method-delete ');
            }
        } catch (\Exception $e) {
            return $this->helper->errorHandler($e, ' ApiController => deleteExpense => Method-delete ');
        }
    }


    public function createAnnouncement(Request $request)
    {
        $validator = $this->AnnouncementValidation($request->all());
        if ($validator != []) return $validator;
        $data = array(
            "title" => $request->title,
            "start_date" => $request->start_date,
            "end_date" => $request->end_date,
            "location_id" => $request->location_id,
            "department_id" => $request->department_id,
            "summary" => $request->summary,
            "description" => $request->description,
            "is_active" => "1",
        );
        $api_url = $this->DOMAIN . "/hrms/create-announcements";
        try {
            $response = $this->helper->postApiCall('post', $api_url, $data);
            return $this->helper->responseHandler($response);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return $this->helper->guzzleErrorHandler($e, ' ApiController => createAnnouncement => Method-post ');
        }
    }

    public function udpateAnnouncements(Request $request)
    {
        $validator = $this->UpdateAnnouncementValidation($request->all());
        if ($validator != []) return $validator;
        $data = array(
            "id" => $request->id,
            "title" => $request->title,
            "start_date" => $request->start_date,
            "end_date" => $request->end_date,
            "location_id" => $request->location_id,
            "department_id" => $request->department_id,
            "summary" => $request->summary,
            "description" => $request->description,
            "is_active" => "1"
        );
        $api_url = $this->DOMAIN . '/hrms/update-announcements';
        try {
            $response = $this->helper->postApiCall("put", $api_url, $data);
            return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return $this->helper->guzzleErrorHandler($e, ' ApiController => udpateAnnouncements => Method-put ');
        }
    }

    public function AnnouncementValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'title' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'location_id' => 'required',
            'department_id' => 'required',
            'summary' => 'required',
            'description' => 'required',
            'is_active' => 'required',
        ], [
            'announcement.regex' => 'Announcement Title should contain alphabet.',
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }

    public function UpdateAnnouncementValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'id' => 'required',
            'title' => 'required',
            'start_date' => 'required',
            'end_date' => 'required',
            'location_id' => 'required',
            'department_id' => 'required',
            'summary' => 'required',
            'description' => 'required',
            'is_active' => 'required',
        ], [
            'announcement.regex' => 'Announcement Title should contain alphabet.',
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }

    public function createExpense(Request $request)
    {
        $validator = $this->ExpenseValidation($request->all());
        if ($validator != []) return $validator;
        $file = $request->file;
        $pathToStorage = storage_path("expense_bill_image");
        if (!file_exists($pathToStorage))
            mkdir($pathToStorage, 0777, true);
        $filename11 = $file->getClientOriginalName();
        $filename = str_replace(' ', '', $filename11);
        $path = $pathToStorage . "/" . $filename;
        file_put_contents($path, file_get_contents($file->path()));
        $multipartData = array("name" => "file",
            "file" => $path,
        );
        unlink(storage_path('expense_bill_image/' . $filename));
        $data = array(
            "employee_id" => $request->purchased_by,
            "expense_type" => $request->expense_type,
            "bill_image" => $multipartData['file'],
            "amount" => $request->amount,
            "purchase_date" => $request->purchased_date,
            "remarks" => $request->remarks,
        );
        $api_url = $this->DOMAIN . "/hrms/create-expenses";
        try {
            $response = $this->helper->postApiCall('post', $api_url, $data);
            return $this->helper->responseHandler($response);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return $this->helper->guzzleErrorHandler($e, ' ApiController => createExpense => Method-post ');
        }
    }

    public function ExpenseValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'purchased_by' => 'required',
            'expense_type' => 'required',
            'file' => 'required',
            'amount' => 'required',
            'purchased_date' => 'required',
            'remarks' => 'required',
        ], [
            'expense.regex' => 'Remarks should contain alphabet.',
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }

    public function updateExpense(Request $request)
    {
        $validator = $this->UpdateExpenseValidation($request->all());
        if ($validator != []) return $validator;
        $data = array(
            "id" => $request->id,
            "employee_id" => $request->purchased_by,
            "expense_type" => $request->expense_type,
            "bill_image" => $request->bill_copy,
            "amount" => $request->amount,
            "purchase_date" => $request->purchased_date,
            "remarks" => $request->remarks,
        );

        $api_url = $this->DOMAIN . '/hrms/update-expenses';
        try {
            $response = $this->helper->postApiCall("put", $api_url, $data);
            return $this->helper->responseHandlerWithoutStatusCode($response);
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            return $this->helper->guzzleErrorHandler($e, ' ApiController => updateExpense => Method-put ');
        }

    }

    public function UpdateExpenseValidation($data)
    {
        $response = [];
        $validator = Validator::make($data, [
            'id' => 'required',
            'purchased_by' => 'required',
            'expense_type' => 'required',
            'amount' => 'required',
            'purchased_date' => 'required',
            'remarks' => 'required',
        ], [
            'expense.regex' => 'Remarks should contain alphabet.',
        ]);
        if ($validator->fails()) {
            $response['code'] = 201;
            $response['msg'] = $validator->errors()->all();
            $response['data'] = null;
        }
        return $response;
    }
}
