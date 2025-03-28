let SELECTED_DATE = null;
let SELECTED_LOCATION;
let SELECTED_DEPARTEMENT;
let SELECTED_DAYS_DATE = null;
let SELECTED_EMPLOYEE;
var appendData = "";
$(document).ready(function(){
    $("#EmployeedateOfjoin").val($("#TodayDate").attr('name'));
    SELECTED_LOCATION = $("#LocationData").children(":selected").attr('id');
    SELECTED_DEPARTEMENT = $("#DepartementData").children(":selected").attr('id');
    $('.table-condensed tbody tr:nth-child(2) td').html("05/2020");
    employeedata(SELECTED_DATE, $("#LocationData").children(":selected").attr('id'), SELECTED_DEPARTEMENT, 0);
   
});
//location onchange function
$("#LocationData").on("change", function () {
    SELECTED_LOCATION = $('#LocationData').val();
    SELECTED_DEPARTEMENT = 0;
    SELECTED_EMPLOYEE = 0;
    getalldept(SELECTED_LOCATION);
    users(SELECTED_LOCATION, SELECTED_DEPARTEMENT);
    employeedata(SELECTED_DATE, SELECTED_LOCATION, SELECTED_DEPARTEMENT,SELECTED_EMPLOYEE)
});

//onchange for departement
$("#DepartementData").on("change", function () {
    SELECTED_DEPARTEMENT = $('#DepartementData').val();
    SELECTED_EMPLOYEE = 0;
    users(SELECTED_LOCATION, SELECTED_DEPARTEMENT);
    employeedata(SELECTED_DATE, SELECTED_LOCATION, SELECTED_DEPARTEMENT,SELECTED_EMPLOYEE);
});
//onchange for employee
$('#employeeId').on('change',function(){
    SELECTED_EMPLOYEE=$("#employeeId").val();
    employeedata(SELECTED_DATE,SELECTED_LOCATION,SELECTED_DEPARTEMENT,SELECTED_EMPLOYEE)
})


//to download the attendance list in the form of sheet
let CallAjaxToGetAllData = () => {
    employeedata(SELECTED_DATE, SELECTED_LOCATION, SELECTED_DEPARTEMENT,SELECTED_EMPLOYEE, 1);
}
function getalldept(SelectlocID) {
    var locData = SelectlocID;
    if (locData === 0) {
        locData = "";
    }
    $.ajax({
        type: "post",
        url: "/" + userType + "/get-department-by-location",
        data: {
            id: locData
        },
        success: function (response) {
            console.log(response);
            var location = " ";
            appendData = "";
            location = response.data.data;
            if (response.code === 200 && location.length !== 0 && location[0].id) {
                appendData += '<option selected class="active-result" value="0">' + AUTO_EMAIL_SEE_ALL_LESS.all  + '</option>';
                for (i = 0; i < location.length; i++) {
                    appendData += ' <option class="active-result" value="' + location[i].id + '">' + location[i].name + '</option>';
                }
            } else if (response.code === 400) {
                appendData += '<option disabled> No Departments </option>';
            } else if (response.code === 500) {
                appendData += '<option disabled>' + response.msg + '</option>';
            } else {
                appendData += '<option selected class="active-result" value="0">' + AUTO_EMAIL_SEE_ALL_LESS.all  + '</option>';
                for (i = 0; i < location.length; i++) {
                    appendData += ' <option class="active-result" value="' + location[i].department_id + '">' + location[i].name + '</option>';
                }
            }
            $('#DepartementData').empty();
            $('#DepartementData').append(appendData);
        },
        error: function (error) {
            if (error.status === 403) {
                appendData += '<option disabled >' + DASHBOARD_JS_ERROR.permissionDenied + '</option>';
            } else {
                appendData += '<option disabled >' + DASHBOARD_JS_ERROR.reload + '</option>';
            }
            $('#DepartementData').append(appendData);
        }
    });
}

