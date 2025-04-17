$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip()
    newFancyBox();
    $('[data-toggle="tooltip"]').tooltip();
    $('#fromTime' + moment().format('HH')).attr('selected', true);
    $('#fromTimeRec' + moment().format('HH')).attr('selected', true);
    $('#fromTimeRecord' + moment().format('HH')).attr('selected', true);
    $('#toTime').append(`<option selected>${String(Number(moment().format('HH')) + 1).padStart(2, '0')}:00</option>`);
    $('#toTimeRecord').append(`<option selected>${String(Number(moment().format('HH')) + 1).padStart(2, '0')}:00</option>`);
    $('#toTimeRec').append(`<option selected>${String(Number(moment().format('HH')) + 1).padStart(2, '0')}:00</option>`)
    // Lets check the Storage type and if Not Google Remove the Information at To Time and extend the value
});

let PRODUCTIVITY = false, TIME_SHEET_CHECK = true,
    SCREEN_SHOTS_CHECK = true, WEB_HISTORY_CHECK = true,
    APP_HISTORY_CHECK = true, KEY_LOGGER_CHECK = true,
    SELECTED_DATE = null, ROLE_CHECK = false,
    DEPT_CHECK = false, DEPT_ID_CHECK = null,
    LOCATION_CHECK = false, USER_DETAILS_CHECK = false,
    CURRENT_TAB = null, REMAINING_TIMER,
    ANALYSIS_CHECK = true, SHOW_ENTRIES = "10",
    TOTAL_COUNT_EMAILS, SORT_NAME = '',
    SORT_ORDER = '', SORTED_TAG_ID = '',
    appendData = '', PAGE_COUNT_CALL = true,
    urlAnlysisData, SEARCH_TEXT = null, ACTIVE_STORAGE;

