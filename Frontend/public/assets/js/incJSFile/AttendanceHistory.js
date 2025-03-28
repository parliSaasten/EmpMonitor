var locID = 0;
var deptID = 0;
var userID = 0;
var fromDate = "";
var toDate = "";
var appendData = "";
var from;
var to;
var pdfCsv = 0;
var message = "";
let SHOW_ENTRIES = 10;
let TOTAL_COUNT_EMAILS = 0; 		 // Your table list total count
let SORT_NAME = '';   			 //Holds on which field we are going to sort
let SORT_ORDER = '';			 //Holds on  which order we are going to do
let SORTED_TAG_ID = '';  		 // Holds the previous tad id  to disable the arrow if we go to another feild for sorting
let PAGE_COUNT_CALL = true, COMPLETE_RECORD_DATA;
let ADD_REMOVE_COLUMN = ["Email", "Location", "Department", "EmpCode","computerName", "ClockIn", "ClockOut","CheckInIp","CheckOutIp", "TotalHour", "OfficeTime", "ActiveHour", "Productive", "Unproductive",  "IdleTime", "Neutral", "Offline", "Productivity"];
let ORIGINAL_TABLE_HEADER = ["Email", "Location", "Department", "EmpCode", "ClockIn", "ClockOut","CheckInIp","CheckOutIp", "TotalHour", "OfficeTime", "ActiveHour", "Productive", "Unproductive",  "IdleTime", "Neutral", "Offline", "Productivity"];


$(function () {
    var start = moment().subtract(0, 'days');
    var end = moment();
    const dateLimit = silahdomain ? { days: 65 } : { days: 30 };
    function cb(start, end) {
        $('#reportranges span').html(start.format('MMMM DD, YYYY') + ' - ' + end.format('MMMM DD, YYYY'));
        $('#from').val(start.format('YYYY-MM-DD'));
        $('#to').val(end.format('YYYY-MM-DD'));
        from = $('#from').val();
        to = $('#to').val();
        if (active_function == 1) {
            attendanceReports(locID, deptID, userID, SHOW_ENTRIES, 0, null);
            makeDatatableDefault();
            $('#showPageNumbers').hide();
            $('#attendanceHistory').hide();

        }
        if (active_function == 0) {
            active_function = 1
        }
    }

    $('#reportranges').daterangepicker({
        startDate: start,
        endDate: end,
        minDate : twelveMonth ? moment().subtract(12, 'months') : nineMonth  ? moment().subtract(9, 'months') : moment().subtract(180, 'days'),
        maxDate: end,
        dateLimit: dateLimit,
        ranges: {
            [dateRangesLocalization.Today]: [moment(), moment()],
            [dateRangesLocalization.Yesterday]: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            [dateRangesLocalization.Last_7_Days]: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
            [dateRangesLocalization.Last_30_Days]: [moment().subtract(30, 'days'), moment().subtract(1, 'days')],
            [dateRangesLocalization.This_Month]: [moment().startOf('month'), moment().endOf('month')],
            [dateRangesLocalization.Last_Month]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        },
        locale: {
            'customRangeLabel': dateRangesLocalization.Custom_Range,
            "applyLabel": dateRangesLocalization.apply,
            "cancelLabel": dateRangesLocalization.cancel,
        },
    }, cb);
    cb(start, end);
});
$(document).ready(function () {
    if (PAGE_COUNT_CALL === true) {
        if (response.code === 200) {
            TOTAL_COUNT_EMAILS = response.data.totalCount;
            paginationSetup();
            TOTAL_COUNT_EMAILS < SHOW_ENTRIES ? $("#showPageNumbers").html(' ' + DATATABLE_LOCALIZE_MSG.showing + ' ' + 1 + ' ' + DATATABLE_LOCALIZE_MSG.to + ' ' + TOTAL_COUNT_EMAILS + ' ' + DATATABLE_LOCALIZE_MSG.of + ' ' + TOTAL_COUNT_EMAILS)
                : $("#showPageNumbers").html(' ' + DATATABLE_LOCALIZE_MSG.showing + ' ' + 1 + ' ' + DATATABLE_LOCALIZE_MSG.to + ' ' + SHOW_ENTRIES + ' ' + DATATABLE_LOCALIZE_MSG.of + ' ' + TOTAL_COUNT_EMAILS);
        } else {
            $("#showPageNumbers").html(' ' + DATATABLE_LOCALIZE_MSG.showing + ' ' + 0 + ' ' + DATATABLE_LOCALIZE_MSG.to + ' ' + 0 + ' ' + DATATABLE_LOCALIZE_MSG.of + ' ' + 0);
            MAIL_DATA = "";
            paginationSetup();
            // $('.pagination').jqPagination();
        }
    }

    $("#employee").select2({width: "200"});
    // users(locID, deptID);
    $('#SearchButton').click(function () {
        $('#SearchButton').attr('disabled', false);
    });
    let runScript = (e) => {
        if (e.keyCode == 13) SearchText();
    }
});

function getAllLocations() {
    $('#showPageNumbers').hide();
    locID = $('#locationdept').val();
    deptID = 0;
    userID = 0;
    makeDatatableDefault();
    getalldept(locID);
    users(locID, deptID);
    attendanceReports(locID, deptID, userID, SHOW_ENTRIES, 0, null);
}

function getAllDepartments() {
    $('#showPageNumbers').hide();
    deptID = $('#getDepartments').val();
    userID = 0;
    users(locID, deptID);
    makeDatatableDefault();
    attendanceReports(locID, deptID, userID, SHOW_ENTRIES, 0, null);
}

function allEmployee() {
    $('#showPageNumbers').hide();
    userID = $('#employee').val();
    makeDatatableDefault();
    attendanceReports(locID, deptID, userID, SHOW_ENTRIES, 0, null);
}

function getalldept(SelectlocID) {
    var locData = locID;
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
            $('#getDepartments').empty();
            $('#getDepartments').append(appendData);
        },
        error: function (error) {
            if (error.status === 403) {
                appendData += '<option disabled >' + DASHBOARD_JS_ERROR.permissionDenied + '</option>';
            } else {
                appendData += '<option disabled >' + DASHBOARD_JS_ERROR.reload + '</option>';
            }
            $('#getDepartments').append(appendData);
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
            $('#employee').empty();
            $('#employee').append(appendData);
        },
        error: function (error) {
            if (error.status === 403) {
                appendData += '<option selected value="" disabled="disabled">' + DASHBOARD_JS_ERROR.permissionDenied + '</option>';
            } else {
                appendData += '<option selected value="" disabled="disabled">' + DASHBOARD_JS_ERROR.reload + '</option>';
            }
            $('#employee').append(appendData);
        }
    });
}

//call the function once on change of pagination
let CalledUserFunction = (skip, SearchText) => {
    attendanceReports(locID, deptID, userID, SHOW_ENTRIES, skip, SearchText, SORT_NAME, SORT_ORDER);
};

