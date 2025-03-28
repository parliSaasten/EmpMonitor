//Global variables
let LOCATION_ID = "";
let DEPARTMENT_ID = "";
let EMPLOYEE_ID = "";
let START_DATE = moment().subtract(29, 'days').format('YYYY-MM-DD');
let TO_DATE = moment().format('YYYY-MM-DD');
let CLIENT_ID = "";
let TYPE = 0;
let SHOW_ENTRIES = "10";
let MAIL_DATA;
let TOTAL_COUNT_EMAILS;
let PAGE_COUNT_CALL = true;

$(function () {
    let start = moment().subtract(29, 'days');
    let end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        START_DATE = start.format('YYYY-MM-DD');
        TO_DATE = end.format('YYYY-MM-DD');
        emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, 0, 0);
        emailMonitroGraph(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID);
    }

    $('#reportrange').daterangepicker({
        maxDate: end,
        startDate: start,
        endDate: end,
        ...dateRangeLocalization,
    }, cb);
    cb(start, end);

});

$(document).ready(function () {
    sessionStorage.setItem("LocationId", "");
    sessionStorage.setItem("RoleId", "");
    sessionStorage.setItem("DepartementId", "");
    UserList(LOCATION_ID, DEPARTMENT_ID);
});

//employee list with selected filters
let UserList = (loc, dept) => {
    $.ajax({
        url: "/" + userType + '/users-list',
        data: {Location: loc, Department: dept},
        type: "post",
        beforeSend: function () {
            $("#EmployeeData").empty();
            $("#EmployeeDiv").css('display', 'none');
        },
        success: function (response) {
            if (response.code == 200) {
                let data = response.data;
                $("#EmployeeData").append('<option id="">ALL</option>');
                response.data.map(user => {
                    $("#EmployeeData").append('<option id="' + user.id + '">' + user.first_name + '  ' + user.last_name + '</option>');
                })
            } else {
                //    error message should display
                $("#EmployeeData").append('<option selected disabled>No Data</option>');
                $("#EmployeeDiv").css('display', 'inline');
                $("#ErrorEmployee").html(response.msg);
            }
        },
        error: function () {
            // error message should be display
            $("#ErrorEmployee").html(DASHBOARD_JS_ERROR.reload);
        }
    })
}

// on change for Employee filtration
$("#EmployeeData").on("change", function () {
    makeDatatableDefault();
    EMPLOYEE_ID = $(this).find('option:selected').attr('id');
    emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, 0, 0);
    emailMonitroGraph(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID);
});

//on change function for the location filtration
$("#LocationAppend").on("change", function () {
    makeDatatableDefault();
    LOCATION_ID = $(this).find('option:selected').attr('id');
    emailMonitoring(LOCATION_ID, "", "", START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, 0, 0);
    emailMonitroGraph(LOCATION_ID, "", "", START_DATE, TO_DATE, CLIENT_ID);
    getDepartments($(this).find('option:selected').attr('id'), 1);
    UserList($(this).find('option:selected').attr('id'), "");
    PAGE_COUNT_CALL = true;
});

//on change of department append
$("#DepartmentAppend").on('change', function () {
    makeDatatableDefault();
    DEPARTMENT_ID = $(this).find('option:selected').val();
    UserList(LOCATION_ID, DEPARTMENT_ID);
    EMPLOYEE_ID = "";
    emailMonitoring(LOCATION_ID, DEPARTMENT_ID, "", START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, 0, 0);
    emailMonitroGraph(LOCATION_ID, DEPARTMENT_ID, "", START_DATE, TO_DATE, CLIENT_ID);
});

// on change for client id
$("#ClientData").on('change', function () {
    makeDatatableDefault();
    CLIENT_ID = $(this).val();
    emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, 0, 0);
    emailMonitroGraph(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID);
});

//function for get type either incoming messages or outgoing messages or both
let typeSelected = (selected) => {
    makeDatatableDefault();
    if (selected === 1) TYPE = 1;
    else if (selected === 2) TYPE = 2;
    else TYPE = 0;
    emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, TYPE, 0);
};

