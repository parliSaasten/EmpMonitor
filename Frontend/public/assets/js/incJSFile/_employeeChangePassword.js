function changePassword() {
    let new_pwd = $('#new_pwd').val();
    let conf_pwd = $('#conf_pwd').val();
    if (new_pwd == "") {
        $('#fg-pwd-error').text('Password is required');
        return;
    } else $('#fg-pwd-error').text('');
    if (conf_pwd == "") {
        $('#confirm-pwd-err').text('Confirm password is required');
        return;
    } else {
        $('#confirm-pwd-err').text('');
    }
    if (new_pwd === conf_pwd) {
        $.ajax({
            url: "manager/change-password",
            data: {
                new_password: new_pwd,
                confirmation_password: conf_pwd
            },
            type: 'POST',
            beforeSend: function () {
                $('#change-pwd-btn').prop('disabled', true);
                $('#confirm-pwd-err').text('');
                $('#fg-pwd-error').text('');
            },
            success: function (response) {
                $('#change-pwd-btn').prop('disabled', false);
                if (response.code == 406) {
                    $.each(response.validator, function (index, value) {
                        switch (index) {
                            case "new_password":
                                document.getElementById('fg-pwd-error').innerHTML = value;
                                break;
                            case "confirmation_password":
                                document.getElementById('confirm-pwd-err').innerHTML = value;
                                break;
                        }
                    })
                } else if (response['code'] === 200) {
                    $("#new_pwd").val('');
                    $("#conf_pwd").val('');
                    $('#changePassword').modal('hide');
                    Swal.fire({
                        icon: 'success',
                        title: response.message,
                        showConfirmButton: false
                    });
                    $('#psw').html(new_pwd + ' <a href="#" style="color: blue" data-toggle="modal" data-target="#changePassword">Change?</a>');
                } else {
                    $('#change-pwd-btn').prop('disabled', false);
                    Swal.fire({
                        icon: 'error',
                        title: response.message,
                        showConfirmButton: true
                    });
                }
            },
            error: function (error) {
                $('#change-pwd-btn').prop('disabled', false);
                $("#new_pwd").val('');
                $("#conf_pwd").val('');
                $('#changePassword').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: "Something went wrong...",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        })
    } else {
        $('#confirm-pwd-err').text('Password and Confirm Password must be same');
        return;
    }
}