function attendanceReports(SelectlocID, SelectDeptId, SelectUserId, showEntries, skipvalue, searchText) {
    var SelectedfromDate = new Date(from).toISOString();
    var SelectedtoDate = new Date(to).toISOString();
    var urlData;
    if (searchText == "") searchText = null;
    if (SORT_NAME == "" && SORT_ORDER == "" && searchText == null) urlData = `location_id=${SelectlocID}&department_id=${SelectDeptId}&employee_id=${SelectUserId}&start_date=${SelectedfromDate}&end_date=${SelectedtoDate}&limit=${showEntries}&skip=${skipvalue}`
    else if (SORT_NAME == "" && SORT_ORDER == "" && searchText != null) {
        urlData = `location_id=${SelectlocID}&department_id=${SelectDeptId}&employee_id=${SelectUserId}&start_date=${SelectedfromDate}&end_date=${SelectedtoDate}&limit=${showEntries}&skip=${skipvalue}&name=${searchText}`
    } else if (SORT_NAME != "" && SORT_ORDER != "" && searchText == null) {
        urlData = `location_id=${SelectlocID}&department_id=${SelectDeptId}&employee_id=${SelectUserId}&start_date=${SelectedfromDate}&end_date=${SelectedtoDate}&limit=${showEntries}&skip=${skipvalue}&sortColumn=${SORT_NAME}&sortOrder=${SORT_ORDER}`
    } else {
        urlData = `location_id=${SelectlocID}&department_id=${SelectDeptId}&employee_id=${SelectUserId}&start_date=${SelectedfromDate}&end_date=${SelectedtoDate}&limit=${showEntries}&skip=${skipvalue}&name=${searchText}&sortColumn=${SORT_NAME}&sortOrder=${SORT_ORDER}`
    }
    let url = userType === ENV_RESELLER ? '/reseller-attendance-history' : '/attendance-history';
    $.ajax({
        type: "post",
        url: '/' + userType + url,
        data: {
            data: urlData
        },
        beforeSend: function () {
            $("#loader").css('display', 'block');
            $('#attendanceHistory').hide();
        },
        success: function (response) {
            $("#SearchButton").attr('disabled',false);
            $('#showPageNumbers').show();
            $('#attendanceHistory').show();
            $("#loader").css('display', 'none');
            appendData = "";
            var data = response.data;
            if (response.code === 200) {
                var ReportsData = data.user_data;
                if (ReportsData) {
                    ReportsData.forEach(function (attHistory) {
                        appendData +='<tr>';
                        if (userType === ENV_RESELLER) {
                            appendData += '<td class="stickyCol-sticky-col"">' + attHistory.first_name + ' ' + attHistory.last_name + '</td>';
                        } else {
                            appendData += '<td class="stickyCol-sticky-col""><a title="View Full Details" href="get-employee-details?id=' + attHistory.id + '">' + attHistory.first_name + ' ' + attHistory.last_name + ' </a></td>';
                        }
                        if (ADD_REMOVE_COLUMN.includes('Email')) appendData += '<td class="EmailTable" style="width: 90px;">' + attHistory.email + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('EmpCode')) appendData += '<td class="EmpCodeTable" style="width: 90px;">' + attHistory.emp_code + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('Location')) appendData += '<td class="LocationTable" style="text-align:center">' + attHistory.location + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('Department')) appendData += '<td class="DepartmentTable" style="text-align:center">' + attHistory.department + '</td>';
                        if(COMPUTER_NAME_DATA){
                            if (ADD_REMOVE_COLUMN.includes('computerName'))    appendData += '<td class="EmailTable" style="width: 90px;">' + attHistory.computer_name + '</td>';
                        }
                        if (ADD_REMOVE_COLUMN.includes('ClockIn')) appendData += '<td class="ClockInTable" style="width: 90px;">' + attHistory.start_time + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('ClockOut')) appendData += '<td class="ClockOutTable" style="width: 90px;">' + attHistory.end_time + '</td>';
                        if(checkEnvPermissionIP){
                            if (ADD_REMOVE_COLUMN.includes('CheckInIp') && $('input[value="CheckInIp"]').is(':checked')){ appendData += '<td class="CheckInIpTable" style="width: 90px;">' + attHistory?.details?.checkInIp.replace(',35.201.73.5', '') + '</td>';$('.CheckInIpTable').show()}else{$('.CheckInIpTable').hide()}
                            if (ADD_REMOVE_COLUMN.includes('CheckOutIp') && $('input[value="CheckOutIp"]').is(':checked')){ appendData += '<td class="CheckOutIpTable" style="width: 90px;">' + attHistory?.details?.checkOutIp.replace(',35.201.73.5', '') + '</td>';$('.CheckOutIpTable').show()}else{$('.CheckOutIpTable').hide()}
                        }
                        if (ADD_REMOVE_COLUMN.includes('TotalHour')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td class="TotalHourTable" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.total_time)) + '</td>' : '<td class="TotalHourTable" style="text-align:center">' +convertTimeHMS(parseInt( attHistory.total_time)) + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('OfficeTime')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td class="OfficeTimeTable" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.office_time)) + '</td>' : '<td class="OfficeTimeTable" style="text-align:center">' + convertTimeHMS(parseInt(attHistory.office_time ))+ '</td>';
                        if (ADD_REMOVE_COLUMN.includes('ActiveHour')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td class="ActiveHourTable" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.computer_activities_time)) + '</td>' : '<td class="ActiveHourTable" style="text-align:center">' +convertTimeHMS(parseInt( attHistory.computer_activities_time)) + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('Productive')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td class="text-success ProductiveTable" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.productive_duration)) + '</td>' : '<td class="text-success ProductiveTable" style="text-align:center">' + convertTimeHMS(parseInt(attHistory.productive_duration)) + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('Unproductive')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td class="text-danger UnproductiveTable" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.non_productive_duration)) + '</td>' : '<td class="text-danger UnproductiveTable" style="text-align:center">' +convertTimeHMS(parseInt( attHistory.non_productive_duration)) + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('Neutral')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td class="text-secondary NeutralTable" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.neutral_duration)) + '</td>' : '<td class="text-secondary ActiveHourTable" style="text-align:center">' + convertTimeHMS(parseInt(attHistory.neutral_duration)) + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('IdleTime')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td  class="text-warning IdleTimeTable" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.idle_duration)) + '</td>' : '<td  class="text-warning AttendanceTable" style="text-align:center">' + convertTimeHMS(parseInt(attHistory.idle_duration)) + '</td>';
                        // if ( envAdminIds.includes(Number(adminId)) ) {
                        if (ADD_REMOVE_COLUMN.includes('Offline')) appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td class="OfflineTable"  style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.offline)) + '</td>' : '<td class="OfflineTable"  style="text-align:center">' + convertTimeHMS(parseInt(attHistory.offline)) + '</td>';
                        // }
                            appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(parseInt(attHistory.break_duration)) + '</td>' : '<td>' + convertTimeHMS(parseInt(attHistory.break_duration)) + '</td>';
                        if (ADD_REMOVE_COLUMN.includes('Productivity')) appendData += '<td class="text-primary ProductivityTable" style="text-align:center">' + attHistory.productivity + '%</td>' ;
                        if(UNPRODUCTIVITYPERCENTAGE){
                            appendData += '<td class="text-primary ProductivityTable" style="text-align:center">' + attHistory?.unproductive + '%</td>' ;
                        }
                        if(MOBILE_DATA){
                            appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(parseInt(attHistory.mobileUsageDuration)) + '</td>' : '<td>' + convertTimeHMS(parseInt((attHistory.mobileUsageDuration))) + '</td>';
                        }
                        if(wasteFieldLunchTime){
                            let waste_hours = parseInt((attHistory.idle_duration)+((attHistory.total_time)-(attHistory.office_time))) - 3600 ;
                            if(waste_hours > 0)
                            {
                                appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(waste_hours) + '</td>' : '<td>' + convertTimeHMS(waste_hours) + '</td>';
                            }else{
                                appendData +=  '<td>0:00:00</td>';
                            }
                        }
                        appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(parseInt(attHistory.total_break_time)) + '</td>' : '<td>' + convertTimeHMS(parseInt((attHistory.total_break_time))) + '</td>';
                        appendData +=  '</tr>';
                    });
                }

                $('#attendanceHistory').empty();
                $('#attendanceHistory').append(appendData);
                if (PAGE_COUNT_CALL === true) {
                    TOTAL_COUNT_EMAILS = response.data.totalCount;
                    paginationSetup();
                    TOTAL_COUNT_EMAILS < SHOW_ENTRIES ? $("#showPageNumbers").html(' ' + DATATABLE_LOCALIZE_MSG.showing + ' ' + 1 + ' ' + DATATABLE_LOCALIZE_MSG.to + ' ' + TOTAL_COUNT_EMAILS + ' ' + DATATABLE_LOCALIZE_MSG.of + ' ' + TOTAL_COUNT_EMAILS)
                        : $("#showPageNumbers").html(' ' + DATATABLE_LOCALIZE_MSG.showing + ' ' + 1 + ' ' + DATATABLE_LOCALIZE_MSG.to + ' ' + SHOW_ENTRIES + ' ' + DATATABLE_LOCALIZE_MSG.of + ' ' + TOTAL_COUNT_EMAILS);
                }

            } else {
                TOTAL_COUNT_EMAILS = 0;
                $("#showPageNumbers").html(' ' + DATATABLE_LOCALIZE_MSG.showing + ' ' + 0 + ' ' + DATATABLE_LOCALIZE_MSG.to + ' ' + 0 + ' ' + DATATABLE_LOCALIZE_MSG.of + ' ' + 0);
                MAIL_DATA = "";
                paginationSetup();
                $('.pagination').jqPagination('destroy');
                message = response.msg;
                // appendData += '<option disabled>' + response.msg + '</option>';
                if (dev_site == 'dev') {
                    if (envAdminIds.includes(Number(adminId))) appendData += '<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td> ' + response.msg + ' </td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    else appendData += '<tr  align="center"> <td colspan="17" style="text-align: center" >' + response.msg + '</td></tr>';
                } else {
                    if (envAdminIds.includes(Number(adminId))) appendData += '<tr align="center"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td> ' + response.msg + ' </td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>';
                    else if (orgId == 0) appendData += '<tr align="center"><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td> ' + response.msg + ' </td><td></td><td></td><td></td><td></td><td></td></tr>';
                }
                $('#attendanceHistory').empty();
                $('#attendanceHistory').append(appendData);
            }
        },
        error: function (error) {
            if (error.status === 403) {
                appendData += '<option disabled >' + DASHBOARD_JS_ERROR.permissionDenied + '</option>';
            } else {
                appendData += '<option disabled >' + DASHBOARD_JS_ERROR.reload + '</option>';
            }
            $('#employee').append(appendData);
        }
    });
}