function users(locationId, departmentId) {
    $.ajax({
        type: "get",
        url: "/" + userType + "/users",
        data: {
            location_id: locationId,
            depId: departmentId,
        },
        beforeSend: function () {
        },
        success: function (response) {
            console.log(response);
            appendData = "";
            var data = " ";
            data = response.data;
            if (response.code === 200) {
                appendData += '<option selected class="active-result" value="0">' + AUTO_EMAIL_SEE_ALL_LESS.all  + '</option>';
                for (i = 0; i < data.length; i++) {
                    appendData += ' <option class="active-result" value="' + data[i].id + '">' + data[i].first_name + ' ' + data[i].last_name + '</option>';
                }
            } else {
                appendData += '<option selected value="" disabled="disabled">' + response.msg + '</option>';
            }
            $('#employeeId').empty();
            $('#employeeId').append(appendData);
        },
        error: function (error) {
            if (error.status === 403) {
                appendData += '<option selected value="" disabled="disabled">' + DASHBOARD_JS_ERROR.permissionDenied + '</option>';
            } else {
                appendData += '<option selected value="" disabled="disabled">' + DASHBOARD_JS_ERROR.reload + '</option>';
            }
            $('#employeeId').append(appendData);
        }
    });
}
function weekDays(date) {
    switch (((new Date(date)).toString().split(' ')[0]).toLowerCase()) {
        case 'mon':
            return WEEK_DAYS_NAME.mon;
        case 'tue':
            return WEEK_DAYS_NAME.tue;
        case 'wed':
            return WEEK_DAYS_NAME.wed;
        case 'thu':
            return WEEK_DAYS_NAME.thu;
        case 'fri':
            return WEEK_DAYS_NAME.fri;
        case 'sat':
            return WEEK_DAYS_NAME.sat;
        case 'sun':
            return WEEK_DAYS_NAME.sun;
    }
}
function employeedata(date, LocationId, DepartmentId,employeeId, excel) {
   

    let route = excel !== 1 ? '/attendance-report-employees' : '/attendance-report-employees-download';
    $.ajax({
        url: "/" + userType + route,
        type: "post",
        data: { date, LocationId, DepartmentId,employeeId },
        success: function (response) {
            let data = response.data;
            let year = (SELECTED_DAYS_DATE != null) ? SELECTED_DAYS_DATE.split("/")[1] : new Date().getFullYear();
            let month = (SELECTED_DAYS_DATE != null) ? parseInt(SELECTED_DAYS_DATE.split("/")[0]) - 1 : new Date().getMonth();
            if (excel === 1) {
                DownloadSheet(response);
                return false;
            }
            if ($.fn.DataTable.isDataTable('#myTable')) {
                $('#myTable').DataTable().clear().destroy();
            }
            $('#headerData').empty();
            $('#bodyData').empty();
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            let headerRow = '<tr>';
            headerRow += '<th>'+ATTENDANCEREPORT.employeeName+'</th>';
            headerRow += '<th>'+ATTENDANCEREPORT.totalTime+'</th>';
            let date = new Date(year, month, 1);
            for (let i = 1; i <= daysInMonth; i++) {
                headerRow += '<th>' + i + ' ' + weekDays(date) + '</th>';
                date.setDate(date.getDate() + 1);
            }
            headerRow += '</tr>';
            $('#headerData').html(headerRow);
            data.forEach(employee => {
                let row = '<tr>';
                row += '<td>' + employee.first_name + ' ' + employee.last_name + '</td>';
                row += '<td>' + (employee.total_time ? convertSecondsToHMS(employee.total_time) : '--') + '</td>';
                if (employee.hasOwnProperty('activity_data')) {
                    for (let i = 1; i <= daysInMonth; i++) {
                        let key = (i < 10 ? '0' : '') + i;
                        row += '<td>' + (employee.activity_data[key] !== null ? convertSecondsToHMS(employee.activity_data[key]) : '--') + '</td>';
                    }
                } else {
                    for (let i = 1; i <= daysInMonth; i++) {
                        row += '<td>--</td>';
                    }
                }
                row += '</tr>';
                $('#bodyData').append(row);
            });
            let targets = [];
            for (let i = 1; i <= daysInMonth+1; i++) {
                targets.push(i);
            }
            $('#myTable').DataTable({
                scrollX: true,
                "columnDefs": [
                    {
                        "targets":targets , 
                        "orderable": false 
                    }
                ]
            });
        }
    });
}
function DownloadSheet(response) {
    if (response.code !== 200) {
        $("#ErrorMessage").html(response.msg).css('display', 'inline');
        $("#DownloadButton").attr("disabled", false);
        return;
    } else {
        let createXLSLFormatObj = [];
        let xlsHeader = [ATTENDANCEREPORT.employeeName, ATTENDANCEREPORT.totalTime];
        let xlsRows = [];

        let year = (SELECTED_DAYS_DATE != null) ? SELECTED_DAYS_DATE.split("/")[1] : new Date().getFullYear();
        let month = (SELECTED_DAYS_DATE != null) ? parseInt(SELECTED_DAYS_DATE.split("/")[0]) - 1 : new Date().getMonth();

        if (response.code === 200 && response.data.length > 0) {
            let daysInMonth = new Date(year, month + 1, 0).getDate();
            let date = new Date(year, month, 1); 
            for (let i = 1; i <= daysInMonth; i++) {
                let dayHeader = i + ' ' + weekDays(date); 
                xlsHeader.push(dayHeader);
                date.setDate(date.getDate() + 1);
            }
            $.each(response.data, (i, data) => {
                let one = {};
                one[ATTENDANCEREPORT.employeeName] = data.first_name + " " + data.last_name;
                one[ATTENDANCEREPORT.totalTime] = convertSecondsToHMS(data.total_time);
                let dateNew = new Date(year, month, 1);
                for (let i = 1; i <= daysInMonth; i++) {
                    if (dateNew.getMonth() != month) break;
                    let dayKey = i < 10 ? `0${i}` : `${i}`;
                    let activityData = data.activity_data && data.activity_data[dayKey];
                    let field = i + "." + dateNew.toString().split(' ')[0];
                    one[field] = convertSecondsToHMS(activityData);
                    dateNew.setDate(dateNew.getDate() + 1);
                }
                xlsRows.push(one);
            });
        }
        downloadExcels(createXLSLFormatObj, xlsHeader, xlsRows, $.datepicker.formatDate('MM_yy', new Date(year, month, 1)));
    }
    setTimeout(function () {
        $("#DownloadButton").html(WEEK_DAYS_NAME.exportExcel);
        $("#DownloadButton").attr("disabled", false);
    }, 100);
}

function downloadExcels(createXLSLFormatObj, xlsHeader, xlsRows, dateField) {
    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows, function (index, value) {
        let innerRowData = [];
        $.each(value, function (ind, val) {
            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });
    /* File Name */
    let filename = EMP_ATTENDANCE_JS.employees_attendance_sheet + "(" + dateField + ") .xlsx";
    /* Sheet Name */
    let ws_name = EMP_ATTENDANCE_JS.employees_attendance_sheet;
    let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    /* Write workbook and Download */
    XLSX.writeFile(wb, filename);
}
function convertSecondsToHMS(seconds) {
    if (seconds === null || seconds === undefined) {
        return '---';
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