$(function () {
    //SS date pickup code
    $('#select_ss_date').datepicker({
        dateFormat: 'yy-mm-dd',
        maxDate: '0',
    });
    $("#select_ss_date").datepicker().datepicker("setDate", new Date());
    $('#select_record_date').datepicker({
        dateFormat: 'yy-mm-dd',
        maxDate: '0',
    });
    $("#select_record_date").datepicker().datepicker("setDate", new Date());
    // date range code
    let start = moment().subtract(0, "days");
    let end = moment().subtract(0, 'days');

    function cb(start, end) {
        $("#dateRange span").html(
            start.format("YYYY-MM-DD") + " - " + end.format("YYYY-MM-DD")
        );
        $('#from').val(start.format("YYYY-MM-DD"));
        $('#to').val(end.format("YYYY-MM-DD"));
        PRODUCTIVITY = false;
        TIME_SHEET_CHECK = false;
        SCREEN_SHOTS_CHECK = false;
        WEB_HISTORY_CHECK = false;
        APP_HISTORY_CHECK = false;
        KEY_LOGGER_CHECK = false;
        ANALYSIS_CHECK = false;

        $('div').find('a').each(function () {
            // if ($(this).hasClass('active') && LOAD_CHECK === false) {
            if ($(this).hasClass('active')) {
                // makeDatatableDefault();
                switch ($(this).attr('href')) {
                    case '#Productivity' :
                        CURRENT_TAB = '#Productivity';
                        getProductivity($('#userId').attr('value'), start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
                        break;
                    case '#Timesheets' :
                        CURRENT_TAB = '#Timesheets';
                        loadTimeSheetData();
                        break;
                    case '#BrowserHistory' :
                        CURRENT_TAB = '#BrowserHistory';
                        loadBrowserHistory();
                        break;
                    case '#AppHistory':
                        CURRENT_TAB = '#AppHistory';
                        loadAppHistory();
                        break;
                    case '#keyLogger':
                        CURRENT_TAB = '#keyLogger';
                        keyLoggerData();
                        break;
                    case '#analysis':
                        makeDatatableDefault();
                        CURRENT_TAB = '#analysis';
                        AnalysisData();
                        break;
                    case '#MobileHistory':
                        CURRENT_TAB = '#MobileHistory';
                        loadMobileAppHistory();
                        break;
                    default:
                        break;
                }
            }
        });
    }

    $("#dateRange").daterangepicker({
        maxDate: end,
        startDate: start,
        endDate: end,
        ...dateRangeLocalization,
    }, cb);

    cb(start, end);
});

$('#fromTime, #fromTimeRec').on('change', () => {
    let from = Number($('#fromTime').find(":selected").text().split(':')[0]);
    let fromRec = Number($('#fromTimeRec').find(":selected").text().split(':')[0]);
    $('#toTime, #toTimeRec').empty();
    extendToTimeList(from, from);
});

function extendToTimeList(from, fromRec) {
    $('#toTime, #toTimeRec').empty();
    if (ACTIVE_STORAGE == 'GD' || (ACTIVE_STORAGE == 'MO' && MO_LIMIT)) {
        $('#toTime').append(`<option selected>${String(++from).padStart(2, '0')}:00</option>`);
        $('#toTimeRec').append(`<option selected>${String(++fromRec).padStart(2, '0')}:00</option>`);
        $("#toTime, #toTimeRec").prop('disabled',true);
    } else {
        let max = Number(SS_MAX_LIMIT) ?? 10;
        for (let i = 0; i < max; i++) {
            $('#toTime').append(`<option>${String(++from).padStart(2, '0')}:00</option>`);
            $('#toTimeRec').append(`<option>${String(++fromRec).padStart(2, '0')}:00</option>`);
            if (from === 24 || fromRec === 24) break;
        }
        $("#toTime option:last, #toTimeRec option:last").attr("selected", "selected");
    }
}
$('#fromTimeRecord').on('change', () => {
    let from = Number($('#fromTimeRecord').find(":selected").text().split(':')[0]);
    $('#toTimeRecord').empty();
    $('#toTimeRecord').append(`<option>${String(++from).padStart(2, '0')}:00</option>`);
});

function emptyProductivePage() {
    $('#activityChart').empty();
    $('#totalTime').empty();
    $('#activeTime').empty();
    $('#productiveTime').empty();
    $('#nonProductiveTime').empty();
    $('#neutralTime').empty();
    $('#productivity').empty();
    $('#mobileTime').empty();
}

function productivityData(response) {
    if (response.code === 200) {
        if (response.data && response.data.length > 0) {
            productDataChart(response);
            PRODUCTIVITY = true;
        } else {
            emptyProductivePage();
            $('#activityChart').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b>' + EMPLOYEE_FULL_DETAILS_ERROR.productivityNotFound + '</b></p>');
        }
    } else if (response.code === 400) {
        emptyProductivePage();
        $('#activityChart').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b>' + EMPLOYEE_FULL_DETAILS_ERROR.productivityNotFound + '</b></p>');
    } else if (response.code === 500) {
        emptyProductivePage();
        $('#activityChart').append("<p  style='color: red; text-align: center; font-size: 150%; width: 100%; height: 10% ' ><b>" + EMPLOYEE_FULL_DETAILS_ERROR.errWhileFetching + " <br/>" +
            " <a href='#'  onclick=" + getProductivity($('#userId').attr('value'), $('#from').val(), $('#to').val()) + ">" + EMPLOYEE_FULL_DETAILS_ERROR.reloadSection + " </a> </b></p>");
        PRODUCTIVITY = false;
    } else {
        PRODUCTIVITY = false;
        return errorHandler(response.msg);
    }
}


function productDataChart(response) {
    am4core.useTheme(am4themes_animated);
    // Create chart instance
    let chart = am4core.create("activityChart", am4charts.XYChart);
    chart.logo.disabled = true;
    // Add data

    chart.data = [];
    let totalProductivity = 0;
    let totalProductivityPercentage = 0;
    let totalNonProductivity = 0;
    let neutral = 0;
    let officeTime = 0;
    let activeTime = 0;
    let totalIdlePercentage = 0;
    let mobileUsageDuration = 0;
    response.data.map(productivity => {
        totalProductivity += productivity.productive_duration;
        officeTime += productivity.office_time;
        activeTime += productivity.computer_activities_time;
        totalNonProductivity += productivity.non_productive_duration;
        neutral += productivity.neutral_duration;
        totalProductivityPercentage += productivity.productivity;
        totalIdlePercentage += productivity.idle_duration;
        mobileUsageDuration += productivity.mobileUsageDuration;
        let productiveTime = `${moment().startOf('day').seconds(productivity.productive_duration).format('HH:mm:ss')} hr`;
        let nonProductiveTime = `${moment().startOf('day').seconds(productivity.non_productive_duration).format('HH:mm:ss')} hr`;
        let neutralTime = `${moment().startOf('day').seconds(productivity.neutral_duration).format('HH:mm:ss')} hr`;
        let idleTime = `${moment().startOf('day').seconds(productivity.idle_duration).format('HH:mm:ss')} hr`;
        chart.data.push({
            "date": productivity.date,
            productiveTime,
            nonProductiveTime,
            neutralTime,
            idleTime,
            "Productive": productivity.productive_duration,
            "Unproductive": productivity.non_productive_duration,
            "Neutral": productivity.neutral_duration,
            "Idle": productivity.idle_duration,
        });
    });

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "date";
    // chart.durationFormatter.durationFormat = "hh':'mm':'ss";
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.DurationAxis());
    valueAxis.baseUnit = "second";

    valueAxis.title.text = PRODUCTIVITY_RULE_JS_MSG.timeUSed;

    // Create series
    function createSeries(field, name, color, time, showToolTip = false) {
        // Set up series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.title = time;
        series.dataFields.categoryX = "date";
        series.sequencedInterpolation = true;
        series.stroke = color;
        series.fill = color;
        // Make it stacked
        series.stacked = true;
        // Configure columns
        series.columns.template.width = am4core.percent(60);

        series.tooltip.getFillFromObject = false;
        series.tooltip.label.fill = am4core.color("#000");
        // Add label
        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        // labelBullet.label.text = "{valueY}";
        labelBullet.locationY = 0.5;
        labelBullet.label.hideOversized = true;

        if (showToolTip === true) {
            let toolTipText = "[bold]{categoryX}[/]\n";
            chart.series.each(function (item) {
                if (item.name !== "") {
                    toolTipText += "[" + item.stroke.hex + "]●[/] " + item.name + ": {" + item.dataFields.title + "}\n";
                }
            });

            series.columns.template.tooltipText = toolTipText
        }
        return series;
    }

    let days = moment($('#to').val()).diff(moment(moment($('#from').val())), 'days') + 1;
    //set 4 boxes
    $('#totalTime,#activeTime,#productiveTime,#nonProductiveTime,#neutralTime,#productivity,#mobileTime').empty();
    $('#totalTime').append(`${String(Math.floor(officeTime / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(officeTime).format(':mm:ss')} hr`).attr('title', convertSecToMMAndSS(officeTime));
    $('#activeTime').append(`${String(Math.floor(activeTime / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(activeTime).format(':mm:ss')} hr`).attr('title', convertSecToMMAndSS(activeTime));
    $('#productiveTime').append(`${String(Math.floor(totalProductivity / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(totalProductivity).format(':mm:ss')} hr`).attr('title', convertSecToMMAndSS(totalProductivity));
    $('#nonProductiveTime').append(`${String(Math.floor(totalNonProductivity / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(totalNonProductivity).format(':mm:ss')} hr`).attr('title', convertSecToMMAndSS(totalNonProductivity));
    $('#neutralTime').append(`${String(Math.floor(neutral / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(neutral).format(':mm:ss')} hr`).attr('title', convertSecToMMAndSS(neutral));
    $('#productivity').append(`${response.poductivity_percentage.total_productivity.toFixed(2)} %`);
    $('#mobileTime').append(`${String(Math.floor(mobileUsageDuration / 3600)).padStart(2, '0')}${moment().startOf('day').seconds(mobileUsageDuration).format(':mm:ss')} hr`).attr('title', convertSecToMMAndSS(mobileUsageDuration));
    // define colors
    let interfaceColors = new am4core.InterfaceColorSet();
    createSeries("Productive", PRODUCTIVITY_RULE_JS_MSG.productive, am4core.color("#26c36c"), "productiveTime");
    createSeries("Unproductive", PRODUCTIVITY_RULE_JS_MSG.unproductive, am4core.color("#f22f3f"), "nonProductiveTime");
    createSeries("Idle", PRODUCTIVITY_RULE_JS_MSG.idle, am4core.color("#ffc107"), "idleTime");
    createSeries("Neutral", PRODUCTIVITY_RULE_JS_MSG.neutral, am4core.color("#CCCCCC"), "neutralTime", true);

    chart.scrollbarX = new am4core.Scrollbar();
    // chart.scrollbarY = new am4core.Scrollbar();

    // Legend
    chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.maxTooltipDistance = 0;
}

function timeSheetData(response) {
    if (response.code === 200) {
        if (response.data && response.data.data.length > 0) {
            $('#timeSheetDataTable').dataTable().fnDestroy();
            $('#timeSheetsData').empty();
            response.data.data.map(timeSheet => {
                let startTime = moment(timeSheet.start_time).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
                let endTime = moment(timeSheet.end_time).tz('Asia/Kolkata').format('DD-MM-YYYY HH:mm:ss');
                
                const time1 = moment(timeSheet.end_time);
                const time2 = moment(timeSheet.start_time); 
                const duration = moment.duration(time1.diff(time2));
                const hours = duration.asHours();
  
                $('#timeSheetsData').append('<tr class="text-center">\n' + ' <td>' + startTime + '</td><td>' + endTime + '</td><td title="' +  hours.toFixed(2) + '">' + hours.toFixed(2) + '</td> </tr>' );
            });
            $("#timeSheetDataTable").DataTable({
                "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
                "language": {"url": DATATABLE_LANG}, // declared in _scripts.blade file
                "order": [],
                "initComplete": function () {
                    $("#timeSheetDataTable").wrap("<div style='overflow:auto; width:100%;position:relative;'></div>");
                },
            });
            TIME_SHEET_CHECK = true;
        } else {
            $('#timeSheetsData').empty();
            $('#timeSheetsData').append('<tr><td colspan="11" style="text-align: center; color: red"><b>' + EMPLOYEE_FULL_DETAILS_ERROR.timeSheetNotFound + ' </b></td></tr>');
            $("#timeSheetDataTable").DataTable({"language": {"url": DATATABLE_LANG}, "bDestroy": true});
        }
    } else if (response.code === 400) {
        $('#timeSheetsData').empty();
        $('#timeSheetsData').append('<tr><td colspan="11" style="text-align: center; color: red"><b>' + EMPLOYEE_FULL_DETAILS_ERROR.timeSheetNotFound + '  </b></td></tr>');
        $("#timeSheetDataTable").DataTable({"language": {"url": DATATABLE_LANG}, "bDestroy": true});
    } else if (response.code === 500) {
        $('#timeSheetsData').empty();
        $('#timeSheetsData').append('<tr><td colspan="11" style="text-align: center; color: red"><b>" + EMPLOYEE_FULL_DETAILS_ERROR.errWhileFetching + " <br/> <a href="#" onclick="loadTimeSheetData()">" + EMPLOYEE_FULL_DETAILS_ERROR.reloadSection + " </a> </b></td></tr>');
        $("#timeSheetDataTable").DataTable({"language": {"url": DATATABLE_LANG}, "bDestroy": true});
        TIME_SHEET_CHECK = false;
    } else {
        $("#timeSheetDataTable").DataTable({"language": {"url": DATATABLE_LANG}, "bDestroy": true});
        TIME_SHEET_CHECK = false;
        return errorHandler(response.msg);
    }
}

