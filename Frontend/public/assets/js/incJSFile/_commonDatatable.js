//page count of page numbers (U can delete once pageNumber()  function implemented)
let pageNumber = () => {
    $("#SearchErrorMsg").html("");
    $("#PageNumbers").empty();
    $("#PageNumbers").append(' <li class="page-item" id="PC_PREVIOUS" onclick="PageNumberChange(\'PREVIOUS\',1)"><a class="page-link">Previous</a></li>');
    if (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) <= 10) {
        for (let i = 1; i <= Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) + 1; i++) {
            i === 1 ? $("#PageNumbers").append('<li class="page-item active" id="PC_' + i + '"   onclick="PageNumberChange(' + i + ',0)"><a class="page-link">' + i + '</a></li>')
                : $("#PageNumbers").append('<li class="page-item" id="PC_' + i + '"><a class="page-link"  onclick="PageNumberChange(' + i + ',0)">' + i + '</a></li>');
        }
    } else {
        for (let i = 1; i <= Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) + 1; i++) {
            if (i < 5) {
                i === 1 ? $("#PageNumbers").append('<li class="page-item active" id="PC_' + i + '"   onclick="PageNumberChange(' + i + ',0)"><a class="page-link">' + i + '</a></li>')
                    : $("#PageNumbers").append('<li class="page-item" id="PC_' + i + '"><a class="page-link"  onclick="PageNumberChange(' + i + ',0)">' + i + '</a></li>');
            }
            if (i > 5 && i < 8) {
                $("#PageNumbers").append('<p>.</p>')
            }
            if (i === (Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2))) $("#PageNumbers").append('<li class="page-item" id="PC_' + i + '"><a class="page-link"  onclick="PageNumberChange(' + i + ',0)" id="CenterElement">' + i + '</a></li>')
            if (i > ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2))) && i < (((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2))) + 5) && i < (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) - 2)) {
                $("#PageNumbers").append('<p>.</p>')
            }
            if (i > (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) - 2)) {
                $("#PageNumbers").append('<li class="page-item" id="PC_' + i + '"><a class="page-link"  onclick="PageNumberChange(' + i + ',0)">' + i + '</a></li>')
            }
        }
    }
    $("#PageNumbers").append(' <li class="page-item"><a class="page-link" onclick="PageNumberChange(\'NEXT\',1)">Next</a></li>');
    PAGE_COUNT_CALL = false;
};