// the table of email monitoring..
let emailMonitoring = (loc, dept, empId, fromDate, ToDate, client, showEntries, type, skip, SearchText) => {
    $.ajax({
        url: "/" + userType + '/list-emails',
        type: "post",
        data: {
            Location: loc,
            Department: dept,
            EmployeeId: empId,
            FromDate: fromDate,
            ToDate: ToDate,
            Client: client,
            limit: showEntries,
            type: type,
            skip: skip,
            SearchText: SearchText
        },
        beforeSend: function () {
            $("#SearchErrorMsg").html("");
            $("#emailListAppend").empty();
            $("#emailListAppend").css('color', 'black');
            $("#SearchButton").attr('disabled', true);
            $("#SearchPdfMsg").html("");
            $("#loader").css('display', 'block');
        },
        success: function (response) {
            $("#loader").css('display', 'none');
            $("#SearchButton").attr('disabled', false);
            if (response.code == 200) {
                MAIL_DATA = response.data.messages;
                if (PAGE_COUNT_CALL === true) {
                    TOTAL_COUNT_EMAILS = response.data.totalCount;
                    paginationSetup();
                    (TOTAL_COUNT_EMAILS < SHOW_ENTRIES) ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' 1  to ' + TOTAL_COUNT_EMAILS + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS)
                        : $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' 1  to ' + SHOW_ENTRIES + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS);
                }
                // if(PAGE_COUNT_CALL===true)
                let AppendData = "";
                response.data.messages.map((data, i) => {
                    AppendData += '<tr>';
                    if (data.type == 2) AppendData += '<td>' + new Date(data.mail_time).toLocaleDateString() + ' ' + new Date(data.mail_time).toLocaleTimeString() + '<p class="mb-0"><i class="fas fa-envelope-open text-primary" title="Incoming Email"></i>' +
                        '</p></td>';
                    // '                               <a><i class="fas fa-envelope-open-text text-danger" onclick="bodyContent(' + i + ')" data-toggle="modal" data-target="#email_content" title="Read Email"></i></a> </p></td>';
                    else AppendData += '<td>' + new Date(data.mail_time).toLocaleDateString() + ' ' + new Date(data.mail_time).toLocaleTimeString() + '  <p class="mb-0"><i class="fas fa-external-link-alt text-info" title="Outgoing Email"></i>' +
                        '</p></td>';
                    // '            <a><i class="fas fa-envelope-open-text text-danger" onclick="bodyContent(' + i + ')" data-toggle="modal" data-target="#email_content" title="Read Email"></i></a></p></td>';
                    AppendData += '<td>' + data.name + '</td><td>' + data.computer + '</td><td>' + data.client_type + '</td><td>' + data.location_name + '</td>><td>' + data.department_name + '</td><td>' + data.from + '</td><td>' + data.to + '</td><td>' + data.attachments + '</td>' +
                        '<td>' + data.subject + '</td>';
                });

                $("#emailListAppend").append(AppendData);
            } else {
                $('.pagination').jqPagination('destroy');
                $("#emailListAppend").html(response.msg);
                $("#emailListAppend").css('color', 'red');
                $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 0 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + 0 + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + 0);
                MAIL_DATA = "";
                TOTAL_COUNT_EMAILS=0;
                paginationSetup();
            }
        },
        error: function () {
            $("#loader").css('display', 'none');
            $('.pagination').jqPagination('destroy');
            //    ERROR MESSAGE SHOULD BE ADDED
            $("#SearchButton").attr('disabled', false);
            $("#emailListAppend").html(DASHBOARD_JS_ERROR.reload)
            $("#emailListAppend").css('color', 'red');
        }
    })
};