function ScreenshotData(response, option) {
    //1 for search and 2 for download options
    if (Number(option.option) === 1) {
        if (response.data.code === 200) {
            let SSDataOldFormat = response.data.data.screenshot;
            let isSSAvail = false;
            for (let i = 0; i < SSDataOldFormat.length; i++) {
                if (SSDataOldFormat[i].s.length > 0) {
                    isSSAvail = true;
                    break;
                }
            }
            if (isSSAvail) {
                if (response.data.data.storage ==='GD' || (response.data.data.storage === 'MO' && MO_LIMIT)) {
                    limitExceedTimer('Success');
                }
                let append = "";
                let ssStatus = "0";

                let SSData = convertingTheFormatOfScreenShots(SSDataOldFormat, $('#fromTime').find(":selected").text(), $('#toTime').find(":selected").text());

                SSData.map(screenShotData => {
                    let FromTime = String(screenShotData.t).padStart(2, '0');
                    let ToTime = String(Number(FromTime) + 1).padStart(2, '0');

                    if (screenShotData.s.length !== 0) {
                        ssStatus = ++ssStatus;
                        let SS = screenShotData.s;
                        SS = _.unique(SS, ["name"]);
                        SS = _.sortBy(SS, ["name"]);
                        let SSS = screenShotData.pageToken;
                        append += ' <div class="timeline"> <div class="timeline-section">' +
                            '<div class="timeline-date text-dark">' + FromTime + ':00 - ' + ToTime + ':00';
                        if (SSS != null) append += '<i  class="owl-next float-right fas fa-chevron-circle-right fa-2x text-primary" type="button" title="Load More Screenshots" id="dis_' + FromTime + '" onclick="NewSSData(\'' + SSS + '\', ' + (Number(FromTime)) + ' , ' + (Number(ToTime)) + ')" /><span id="next_' + FromTime + '" /></div>';
                        else if (SSS == null) append += '<i  class="owl-next float-right fas fa-chevron-circle-right fa-2x" title="No More Screenshots to load" /> </div>';
                        append += '<div class="col-sm-12 scrollmenu" style="overflow-x: scroll; padding-bottom: 0 !important;" id="Scroll_' + FromTime + '"> <ul style="display: inline-flex; padding-left: 2px" id="Time_' + FromTime + '">';
                        for (let j = 0; j < SS.length; j++) {
                            if(response.data.data.storage ==='GD') SS[j].link = `https://lh3.googleusercontent.com/u/0/d/${SS[j].id}`;
                            append += '<li class="imageSize"><a class="fancybox-button " rel="fancybox-button" ref="' + SS[j].link + '" title="' + SS[j].name.substr(SS[j].name.indexOf("-") + 1).split(".")[0] + '" style="display: block !important;" "=""><img src="' + SS[j].link + '" alt="Screenshot"  class="img-fluid">' +
                                '</a> </li>';
                        }
                        append += '</ul> </div> </div> </div>';
                        newFancyBox();
                    }
                });
                if (ssStatus !== 0) $('#appendSSData').append(append);
                else $('#appendSSData').append('<p style="text-align: center; color:red; font-size: 18px"><b>' + EMPLOYEE_FULL_DETAILS_ERROR.screenShotNotFound + '</p>');
            } else $('#appendSSData').append('<p style="text-align: center; color:red; font-size: 18px"><b>' + EMPLOYEE_FULL_DETAILS_ERROR.screenShotNotFound + '</p>');

        } else {
            $('#appendSSData').empty();
            $('#appendSSData').append('<p style="text-align: center;font-size: 18px"><b>' + response.data.message + '</p>');
            Swal.fire({
                icon: 'error',
                title: response.data.message,
                text: response.data.error,
                showConfirmButton: true,
                confirmButtonText: DASHBOARD_JS.ok??'OK'
            });
        }
    } else if (Number(option.option) === 2) {
        if (option.path && option.code === 200) {
            let name = option.response[0].data.data.name;
            let append = "";
            append += '<b><p style= "color:green; text-align: center; font-size: 150%">' + EMPLOYEE_FULL_DETAILS_ERROR.filesDownloaded + '</p></b>';
            $('#appendSSData').empty();
            $('#appendSSData').append(append);
            window.location = window.location.origin + '/downloadSSZip?name=' + name + '';
        } else {
            let append = "";
            append += '<b><p style= "color:red; text-align: center; font-size: 150%">' + EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong + '</p></b>';
            $('#appendSSData').empty();
            $('#appendSSData').append(append);
            errorHandler(option.msg);
        }
    }
}

function convertingTheFormatOfScreenShots(SSDataOldFormat, selectedFromTime, selectedToTime) {
    let SSData = [];
    let maxSlot = Number(selectedToTime.replace(':00', '')) - 1;
    for (let i = Number(selectedFromTime.replace(':00', '')); i <= maxSlot; i++) {
        SSData.push({
            t: i,
            s: [],
            pageToken: null,
        });
    }

    SSDataOldFormat.map(screenShot => {
        screenShot.s.map(data => {
            SSData.map(slot => {
                if (Number(slot.t) === Number(data.timeslot)) {
                    slot.s.push(data);
                    slot.pageToken = screenShot.pageToken;
                }
            });
        });
    });

    return SSData;
}

