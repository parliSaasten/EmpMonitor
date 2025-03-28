function errorHandler(message) {
    Swal.fire({
        icon: 'error',
        title: DASHBOARD_JS[message] || message || 'error',
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        timer: 4000
    });
}

function successHandler(message) {
    Swal.fire({
        icon: 'success',
        title: DASHBOARD_JS[message] || message || 'success',
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        timer: 4000
    });
}
function infoHandler(message) {
    Swal.fire({
        icon: 'info',
        title: DASHBOARD_JS[message] || message || 'success',
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        timer: 4000
    });
}
function errorHandlerWithNames(message, names) {
    let inputOptions;
    names !== undefined ? inputOptions = names : inputOptions = null;
    Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        inputOptions
    });
}

//These are the sweet alerts with some delay
//success swal alert message
function successSwal(msg) {
    setTimeout(function () {
        Swal.fire({
            position: 'inherit',
            icon: 'success',
            title: DASHBOARD_JS[msg] || msg || 'success',
            showConfirmButton: false,
            timer: 1500
        });
    }, 500)

}

//error swal alert
function errorSwal(msg, text) {
    var message = msg != null ? msg : "Please, Reload and try again...";
    var textMessage = text != null ? text : "";
    setTimeout(function () {
        Swal.fire({
            icon: 'error',
            title:msg,
            text: textMessage,
            showConfirmButton: true,
            confirmButtonText: DASHBOARD_JS.ok??'OK',
        });
    }, 500)
}

//    warning alert for select any one option in the list
function warningAlert(title, txt) {
    var txtmsg = txt != undefined ? txt : "";
    var titlemsg = title != undefined ? title : "Please select any one option"
    Swal.fire({
        position: 'inherit',
        icon: 'warning',
        title: titlemsg,
        text: txtmsg,
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
    });
}

//    warning alert for select any one option in the list
function warningAlertWithAutoTime(title, txt) {
    Swal.fire({
        icon: 'warning',
        title: title ?? 'Warning',
        text: txt ?? "Check the Inputs again",
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        timer: 2000
    });
}

function warningHandler(message) {
    Swal.fire({
        icon: "warning",
        title: warning_Swal_msg,
        text: message,
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        timer: 4000
    })
}

function customSuccessHandler(message) {
    Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        timer: 4000
    });
}

function customErrorHandler(message) {
    Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: true,
        confirmButtonText: DASHBOARD_JS.ok??'OK',
        timer: 4000
    });
}


window.document.onload = function(e){ 
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
}
