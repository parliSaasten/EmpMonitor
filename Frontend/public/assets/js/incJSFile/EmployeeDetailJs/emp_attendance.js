//Global variables
let SELECTED_DATE = null;
let SELECTED_DAYS_DATE = null;
let SELECTED_LOCATION;
let SELECTED_DEPARTEMENT;
let TABLE_HEADER = true;
//for datatable variables
let SHOW_ENTRIES = "10";
let TOTAL_COUNT_EMAILS;  // total count of users
let PAGE_COUNT_CALL = true;
let SORT_NAME = '';
let SORT_ORDER = '';
let SORTED_TAG_ID = '';

$(document).ready(function () {
    $("#EmployeedateOfjoin").val($("#TodayDate").attr('name'));
    SELECTED_LOCATION = $("#LocationData").children(":selected").attr('id');
    SELECTED_DEPARTEMENT = $("#DepartementData").children(":selected").attr('id');
    $('.table-condensed tbody tr:nth-child(2) td').html("05/2020");
    EmployeeAttendanceList(SELECTED_DATE, $("#LocationData").children(":selected").attr('id'), $("#DepartementData").children(":selected").attr('id'), SHOW_ENTRIES, "", "", SORT_NAME, SORT_ORDER, 0);

})

//location onchange function
$("#LocationData").on("change", function () {
    makeDatatableDefault();
    SELECTED_LOCATION = $(this).children(":selected").attr('id');
    SELECTED_DEPARTEMENT = null;
    EmployeeAttendanceList(SELECTED_DATE, $(this).children(":selected").attr('id'), "", SHOW_ENTRIES, "", "", SORT_NAME, SORT_ORDER, 0);
    getDepartments($(this).children(":selected").attr('id'));
});

// function for getting departements in edit form
function getDepartments(LocationId) {
    let location = 0;
    if (LocationId == "" || LocationId == 0) {
        location = 0;
    } else location = LocationId;
    $.ajax({
        type: "get",
        url: "/" + userType + '/get-department-by-location',
        data: {id: location},
        beforeSend: function () {
        },
        success: function (response) {
            let departmentsDropdown = '';
            if (response.code == 200) {
                let departmentsData = response.data;
                departmentsDropdown += '<option value="null" id=null>All Departments</option>';

                if (departmentsData[0].id) {
                    for (let i = 0; i < departmentsData.length; i++) {
                        departmentsDropdown += '<option id="' + departmentsData[i].department_id + '"> ' + departmentsData[i].name + '</option>';
                    }
                } else {
                    for (let i = 0; i < departmentsData.length; i++) {
                        departmentsDropdown += '<option  id="' + departmentsData[i].department_id + '"> ' + departmentsData[i].name + '</option>';
                    }
                }
                $('#DepartementData').empty();
                $('#DepartementData').append(departmentsDropdown);
            } else if (response.code == 201) {
                $('#departmentsAppend').empty();
                $('#Empedit_departments').empty();
            } else {
                departmentsDropdown += '<option >' + response.msg + '</option>';
                $('#DepartementData').empty();
                $('#DepartementData').append(departmentsDropdown);
            }
        },
        error: function () {
            errorSwal()
        }
    });
}

//onchange for departement
$("#DepartementData").on("change", function () {
    makeDatatableDefault();
    SELECTED_DEPARTEMENT = $(this).children(':selected').attr('id');
    EmployeeAttendanceList(SELECTED_DATE, SELECTED_LOCATION, $(this).children(":selected").attr('id'), SHOW_ENTRIES, "", "", SORT_NAME, SORT_ORDER, 0);
});