function NewSSData(pageToken, FromTime, ToTime) {
    if (FromTime <= 9) FromTime = "0" + FromTime;
    if (ToTime <= 9) ToTime = "0" + ToTime;
    $.ajax({
        type: "post",
        url: "/" + userType + '/EmpSSwithToken',
        data: {
            userId: $('#userId').attr('value'),
            fromTime: FromTime,
            ToTime: ToTime,
            selected: "1",
            Date: SELECTED_DATE,
            PageToken: pageToken
        },
        beforeSend: function () {
            FromTime = String(Number(FromTime)).padStart(2, '0');
            ToTime = String(Number(ToTime)).padStart(2, '0');
            $('#oneSearch').attr("disabled", false);
            $('#dis_' + FromTime + '').attr("disabled", true);
            $('#dis_' + FromTime + '').empty();
            $('#dis_' + FromTime + '').removeClass('fas fa-chevron-circle-right');
            $('#dis_' + FromTime + '').addClass('spinner-border');
            $('#dis_' + FromTime + '').attr("title", "More Screenshots are Loading...");
            $('#dis_' + FromTime).css({'width': '1.4rem', 'height': '1.4rem'});
        },
        success: function (response) {
            if (response.data.data.code === 200) {
                let SSDataOldFormat = response.data.data.data.screenshot;
                let append = "";
                let SSData = convertingTheFormatOfScreenShots(SSDataOldFormat, String(FromTime), String(ToTime));

                // Generally SSData is having 2 arrays, we are able to get the half data of +1 hour
                let SS = SSData[0].s;
                if (SS.length > 0) {
                    append += '<ul style="display: inline-flex; padding-left: 2px" id="Time_' + FromTime + '">';
                    for (let j = 0; j < SS.length; j++) {
                        append += '<li class="imageSize"><a class="fancybox-button" rel="fancybox-button"  title="' + SS[j].name.substr(SS[j].name.indexOf("-") + 1).split(".")[0] + '"  style="display: block !important;" "="">' +
                            '<img src="' + SS[j].link + '" alt="Screenshot" class="img-fluid">' +
                            '</a> </li></ul>';
                        let SSS = response.data.data.data.screenshot[0].pageToken;
                        let clickFunction = $("#dis_" + response.data.data.data.screenshot[0].t).attr("onClick");
                        if (clickFunction) {
                            let functionName = clickFunction.substring(0, clickFunction.indexOf("("));
                            $("#dis_" + response.data.data.data.screenshot[0].t).attr("onclick", functionName + "(\"" + SSS + "\", " + "" + FromTime + "," + "" + ToTime + ")");
                        }
                        if (SSS != null) {
                            return appendMore(response);
                        }
                        if (SSS == null) {
                            return appendNoMore(FromTime);
                        }
                    }
                    $("#Time_" + response.data.data.data.screenshot[0].t).append(append);
                    newFancyBox();
                } else {
                    return appendNoMore(FromTime);
                }
            } else {
                appendMore(response);
                errorHandler(response.msg);
            }
        },
        error: function () {
            errorHandler(EMPLOYEE_FULL_DETAILS_ERROR.somethingWrong);
        }
    });
}

function limitExceedTimer(status) {
    $('#oneSearch').prop('disabled', true);
    status !== 'success' ? $('#oneSearch').attr('title', apilimitmsg) : {};
    let timeLeft = envRemainingTime;
    REMAINING_TIMER = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(REMAINING_TIMER);
            $('#oneSearch').html('<i class="fas fa-search"></i> Search');
            $('#oneSearch').prop('disabled', false);
            $('#oneSearch').attr('title', 'Search');
        } else {
            $('#oneSearch').attr('disabled', true);
            $('#oneSearch').html(timeLeft + " Seconds...");
        }
        timeLeft -= 1;
    }, 1000);
}

function appendNoMore(FromTime) {
    $('#dis_' + String(FromTime)).attr("disabled", true);
    $('#dis_' + String(FromTime)).removeClass('spinner-border text-primary');
    $('#dis_' + String(FromTime) + '').removeAttr('style');
    $('#dis_' + String(FromTime) + '').removeAttr('type');
    $('#dis_' + String(FromTime) + '').removeAttr('onclick');
    $('#dis_' + String(FromTime) + '').addClass('fas fa-chevron-circle-right');
    $('#dis_' + String(FromTime)).attr("title", "No More Screenshots To Load");
}

function appendMore(response) {
    $('#dis_' + response.data.data.data.screenshot[0].t + '').attr("disabled", false);
    $('#dis_' + response.data.data.data.screenshot[0].t + '').removeClass('spinner-border');
    $('#dis_' + response.data.data.data.screenshot[0].t + '').removeAttr('style');
    $('#dis_' + response.data.data.data.screenshot[0].t + '').addClass('fas fa-chevron-circle-right');
    $('#dis_' + response.data.data.data.screenshot[0].t + '').attr("title", "Load More Screenshots");
}

function newFancyBox() {
    let resolutions = {};
    if(location.href.includes('mutracker.com')) {
        resolutions.width =  0.70 * window.innerWidth;
        resolutions.height = 0.70 * window.innerHeight;
    }
    $(".fancybox-button").fancybox({
        padding: 5,
        prevEffect: 'none',
        nextEffect: 'none',
        autoScale: true,
        fitToView: true,
        autoSize: !location.href.includes('mutracker.com'),
        scrolling : false,
        autoHeight: true,
        autoWidth: !location.href.includes('mutracker.com'),
        ...resolutions,
        closeBtn: true,
        loop: false,
        helpers: {
            title: {type: 'inside'},
            buttons: {}
        }
    });
}

function browserHistoryData(response) {
    if (response.code == 200) {
        if (response.data && response.data.length > 0) {
            let browserHistoryDataTableData = '';
            // setTimeout(() => {
            //     webHistoryChart(response);
            // }, 700);

            $('#browserHistoryTableLoader').css('display', 'none');
            $('#browserHistoryTable').empty(); 
            $('#browserHistoryDataTableData').empty();
            $('#browserHistoryTableId').dataTable().fnClearTable();
            $('#browserHistoryTableId').dataTable().fnDraw();
            $('#browserHistoryTableId').dataTable().fnDestroy();
            response.data.map(webData => { 
                let startDate = moment(new Date(webData.start_time)).format('YYYY-MM-DD HH:mm:ss');
                let endDate = moment(new Date(webData.end_time)).format('YYYY-MM-DD HH:mm:ss');
             
                let urlFormat = webData.application_name.length < 40 ? webData.application_name.toString().substr(0, 40) : webData.application_name.toString().substr(0, 40).concat('...');
                let titleFormat = webData.application_name.length < 40 ? webData.application_name : webData.application_name.toString().substr(0, 40).concat('...');
                $('#browserHistoryDataTableData').append('<tr style="font-size: 14px !important;"><td style="text-transform: capitalize">' + webData.application_name + '</td><td style="text-transform: capitalize;" title="' + webData.application_name + '">' + titleFormat + '</td><td width="400px"><a href="' + webData.url + '" title="' + webData.url + '" target="_blank">' + webData.url + '</td>' +
                    '<td>' + startDate + '</td><td>' + endDate + '</td></tr>');
            });
            $("#browserHistoryTableId").DataTable({
                "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
                "order": [[3, "desc"]],
                "language": {"url": DATATABLE_LANG} // declared in _scripts.blade file
            });
            WEB_HISTORY_CHECK = true;
        } else {
            // $('#browserHistoryTableId').dataTable().fnDestroy();
            $('#browserHistoryTable').empty();
            $('#browserHistoryDataTableData').empty();
            $('#browserHistoryDataTableData').append('<tr><td colspan="10" style="text-align: center"> ' + EMPLOYEE_FULL_DETAILS_ERROR.browserHistoryNotFound + ' </td></tr>');
            $('#webHistoryChart').empty();
            $('#webHistoryChartLoader').css('display', 'none');
            $('#browserHistoryTableLoader').css('display', 'none');
            $('#webHistoryChart').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b>' + EMPLOYEE_FULL_DETAILS_ERROR.webHistoryNotFound + '</b></p>');
        }
    } else if (response.code == 400) {
        $('#browserHistoryTable').empty();
        $('#webHistoryChartLoader').css('display', 'none');
        $('#browserHistoryTableLoader').css('display', 'none');
        $('#webHistoryChart').empty();
        $('#webHistoryChart').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b>' + EMPLOYEE_FULL_DETAILS_ERROR.webHistoryNotFound + ' </b></p>');
    } else if (response.code == 500) {
        $('#browserHistoryTable').empty();
        $('#webHistoryChartLoader').css('display', 'none');
        $('#browserHistoryTableLoader').css('display', 'none');
        $('#webHistoryChart').empty();
        $('#webHistoryChart').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b> ' + EMPLOYEE_FULL_DETAILS_ERROR.errWhileFetching + ' <br/> <a href="#" onclick="loadBrowserHistory()">' + EMPLOYEE_FULL_DETAILS_ERROR.reloadSection + ' </a> </b></p>');
        WEB_HISTORY_CHECK = false;
    } else {
        WEB_HISTORY_CHECK = false;
        return errorHandler(response.msg);
    }
}

