function errorHandler(message) {
    Swal.fire({
        icon: 'error',
        title: message,
        showConfirmButton: true,
        timer: 4000
    });
}

function successHandler(message) {
    Swal.fire({
        icon: 'success',
        title: message,
        showConfirmButton: true,
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
        inputOptions
    });
}