//getting employee attendence list based on filter
function EmployeeAttendanceList(date, LocationId, DepartmentId, limit, skip, searhcText, sortName, sortOrder, excel) {
    let route = excel !==1 ?'/attendance-list-employees' : '/attendance-list-employees-download';
    $.ajax({
        url: "/" + userType + route ,
        type: "post",
        data: {date, LocationId, DepartmentId, limit, skip, searhcText, sortName, sortOrder},
        beforeSend: function () {
            $("#ErrorMessage").html("");
            if (excel != 1) {
                $("#AttendanceListData").empty();
                $("#DownloadButton").attr("disabled", true);
                $("#loader").css('display', 'block');
            } else {
                $("#DownloadButton").attr("disabled", true);
                $("#DownloadButton").html("Loading...")
            }
        },
        success: function (response) {
            $("#DownloadButton").attr("disabled", false);
            $("#loader").css('display', 'none');
            $("#ErrorMessage").css('display', 'none');
            $("#ErrorMessage").html("");
            $("#tableRemove").css('display', 'block');
            if (excel === 1) {
                DownloadSheet(response);
                return false;
            }
            // COMPLETE_USERS_DATA = response;
            if (response.code === 200 && response.data.length !== 0) {
                let AppendHeader = '', AppendTR = '';
                let data = response.data;
                let year = (SELECTED_DAYS_DATE != null) ? SELECTED_DAYS_DATE.split("/")[1] : new Date().getFullYear();
                let month = (SELECTED_DAYS_DATE != null) ? parseInt(SELECTED_DAYS_DATE.split("/")[0]) - 1 : new Date().getMonth();
                if (TABLE_HEADER === true) {
                    AppendHeader +=
                        '<tr><th class="sticky-col-one"><b><label class="mb-0 w-100"><a onclick="sort(\'name\',\'NameSort\')">' + EMPLOYEE_MSG + ' ' + EMPLOYEE_NAME_MSG + '</a><span class="float-right"><i id="NameSort" class="fas fa-long-arrow-alt-up text-light"></i> </span></b></label></th>' +
                        '<th class="sticky-col-two"><b><label class="mb-0 w-100"><a onclick="sort(\'location\',\'LocationSort\')">' + LOCATION_MSG + '</a><span class="float-right"><i id="LocationSort" class="fas fa-long-arrow-alt-up text-light"></i> </span></b></label></th>' +
                        '<th class="sticky-col-three"><b><label class="mb-0 w-100"><a onclick="sort(\'department\',\'DepartmentSort\')">' + DEPARTMENT_MSG + '</a><span class="float-right"><i id="DepartmentSort" class="fas fa-long-arrow-alt-up text-light"></i> </span></b></label></th>' +
                        '<th class="sticky-col-four"><b><label class="mb-0 w-100"><a onclick="sort(\'emp_code\',\'EmpCodeSort\')">' + EMPLOYEE_MSG + ' ' + EMPLOYEE_CODE_MSG + '</a><span class="float-right"><i id="EmpCodeSort" class="fas fa-long-arrow-alt-up text-light"></i> </span></b></label></th>';
                    let date = new Date(year, month, 1);
                    let i = 1;
                    while (date.getMonth() == month) {
                        AppendHeader += '<th><b>' + i + " " + weekDays(date) + '</b></th>';
                        date.setDate(date.getDate() + 1);
                        i++;
                    }
                    AppendHeader += '<th> '+ attendance_local.P +'<span class=""><i class="fas fa-info-circle " title="' + EMP_ATTENDANCE_JS.Total_present_count + '"></i></span></th>' +
                        '<th >'+ attendance_local.L +'<span class=""><i class="fas fa-info-circle " title="' + EMP_ATTENDANCE_JS.Total_late_count + '"></i></th>' +
                        '<th >'+ attendance_local.H +'<span class=""><i class="fas fa-info-circle" title="' + EMP_ATTENDANCE_JS.Total_half_count + '"></i></th>' +
                        '<th >'+ attendance_local.A +' <span class=""><i class="fas fa-info-circle" title="' + EMP_ATTENDANCE_JS.Total_absent_count + '"></i></th>' +
                        '<th>'+ attendance_local.O +'<span class=""><i class="fas fa-info-circle " title="' + EMP_ATTENDANCE_JS.Total_overtime_count + '"></i></th>' +
                        '<th>'+ attendance_local.D +'<span class=""><i class="fas fa-info-circle " title="' + EMP_ATTENDANCE_JS.Total_day_off_count + '"></i></th>' +
                        '<th>'+ attendance_local.EL +'<span class=""><i class="fas fa-info-circle " title="' + EMP_ATTENDANCE_JS.early_logout + '"></i></th></tr>';
                    $("#AppendHeader").append(AppendHeader);
                    TABLE_HEADER = false;
                }
                $.each(response.data, (i) => {
                    if (i !== 'empCount' && i !== 'pageCount') {
                        $.each(response.data[i], (key, val, param) => {
                            AppendTR += '<tr>';
                            let data = response.data[i][key];
                            AppendTR += '<td class="sticky-col-one"><a title="' + data.first_name + " " + data.last_name + ' ' + EMPLOYEE_DETAILS_CONST.ViewDetails + '" href="get-employee-details?id=' + data.id + '"}>' + data.first_name + " " + data.last_name + '</a></td>' +
                                '<td class="sticky-col-two">' + data.location + '</td>' +
                                '<td class="sticky-col-three">' + data.departament + '</td>' +
                                '<td class="sticky-col-four">' + data.emp_code + '</td>';
                            if (typeof (data.date) == "object") {
                                $.each(data.date, (key, value) => {
                                    if ((!value.isWorkDay) && value.log.overtime) {
                                        AppendTR += `<td class="text-center"> ${attendance_local.D}/${attendance_local.O}</td>`;
                                    } else {
                                        AppendTR += '<td class="text-center">' + attendance_local[value.log.marker] + '</td>';
                                    }
                                });
                            } else {
                                let dateNew = new Date(year, month, 1);
                                while (dateNew.getMonth() == month) {
                                    AppendTR += '<td class="text-center">-</td>';
                                    dateNew.setDate(dateNew.getDate() + 1);
                                }
                            }
                            AppendTR += '<td>' + data.P + '</td><td>' + data.L + '</td><td>' + data.H + '</td><td>' + data.A + '</td><td>' + data.O + '</td><td>' + data.D + '</td><td>' + data.EL + '</td></tr>';
                        })
                    }
                });
                $("#AttendanceListData").append(AppendTR);
                if (PAGE_COUNT_CALL === true) {
                    TOTAL_COUNT_EMAILS = (parseInt(data.empCount));
                    paginationSetup();
                    TOTAL_COUNT_EMAILS < SHOW_ENTRIES ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 1 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + TOTAL_COUNT_EMAILS + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS)
                        : $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 1 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + SHOW_ENTRIES + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS);
                }

            } else {
                TOTAL_COUNT_EMAILS = 0;
                $('#AttendanceListData').append("<tr style='text-align:center;'> <td colspan='12' >"+ noData +" !</td></tr>");
                $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 0 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + 0 + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + 0);
                paginationSetup();
            }
            $("#SearchButton").attr('disabled', false);
        },
        error: function (jqXHR) {
            if(jqXHR.status == 410 ){
                $("#UnaccessModal").empty();
                $("#UnaccessModal").css('display','block');
                $("#UnaccessModal").append('<div class="alert alert-danger text-center"><button type="button" class="close" data-dismiss="alert" >&times;</button><b  id="ErrorMsgForUnaccess"> '+jqXHR.responseJSON.error+'</b></div>')
            }
            //    error swal
            $("#loader").css('display', 'none');
            TOTAL_COUNT_EMAILS = 0;
            $('#AttendanceListData').append("<tr style='text-align:center;'> <td colspan='12' >"+ noData +"</td></tr>");
            $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 0 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + 0 + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + 0);
            paginationSetup();
            $("#SearchButton").attr('disabled', false);
        }
    })
}