function webHistoryChart(response) {
    let chart = am4core.create("webHistoryChart", am4charts.PieChart);
    chart.logo.disabled = true;
    chart.data = [];
    response.data.map(domain => { 
        chart.data.push({
            web_app: domain.application_name,
            time: domain.start_time
        });
     });
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "time";
    pieSeries.dataFields.category = "web_app";
    pieSeries.innerRadius = am4core.percent(50);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    setTitle(pieSeries);
    removeMinorSlices(pieSeries);

    chart.legend = new am4charts.Legend();
    chart.legend.position = "left";
    chart.legend.scrollable = true;
    chart.legend.itemContainers.template.togglable = false;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 14;
    $('#webHistoryChartLoader').css('display', 'none');
}

function applicationHistoryData(response) {
    if (response.code == 200) {
        if (response.data && response.data.length > 0) {
            appHistoryChart(response);
            $('#appHistoryTable').empty();
            $('#applicationHistoryTableId').dataTable().fnDestroy();
            $('#applicationHistoryDataTableData').empty();
            response.data.map(appData => { 
                $('#appHistoryTable').append('<tr><td class="td-url" title="' + appData.application_name + '" style="text-transform: capitalize"><i class="fas fa-mobile-alt mr-2"></i>' + appData.application_name + '</td></tr>');
                let startDate = moment(new Date(appData.start_time)).format('YYYY-MM-DD HH:mm:ss');
                let endDate = moment(new Date(appData.end_time)).format('YYYY-MM-DD HH:mm:ss');
                $('#applicationHistoryDataTableData').append('<tr style="text-align: center; font-size: 14px !important;"><td style="text-transform: capitalize">' + appData.application_name.replace(".exe", "") + '</td><td style="text-transform: capitalize;">' + appData.application_name + '</td><td>' + startDate + '</td><td>' + endDate + '</td></tr>');
                  
            });

            $("#applicationHistoryTableId").DataTable({
                "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
                "order": [[2, "desc"]],
                "language": {"url": DATATABLE_LANG} // declared in _scripts.blade file
            });
            APP_HISTORY_CHECK = true;
        } else {
            $('#appHistoryTable').empty();
            $('#applicationHistoryDataTableData').empty();
            $('#applicationHistoryDataTableData').append('<tr><td colspan="10" style="text-align: center"> ' + EMPLOYEE_FULL_DETAILS_ERROR.appHistoryNotFound + '</td></tr>');
            // $('#chartApp').empty();
            // $('#chartApp').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b> ' + EMPLOYEE_FULL_DETAILS_ERROR.appDataNotFound + ' </b></p>');
        }
    } else if (response.code == 400) {
        $('#appHistoryTable').empty();
        // $('#chartApp').empty();
        // $('#chartApp').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b>' + EMPLOYEE_FULL_DETAILS_ERROR.appDataNotFound + '  </b></p>');
    } else if (response.code == 500) {
        $('#appHistoryTable').empty();
        $('#applicationHistoryDataTableData').empty();
        $('#applicationHistoryDataTableData').append('<tr><td colspan="7" style="text-align: center"> ' + EMPLOYEE_FULL_DETAILS_ERROR.appHistoryNotFound + '</td></tr>');
        // $('#chartApp').empty();
        // $('#chartApp').append('<p  style="color: red; text-align: center; font-size: 150%; width: 100%; height: 10% " ><b>' + EMPLOYEE_FULL_DETAILS_ERROR.errWhileFetching + ' <br/> <a href="#" onclick="loadAppHistory()">' + EMPLOYEE_FULL_DETAILS_ERROR.reloadSection + ' </a> </b></p>');
        APP_HISTORY_CHECK = false;
    } else {
        APP_HISTORY_CHECK = false;
        return errorHandler(response.msg);
    }
}

function appHistoryChart(response) {
    let chart = am4core.create("chartApp", am4charts.PieChart);
    chart.logo.disabled = true;
    chart.data = [];
    response.data.map(appData => {
        chart.data.push({
            app_used: appData.application_name.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }),
            time: appData.active_seconds
        });
    });

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "time";
    pieSeries.dataFields.category = "app_used";
    pieSeries.innerRadius = am4core.percent(50);
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.disabled = true;

    setTitle(pieSeries);
    removeMinorSlices(pieSeries);

    chart.legend = new am4charts.Legend();
    chart.legend.position = "left";
    chart.legend.scrollable = true;
    chart.legend.itemContainers.template.togglable = false;

    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 13;
    markerTemplate.height = 14;
}

function setTitle(pieSeries) {
    pieSeries.legendSettings.valueText = null;
    pieSeries.labels.template.text = "{category}";
    pieSeries.slices.template.tooltipText = "{category}";
}

function removeMinorSlices(pieSeries) {
    // 2 ways to remove 0.0 slices , 1. this validation 2. above validation
    pieSeries.events.on("datavalidated", function (ev) {
        ev.target.slices.each(function (slice) {
            if (slice.dataItem.values.value.percent < 0.1) {
                slice.dataItem.hide();
                slice.dataItem.legendDataItem.hide();
            }
        });
    });
}

$(".toggle-password-show-edit, .toggle-password-show-edit-c").click(function () {
    $(this).toggleClass("fa-eye fa-eye-slash");
    let input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    } else {
        input.attr("type", "password");
    }
});

function setChartScore(data) {
    setRiskFactor(data.risk_score);
    setConversationChart(data.normal, data.offensive);
    setSentimentChart(data.setimental);
    setChartDetails(data.details);
}

function setRiskFactor(risk_factor) {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartrisk", am4charts.GaugeChart);
    chart.logo.disabled = true;
    chart.innerRadius = -15;
    var axis = chart.xAxes.push(new am4charts.ValueAxis());
    axis.min = 0;
    axis.max = 100;
    axis.strictMinMax = true;
    var colorSet = new am4core.ColorSet();
    var gradient = new am4core.LinearGradient();
    gradient.stops.push({color: am4core.color("green")})
    gradient.stops.push({color: am4core.color("yellow")})
    gradient.stops.push({color: am4core.color("red")})
    axis.renderer.line.stroke = gradient;
    axis.renderer.line.strokeWidth = 15;
    axis.renderer.line.strokeOpacity = 1;
    axis.renderer.grid.template.disabled = true;
    var hand = chart.hands.push(new am4charts.ClockHand());
    hand.radius = am4core.percent(97);
    hand.showValue(risk_factor, am4core.ease.cubicOut);
}

