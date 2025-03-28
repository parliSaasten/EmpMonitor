let EMPLOYEE_IDS = 0;
$(document).ready(function () {
    $('#select_date_id').val(moment().format('YYYY-MM-DD'));
    let employeedata = $("#employeeData").data('list');
   $("#select_date_id").attr('max', new Date().toISOString().split("T")[0]);
   if (employeedata.code === 200) {
        EMPLOYEE_IDS = employeedata.data[0].id;
        productivitydata();
    } else productivitydata();
});

$('#select_date_id').datepicker({
    minDate:"-180d",
    maxDate:"0d",
});

$(function() {
    $('#select_date_id').keypress(function(event) {
        event.preventDefault();
        return false;
    });
});

function roles() {
    RoleId = $('#roleid').val().split("+")[1];
    getLocations(RoleId)
    getDepartment(RoleId, 0);
    getUsers(RoleId, 0, 0);
}

function loc() {
    RoleId = $('#roleid').val().split("+")[1];
    LocationId = $('#locationid').val().split("+")[1];
    getDepartment(RoleId, LocationId);
    getUsers(RoleId, LocationId, 0);
}

function depts() {
    RoleId = $('#roleid').val().split("+")[1];
    LocationId = $('#locationid').val().split("+")[1];
    DepartementId = $('#departmentid').val().split("+")[1];
    getUsers(RoleId, LocationId, DepartementId);
}

function emps() {
    EMPLOYEE_IDS = $('#employeeid').val();
    productivitydata();
}

function getLocations(roleID) {
    $.ajax({
        type: "post",
        url: "/" + userType + "/get-locations-roleid",
        data: {
            id: roleID
        },
        success: function (response) {
            let data = " ";
            data = response.data;
            $('#locationid').empty();
            if (response.code === 200) {
                if (response.data) {
                    $('#locationid').append('<option id="locs+0" value="locs+0">' + ALL + '</option>');
                    response.data.forEach(function (loc) {
                        $('#locationid').append(' <option id="locs+' + loc.id + '" value="locs+' + loc.id + '">' + loc.name + '</option>');
                    })
                }
            } else {
                $("#locationid").append('<option selected disabled=true>' + response.msg + '</option>');
            }
        },
        error: function (error) {
            if (error.status === 403) {
                $("#locationid").append('<option selected disabled=true>' + DASHBOARD_JS_ERROR.permissionDenied + '</option>');
            } else {
                $("#locationid").append('<option selected disabled=true>' + DASHBOARD_JS_ERROR.reload + '</option>');
            }
        }
    });
}

function getDepartment(roleId, LocationId) {
    $.ajax({
        type: "post",
        url: "/" + userType + '/get-department-by-location',
        data: {
            id: LocationId,
            roleID: roleId,
        },
        success: function (response) {
            var data = response.data.data;
            $('#departmentid').empty();
            $("#departmentid").append('<option id="depts+0" value="depts+0"> ' + ALL + ' </option>');
            if (data != null) {
                if (data[0].id) {
                    data.forEach(function (departmentValue) {
                        $("#departmentid").append('<option id="depts+' + departmentValue.id + '"  value="depts+' + departmentValue.id + '">' + departmentValue.name + '</option>');
                    })
                } else {
                    data.forEach(function (departmentValue) {
                        $("#departmentid").append('<option id="depts+' + departmentValue.department_id + '" value="depts+' + departmentValue.department_id + '">' + departmentValue.name + '</option>');
                    })
                }
            } else {
                $("#departmentid").append('<option selected disabled=true> ' + DASHBOARD_JS_ERROR.reload + ' </option>');
            }
        }
    });
}