function attendanceReportsDownload(value) {
    $('#cover-spin').show(0);
    var SelectedfromDate = new Date(from).toISOString();
    var SelectedtoDate = new Date(to).toISOString();
    let downloadHeaderSelected = $('.downloadCheckbox:checked,.downloadCheckboxes:checked').map(function () {
        return $(this).val();
    }).get();
    let Average_employee = (downloadHeaderSelected.includes('Average_employee') && !downloadHeaderSelected.includes('Split_Excel_List')) ? true : false;
    let Absent_employee = (downloadHeaderSelected.includes('Absent_employee')) ? "1" : "0";
    let total_avg = (downloadHeaderSelected.includes('Total_Average_employee')) ? "true" : "false";
    $.ajax({
        type: "get",
        url: "/" + userType + "/attendance-reports",
        data: {
            data: `location_id=${locID}&department_id=${deptID}&employee_id=${userID}&start_date=${SelectedfromDate}&end_date=${SelectedtoDate}&employee_avg=${Average_employee}&absent=${Absent_employee}&avg=${total_avg}`
        },
        beforeSend: function () {
            $("#checklocDownload").prop('checked', false);
        },
        success: function (response) {
            appendData = "" , appendDataHeader = "";
            var data = response.data;
            if (response.code === 200) {
                var ReportsData = data.user_data;
                COMPLETE_RECORD_DATA = ReportsData;
                if (downloadHeaderSelected.includes('Split_Excel_List') && value.toString() == "1") return MakeSplitExcel();
                // let downloadHeaderSelected =  ["Email","EmpCode","ClockIn","ClockOut","TotalHour","OfficeTime","ActiveHour","Productive","Unproductive","Neutral","IdleTime","Offline","Break","Productivity"];
                applyOneFeature();
                if (ReportsData) {
                    pdfCsv = 0;
                    let Time_header =downloadHeaderSelected.includes('T_minutes') ? TABLE_HEADER_ATTENDANCE.Min  : TABLE_HEADER_ATTENDANCE.Hr ;
                    appendDataHeader += `<tr>`;
                    appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.name}</th>`;
                    if (downloadHeaderSelected.includes('Email')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.Email_id}</th>`;
                    if (downloadHeaderSelected.includes('EmpCode')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.employeeCode}</th>`;
                    appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.date}</th>`;
                    if (downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee')) {
                        appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.workingDays}</th>`;
                        appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.NonWorkingDays}</th>`;
                    } else {
                        if (downloadHeaderSelected.includes('ClockIn') ) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.clockin}</th>`;
                        if (downloadHeaderSelected.includes('ClockOut')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.clockout}</th>`;
                    }
                    if(value == 1 && checkEnvPermissionIP){
                        if (downloadHeaderSelected.includes('CheckInIp')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.checkinip}</th>`;
                        if (downloadHeaderSelected.includes('CheckOutIp')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.checkoutip}</th>`;
                      }
                    appendDataHeader += `<th>${EXPORT_WITH_HEADER.computeName}</th>`;
                    if (downloadHeaderSelected.includes('Location')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.location}</th>`;
                    if (downloadHeaderSelected.includes('Department')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.department}</th>`;
                    if(COMPUTER_NAME_DATA){
                        appendDataHeader += ` <th class="text-primary">`+ computerName +`</th>`;
                    }
                    if (downloadHeaderSelected.includes('LoggedInIP')) appendDataHeader += `<th style="width: 90px;">${TABLE_HEADER_DOWNLOAD.LoggedInIP}</th>`;
                    if (downloadHeaderSelected.includes('TotalHour')) appendDataHeader += `<th style="width: 90px;">${TABLE_HEADER_ATTENDANCE.total} ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('OfficeTime')) appendDataHeader += `<th style="width: 90px;">${TABLE_HEADER_ATTENDANCE.officeHours} ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('ActiveHour')) appendDataHeader += `<th style="width: 90px;">${TABLE_HEADER_ATTENDANCE.activeHours} ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('Productive')) appendDataHeader += `<th  class="text-success">${TABLE_HEADER_DOWNLOAD.productive}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('Unproductive')) appendDataHeader += `<th class="text-danger">${TABLE_HEADER_DOWNLOAD.unProdHour}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('Neutral')) appendDataHeader += `<th class="text-secondary">${TABLE_HEADER_DOWNLOAD.neutral}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('IdleTime')) appendDataHeader += `<th class="text-warning">${TABLE_HEADER_DOWNLOAD.idles}  ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header}) </th>`
                    if (downloadHeaderSelected.includes('Offline')) appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.offline}  ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('Break'))  appendDataHeader += `<th>${TABLE_HEADER_DOWNLOAD.break}  ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</th>`
                    if (downloadHeaderSelected.includes('Productivity')) appendDataHeader += ` <th class="text-primary">${TABLE_HEADER_DOWNLOAD.productivity} %</th>`;
                    if(UNPRODUCTIVITYPERCENTAGE){
                        appendDataHeader += ` <th class="text-primary">`+ unproductivity +` %</th>`;
                    }
                    if(MOBILE_DATA){
                        appendDataHeader += ` <th class="text-primary">`+ mobileHrs +`</th>`;
                    }
                    if(wasteFieldLunchTime){
                        appendDataHeader += ` <th class="text-primary">`+ wasteName +`</th>`;
                    }
                    appendDataHeader += ` <th class="text-primary">`+ totalBreakHrs +`</th>`;
                    if (downloadHeaderSelected.includes('Manager_List') && value == 1) appendDataHeader += ` <th class="text-primary">${TABLE_HEADER_DOWNLOAD.assignedList} </th>`;
                    if (value == 1 && work_hours_eight_enabled) {
                        appendDataHeader += ` <th class="text-primary">`+ workHours +` (in sec) </th>`;
                        appendDataHeader += ` <th class="text-primary">`+ workHours +` %</th>`;
                    }
                    appendDataHeader += ` </tr>`;
                    let MergeColumnEmpCode, MergeColumnDate ;
                    ReportsData.forEach(function (attHistory) {
                        let break_duration = attHistory.break_duration !== null ? `${String(Math.floor(attHistory.break_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.break_duration).format(':mm:ss')}` : Employee_Absent;
                        let computer_activity = attHistory.computer_activities_time !== null ? `${String(Math.floor(attHistory.computer_activities_time / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.computer_activities_time).format(':mm:ss')}` : Employee_Absent;
                        let idle_duration = attHistory.idle_duration !== null ? `${String(Math.floor(attHistory.idle_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.idle_duration).format(':mm:ss')}` : Employee_Absent;
                        let neutral_duration = attHistory.neutral_duration !== null ? `${String(Math.floor(attHistory.neutral_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.neutral_duration).format(':mm:ss')}` : Employee_Absent;
                        let non_productive_duration = attHistory.non_productive_duration !== null ? `${String(Math.floor(attHistory.non_productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.non_productive_duration).format(':mm:ss')}` : Employee_Absent;
                        let office_time = attHistory.office_time !== null ? `${String(Math.floor(attHistory.office_time / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.office_time).format(':mm:ss')}` : Employee_Absent;
                        let productive_duration = attHistory.productive_duration !== null ? `${String(Math.floor(attHistory.productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.productive_duration).format(':mm:ss')}` : Employee_Absent;
                        let total_time = attHistory.total_time !== null ? `${String(Math.floor(attHistory.total_time / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.total_time).format(':mm:ss')}` : Employee_Absent;
                        let offline_time = attHistory.offline !== null ? `${String(Math.floor((Math.abs(attHistory.offline)) / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(Math.abs(attHistory.offline)).format(':mm:ss')}` : Employee_Absent;
                        let offline_hours = attHistory.offline !== null ? (attHistory.offline < 0) ? '-' + offline_time : offline_time : Employee_Absent;
                        // let offline_hours_text = envAdminIds.includes(Number(adminId)) ? '<td style="text-align:center">' + offline_hours + '</td>' : '';
                        let offline_hours_text = attHistory.offline !== null ? '<td style="text-align:center">' + offline_hours + '</td>' : Employee_Absent;

                        let start_time, end_time;
                        let clockInAndClockOut = downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee');
                        if (clockInAndClockOut) {
                            let a = moment(to);
                            let b = moment(from);
                            start_time = attHistory.count !== undefined  && attHistory.count != null ? (attHistory.count) : 0;
                            end_time = attHistory.count !== undefined && attHistory.count != null ? (a.diff(b, 'days') + 1) - attHistory.count : (a.diff(b, 'days') + 1);
                        } else {
                            start_time = attHistory.start_time !== null ? moment(attHistory.start_time).tz(attHistory.timezone).format('DD-MM-YYYY HH:mm:ss') : Employee_Absent;
                            end_time = attHistory.end_time !== null ? moment(attHistory.end_time).tz(attHistory.timezone).format('DD-MM-YYYY HH:mm:ss') : Employee_Absent;
                        }

                        let emails = ((attHistory.email == null) || (attHistory.email == "null")) ? '-' : attHistory.email;
                        // let productivityPercentage = envAdminIds.includes(Number(adminId)) ? ((attHistory.productive_duration / 30600) * 100).toFixed(2) : attHistory.productivity.toFixed(2);

                        if((MergeColumnEmpCode !== attHistory.emp_code && MergeColumnEmpCode !== attHistory.date) || response.mergeColumns) {
                            appendData += '<tr attendanceId="' + attHistory.attendance_id + '" id="' + attHistory.id + '" ><td><a title="View Full Details" href="get-employee-details?id=' + attHistory.id + '">' + attHistory.first_name + ' ' + attHistory.last_name + ' </a></td>';
                            if (downloadHeaderSelected.includes('Email')) appendData += '<td style="width: 90px;">' + emails + '</td>';
                            if (downloadHeaderSelected.includes('EmpCode')) appendData += '<td style="width: 90px;">' + attHistory.emp_code + '</td>';
                            if( downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))  appendData += '<td style="text-align:center">' + from + " to " + to + '</td>';
                            else attHistory.date !== undefined ? typeof (attHistory.date) === "string" ? appendData += '<td style="text-align:center">' + attHistory.date + '</td>' : appendData += '<td style="text-align:center">' + attHistory.date[0] + '</td>' :  appendData += '<td style="text-align:center">' + attHistory.start_time.split("T")[0] + '</td>';
                        }
                        else {
                            appendData += '<tr><td><a title="View Full Details" href="get-employee-details?id=' + attHistory.id + '"></a></td>';
                            if (downloadHeaderSelected.includes('Email')) appendData += '<td style="width: 90px;"></td>';
                            if (downloadHeaderSelected.includes('EmpCode')) appendData += '<td style="width: 90px;"></td>';
                            if( downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))  appendData += '<td style="text-align:center"></td>';
                            else attHistory.date !== undefined ? typeof (attHistory.date) === "string" ? appendData += '<td style="text-align:center"></td>' : appendData += '<td style="text-align:center"></td>' :  appendData += '<td style="text-align:center"></td>';
                        }

                        if (MergeColumnEmpCode !== attHistory.emp_code) MergeColumnEmpCode = attHistory.emp_code;
                        if (MergeColumnEmpCode !== attHistory.date) MergeColumnDate = attHistory.date;
                        if (downloadHeaderSelected.includes('ClockIn') || clockInAndClockOut) appendData += attHistory.start_time !== null || clockInAndClockOut ? '<td style="width: 90px;">' + start_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('ClockOut') || clockInAndClockOut) appendData += attHistory.end_time !== null || clockInAndClockOut ? '<td style="width: 90px;">' + end_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if(value == 1  && checkEnvPermissionIP){
                            if (downloadHeaderSelected.includes('CheckInIp')) appendData += attHistory.details !== undefined && attHistory?.details?.checkInIp !== null ? '<td style="width: 90px;">' + attHistory?.details?.checkInIp.replace(',35.201.73.5', '') + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                            if (downloadHeaderSelected.includes('CheckOutIp')) appendData += attHistory.details !== undefined && attHistory?.details?.checkOutIp !== null ? '<td style="width: 90px;">' + attHistory?.details?.checkOutIp.replace(',35.201.73.5', '') + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';}
                        appendData += attHistory.computer_name === null ? '<td style="text-align:center">--</td>' :  '<td style="text-align:center">' + attHistory.computer_name + '</td>';
                        if (downloadHeaderSelected.includes('Location')) appendData += '<td style="text-align:center">' + attHistory.location + '</td>';
                        if (downloadHeaderSelected.includes('Department')) appendData += '<td style="text-align:center">' + attHistory.department + '</td>';
                        if(COMPUTER_NAME_DATA){
                            appendData += '<td>' + attHistory.computer_name + '</td>';
                        }
                        if (downloadHeaderSelected.includes('LoggedInIP')) appendData +=  attHistory.details !== undefined && attHistory.details !== null  ?  '<td style="text-align:center">' + attHistory?.details?.checkInIp + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('TotalHour')) appendData += attHistory.total_time !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.total_time)) + '</td>' : '<td style="text-align:center">' + total_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('OfficeTime')) appendData += attHistory.office_time !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.office_time)) + '</td>' : '<td style="text-align:center">' + office_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('ActiveHour')) appendData += attHistory.computer_activities_time !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.computer_activities_time)) + '</td>' : '<td style="text-align:center">' + computer_activity + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('Productive')) appendData += attHistory.productive_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td class="text-success" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.productive_duration)) + '</td>' : '<td class="text-success" style="text-align:center">' + productive_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('Unproductive')) appendData += attHistory.non_productive_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td class="text-danger" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.non_productive_duration)) + '</td>' : '<td class="text-danger" style="text-align:center">' + non_productive_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('Neutral')) appendData += attHistory.neutral_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td class="text-secondary" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.neutral_duration)) + '</td>' : '<td class="text-secondary" style="text-align:center">' + neutral_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('IdleTime')) appendData += attHistory.idle_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td  class="text-warning" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.idle_duration)) + '</td>' : '<td  class="text-warning" style="text-align:center">' + idle_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('Offline')) appendData += attHistory.offline !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.offline)) + '</td>' : '<td style="text-align:center">' + offline_hours + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        // '<td>' + break_duration + '</td>' +
                            if (downloadHeaderSelected.includes('Break')) appendData += attHistory.break_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(parseInt(attHistory.break_duration)) + '</td>' : '<td>' + break_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if (downloadHeaderSelected.includes('Productivity')) appendData += attHistory.productivity !== null ? '<td class="text-primary" style="text-align:center">' + attHistory.productivity.toFixed(2) + '%</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        if(UNPRODUCTIVITYPERCENTAGE){
                            appendData += '<td class="text-primary ProductivityTable" style="text-align:center">' + attHistory?.unproductive + '%</td>' ;
                        }
                        if(MOBILE_DATA){
                            appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(parseInt((attHistory.mobileUsageDuration))) + '</td>' : '<td>' + convertTimeHMS(parseInt((attHistory.mobileUsageDuration))) + '</td>';
                        }
                        if(wasteFieldLunchTime){
                            let waste_hours = parseInt((attHistory.idle_duration)+((attHistory.total_time)-(attHistory.office_time))) - 3600 ;
                            if(waste_hours > 0)
                            {
                                appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(waste_hours) + '</td>' : '<td>' + convertTimeHMS(waste_hours) + '</td>';
                            }else{
                                appendData +=  '<td>0:00:00</td>';
                            }
                        }
                        appendData += ADD_REMOVE_COLUMN.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(parseInt((attHistory.total_break_time))) + '</td>' : '<td>' + convertTimeHMS(parseInt((attHistory.total_break_time))) + '</td>';
                        if (downloadHeaderSelected.includes('Manager_List') && value == 1) appendData += attHistory.AssignedTo !== null ? '<td class="text-primary" style="text-align:center">' + attHistory.AssignedTo + '</td>' : '<td style="text-align:center"></td>';
                        if (value == 1 && work_hours_eight_enabled) {
                            let work_hours = parseInt(attHistory.office_time) - 28800;
                            appendData += attHistory.office_time !== null ? '<td class="text-primary" style="text-align:center">'+(work_hours < 0 ? '-' : '')  + Math.abs(work_hours) + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                            appendData += attHistory.computer_activities_time !== null ? '<td class="text-primary" style="text-align:center">' + (parseInt(attHistory.computer_activities_time) / 288).toFixed(2) + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
                        }
                    });
                }
            } else {
                $('#cover-spin').hide();
                pdfCsv = 1;
                message = response.msg;
                appendData += '<option disabled>' + response.msg + '</option>';
            }
            $('#attendanceHistory1').empty();
            $('#attendanceHistory1').append(appendData);
            $('#PDFDownloadHeader').empty();
            $('#PDFDownloadHeader').append(appendDataHeader);
            $('#PDFDownloadRowData').empty();
            (value == 1) ? custom_employee_report ? (download_table_as_customcsv()) : (download_table_as_csv()) : (download_table_as_pdf());
            applyOneFeature();
        },
        error: function (jqXHR) {
            $('#cover-spin').hide();
            if (jqXHR.status == 410) {
                $("#UnaccessModal").empty();
                $("#UnaccessModal").css('display', 'block');
                $("#UnaccessModal").append('<div class="alert alert-danger text-center"><button type="button" class="close" data-dismiss="alert" >&times;</button><b  id="ErrorMsgForUnaccess"> ' + jqXHR.responseJSON.error + '</b></div>')
            } else {
                appendData += '<option disabled >' + DASHBOARD_JS_ERROR.reload + '</option>';
            }
            $('#employee').append(appendData);
        }
    });
}

