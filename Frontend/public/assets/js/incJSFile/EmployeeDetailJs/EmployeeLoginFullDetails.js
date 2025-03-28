
function loadBrowserHistory() {
    $('#dateRange').show();
    $.ajax({
        type: "post",
        url: "/"+userType+'/get-browser-history-data',
        data: {data: `employee_id=${$('#userId').attr('value')}&startDate=${$('#from').val()}&endDate=${$('#to').val()}&skip=0&limit=9000`},

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
        error: function (error) {
            if (error.status === 410) {
                $('#BrowserHistory').empty();
                $('#BrowserHistory').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 40% " class="mt-5"><b>'+EMPLOYEE_FULL_DETAILS_ERROR.AccessDenied+' </b></p>');
            } else {
                return errorHandler(DASHBOARD_JS.error);
            }
            WEB_HISTORY_CHECK = false;
        }
    });
}

function loadAppHistory() {
    $('#dateRange').show();
    $.ajax({
        type: "post",
        url: "/"+userType+'/get-application-history-data',
        data: {data: `employee_id=${$('#userId').attr('value')}&startDate=${$('#from').val()}&endDate=${$('#to').val()}&skip=0&limit=9000`},

        beforeSend: function () {
            APP_HISTORY_CHECK = true;
            $('#applicationHistoryTableId').dataTable().fnClearTable();
            $('#applicationHistoryTableId').dataTable().fnDraw();
            $('#chartApp').empty();
            $('#appHistoryTable').empty();
            $('#appHistoryTable').append('<div  class="loader"></div>');
        },
        success: function (response) {
            return applicationHistoryData(response);
        },
        error: function (error) {
            APP_HISTORY_CHECK = false;
            if (error.status === 410) {
                $('#AppHistory').empty();
                $('#AppHistory').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 40% " class="mt-5"><b>'+EMPLOYEE_FULL_DETAILS_ERROR.AccessDenied+'</b></p>');
            } else {
                return errorHandler(DASHBOARD_JS.error);
            }
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