function setSentimentChart(setimentalData) {
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartsentiment", am4charts.PieChart);
    chart.logo.disabled = true;
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Time";
    pieSeries.dataFields.category = "Work";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.slices.template
        .cursorOverStyle = [
        {
            "property": "cursor",
            "value": "pointer"
        }
    ];
    pieSeries.alignLabels = true;
    pieSeries.labels.template.bent = true;
    pieSeries.labels.template.radius = 3;
    pieSeries.labels.template.padding(0, 0, 0, 0);
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.ticks.template.disabled = true;
    pieSeries.labels.template.fontSize = 12;
    const shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;
    const hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
    const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;
    chart.legend = new am4charts.Legend();

    chart.data = [{
        "Work": lblPositive,
        "Time": setimentalData.positive,
        "color": am4core.color("#3ac36c")
    }, {
        "Work": lblNegative,
        "Time": setimentalData.negative,
        "color": am4core.color("#f22f3f")
    }, {
        "Work": lblNeutral,
        "Time": setimentalData.neutral,
        "color": am4core.color("#cccccc")
    }];

    chart.legend.fontSize = 12;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;
}

function setConversationChart(normal, offensive) {
    am4core.useTheme(am4themes_animated);
    const chart = am4core.create("chartconversation", am4charts.PieChart);
    chart.logo.disabled = true;
    const pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "Time";
    pieSeries.dataFields.category = "Talk";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;
    pieSeries.labels.template.fontSize = 12;
    pieSeries.slices.template
        .cursorOverStyle = [
        {
            "property": "cursor",
            "value": "pointer"
        }
    ];
    pieSeries.alignLabels = true;
    pieSeries.labels.template.bent = true;
    pieSeries.labels.template.radius = 3;
    pieSeries.labels.template.padding(0, 0, 0, 0);
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.ticks.template.disabled = true;
    const shadow = pieSeries.slices.template.filters.push(new am4core.DropShadowFilter);
    shadow.opacity = 0;
    const hoverState = pieSeries.slices.template.states.getKey("hover"); // normally we have to create the hover state, in this case it already exists
    const hoverShadow = hoverState.filters.push(new am4core.DropShadowFilter);
    hoverShadow.opacity = 0.7;
    hoverShadow.blur = 5;
    chart.legend = new am4charts.Legend();
    chart.data = [{
        "Talk": lblNormal,
        "Time": normal,
        "color": am4core.color("#3ac36c")
    }, {
        "Talk": lblOffensive,
        "Time": offensive,
        "color": am4core.color("#f22f3f")
    }];
    chart.legend.fontSize = 12;
    let markerTemplate = chart.legend.markers.template;
    markerTemplate.width = 15;
    markerTemplate.height = 15;
}

function createDatatable(tableId, bodyId, bodyData) {
    $(tableId).dataTable().fnClearTable();
    $(tableId).dataTable().fnDraw();
    $(tableId).dataTable().fnDestroy();
    $(bodyId).empty();
    $(bodyId).append(bodyData);
    $(tableId).DataTable({
        "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
        "language": {"url": DATATABLE_LANG} // declared in _scripts.blade file
    });
}

function setChartDetails(details) {
    let sliceSize = 4;
    let linkSentimentModal = false;
    let linkConversationModal = false;
    let appDataSentiment = "";
    let appDataConversation = "";
    details.map((data, index) => {
        if (data.offensive_words.length > 0) {
            let offensiveWords = data.offensive_words.split(',');
            if (!linkConversationModal) {
                $("#linkConversationModal").css('display', 'block');
                linkConversationModal = true;
            }
            appDataConversation += `<tr><td ><a href="#" title="${convertToSentenceCase(data.app)}">${convertToSentenceCase(data.app)}</a></td>` +
                `<td ><a href="#" title="${data.date}">${data.date}</a></td><td><ul>`;
            offensiveWords.slice(0, sliceSize).map(word => {
                appDataConversation += `<li><a href="#" title="${convertToSentenceCase(word)}">${convertToSentenceCase(word)}</a></li>`;
            });
            appDataConversation += `</ul>${(offensiveWords.length > sliceSize ? "<button type='button' data-toggle='modal' onclick=\"(setSeeMoreList('" + convertToSentenceCase(data.app) + " ','" + ow + " ','" + offensiveWords.toString() + " '))\" href='#morelist' class='btn btn-primary btn-sm float-right blurBGModel'>See All</button>" : '')}</td></tr>`;

        }
        if (data.negative_sentences.length > 0 || data.positive_sentences.length > 0) {
            if (!linkSentimentModal) {
                $("#linkSentimentModal").css('display', 'block');
                linkSentimentModal = true;
            }
            appDataSentiment += `<tr><td ><a href="#" title="${convertToSentenceCase(data.app)}">${convertToSentenceCase(data.app)}</a></td>` +
                `<td ><a href="#" title="${data.date}">${data.date}</a></td><td><ul>`;

            data.positive_sentences.slice(0, sliceSize).map(positive => {
                appDataSentiment += `<li><a href="#" title="${convertToSentenceCase(positive)}">${convertToSentenceCase(positive)}</a></li>`;
            });
            Array.from(data.positive_sentences);
            appDataSentiment += `</ul>${(data.positive_sentences.length > sliceSize ? "<button type='button' data-toggle='modal' onclick=\"(setSeeMoreList('" + convertToSentenceCase(data.app) + " ','" + ps + " ','" + data.positive_sentences.toString() + " '))\" href='#morelist' class='btn btn-primary btn-sm float-right blurBGModel'>See All</button>" : '')}</td><td><ul>`;
            data.negative_sentences.slice(0, sliceSize).map(negative => {
                appDataSentiment += `<li><a href="#" title="${convertToSentenceCase(negative)}">${convertToSentenceCase(negative)}</a></li>`;
            });
            appDataSentiment += `</ul>${(data.negative_sentences.length > sliceSize ? "<button type='button' data-toggle='modal' onclick=\"(setSeeMoreList('" + convertToSentenceCase(data.app) + " ','" + ns + " ','" + data.negative_sentences.toString() + " '))\" href='#morelist' class='btn btn-primary btn-sm float-right blurBGModel'>See All</button>" : '')}</td></tr>`;
        }
    });
    if (!linkSentimentModal) ($("#linkSentimentModal").css('display', 'none'));
    if (!linkConversationModal) ($("#linkConversationModal").css('display', 'none'));
    createDatatable('#sentiment_table', "#bodySentimentModal", appDataSentiment);
    createDatatable('#conversation_table', "#bodyConversationModal", appDataConversation);
    $('.blurBGModel').on('click', function () {
        $('#morelist').css('z-index', '1050')
    });
}