function getUsers(role_id, location_id, depId) {
    $.ajax({
        type: "get",
        url: "/" + userType + "/users",
        data: {
            role_id, location_id, depId
        },
        success: function (response) {
            appendData = "";
            let data = " ";
            data = response.data;
            if (response.code === 200) {
                for (i = 0; i < data.length; i++) {
                    EMPLOYEE_IDS = data[0].id;
                    appendData += ' <option class="active-result" value="' + data[i].id + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                }
            } else {
                appendData += '<option selected value="" disabled="disabled">' + response.msg + '</option>';
            }
            setTimeout(function () {
                productivitydata();
            }, 2000);
            $('#employeeid').empty();
            $('#employeeid').append(appendData);
        },
        error: function (error) {
            if (error.status === 403) {
                appendData += '<option selected value="" disabled="disabled">' + DASHBOARD_JS_ERROR.permissionDenied + '</option>';
            } else {
                appendData += '<option selected value="" disabled="disabled">' + DASHBOARD_JS_ERROR.reload + '</option>';
            }
            $('#employeeid').append(appendData);
        }
    });
}

function dateFunction() {
    productivitydata();
}

function productivitydata() {
    getLocation(EMPLOYEE_IDS);
    let date = moment($('#select_date_id').val()).format('YYYY-MM-DD');
    if (EMPLOYEE_IDS === 0) $('#office_time_id, #productive_time_id, #unproductive_time_id, #productivity_id, #total_work_id, #total_work_average_id, #to_previous_day_id, #total_work_average_id, #whole_organisation_average_id').append(productive_comparison_js.plz_sel_emp);
    else {
        $.ajax({
            type: "post",
            url: "/" + userType + "/productivity-comparison-emp-id",
            data: {
                EMPLOYEE_IDS, date
            },
            beforeSend: function () {
                $('#office_time_id, #productive_time_id, #unproductive_time_id, #productivity_id, #total_work_id, #total_work_average_id, #to_previous_day_id, #total_work_average_id, #whole_organisation_average_id, #to_previous_day_average_id').empty();
            },
            success: function (response) {
                if (response.code === 200) {
                    let office_time = (response.data.todays.length > 0) ? `${String(Math.floor(response.data.todays[0].office_time / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(response.data.todays[0].office_time).format(':mm:ss')}` + productive_comparison_js.hr : '-';
                    let productive_duration = (response.data.todays.length > 0) ? `${String(Math.floor(response.data.todays[0].productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(response.data.todays[0].productive_duration).format(':mm:ss')}` + productive_comparison_js.hr : '-';
                    let non_productive_duration = (response.data.todays.length > 0) ? `${String(Math.floor(response.data.todays[0].non_productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(response.data.todays[0].non_productive_duration).format(':mm:ss')}` + productive_comparison_js.hr : '-';
                    let productivity = (response.data.todays.length > 0) ? `${String(Math.floor(response.data.todays[0].productivity / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(response.data.todays[0].productivity).format(':mm:ss')}` + productive_comparison_js.hr : '-';
                    let total_duration = (response.data.todays.length > 0) ? `${String(Math.floor(response.data.todays[0].productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(response.data.todays[0].productive_duration).format(':mm:ss')}` + productive_comparison_js.hr : '-';
                    let productivity_percentage = (response.data.todays.length > 0) ? response.data.todays[0].productivity.toFixed(2) + '%' : '-';
                    $('#office_time_id').append(office_time);
                    $('#productive_time_id').append(productive_duration);
                    $('#unproductive_time_id').append(non_productive_duration);
                    $('#productivity_id').append(productivity_percentage);
                    let previous_productive_duration = (response.data.yesterdays.length > 0) ? `${String(Math.floor(response.data.yesterdays[0].productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(response.data.yesterdays[0].productive_duration).format(':mm:ss')}` + productive_comparison_js.hr : '-';
                    let previous_productivity_percentage = (response.data.yesterdays.length > 0) ? response.data.yesterdays[0].productivity.toFixed(2) + '%' : '-';
                    if (previous_productive_duration != '-') {
                        let yesterday_productive_data = '';
                        yesterday_productive_data = productive_duration == '-' ? 0 : response.data.todays[0].productive_duration;
                        if (response.data.yesterdays[0].productive_duration >= yesterday_productive_data) {
                            $('#to_previous_day_id').append('<h3 class="text-success"><i class="fas fa-sort-amount-up mr-1"></i>' + previous_productive_duration + '</h3>');
                        } else {
                            $('#to_previous_day_id').append('<h3 class="text-danger"><i class="fas fa-sort-amount-down mr-1"></i>' + previous_productive_duration + '</h3>');
                        }
                    } else $('#to_previous_day_id').append(previous_productive_duration);
                    if(productive_duration != '-') {
                        let today_productive_data = '';
                        today_productive_data = previous_productive_duration == '-' ? 0 : response.data.yesterdays[0].productive_duration;
                        if (response.data.todays[0].productive_duration >= today_productive_data) {
                            $('#total_work_id').append('<h3 class="text-success"><i class="fas fa-sort-amount-up mr-1"></i>' + productive_duration + '</h3>');
                        } else {
                            $('#total_work_id').append('<h3 class="text-danger"><i class="fas fa-sort-amount-down mr-1"></i>' + productive_duration + '</h3>');
                        }
                    } else $('#total_work_id').append(productive_duration);
                    if (previous_productivity_percentage != '-') {
                        let previous_productivity_data = '';
                        previous_productivity_data = productivity_percentage == '-' ? 0 : response.data.todays[0].productivity;
                        if (response.data.yesterdays[0].productivity >= previous_productivity_data) {
                            $('#to_previous_day_average_id').append('<h3 class="text-success"><i class="fas fa-sort-amount-up mr-1"></i>' + previous_productivity_percentage + '</h3>');
                        } else {
                            $('#to_previous_day_average_id').append('<h3 class="text-danger"><i class="fas fa-sort-amount-down mr-1"></i>' + previous_productivity_percentage + '</h3>');
                        }
                    } else $('#to_previous_day_average_id').append(previous_productivity_percentage);
                    if (productivity_percentage != '-') {
                        let todays_productivity_data = '';
                        todays_productivity_data = previous_productivity_percentage == '-' ? 0 : response.data.yesterdays[0].productivity;
                        if (response.data.todays[0].productivity >= todays_productivity_data) {
                            $('#total_work_average_id').append('<h3 class="text-success"><i class="fas fa-sort-amount-up mr-1"></i>' + productivity_percentage + '</h3>');
                        } else {
                            $('#total_work_average_id').append('<h3 class="text-danger"><i class="fas fa-sort-amount-down mr-1"></i>' + productivity_percentage + '</h3>');
                        }
                    } else $('#total_work_average_id').append(productivity_percentage);
                    let org_productivity_percentage = (response.data.organization.length > 0) ? response.data.organization[0].productivity.toFixed(2) + '%' : '-';
                    $('#whole_organisation_average_id').append('<h3>'+org_productivity_percentage+'</h3>');
                } else {
                    $('#office_time_id, #productive_time_id, #unproductive_time_id, #productivity_id, #total_work_id, #total_work_average_id, #to_previous_day_id, #total_work_average_id, #whole_organisation_average_id').append(response.msg);
                }
            },
            error: function (error) {
                $('#office_time_id, #productive_time_id, #unproductive_time_id, #productivity_id, #total_work_id, #total_work_average_id, #to_previous_day_id, #total_work_average_id, #whole_organisation_average_id').append(DASHBOARD_JS_ERROR.reload);
            }
        });
    }
}

setTimeout(() => {
    getLocation($("#employeeid").val());
}, 2000)

function getLocation(employee_id) {
    if (!employee_id) {
        $("#currentLocationError").empty();
        $("#currentLocationError").append(productive_comparison_js.plz_sel_emp);
        return;
      }
    $.ajax({
        type: "post",
        url: "/" + userType + "/get-location",
        data: {employee_id},
        beforeSend: function () {
            $("#currentLocationError").empty();
            $("#latAndLong").val("");
        },
        success: function (response) {
            if (response.code === 200) {
                if (response.data.longitude !== undefined) {
                    $("#latAndLong").val((response.data.latitude + ',' + response.data.longitude));
                }
            } else {
                $("#currentLocationError").append(response.msg);
            }
        },
    });
}