//to download the attendance list in the form of sheet
let CallAjaxToGetAllData = () => {
    EmployeeAttendanceList(SELECTED_DATE, SELECTED_LOCATION, SELECTED_DEPARTEMENT, "", "", $("#SearchTextField").val(), "", "", 1);
}

function DownloadSheet(response) {
    if (response.code !== 200) {
        $("#ErrorMessage").html("");
        $("#ErrorMessage").css('display', 'inline');
        $("#DownloadButton").html(WEEK_DAYS_NAME.exportExcel);
        $("#DownloadButton").attr("disabled", false);
        return $("#ErrorMessage").html(response.msg);
    } else {
        let createXLSLFormatObj = [];
        let xlsHeader = [];
        let header = {};
        let headers = {};
        let xlsRows = [];

        xlsHeader.push(EMPLOYEE_MSG +' '+EMPLOYEE_NAME_MSG, LOCATION_MSG, DEPARTMENT_MSG, EMPLOYEE_MSG +' '+ EMPLOYEE_CODE_MSG);

        let year = (SELECTED_DAYS_DATE != null) ? SELECTED_DAYS_DATE.split("/")[1] : new Date().getFullYear();
        let month = (SELECTED_DAYS_DATE != null) ? parseInt(SELECTED_DAYS_DATE.split("/")[0]) - 1 : new Date().getMonth();
        if (response.code === 200 && response.data !== []) {
            let date = new Date(year, month, 1);
            let i = 1;
            while (date.getMonth() == month) {
                headers = i + "." + (new Date(date)).toString().split(' ')[0];
                xlsHeader.push(headers);
                date.setDate(date.getDate() + 1);
                i++;
            }
            xlsHeader.push("Present", "Late", "Half_leave", "Absent", "Overtime", "Day-Off");
            $.each(response.data, (i) => {
                if (i !== 'empCount' && i !== 'pageCount') {
                    $.each(response.data[i], (key, val) => {
                        let one = {};
                        let data = response.data[i][key];
                        one.Employee_Name = data.first_name + " " + data.last_name;
                        one.Location = data.location;
                        one.Department = data.departament;
                        one.Employee_Code = data.emp_code;

                        if (typeof (response.data[i][key].date) == "object") {
                            $.each(response.data[i][key].date, (key, value, i) => {
                                let field = key + "." + value.dayOfWeek;
                                one[field] = value.log.marker;
                            });
                        } else {
                            let i = 1;
                            let dateNew = new Date(year, month, 1);
                            while (dateNew.getMonth() == month) {
                                let field = i + "." + (new Date(dateNew)).toString().split(' ')[0];
                                one[field] = "-";
                                dateNew.setDate(dateNew.getDate() + 1);
                                i++;
                            }
                        }
                        one.P = data.P;
                        one.L = data.L;
                        one.H = data.H;
                        one.A = data.A;
                        one.O = data.O;
                        one.D = data.D;
                        xlsRows.push(one);
                    });
                }
            });
        }
        downloadExcels(createXLSLFormatObj, xlsHeader, xlsRows, $.datepicker.formatDate('MM_yy', new Date(year, month, 1)));
    }
    setTimeout(function () {
        $("#DownloadButton").html(WEEK_DAYS_NAME.exportExcel);
        $("#DownloadButton").attr("disabled", false);
    }, 100)
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

//call the function once on change of pagination
let CalledUserFunction = (skip, SearchText) => {
    EmployeeAttendanceList(SELECTED_DATE, SELECTED_LOCATION, SELECTED_DEPARTEMENT, SHOW_ENTRIES, skip, SearchText, SORT_NAME, SORT_ORDER, 0);
};

let weekDays = (date) => {
    switch (((new Date(date)).toString().split(' ')[0]).toLowerCase()) {
        case 'mon' :
            return WEEK_DAYS_NAME.mon;
        case 'tue' :
            return WEEK_DAYS_NAME.tue;
        case 'wed' :
            return WEEK_DAYS_NAME.wed;
        case 'thu' :
            return WEEK_DAYS_NAME.thu;
        case 'fri' :
            return WEEK_DAYS_NAME.fri;
        case 'sat' :
            return WEEK_DAYS_NAME.sat;
        case 'sun' :
            return WEEK_DAYS_NAME.sun;

    }
}