function setSeeMoreList(title, header, arrayValues) {
    $('#moreListTitle').text(title);
    $('#moreListHeader').text(header);
    appendData = "";
    arrayValues.split(",").map(data => {
        appendData += `<li class=""><a href="#" title="Indicates an important action">${convertToSentenceCase(data)}</a></li>`;
    });
    $('#moreListBody').empty();
    $('#moreListBody').append(appendData);
}

function setURLAnlysisTableData(data) {
    $('#urlAnalysisData').empty();
    urlAnlysisData = data;
    urlAnlysisData.map(analysisData => {
        let domainname = analysisData.domain;
        let prediction = analysisData.prediction;
        let arrayCategory = [];
        analysisData.category.map(category => {
            arrayCategory.push(convertToSentenceCase(category))
        });
        let date = analysisData.date;
        $('#urlAnalysisData').append(`<tr><td>${domainname}</td><td>${date}<td>${arrayCategory.join(',')}</td><td>${prediction}</td>
           <td class="text-center"><a id=${domainname} title="URLs" onclick="loadURLData('${domainname}')"><i class="far fa-eye"></i></a></td></tr>`);
    });
}

function setEmployeeInformation(data) {
    $('#emp_name').text(data.full_name);
    $('#emp_id').text(data.emp_code);
    $('#emp_dept').text(data.department_name);
    $('#emp_role').text(data.role_name);
    $('#emp_img').attr("src", data.photo_path);
}

function loadURLData(domain) {
    $('#urlList').empty();
    let domainDetail = urlAnlysisData.filter(data => data.domain === domain);
    var uniqueURL = [];
    appendData = `<ul class="list-group">`;
    domainDetail.map(data => {
        data.urls.map(URLs => {
            let currentURL = uniqueURL.filter(url => url['url'] === URLs.url);
            currentURL.length > 0 ? currentURL[0].occurrence++ : uniqueURL.push({url: URLs.url, occurrence: 1});
        });
    });
    uniqueURL.map(URLs => {
        appendData += `<li class="data_show_short list-group-item"><i class="fas fa-globe mr-2"></i><a class="anchorPopOver" href="${URLs.url}" target="_blank" title="${URLs.occurrence} Time(s) Clicked" data-original-title="${URLs.occurrence} Time(s) Clicked" data-toggle="popover" data-trigger="hover" data-content="${URLs.url}" data-placement="bottom">${URLs.url}</a></li>`;
    });
    appendData += `</ul>`;
    $("#urlList").append(appendData);
    $("#domainUrlModal").modal('show');
    $(".anchorPopOver").popover();
}

function loadCategoryChartDetails(chartDetails) {
    let chartData = [];
    chartDetails.map(data => {
        let categoryName = "";
        let authentic = 0;
        let Unreliable = 0;
        let other = 0;
        if (data.category) {
            categoryName = data.category;
            data.details.map(connection => {
                switch (connection.cannection) {
                    case "Authorized":
                        authentic += ((data.category_percentage / 100) * connection.percentage).toFixed(2);
                        break;
                    case "Unreliable":
                        Unreliable += ((data.category_percentage / 100) * connection.percentage).toFixed(2);
                        break;
                    default:
                        other += ((data.category_percentage / 100) * connection.percentage).toFixed(2);
                        break;
                }
            });
        }
        if (categoryName)
            chartData.push({
                category: convertToSentenceCase(categoryName),
                Authentic: authentic,
                Unreliable: Unreliable,
                Other: other
            });
    });
    setCategoryChart(chartData);
}

function setCategoryChart(chartData) {
    am4core.useTheme(am4themes_animated);
    const chart = am4core.create("chartcategory", am4charts.XYChart);
    chart.logo.disabled = true;
    const title = chart.titles.push(new am4core.Label());

    chart.data = chartData;
    const categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.axisFills.template.disabled = false;
    categoryAxis.renderer.axisFills.template.fillOpacity = 0.05;
    categoryAxis.title.text = EMPLOYEE_FULL_DETAILS_ERROR.categoryList;

    const valueAxis = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.ticks.template.strokeOpacity = 0.4;
    // valueAxis.renderer.labels.template.adapter.add("text", function (text) {
    //     return text == "Productive" || text == "Unproductive" ? text : text + "%";
    // })
    chart.legend = new am4charts.Legend();
    chart.legend.position = "bottom";

    function createSeries(field, name, color) {
        var series = chart.series.push(new am4charts.ColumnSeries());
        series.dataFields.valueX = field;
        series.dataFields.categoryY = "category";
        series.stacked = true;
        series.name = name;
        series.stroke = color;
        series.fill = color;

        const label = series.bullets.push(new am4charts.LabelBullet);
        label.label.text = "{valueX}%";
        label.label.fill = am4core.color("#fff");
        label.label.strokeWidth = 0;
        label.label.hideOversized = true;
        label.locationX = 0.5;

        return series;
    }

    createSeries("Authentic", lblAthuentic, am4core.color("#26c36c"));
    createSeries("Unreliable", lblUnreliable, am4core.color("#f22f3f"));
    createSeries("Other", lblOther, am4core.color("#cccc00"));
    valueAxis.title.text = EMPLOYEE_FULL_DETAILS_ERROR.categoryPercent;
    chart.legend.events.on("layoutvalidated", function (event) {
        chart.legend.itemContainers.each((container) => {
            if (container.dataItem.dataContext.name === "Other") {
                container.toBack();
            }
        })
    });
    chart.scrollbarY = new am4core.Scrollbar();
}

function convertToSentenceCase(theString) {
    return theString.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, function (c) {
        return c.toUpperCase()
    });
}



// Function for productive, neutral and unproductive detail
// type = 2 and category = 0 is for unproductive of websites
// type = 1 and category = 0 is for unproductive of application
// type = 2 and category = 1 is for productive of websites
// type = 1 and category = 1 is for productive of application
// type = 2 and category = 2 is for unproductive of websites
// type = 1 and category = 2 is for unproductive of application

