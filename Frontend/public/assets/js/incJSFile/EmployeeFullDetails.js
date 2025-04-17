$(document).ready(function () {
    $("#EmployeedateOfjoin").datepicker({
        maxDate: new Date,
        uiLibrary: 'bootstrap4',
    });

    $('#TimesheetsTab').click();
})

function loadTimeSheetData() {
    $('#dateRange').show();
    let startTime = new Date($('#from').val()).toISOString();
    let endTime = new Date($('#to').val()).toISOString();
    $.ajax({
        type: "post",
        url: "/" + userType + '/get-time-sheets-data',
        data: {data: `skip=0&limit=10&employee_id=${$('#userId').attr('value')}&start_date=${startTime}&end_date=${endTime}`},
        beforeSend: function () {
            TIME_SHEET_CHECK = true;
            $('#timeSheetDataTable').dataTable().fnClearTable();
            $('#timeSheetDataTable').dataTable().fnDraw();
            $('#timeSheetsData').empty();
            $('#browserHistoryTable').hide();
            $('#timeSheetsData').append('<tr><td colspan="11"><div  class="loader"></div></td></tr>');
        },
        success: function (response) {
            return timeSheetData(response);
        },
        error: function (jqXHR) {
            if(jqXHR.status == 410)  {
                $('#Timesheet').empty();
                $('#timeSheetsData').empty();
                $('#Timesheet').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 40% " class="mt-5"><b>'+jqXHR.responseJSON.error+'</b></p>');
                $("#timeSheetDataTable").DataTable({ "language": {"url": DATATABLE_LANG},"bDestroy": true});
                $("#ErrorMsgForUnaccess").html(jqXHR.responseJSON.error)
            } else {
                $("#timeSheetDataTable").DataTable({ "language": {"url": DATATABLE_LANG},"bDestroy": true});
                return errorHandler(EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
            }
            TIME_SHEET_CHECK = false;
        }
    });
}
$('#select_ss_date').datepicker({
    minDate: '-180d',
    maxDate:"0d",
});
$(function() {
    $('#select_ss_date').keypress(function(event) {
        event.preventDefault();
        return false;
    });
});
function loadBrowserHistory(type=2) {
     $('#dateRange').show();
    $.ajax({
        type: "post",
        url: "/" + userType + '/get-web-app-history',
        data: {data: `employeeId=${$('#userId').attr('value')}&startDate=${$('#from').val()}&endDate=${$('#to').val()}&type=${type}`},

        beforeSend: function () {
            $('#browserHistoryTableLoader').css('display', 'block');
            $('#webHistoryChartLoader').css('display', 'block');
            WEB_HISTORY_CHECK = true;
            $('#browserHistoryDataTableData').empty();
            $('#browserHistoryTable').empty();
            $('#browserHistoryDataTableData').append("<tr><td colspan='7' style='text-align: center' class='text-primary'>"+EMPLOYEE_FULL_DETAILS_ERROR.BrowserDataLoading+" </td></tr>");
            $('#webHistoryChart').empty();
        },
        success: function (response) {
            return browserHistoryData(response);
        },
        error: function (jqXHR) {
            if(jqXHR.status == 410)  {
                $('#BrowserHistory').empty();
                $('#BrowserHistory').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 40% " class="mt-5"><b>'+jqXHR.responseJSON.error+'</b></p>');

                $("#ErrorMsgForUnaccess").html()
            }else {
                return errorHandler(EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
            }
            WEB_HISTORY_CHECK = false;
        }
    });
}

function loadAppHistory(type=1) {
    $('#dateRange').show();
    $.ajax({
        type: "post",
        url: "/" + userType + '/get-web-app-history',
        data: {data: `employeeId=${$('#userId').attr('value')}&startDate=${$('#from').val()}&endDate=${$('#to').val()}&type=${type}`},
        beforeSend: function () {
            APP_HISTORY_CHECK = true;
            $('#applicationHistoryTableId').dataTable().fnClearTable();
            $('#applicationHistoryTableId').dataTable().fnDraw();
            // $('#chartApp').empty();
            $('#appHistoryTable').empty();
            $('#appHistoryTable').append('<div  class="loader"></div>');
        },
        success: function (response) {
            return applicationHistoryData(response);
        },
        error: function (jqXHR) {
            if(jqXHR.status == 410)  {
                $('#AppHistory').empty();
                $('#AppHistory').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 40% " class="mt-5"><b>'+jqXHR.responseJSON.error+'</b></p>');
                $("#ErrorMsgForUnaccess").html()
            }else {
                return errorHandler(EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
            }
            APP_HISTORY_CHECK = false;
        }
    });
}

function loadEmployeeInformation() {
    $.ajax({
        type: "post",
        url: "/" + userType + '/get-employee-information',
        data: {data: `${$('#userId').attr('value')}`},
        beforeSend: function () {
        }, success: function (response) {
            if (response.code == 200) {
                // $('#empinfoloader').remove();
                if (response.data) {
                    setEmployeeInformation(response.data);
                } else {
                    errormessage('#empInfo', EMPLOYEE_FULL_DETAILS_ERROR.empDataNotFound);
                }
            } else if (response.code == 400 || response.code == 500) {
                errormessage('#empInfo', EMPLOYEE_FULL_DETAILS_ERROR.empDataNotFound);
            } else {
                errormessage('#empInfo', response.msg);
            }
        },
        error: function () {
            errormessage('#empInfo', EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
        }
    });
}

function errormessage(selectorID, msg, num, dataTable = false) {
    $(selectorID).empty();
    if (dataTable) $(selectorID).append('<tr><td colspan=' + num + ' style="text-align: center; color: red"><b> ' + msg + ' </b></td></tr>');
    else $(selectorID).append('<div style="text-align: center; color: red" class="col-sm-12"><b>' + msg + ' </b></div>');
}


let CalledUserFunction =
    (skip, searchtext) => {
        SEARCH_TEXT = searchtext;
        loadUrlAnalysis(SHOW_ENTRIES, skip, SORT_NAME, SORT_ORDER);
    }

//roles for edit the employee
$("#role-EditEmployee").change(function () {
    let id = $(this).children(":selected").attr("id");
});

function getLocations() {
    LOCATION_CHECK === false ? (
        $.ajax({
            type: "get",
            url: "/" + userType + '/get-all-locations',
            beforeSend: function () {
                $('#locations-editEmp').empty();
            },
            success: function (response) {
                if (response.code == 200) {
                    let locationData = response.data;
                    $('#locations-editEmp').append('<option disabled id="0">Select Location</option>');
                    locationData.map(location => $('#locations-editEmp').append('<option id="' + location.id + '">' + location.name + '</option>'));
                    LOCATION_CHECK = true;
                } else if (response.code == 400) {
                    $('#locations').append('<option selected>' + response.msg + '</option>')
                }
            },
            error: function () {
                return errorHandler(EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
            }
        })) : null;
}

// function for getting departments in edit form
function getDepartments(LocationId, SelectedDeptId) {
    if (DEPT_CHECK === false || DEPT_ID_CHECK !== LocationId) {
        DEPT_ID_CHECK = LocationId;
        let location = 0;
        LocationId == "" ? location = 0 : LocationId == 0 ? location = 0 : location = LocationId;
        $.ajax({
            type: "get",
            url: "/" + userType + '/get-department-by-location',
            data: {id: location},
            beforeSend: function () {
            },
            success: function (response) {
                if (response.code == 200) {
                    $('#departmentsAppend').empty();
                    let departmentsData = response.data;
                    $('#Empedit_departments').empty();
                    $('#Empedit_departments').append('<option disabled> '+EMP_DROPDOWN_TEXT.selDept+'</option>');
                    departmentsData.map(department => {
                        if (department.id) {
                            $('#Empedit_departments').append('<option id="' + department.id + '" value="' + department.id + '"> ' + department.name + '</option>');
                        } else {
                            $('#Empedit_departments').append('<option id="' + department.department_id + '"  value="' + department.department_id + '"> ' + department.name + '</option>');
                        }
                    });
                    $("#Empedit_departments option[id='" + SelectedDeptId + "']").attr("selected", "selected");
                    DEPT_CHECK = true;
                }
            },
            error: function () {
                return errorHandler(EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
            }
        })
    }
}

function getCategoryChartDetails() {
    $.ajax({
        type: "post",
        url: "/" + userType + '/get-category-connection',
        data: {data: `employee_id=${$('#userId').attr('value')}&startDate=${$('#from').val()}&endDate=${$('#to').val()}`},
        beforeSend: function () {
            $('#categoryDiv').empty();
            // $('#categoryDiv').append('<div style="text-align: center"class="loader"></div>');
        }, success: function (response) {
           $('#categoryDiv').empty();
            if (response.code == 200) {
                if (response.data) {
                    $('#categoryDiv').append('<div style="height: 500px; width: 100%;" id="chartcategory"></div>');
                    loadCategoryChartDetails(response.data);
                } else {
                    errormessage('#categoryDiv', EMPLOYEE_FULL_DETAILS_ERROR.categoryNotFound);
                }
            } else if (response.code == 400 || response.code == 500) {
                errormessage('#categoryDiv', EMPLOYEE_FULL_DETAILS_ERROR.categoryNotFound);
            } else {
                errormessage('#categoryDiv', response.msg);
            }
        },
        error: function () {
            $('#chartcategoryloader').remove();
            errormessage('#categoryDiv', EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
        }
    });
}


// datepicker
$( "#singleDateCalender" ).datepicker({
    changeMonth: true,
    changeYear: true,
    dateFormat: 'yy-mm-dd',
    // minDate: -20,
    maxDate: "0D"
});


 
$('#dateRange').on('apply.daterangepicker', function () {
    $('.btn.btn-info.nav-link.active').click();
});