//on change of page numbers
let PageNumberChange = (PageNumberChanged, Non_number) => {
//here the concept is...Non_number==0 u clicked on numbers instead of prev and next buttons
// Active Page indicates which page u r in currently and PageNumber changed said that clicked on numbers or buttons and gets the value of the number
//    TOTAL_COUNT_EMAILS is the total count / SHOW_ENTRIES is selected entries in UI
//    let SHOW_ENTRIES = "10";let MAIL_DATA;let TOTAL_COUNT_EMAILS = "149"; let ACTIVE_PAGE = 1; declare them as global
    if (Non_number === 0) {
        $("#PC_" + ACTIVE_PAGE).removeClass('page-item active').addClass('page-item');
        $("#PC_" + (PageNumberChanged)).removeClass('page-item').addClass('page-item active');
        ACTIVE_PAGE = PageNumberChanged;
        // '+DATATABLE_LOCALIZE_MSG.showing+ ' the page counts in left side down corner
        PageNumberChanged * SHOW_ENTRIES > TOTAL_COUNT_EMAILS ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + (((PageNumberChanged - 1) * SHOW_ENTRIES) + 1) + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + TOTAL_COUNT_EMAILS + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS)
            : PageNumberChanged === 1 ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 1 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + PageNumberChanged * SHOW_ENTRIES + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS) : $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + (((PageNumberChanged - 1) * SHOW_ENTRIES) + 1) + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + PageNumberChanged * SHOW_ENTRIES + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS);

        if (PageNumberChanged === ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2)))) {
            ACTIVE_PAGE = PageNumberChanged;

            $("#PC_" + ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2)))).removeClass('page-item').addClass('page-item active');
        } else {
            $("#CenterElement").html(((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2))));
            $("#PC_" + ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2)))).removeClass('page-item active').addClass('page-item');
        }
        CalledUserFunction((ACTIVE_PAGE - 1) * SHOW_ENTRIES, $("#SearchTextField").val());
        // emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, TYPE, (ACTIVE_PAGE - 1) * SHOW_ENTRIES);
    } else {
        if (PageNumberChanged === "PREVIOUS" && ACTIVE_PAGE != 1) {
            $("#PC_" + ACTIVE_PAGE).removeClass('page-item active').addClass('page-item');
            $("#PC_" + (ACTIVE_PAGE - 1)).removeClass('page-item').addClass('page-item active');
            ACTIVE_PAGE = ACTIVE_PAGE - 1;
            if (ACTIVE_PAGE > 4 && ACTIVE_PAGE < (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) - 1)) {
                $("#CenterElement").html(ACTIVE_PAGE);
                $("#PC_" + ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2)))).removeClass('page-item').addClass('page-item active');
            } else {
                $("#CenterElement").html(((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2))));
                $("#PC_" + ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2)))).removeClass('page-item active').addClass('page-item');
            }
            ACTIVE_PAGE === 1 ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 1 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + (1 * SHOW_ENTRIES) + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS)
                : ACTIVE_PAGE >= (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) + 1) ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + (((ACTIVE_PAGE - 1) * SHOW_ENTRIES) + 1) + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + TOTAL_COUNT_EMAILS + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS)
                : $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + (((ACTIVE_PAGE - 1) * SHOW_ENTRIES) + 1) + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + (ACTIVE_PAGE * SHOW_ENTRIES) + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS);
            CalledUserFunction((ACTIVE_PAGE - 1) * SHOW_ENTRIES, $("#SearchTextField").val());
            // emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, TYPE, (ACTIVE_PAGE - 1) * SHOW_ENTRIES);

        } else if (PageNumberChanged === "NEXT" && ACTIVE_PAGE !== (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) + 1)) {
            $("#PC_" + ACTIVE_PAGE).removeClass('page-item active').addClass('page-item');
            $("#PC_" + (ACTIVE_PAGE + 1)).removeClass('page-item').addClass('page-item active');
            ACTIVE_PAGE = ACTIVE_PAGE + 1;

            if (ACTIVE_PAGE > 4 && ACTIVE_PAGE < (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) - 1)) {
                $("#CenterElement").html(ACTIVE_PAGE);
                $("#PC_" + ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2)))).removeClass('page-item').addClass('page-item active');
            } else {
                $("#CenterElement").html(((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2))));
                $("#PC_" + ((Math.floor(Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) / 2)))).removeClass('page-item active').addClass('page-item');
            }
            // emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, TYPE, (ACTIVE_PAGE - 1) * SHOW_ENTRIES);
            CalledUserFunction((ACTIVE_PAGE - 1) * SHOW_ENTRIES, $("#SearchTextField").val());
        }
        ACTIVE_PAGE === 1 ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + 1 + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + TOTAL_COUNT_EMAILS + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS)
            : ACTIVE_PAGE >= (Math.floor(TOTAL_COUNT_EMAILS / SHOW_ENTRIES) + 1) ? $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + (((ACTIVE_PAGE - 1) * SHOW_ENTRIES) + 1) + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + TOTAL_COUNT_EMAILS + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS)
            : $("#showPageNumbers").html(' '+DATATABLE_LOCALIZE_MSG.showing+ ' ' + (((ACTIVE_PAGE - 1) * SHOW_ENTRIES) + 1) + ' '+DATATABLE_LOCALIZE_MSG.to+' ' + (ACTIVE_PAGE * SHOW_ENTRIES) + ' '+DATATABLE_LOCALIZE_MSG.of+' ' + TOTAL_COUNT_EMAILS);
        if (ACTIVE_PAGE === 1) $("#PC_1").removeClass('page-item').addClass('page-item active');
    }
};

//on change of show entries list
$("#ShowEntriesList").on('change', function () {
    SHOW_ENTRIES = $(this).find('option:selected').attr('id');
    // emailMonitoring(LOCATION_ID, DEPARTMENT_ID, EMPLOYEE_ID, START_DATE, TO_DATE, CLIENT_ID, SHOW_ENTRIES, 0, 0);
    $("#PageNumbers").empty()
    PAGE_COUNT_CALL = true;
    ACTIVE_PAGE = 1;
    CalledUserFunction(0, $("#SearchTextField").val());
});

//search text field to get the text
let SearchText = () => {
    $("#SearchErrorMsg").html("");
    $("#SearchButton").attr('disabled', true);
    ($("#SearchTextField").val().length >= 3 || $("#SearchTextField").val() == "") ? (PAGE_COUNT_CALL = true,  ACTIVE_PAGE = 1, CalledUserFunction(0, $("#SearchTextField").val()), $("#SearchErrorMsg").html(""))
        : ($("#SearchErrorMsg").html("Please, Search with minimum three letters"), $("#SearchButton").attr('disabled', false));

};

//to make the datatable as default means make it starting
let makeDefaultDatatable = () => {
    ACTIVE_PAGE = 1;
    PAGE_COUNT_CALL = true;
    $("#SearchTextField").val("");
    $("#SearchErrorMsg").html("");
};