function unproductiveCsv() {

    $.ajax({
        type: "get",
        url: "/" + userType + "/unproductive-employees",
        data: {},
        beforeSend: function () {
        },
        success: function (response) {
            if (response.code == '200') {
                const createXLSLFormatObj = [];
                /* XLS Head Columns */
                let xlsHeader = ["EMPLOYEE ID", "FIRST NAME","LAST NAME", "LOCATION", "DEPARTMENT",moment().subtract(7, 'd').format("YYYY-MM-DD"), moment().subtract(6, 'd').format("YYYY-MM-DD"), moment().subtract(5, 'd').format("YYYY-MM-DD"), moment().subtract(4, 'd').format("YYYY-MM-DD"), moment().subtract(3, 'd').format("YYYY-MM-DD"), moment().subtract(2, 'd').format("YYYY-MM-DD"), moment().subtract(1, 'd').format("YYYY-MM-DD")];
                let datexlsHeader = [moment().subtract(7, 'd').format("YYYY-MM-DD"), moment().subtract(6, 'd').format("YYYY-MM-DD"), moment().subtract(5, 'd').format("YYYY-MM-DD"), moment().subtract(4, 'd').format("YYYY-MM-DD"), moment().subtract(3, 'd').format("YYYY-MM-DD"), moment().subtract(2, 'd').format("YYYY-MM-DD"), moment().subtract(1, 'd').format("YYYY-MM-DD")];
                xlsHeader.push();
                let xlsRows = [];
                response.data.user_data.forEach(data => {
                    one = {};
                    one["EMPLOYEE ID"] = data.employee_id;
                    one["FIRST NAME"] = data.first_name;
                    one["LAST NAME"] = data.last_name;
                    one["LOCATION"] = data.location;
                    one["DEPARTMENT"] = data.department;

                    for (let i = 0; i < datexlsHeader.length; i++) {
                        one[datexlsHeader[i]] = '--';
                    }
                    for (let key of Object.keys(data.details)) {
                        one[key] = data.details[key];
                    }
                    xlsRows.push(one);
                });
                downloadsExcels(createXLSLFormatObj, xlsHeader, xlsRows);
            } else{
                message = response.msg;
                warningHandler(message);
        }}
    });
}