//function for the email monitoring graph
let emailMonitroGraph = (loc, dept, empId, fromDate, ToDate, client) => {
    $.ajax({
        type: 'post',
        url: "/" + userType + '/emails-graph',
        data: {
            Location: loc,
            Department: dept,
            EmployeeId: empId,
            FromDate: fromDate,
            ToDate: ToDate,
            Client: client,
        },
        beforeSend: function () {
            $("#chartErrorMsg").css('display', 'none');
            $("#chartErrorMsg").html("");
        },
        success: function (response) {
            // Create chart instance
            if (response.code == 200) {
                am4core.useTheme(am4themes_animated);
                let chart = am4core.create("chartemail", am4charts.XYChart);
                chart.data = [];
                response.data.map((data) => {
                    let one = {};
                    one.Date = data.date;
                    one.Incoming = data.inComming;
                    one.Outgoing = data.outGoing;
                    chart.data.push(one);
                })
                // Create category axis
                let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
                categoryAxis.dataFields.category = "Date";

                // Create value axis
                let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
                valueAxis.title.text = "Email Count";

                // Create series
                let series1 = chart.series.push(new am4charts.LineSeries());
                series1.dataFields.valueY = "Outgoing";
                series1.dataFields.categoryX = "Date";
                series1.name = "Outgoing";
                series1.bullets.push(new am4charts.CircleBullet());
                series1.tooltipText = "{name} Email {categoryX}: {valueY}";
                series1.visible = false;
                let series2 = chart.series.push(new am4charts.LineSeries());
                series2.dataFields.valueY = "Incoming";
                series2.dataFields.categoryX = "Date";
                series2.name = 'Incoming';
                series2.bullets.push(new am4charts.CircleBullet());
                series2.tooltipText = "{name} Email {categoryX}: {valueY}";
                // Add chart cursor
                chart.cursor = new am4charts.XYCursor();
                chart.cursor.behavior = "zoomY";
                let hs1 = series1.segments.template.states.create("hover")
                hs1.properties.strokeWidth = 5;
                series1.segments.template.strokeWidth = 1;

                let hs2 = series2.segments.template.states.create("hover");
                hs2.properties.strokeWidth = 5;
                series2.segments.template.strokeWidth = 1;

                // Add legend
                chart.legend = new am4charts.Legend();
                chart.legend.itemContainers.template.events.on("over", function (event) {
                    var segments = event.target.dataItem.dataContext.segments;
                    segments.each(function (segment) {
                        segment.isHover = true;
                    })
                })

                chart.legend.itemContainers.template.events.on("out", function (event) {
                    var segments = event.target.dataItem.dataContext.segments;
                    segments.each(function (segment) {
                        segment.isHover = false;
                    })
                })
            } else {
                $("#chartErrorMsg").css('display', 'inline');
                $("#chartErrorMsg").html(response.msg)
            }
        },
        error: function () {
            //error message should be display
            $("#chartErrorMsg").html(DASHBOARD_JS_ERROR.reload)
        }
    })
};

//to display the body content
let bodyContent = (id) => {
    MAIL_DATA.map((data, i) => {
        if (id == i) {
            // $("#BodyEventDate").html();
            $("#BodyMailDate").html(data.mail_time);
            $("#BodyFromMail").html(data.from);
            $("#BodyToMail").html(data.to);
            $("#BodySubject").html(data.subject);
            $("#BodyAttachment").html(data.attachments);
            return false;
        }
    })
};

// to make csv file
let saveCSV = () => {
    if (MAIL_DATA.length !== 0) {
        let rows = document.querySelectorAll('table#EmailDatatFullTable tr');
        let csv = [];
        for (let i = 0; i < rows.length; i++) {
            let row = [],
                cols = rows[i].querySelectorAll('td, th');
            for (let j = 0; j < cols.length; j++) {
                let data = cols[j].innerText;
                row.push('"' + data + '"');
            }
            csv.push(row);
        }

        // var user = $('#headerID').attr('name');
        let csv_string = csv.join('\n');
        let filename = 'Emails-List.csv';
        //$('#cover-spin').hide();
        let link = document.createElement('a');
        link.style.display = 'none';
        link.setAttribute('target', '_blank');
        link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } else $("#SearchPdfMsg").html("No Data Available With Selected Filtration.");
}

// save as pdf
let savePDF = () => {
    if (MAIL_DATA.length !== 0) {
        let doc = new jsPDF('p', 'pt', 'a3');
        let totalPagesExp = "{total_pages_count_string}";
        let leftMargin = 40;
        doc.setFontSize(15);
        doc.autoTable({
            html: '#EmailDatatFullTable',
            // html: '#bodyContent',
            theme: "grid",
            columnStyles: {
                0: {
                    cellWidth: 60
                },
                1: {
                    cellWidth: 60
                },
                2: {
                    cellWidth: 60
                },
                3: {
                    cellWidth: 55
                },
                4: {
                    cellWidth: 60
                },
                5: {
                    cellWidth: 80
                },
                6: {
                    cellWidth: 80
                },
                7: {
                    cellWidth: 100
                },
                8: {
                    cellWidth: 80
                },
                9: {
                    cellWidth: 130
                },
            },
            didDrawPage: function (data) {
                doc.text('Email-Monitoring                                                                                           ' + START_DATE + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + TO_DATE, leftMargin, 30);
                let str = "Page " + data.pageCount;
                if (typeof doc.putTotalPages === 'function') {
                    str = str + " of " + totalPagesExp;
                }
                doc.text(str, leftMargin, doc.internal.pageSize.height - 10);
            }
        });
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        doc.save('Emails-List');
    } else $("#SearchPdfMsg").html("No Data Available With Selected Filtration.");
}

//to get the funtion back from the pageNumber onchange
let CalledUserFunction = (skip, SearchText) => {
    $("#PaginationShow").css('display', "inline");
    emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, TYPE, skip, SearchText);
};