function getProductiveDetail() {
    $.ajax({
        url: "/" + userType + "/employee-web-app-detail",
        data: {
            employee_id: $('#userId').attr('value'),
            startDate: $('#from').val(),
            endDate: $('#to').val(),
            type: $('#appOption').val(),
            category: 1,
        },
        method: 'get',
        success: function (resp) {
            if (resp.code === 200) {
                $('#productive_detail_table').dataTable().fnClearTable();
                $('#productive_detail_table').dataTable().fnDraw();
                $('#productive_detail_table').dataTable().fnDestroy();
                $('#productive_detail_body').empty();
                manageDataTable('Productive', resp.data)
                $('#productive_detail').modal('show');
            } else {
                //    show error swal
            }
        },
        error: function (err) {
            //    show error swal
        }
    })
}
function getUnProductiveDetail() {
    $.ajax({
        url: "/" + userType + "/employee-web-app-detail",
        data: {
            employee_id: $('#userId').attr('value'),
            startDate: $('#from').val(),
            endDate: $('#to').val(),
            type: $('#appOption1').val(),
            category: 2,
        },
        method: 'get',
        success: function (resp) {
            if (resp.code === 200) {
                $('#unproductive_detail_table').dataTable().fnClearTable();
                $('#unproductive_detail_table').dataTable().fnDraw();
                $('#unproductive_detail_table').dataTable().fnDestroy();
                $('#unproductive_detail_body').empty();
                manageDataTable('UnProductive', resp.data)
                $('#unproductive_detail').modal('show');
            } else {
                //    show error swal
            }
        },
        error: function (err) {
            //    show error swal
        }
    })
}
function getNeutralDetail() {
    $.ajax({
        url: "/" + userType + "/employee-web-app-detail",
        data: {
            employee_id: $('#userId').attr('value'),
            startDate: $('#from').val(),
            endDate: $('#to').val(),
            type: $('#appOption2').val(),
            category: 0,
        },
        method: 'get',
        success: function (resp) {
            if (resp.code === 200) {
                $('#neutral_detail_table').dataTable().fnClearTable();
                $('#neutral_detail_table').dataTable().fnDraw();
                $('#neutral_detail_table').dataTable().fnDestroy();
                $('#neutral_detail_body').empty();
                manageDataTable('Neutral', resp.data)
                $('#neutral_detail').modal('show');
            } else {
                //    show error swal
            }
        },
        error: function (err) {
            //    show error swal
        }
    })
}
function manageDataTable(tableType, tableData) {
    let tableId = null, tableBody = null, buttonColor = null, data = '', divId = '';
    switch (tableType) {
        case "Productive":
            tableId = '#productive_detail_table';
            tableBody = '#productive_detail_body';
            buttonColor = 'success';
            divId = '#productive_detail';
            break;
        case "UnProductive" :
            tableId = '#unproductive_detail_table';
            tableBody = '#unproductive_detail_body';
            divId = '#unproductive_detail';
            break;
        case "Neutral":
            tableId = '#neutral_detail_table';
            tableBody = '#neutral_detail_body';
            divId = '#neutral_detail';
            break;
        default:
            break;
    }
    _.forEach(tableData, function (user, key) {
        let startDate = moment(new Date(user.start_time)).format('YYYY-MM-DD HH:mm:ss');
        let endDate = moment(new Date(user.end_time)).format('YYYY-MM-DD HH:mm:ss');
        let activeTime = moment().startOf('day').seconds(user.active_seconds).format('HH:mm:ss');
        let totalTime = moment().startOf('day').seconds(user.total_duration).format('HH:mm:ss');
        let idleTime = moment().startOf('day').seconds(user.total_duration - user.active_seconds).format('HH:mm:ss');
        // let urlFormat = user.url.length < 40 ? user.url.toString().substr(0, 40) : user.url.toString().substr(0, 40).concat('...');
        let titleFormat = user.title.length < 40 ? user.title : user.title.toString().substr(0, 40).concat('...');
        data += `<tr><td>${user.organization_apps_webs.name}</td> <td>${titleFormat}</td><td>${startDate}</td><td>${endDate}</td><td>${activeTime} hr</td><td>${idleTime} hr</td><td>${totalTime} hr</td></tr>`;
    });
    $(tableId).dataTable().fnClearTable();
    $(tableId).dataTable().fnDraw();
    $(tableId).dataTable().fnDestroy();
    $(tableBody).empty();
    $(tableBody).append(data);
    $(tableId).DataTable({
        "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
        "language": {"url": DATATABLE_LANG} // declared in _scripts.blade file
    });
    $(divId).modal('show');
}
function breakHistoryData(response) {
    if (response.code === 200) {
        if (response.data.data) {
            $('#breakHistoryTableId').dataTable().fnDestroy();
            $('#breakHistoryDataTableData').empty();
            response.data.data.map(appData => {
                let startTime = moment(new Date(appData.start_time)).format('YYYY-MM-DD HH:mm:ss');
                let endTime = moment(new Date(appData.end_time)).format('YYYY-MM-DD HH:mm:ss');
                let totalBreakTime = moment().startOf('day').seconds(appData.total_break_time).format('HH:mm:ss');
                $('#breakHistoryDataTableData').append('<tr style="text-align: center; font-size: 14px !important;"><td>' + startTime + '</td><td>' + endTime + '</td><td>' + totalBreakTime + ' hr</td></tr>');
            });

            $("#breakHistoryTableId").DataTable({
                "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
                "order": [[2, "desc"]],
                "language": {"url": DATATABLE_LANG} // declared in _scripts.blade file
            });
            BREAK_HISTORY_CHECK = true;
        }else {
            $('#breakHistoryDataTableData').empty();
            $('#breakHistoryDataTableData').append('<tr><td colspan="3" style="text-align: center"> ' + response.message + '</td></tr>');
        }
    } else if (response.code == 404) {
        $('#breakHistoryDataTableData').empty();
        $('#breakHistoryDataTableData').append('<tr><td colspan="3" style="text-align: center"> ' + response.message + '</td></tr>');

        BREAK_HISTORY_CHECK = false;
    } else {
        BREAK_HISTORY_CHECK = false;
        return errorHandler(response.message);
    }
}

function createDeleteTimeRequest() {
    let url = userType === ENV_EMPLOYEE ? '/employee-delete-time' : '/admin-delete-time';
    $.ajax({
        url: '/' + userType + url,
        data: {
            employee_id: document.getElementById('delete_user_id').textContent,
            start_time: $('#deleteTimeStart').val(),
            end_time: $('#deleteTimeEnd').val(),
            date: $('#deleteDate').val(),
        },
        method: 'get',
        success: function (resp) {
            if (resp.code === 200) {
                $('#TimeDeleteReqModal').modal('hide');
                successHandler(resp.message)
                loadDeleteTimeHistory();
            } else {
                errorHandler(resp.message);
                //    show error swal
            }
        },
        error: function (err) {
            //    show error swal
        }
    })
}

function loadTimeDeleteHistoryData(response) {
    if (response.code === 200) {
        if (response.data.deletedTimelineData) {
            $('#timeDeleteHistoryTableId').dataTable().fnDestroy();
            $('#timeDeleteHistoryTableData').empty();
            response.data.deletedTimelineData.map(appData => {
                let startTime = moment(new Date(appData.start_time)).format('YYYY-MM-DD HH:mm:ss');
                let endTime = moment(new Date(appData.end_time)).format('YYYY-MM-DD HH:mm:ss');
                let date = moment(new Date(appData.date)).format('YYYY-MM-DD');
                $('#timeDeleteHistoryTableData').append('<tr style="text-align: center; font-size: 14px !important;"><td>' + date + '</td><td>' + startTime + '</td><td>' + endTime + '</td></tr>');
            });

            $("#timeDeleteHistoryTableId").DataTable({
                "lengthMenu": [[10, 25, 50, 100, 200], [10, 25, 50, 100, 200]],
                "order": [[2, "desc"]],
                "language": {"url": DATATABLE_LANG} // declared in _scripts.blade file
            });
            BREAK_HISTORY_CHECK = true;
        } else {
            $('#timeDeleteHistoryTableData').empty();
            $('#timeDeleteHistoryTableData').append('<tr><td colspan="3" style="text-align: center"> ' + noData + '</td></tr>');
        }
    } else if (response.code == 404) {
        $('#timeDeleteHistoryTableData').empty();
        $('#timeDeleteHistoryTableData').append('<tr><td colspan="3" style="text-align: center"> ' + response.message + '</td></tr>');

        BREAK_HISTORY_CHECK = false;
    } else {
        BREAK_HISTORY_CHECK = false;
        return errorHandler(response.message);
    }
}