function downloadsExcels(createXLSLFormatObj, xlsHeader,xlsRows) {
    createXLSLFormatObj.push(xlsHeader);
    $.each(xlsRows ,function (index, value) {
        const innerRowData = [];
        $.each(value, function (ind, val) {
            innerRowData.push(val);
        });
        createXLSLFormatObj.push(innerRowData);
    });
    /* File Name */
    const filename = 'unproductiveEmployees' + '.xlsx';
    /* Sheet Name */
    const ws_name = "unproductive employee list" ;
    const wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    /* Write workbook and Download */
    XLSX.writeFile(wb,filename);
}

//This code convert html to csv file
function download_table_as_csv() {
    if (pdfCsv === 0) {
        var rows = document.querySelectorAll('table#history_tracked1 tr');
        var csv = [];
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll('td, th');
            for (var j = 0; j < cols.length; j++) {
                var data = cols[j].innerText;
                row.push(data);
            }
            csv.push(row);
        }
        $('#cover-spin').hide();
        const filename = downloadFileName + '.xlsx';
        const ws_name = "attendance history" ;
        const wb = XLSX.utils.book_new(),
              ws = XLSX.utils.aoa_to_sheet(csv);
        XLSX.utils.book_append_sheet(wb, ws, ws_name);
        XLSX.writeFile(wb,filename);
    } else {
        warningHandler(message);
    }
}
function download_table_as_customcsv() {
    if (pdfCsv === 0) {
        var rows = document.querySelectorAll('table#history_tracked1 tr');
        var csv = [];
        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll('td, th');
            for (var j = 0; j < cols.length; j++) {
                var data = cols[j].innerText;
                row.push(data);
            }
            csv.push(row);
        }

        let [headers, ...rowsData] = csv;

        let obj = {};
        for (const r of rowsData) {
            if (!obj[r[0]] || obj[r[0]].length == 0) {
                obj[r[0]] = [];
                obj[r[0]].push(headers);
                obj[r[0]].push(r);
            }
            else {
                obj[r[0]].push(r);
            }
        }

        const filename = downloadFileName + '.xlsx';
        const wb = XLSX.utils.book_new();

        Object.keys(obj).forEach((key) => {
            let data = obj[key];
            key = key.slice(0, 31);
            let ws = XLSX.utils.aoa_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, key);
        });

        $('#cover-spin').hide();
        XLSX.writeFile(wb,filename);
    } else {
        warningHandler(message);
    }
}

async  function download_table_as_pdf() {
    if (pdfCsv === 0) {
        let img = new Image();
        img.src = DYNAMIC_LOGO;


        let totalPagesExp = "{total_pages_count_string}";
        let leftMargin = 15;
        let doc = new jsPDF('p', 'pt', 'a2');
        if (language_ar == "ar" || silahdomain){
            var TajawalFont = await getTajawalFont();
            doc.addFileToVFS('Tajawal-Regular-normal.ttf', TajawalFont);
            doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', 'normal');
            doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', 'bold');
            doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', "italic");
            doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', "bolditalic");
            doc.setFont('Tajawal');
        }
        doc.text(80,30, downloadFileName, {align:'left'},100,20)
        doc.setFontSize(13);
        doc.text(97,73, REPORT_DOWNLOAD_MSG.fromDate + " :-", {align:'right'},100,20);
        doc.text(85,101, REPORT_DOWNLOAD_MSG.locatiom + " :-", {align:'right'},100,20);
        doc.text(93,129, REPORT_DOWNLOAD_MSG.employee + " :-", {align:'right'},100,20);
        // doc.setFontType("normal");
        doc.text(175,73,from , {align:'right'},100,20);
        let length1=150+ ($("#locationdept").children(':selected').text().replace('See','').length-6)*5.5;
        doc.text(length1,101, $("#locationdept").children(':selected').text().replace('See',''), {align:'right'},100,20);
        let length2=150+ ($("#employee").children(':selected').text().replace('See','').length-6)*5.5;
        doc.text(length2,129, $("#employee").children(':selected').text().replace('See',''), {align:'right'},100,20);
        $("#FromDatePdf").html(from);
        $("#locationPdf").html($("#locationdept").children(':selected').text().replace('See',''));
        $("#employeePdf").html($("#employee").children(':selected').text().replace('See',''));

        doc.text(360,73, REPORT_DOWNLOAD_MSG.toDate+" :-", {align:'right'},100,20);
        doc.text(360,101, REPORT_DOWNLOAD_MSG.department+" :-", {align:'right'},100,20);
        doc.setFontType("normal");
        doc.text(440,73,to , {align:'right'},100,20);
        let length=436+ ($("#getDepartments").children(':selected').text().replace('See','').length-6)*5.5;
        doc.text(length,101, $("#getDepartments").children(':selected').text().replace('See',''), {align:'right'},100,20);
            doc.fromHTML($('#section1').html(), 30, 20, {
                    'width': 4000,
            });
        doc.setFontSize(13);
        // if (envAdminIds.includes(Number(adminId))) {


            doc.addImage(img, 'PNG', 1020, 50, 140, 45);

        if (language_ar == "ar" || silahdomain){
            doc.autoTable({
            html: '#history_tracked1', theme: "grid",
            startY: 160,
            startX: 8,
            tableWidth: '500',
            columnStyles: {
                0: {cellWidth: 80},
                1: {cellWidth: 90},
                2: {cellWidth: 50},
                3: {cellWidth: 40},
                4: {cellWidth: 60},
                5: {cellWidth: 60},
                6: {cellWidth: 52},
                7: {cellWidth: 50},
                8: {cellWidth: 63},
                9: {cellWidth: 63},
                10: {cellWidth: 60},
                11: {cellWidth: 60},
                12: {cellWidth: 49},
                13: {cellWidth: 55},
                14: {cellWidth: 55},
                15: {cellWidth: 52},
                16: {cellWidth: 60},
                17: {cellWidth: 62},
                18: {cellWidth: 62},
                19: {cellWidth: 68},

            },
            styles: {
                overflow: 'linebreak',
                font: 'arial',
                cellPadding: 5,
                font: 'Tajawal',
                // overflowColumns: 'linebreak'
            },didDrawPage: function (data) {
                let str = "Page " + data.pageCount;
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " of " + totalPagesExp;
                }
                doc.text(str, leftMargin, doc.internal.pageSize.height - 10);
            }
        });
    }else{
        doc.autoTable({
            html: '#history_tracked1', theme: "grid",
            startY: 160,
            startX: 8,
            tableWidth: '500',
            columnStyles: {
                0: {cellWidth: 80},
                1: {cellWidth: 90},
                2: {cellWidth: 50},
                3: {cellWidth: 40},
                4: {cellWidth: 60},
                5: {cellWidth: 60},
                6: {cellWidth: 52},
                7: {cellWidth: 50},
                8: {cellWidth: 63},
                9: {cellWidth: 55},
                10: {cellWidth: 55},
                11: {cellWidth: 55},
                12: {cellWidth: 49},
                13: {cellWidth: 55},
                14: {cellWidth: 55},
                15: {cellWidth: 52},
                16: {cellWidth: 60},
                17: {cellWidth: 55},
                18: {cellWidth: 58},
                19: {cellWidth: 55},

            },
            styles: {
                overflow: 'linebreak',
                font: 'arial',
                cellPadding: 5,
                // overflowColumns: 'linebreak'
            },didDrawPage: function (data) {
                let str = "Page " + data.pageCount;
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " of " + totalPagesExp;
                }
                doc.text(str, leftMargin, doc.internal.pageSize.height - 10);
            }
        });
    }
        // } else {
        //     // doc.addImage(img, 'PNG', 1000,50,140, 45);
        //     doc.autoTable({
        //         html: '#history_tracked1', theme: "grid",
        //         startY: 160,
        //         columnStyles: {
        //             0: {cellWidth: 90},
        //             1: {cellWidth: 100},
        //             2: {cellWidth: 85},
        //             3: {cellWidth: 60},
        //             4: {cellWidth: 70},
        //             5: {cellWidth: 60},
        //             6: {cellWidth: 60},
        //             7: {cellWidth: 70},
        //             8: {cellWidth: 70},
        //             9: {cellWidth: 70},
        //             10: {cellWidth: 60},
        //             11: {cellWidth: 80},
        //             12: {cellWidth: 50},
        //             13: {cellWidth: 60},
        //             14: {cellWidth: 73},
        //         }, didDrawPage: function (data) {
        //             var str = "Page " + data.pageCount;
        //             if (typeof doc.putTotalPages === 'function') {
        //                 str = str + " of " + totalPagesExp;
        //             }
        //             doc.text(str, leftMargin, doc.internal.pageSize.height - 10);
        //         }
        //     });
        // }

        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.save(downloadFileName);
        $('#cover-spin').hide();
    } else {
        warningHandler(message);
    }
}
//Added and removing table headers
let tableHeaderUpdated = () => {
    attendanceReports(locID, deptID, userID, SHOW_ENTRIES, 0, $("#SearchTextField").val(), SORT_NAME, SORT_ORDER);
    setTimeout(function () {
        $("#mytimesheetdataDownload").hide();
        $("#Manager_List_Id, #Split_List_Id").show();
        $("#checklocDownload").prop('checked',false);
    },10)
};

// Seconds to  in HH:MM:SS format
let convertTimeHMS = (s) => {
    let h = Math.floor(s / 3600); //Get whole hours
    s -= h * 3600;
    let m = Math.floor(s / 60); //Get remaining minutes
    s -= m * 60;
    return h + ":" + (m < 10 ? '0' + m : m) + ":" + (s < 10 ? '0' + s : s); //zero padding on minutes and seconds
}

// From here checking to add the excel
function prepareTable(DateFeild) {
    let MergeColumnEmpCode, MergeColumnDate ;
    var appendData = "",
        header = "",
        header = '<html><h2 style="text-align:center;"></h2>';

    appendData += '<table><tbody>';

    let downloadHeaderSelected = $('.downloadCheckbox:checked,.downloadCheckboxes:checked').map(function () {
        return $(this).val();
    }).get();
    let Time_header = downloadHeaderSelected.includes('T_minutes') ? TABLE_HEADER_ATTENDANCE.Min : TABLE_HEADER_ATTENDANCE.Hr;
    appendData += `<tr>`;
    appendData += `<td>${TABLE_HEADER_DOWNLOAD.name}</td>`;
    if (downloadHeaderSelected.includes('Email')) appendData += `<td>${TABLE_HEADER_DOWNLOAD.Email_id}</td>`;
    if (downloadHeaderSelected.includes('EmpCode')) appendData += `<td>${TABLE_HEADER_DOWNLOAD.employeeCode}</td>`;
    appendData += `<td>${TABLE_HEADER_DOWNLOAD.date}</td>`;
    appendData += `<td>${EXPORT_WITH_HEADER.computeName}</td>`;
    if (downloadHeaderSelected.includes('ClockIn') && !(downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))) appendData += `<td>${TABLE_HEADER_DOWNLOAD.clockin}</td>`;
    if (downloadHeaderSelected.includes('ClockOut') && !(downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))) appendData += `<td>${TABLE_HEADER_DOWNLOAD.clockout}</td>`;
    if(checkEnvPermissionIP){
      if (downloadHeaderSelected.includes('CheckInIp') && !(downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))) appendData += `<td>${TABLE_HEADER_DOWNLOAD.checkInIp}</td>`;
      if (downloadHeaderSelected.includes('CheckOutIp') && !(downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))) appendData += `<td>${TABLE_HEADER_DOWNLOAD.checkOutIp}</td>`;
    }
    if (downloadHeaderSelected.includes('Location')) appendData += `<td>${TABLE_HEADER_DOWNLOAD.location}</td>`;
    if (downloadHeaderSelected.includes('Department')) appendData += `<td>${TABLE_HEADER_DOWNLOAD.department}</td>`;
    if (downloadHeaderSelected.includes('LoggedInIP')) appendData += `<td style="width: 90px;">${TABLE_HEADER_DOWNLOAD.LoggedInIP} </td>`;
    if (downloadHeaderSelected.includes('TotalHour')) appendData += `<td style="width: 90px;">${TABLE_HEADER_ATTENDANCE.total} ${TABLE_HEADER_ATTENDANCE.total_time}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('OfficeTime')) appendData += `<td style="width: 90px;">${TABLE_HEADER_ATTENDANCE.officeHours} ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('ActiveHour')) appendData += `<td style="width: 90px;">${TABLE_HEADER_ATTENDANCE.activeHours} ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('Productive')) appendData += `<td  class="text-success">${TABLE_HEADER_DOWNLOAD.productive}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('Unproductive')) appendData += `<td class="text-danger">${TABLE_HEADER_DOWNLOAD.unProdHour}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('Neutral')) appendData += `<td class="text-secondary">${TABLE_HEADER_DOWNLOAD.neutral}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('IdleTime')) appendData += `<td class="text-warning">${TABLE_HEADER_DOWNLOAD.idles}  ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header}) </td>`;
    if (downloadHeaderSelected.includes('Offline')) appendData += `<td>${TABLE_HEADER_DOWNLOAD.offline}  ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('Break'))  appendData += `<td>${TABLE_HEADER_DOWNLOAD.break}  ${TABLE_HEADER_ATTENDANCE.Time}(${Time_header})</td>`;
    if (downloadHeaderSelected.includes('Productivity')) appendData += ` <td class="text-primary">${TABLE_HEADER_DOWNLOAD.productivity} %</td>`;
    if (downloadHeaderSelected.includes('Manager_List')) appendData += ` <td class="text-primary">${TABLE_HEADER_DOWNLOAD.assignedList} </td>`;
    appendData += ` </tr>`;

    let recordPresent = 0;

    COMPLETE_RECORD_DATA.forEach(function (attHistory) {
        recordPresent = 0;
        let break_duration = attHistory.break_duration !== null ? `${String(Math.floor(attHistory.break_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.break_duration).format(':mm:ss')}` : Employee_Absent;
        let computer_activity = attHistory.computer_activities_time !== null ? `${String(Math.floor(attHistory.computer_activities_time / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.computer_activities_time).format(':mm:ss')}` : Employee_Absent;
        let idle_duration = attHistory.idle_duration !== null ? `${String(Math.floor(attHistory.idle_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.idle_duration).format(':mm:ss')}` : Employee_Absent;
        let neutral_duration = attHistory.neutral_duration !== null ? `${String(Math.floor(attHistory.neutral_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.neutral_duration).format(':mm:ss')}` : Employee_Absent;
        let non_productive_duration = attHistory.non_productive_duration !== null ? `${String(Math.floor(attHistory.non_productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.non_productive_duration).format(':mm:ss')}` : Employee_Absent;
        let office_time = attHistory.office_time !== null ? `${String(Math.floor(attHistory.office_time / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.office_time).format(':mm:ss')}` : Employee_Absent;
        let productive_duration = attHistory.productive_duration !== null ? `${String(Math.floor(attHistory.productive_duration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.productive_duration).format(':mm:ss')}` : Employee_Absent;
        let total_time = attHistory.total_time !== null ? `${String(Math.floor(attHistory.total_time / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(attHistory.total_time).format(':mm:ss')}` : Employee_Absent;
        let offline_time = attHistory.offline !== null ? `${String(Math.floor((Math.abs(attHistory.offline)) / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(Math.abs(attHistory.offline)).format(':mm:ss')}` : Employee_Absent;
        let offline_hours = attHistory.offline !== null ? (attHistory.offline < 0) ? '-' + offline_time : offline_time : Employee_Absent;
        // let offline_hours_text = envAdminIds.includes(Number(adminId)) ? '<td style="text-align:center">' + offline_hours + '</td>' : '';
        let offline_hours_text = attHistory.offline !== null ? '<td style="text-align:center">' + offline_hours + '</td>' : Employee_Absent;
        let  start_time = attHistory.start_time !== null ? moment(attHistory.start_time).tz(attHistory.timezone).format('DD-MM-YYYY HH:mm:ss') : Employee_Absent;
        let  end_time = attHistory.end_time !== null ? moment(attHistory.end_time).tz(attHistory.timezone).format('DD-MM-YYYY HH:mm:ss') : Employee_Absent;
        let emails = ((attHistory.email == null) || (attHistory.email == "null")) ? '-' : attHistory.email;
        // let productivityPercentage = envAdminIds.includes(Number(adminId)) ? ((attHistory.productive_duration / 30600) * 100).toFixed(2) : attHistory.productivity.toFixed(2);
        let responseDate =  attHistory.date !== undefined ? typeof (attHistory.date) === "string" ? attHistory.date : attHistory.date[0] : attHistory.start_time.split("T")[0];

        if (responseDate == DateFeild) {
            recordPresent = 1;
            if ((MergeColumnEmpCode !== attHistory.emp_code && MergeColumnEmpCode !== attHistory.date) || response.mergeColumns) {
                appendData += '<tr attendanceId="' + attHistory.attendance_id + '" id="' + attHistory.id + '" ><td><a title="View Full Details" href="get-employee-details?id=' + attHistory.id + '">' + attHistory.first_name + ' ' + attHistory.last_name + ' </a></td>';
                if (downloadHeaderSelected.includes('Email')) appendData += '<td style="width: 90px;">' + emails + '</td>';
                if (downloadHeaderSelected.includes('EmpCode')) appendData += '<td style="width: 90px;">' + attHistory.emp_code + '</td>';
                attHistory.date !== undefined ? typeof (attHistory.date) === "string" ? appendData += '<td style="text-align:center">' + attHistory.date + '</td>' : appendData += '<td style="text-align:center">' + attHistory.date[0] + '</td>' : appendData += '<td style="text-align:center">' + attHistory.start_time.split("T")[0] + '</td>';
            } else {
                appendData += '<tr><td></td>';
                if (downloadHeaderSelected.includes('Email')) appendData += '<td style="width: 90px;"></td>';
                if (downloadHeaderSelected.includes('EmpCode')) appendData += '<td style="width: 90px;"></td>';
                attHistory.date !== undefined ? typeof (attHistory.date) === "string" ? appendData += '<td style="text-align:center"></td>' : appendData += '<td style="text-align:center"></td>' : appendData += '<td style="text-align:center"></td>';
            }
            if (MergeColumnEmpCode !== attHistory.emp_code) MergeColumnEmpCode = attHistory.emp_code;
            if (MergeColumnEmpCode !== attHistory.date) MergeColumnDate = attHistory.date;
            if (downloadHeaderSelected.includes('ClockIn') && !(downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))) appendData += attHistory.start_time !== null ? '<td style="width: 90px;">' + start_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('ClockOut') && !(downloadHeaderSelected.includes('Average_employee') || downloadHeaderSelected.includes('Total_Average_employee'))) appendData += attHistory.end_time !== null ? '<td style="width: 90px;">' + end_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if(checkEnvPermissionIP){
                if (downloadHeaderSelected.includes('CheckInIp')) appendData += '<td style="text-align:center">' + attHistory?.details?.checkInIp.replace(',35.201.73.5', '') + '</td>';
                if (downloadHeaderSelected.includes('CheckOutIp')) appendData += '<td style="text-align:center">' + attHistory?.details?.checkOutIp.replace(',35.201.73.5', '') + '</td>';
             }
            appendData += attHistory.computer_name === null ? '<td style="text-align:center">--</td>' :  '<td style="text-align:center">' + attHistory.computer_name + '</td>';
            if (downloadHeaderSelected.includes('Location')) appendData += '<td style="text-align:center">' + attHistory.location + '</td>';
            if (downloadHeaderSelected.includes('Department')) appendData += '<td style="text-align:center">' + attHistory.department + '</td>';
            if (downloadHeaderSelected.includes('LoggedInIP')) appendData +=  attHistory.details !== undefined && attHistory.details !== null  ?  '<td style="text-align:center">' + attHistory?.details?.checkInIp + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('TotalHour')) appendData += attHistory.total_time !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.total_time)) + '</td>' : '<td style="text-align:center">' + total_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('OfficeTime')) appendData += attHistory.office_time !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.office_time)) + '</td>' : '<td style="text-align:center">' + office_time + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('ActiveHour')) appendData += attHistory.computer_activities_time !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.computer_activities_time)) + '</td>' : '<td style="text-align:center">' + computer_activity + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('Productive')) appendData += attHistory.productive_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td class="text-success" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.productive_duration)) + '</td>' : '<td class="text-success" style="text-align:center">' + productive_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('Unproductive')) appendData += attHistory.non_productive_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td class="text-danger" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.non_productive_duration)) + '</td>' : '<td class="text-danger" style="text-align:center">' + non_productive_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('Neutral')) appendData += attHistory.neutral_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td class="text-secondary" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.neutral_duration)) + '</td>' : '<td class="text-secondary" style="text-align:center">' + neutral_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('IdleTime')) appendData += attHistory.idle_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td  class="text-warning" style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.idle_duration)) + '</td>' : '<td  class="text-warning" style="text-align:center">' + idle_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('Offline')) appendData += attHistory.offline !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td style="text-align:center">' + convertSecToMMAndSS(parseInt(attHistory.offline)) + '</td>' : '<td style="text-align:center">' + offline_hours + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            // '<td>' + break_duration + '</td>' +
                if (downloadHeaderSelected.includes('Break')) appendData += attHistory.break_duration !== null ? downloadHeaderSelected.includes('T_minutes') ? '<td>' + convertSecToMMAndSS(parseInt(attHistory.break_duration)) + '</td>' : '<td>' + break_duration + '</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('Productivity')) appendData += attHistory.productivity !== null ? '<td class="text-primary" style="text-align:center">' + attHistory.productivity.toFixed(2) + '%</td>' : '<td style="text-align:center">' + Employee_Absent + '</td>';
            if (downloadHeaderSelected.includes('Manager_List')) appendData += attHistory.AssignedTo !== null ? '<td class="text-primary" style="text-align:center">' + attHistory.AssignedTo + '</td>' : '<td style="text-align:center"></td>';
            appendData += '</tr>';
        }
    });
    appendData += '</tbody></table></html>';
    return header + appendData;
}

// To make the split sheets in excel format based on date
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

// To make excel sheet
function MakeSplitExcel() {
    var blob,
        wb = {SheetNames: [], Sheets: {}};
    var start = new Date(from),
        end = new Date(to),
        currentDate = new Date(start.getTime()),
        between = [];

    while (currentDate <= end) {
        between.push(new Date(currentDate));
        var ws1 = XLSX.read(prepareTable(moment(currentDate).format('YYYY-MM-DD')), {type: "binary"}).Sheets.Sheet1;
        let arrayExcelData = ["A1", "B1", "C1", "D1", "E1", "F1", "G1", "H1", "I1", "J1", "K1", "L1", "M1", "N1", "O1", "P1", "Q1", "R1", "S1", "T1", "U1", "V1", "W1", "X1", "Y1", "Z1"];
        if (!arrayExcelData.includes(ws1['!ref'].split(':')[1])) {
            wb.SheetNames.push(downloadFileName + " " + moment(currentDate).format('YYYY-MM-DD'));
            wb.Sheets[downloadFileName + " " + moment(currentDate).format('YYYY-MM-DD')] = ws1;
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    blob = new Blob([s2ab(XLSX.write(wb, {bookType: 'xlsx', type: 'binary'}))], {
        type: "application/octet-stream"
    });

    saveAs(blob, downloadFileName + ".xlsx");
    $('#cover-spin').hide();
}

// function to realate the time_in total, average  and absent
//At a time any one only applicable while download
// Id  1->total time , 2-> average , 3-> absent
let applyOneFeature = Id => {
    switch (Id) {
        case 1 :
            $("#Average_employeeCheckbox").prop('checked') ? ($("#Total_Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox").prop('checked', false), $("#Total_Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox").attr('disabled', true))
                : ($("#Total_Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox").prop('checked', false), $("#Total_Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox").attr('disabled', false));
            break;
        case 2 :
            $("#Total_Average_employeeCheckbox").prop('checked') ? ($("#Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").prop('checked', false), $("#Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").attr('disabled', true))
                : ($("#Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").prop('checked', false), $("#Average_employeeCheckbox, #Split_Excel_ListCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").attr('disabled', false));
            break;
        case 3 :
            setTimeout(() => {
                $("#checklocDownload").prop('checked') ? ($("#Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").prop('checked', false), $("#Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").attr('disabled', true))
                    : ($("#Average_employeeCheckbox, #Total_Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").prop('checked', false), $("#Average_employeeCheckbox, #ClockInCheckbox, #ClockOutCheckbox, #Split_Excel_ListCheckbox").attr('disabled', false));
            }, 100);
            break;
        default :
            ($("#Total_Average_employeeCheckbox,#Average_employeeCheckbox, #Split_Excel_ListCheckbox, #ClockInCheckbox, #ClockOutCheckbox").prop('checked', false), $("#Total_Average_employeeCheckbox, #Average_employeeCheckbox, #Split_Excel_ListCheckbox, #ClockInCheckbox, #ClockOutCheckbox").attr('disabled', false));
    }
};


$(document).mouseup(function(e){
    var dropdown = $("#mytimesheetdataDownload");
    var checkbox =$("#checklocDownload");

    if(!dropdown.is(e.target) && dropdown.has(e.target).length === 0 ){
        dropdown.hide();
    }
    else if (dropdown.is(e.target) && (dropdown.has(e.target) && (checkbox.is(e.target)))){
        if (checkbox.prop('checked')) {
            dropdown.show();
            checkbox.prop('checked',true);
                } else {
                    checkbox.prop('checked', false);
                }
    }
    // else (dropdown.checked)
    // {
    //     $("#checklocDownload").prop('checked',false);
    // }


});
function downloadTimeSheetCsvPdf(type){
    var SelectedfromDate = new Date(from).toISOString();
    var SelectedtoDate = new Date(to).toISOString();
    $.ajax({
        type: "get",
        url: '/' + userType + "/get-timesheet-pdf",
        data: {locID,deptID,userID,SelectedfromDate,SelectedtoDate},
        success: function (response) {
         if(response.code!==200) return errorHandler("No Data Found");
          if(type==1) TimeSheetPdf(response.data);
          if(type==2) TimeSheetCsv(response.data);
        },
    });
}
function TimeSheetCsv(data){
    if(data.length==0) return errorHandler("No Data Found");
    const csv = [
        [SILAH_PDFCSV.name, SILAH_PDFCSV.id, SILAH_PDFCSV.check_in_time, SILAH_PDFCSV.check_out_time, SILAH_PDFCSV.total_no_of_hours]
    ];
    data.forEach(ele => {
        let totalSeconds = Math.floor(moment(ele.end_time).diff(moment(ele.start_time), 'seconds'));
        csv.push([
            `${ele.first_name} ${ele.last_name}`,
            ele.emp_code,
            moment(ele.start_time).format('YYYY-MM-DD HH:mm:ss'),
            moment(ele.end_time).format('YYYY-MM-DD HH:mm:ss'),
            moment.utc(totalSeconds * 1000).format("H [hrs] m [min] s [sec]"),
        ]);
    });
    $('#cover-spin').hide();
    const filename = window.Custom_translations.timesheets + '.xlsx';
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Time Sheet');
    worksheet.addRows(csv);
    const headerStyle = {
      font: {
        bold: true,
        color: { argb: 'FFFFFFFF' }
      },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' }
      },
      alignment: {
        vertical: 'middle',
        horizontal: 'center'
      }
    };
    worksheet.getRow(1).eachCell((cell) => {
      cell.style = headerStyle;
    });
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
    });
}
async function TimeSheetPdf(data) {
   if(data.length==0) return errorHandler("No Data Found");
    const parsedUrl = new URL(window.location.href);
   const domineName = `${parsedUrl.host}`;
    const doc = new jsPDF('landscape', 'pt', 'a4');
    var startDate = new Date(from).toLocaleDateString();
    var endDate = new Date(to).toLocaleDateString();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const addFooterAndLogo = (currentPage, totalPages) => {
        doc.addImage(silahCheckCircle, 'PNG', 10, pageHeight - 42, 36, 36);
        const pageText = `${currentPage}` ;
        doc.setFontSize(15);
        doc.setTextColor(12, 12, 12);
        doc.text(`${pageText}`+SILAH_PDFCSV.page, 48,pageHeight - 20);
        doc.setFontSize(16);
        const dateRangeTextWidth = doc.getTextWidth(SILAH_PDFCSV.all_report_automatically);
        if (language_ar == "ar") {
            doc.setFont('Tajawal');
            doc.text(SILAH_PDFCSV.all_report_automatically, (pageWidth - dateRangeTextWidth) / 2, pageHeight - 30, {  direction: 'rtl' });
        } else {
            doc.text(SILAH_PDFCSV.all_report_automatically, (pageWidth - dateRangeTextWidth) / 2, pageHeight - 30, );
        }
        doc.setFontSize(12);
        doc.setTextColor(12, 12, 12);
        doc.text(pageText, 48,pageHeight - 20);
        // Add the clickable link
        const linkText = domineName;
        const textWidth = doc.getTextWidth(linkText);
        const xPosition = (pageWidth - textWidth) / 2;
        doc.setTextColor(204, 0, 0);
        doc.textWithLink(
            linkText,
            xPosition, // Centered X-coordinate
            pageHeight - 15, // Y-coordinate
            { url: domineName }
        );
    };
    let silahCheckCircle = new Image();
    silahCheckCircle.src = ALERTS_LOGO ;
    try {
        doc.setLineWidth(2);
        doc.setDrawColor(0, 0, 0);
        doc.line(0, 61, 400, 61);
      doc.addImage(silahCheckCircle, 'PNG', 700, 20, 82,82);
        var TajawalFont = await getTajawalFont();
        doc.addFileToVFS('Tajawal-Regular-normal.ttf', TajawalFont);
        doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', 'normal');
        doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', 'bold');
        doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', "italic");
        doc.addFont('Tajawal-Regular-normal.ttf', 'Tajawal', "bolditalic");
      doc.setFontSize(25);
      doc.setTextColor(12, 12, 12);
    if (language_ar == "ar") {
        doc.setFont('Tajawal');
        doc.text(SILAH_PDFCSV.report_date_range, 700, 54, { align: 'right', direction: 'rtl' });
    } else {
        doc.text(SILAH_PDFCSV.report_date_range, 700, 54, { align: 'right' });
    }
      doc.setFontSize(23);
      doc.setTextColor(204, 0, 0);
    if (language_ar == "ar") {
        doc.setFont('Tajawal');
        doc.text(SILAH_PDFCSV.time_sheet_report, 700, 84, { align: 'right', direction: 'rtl' });
    } else {
        doc.text(SILAH_PDFCSV.time_sheet_report, 700, 84, { align: 'right' });
    }
      doc.setFillColor(204, 0, 0);
      doc.roundedRect(70, 130, pageWidth - 140, 70, 1, 1, 'F');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
    if (language_ar == "ar") {
        doc.setFont('Tajawal');
        doc.text(SILAH_PDFCSV.report_date_range, pageWidth - 80, 150, { align: 'right', direction: 'rtl' });
    } else {
        doc.text(SILAH_PDFCSV.report_date_range, pageWidth - 80, 150, { align: 'right' });
    }
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text(
        ':',
        pageWidth - 320,
        150,
        { align: 'right' }
      );
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(`${startDate} - ${endDate}`, pageWidth - 350, 150, { align: 'right' });
      doc.setFontSize(20);
      doc.setTextColor(255, 255, 255);
      doc.text(
        ':',
        pageWidth - 320,
        180,
        { align: 'right' }
      );
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text(String(new Set(data.map(item => item.employee_id)).size), pageWidth - 350, 180, { align: 'right' });
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
    if (language_ar == "ar") {
        doc.setFont('Tajawal');
        doc.text(SILAH_PDFCSV.no_of_employee_report, pageWidth - 80, 180, { align: 'right', direction: 'rtl' });
    } else {
        doc.text(SILAH_PDFCSV.no_of_employee_report, pageWidth - 80, 180, { align: 'right' });
    }
      const StartY = 250;
      doc.setFillColor(204, 0, 0);
      doc.setDrawColor(0, 0, 0);
      doc.rect(20, 220, pageWidth-70, 30, 'FD');
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
    if (language_ar == "ar") {
        doc.setFont('Tajawal');
        doc.text(SILAH_PDFCSV.table, pageWidth/2, 239, { align: 'center', direction: 'rtl' });
    } else {
        doc.text(SILAH_PDFCSV.table, pageWidth/2, 239, { align: 'center' });
    }
    let bodyData = data.map((ele) => {
        let totalSeconds = Math.floor(moment(ele.end_time).diff(moment(ele.start_time), 'seconds'));
        return [
            moment.utc(totalSeconds * 1000).format("H [hrs] m [min] s [sec]"),
            moment(ele.end_time).format('YYYY-MM-DD HH:mm:ss'),
            moment(ele.start_time).format('YYYY-MM-DD HH:mm:ss'),
            moment(ele.start_time).format('YYYY-MM-DD'),
            ele.emp_code,
            `${ele.first_name} ${ele.last_name}`
        ];
    });
        const tableData = [SILAH_PDFCSV.total_no_of_hours,SILAH_PDFCSV.check_out_time,SILAH_PDFCSV.check_in_time,SILAH_PDFCSV.date_of_the_day,SILAH_PDFCSV.id,SILAH_PDFCSV.name]

        doc.autoTable({
          head: [tableData],
          body: bodyData,
          startY: StartY,
          theme: 'grid',
          bodyStyles: {lineColor: [0, 0, 0],lineWidth:1},halign: language_ar == "ar" ? "right" : "center",
          tableWidth: 770,
          margin: { left: 20 },
          styles: {
            font: "Tajawal",
            textDirection: language_ar === "ar" ? "rtl" : "ltr",
            halign: language_ar === "ar" ? "right" : "center",
        },
          headStyles: {
              fillColor: [204, 0, 0],
              textColor: [255, 255, 255],
              fontSize: 9,
              lineColor: [0, 0, 0],
              lineWidth:1,
              minCellHeight: 30,halign: language_ar == "ar" ? "right" : "center",
            },
            columnStyles: {
              0: {cellWidth: 'auto'},
              1: {cellWidth: 'auto'},
              2: {cellWidth: 'auto'},
              3: {cellWidth: 'auto'},
              4: {cellWidth: 'auto'},
              5: {cellWidth: 'auto'},
            },
            didDrawPage: function (data) {
                const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
                const totalPages = doc.internal.getNumberOfPages();
                addFooterAndLogo(currentPage, totalPages);
            },
        });
      doc.save(window.Custom_translations.timesheets+'.pdf');
    } catch (error) {
      console.error('Error while creating PDF:', error);
    }
}
