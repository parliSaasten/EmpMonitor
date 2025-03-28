//get-manager-profile-details
function getManagerProfile(userId) {
    $.ajax({
        url: "/" + userType + '/show_details',
        type: 'Post',
        data: {userId},
        beforeSend: function () {
            $('#profile-name').text("");
            $('#profile-email').text("");
            $('#profile-telephone').text("");
            $('#profile-empcode').text("");
            $('#profile-location').text("");
            $('#profile-department').text("");
            $('#profile-date').text("");
            $('#profile-address').text("");
        },
        success: function (response) {
            if (response['code'] == 200) {
                let managerData = response.data;
                //set profile
                $('#profile-name').text(managerData.full_name);
                $('#profile-email').text(managerData.email);
                $('#profile-telephone').text(managerData.phone);
                $('#profile-empcode').text(managerData.emp_code);
                $('#profile-location').text(managerData.location_name);
                $('#profile-department').text(managerData.department_name);
                managerData.date_join ? $('#profile-date').text(managerData.date_join.split('T')[0]) : $('#profile-date').text();
                if (!managerData.address || managerData.address !== 'null') $('#profile-address').text(managerData.address); else $('#profile-address').text();
                if (managerData.photo_path.substring(0, 5) === "https") $("#profile-image").attr("src", managerData.photo_path);
                else $("#profile-image").attr("src", `${location.host}${managerData.photo_path}`);
                // if (managerData.photo_path != "" && managerData.photo_path != "undefined") {
                //     imagePath += managerData.photo_path;
                //     $("#profile-image").attr("src", imagePath);
                // }
            }
        }
    })
}

// Call only for the first time
function getResellerProfileDetails() {
    $.ajax({
        url: "/" + userType + '/reseller-client-detail',
        type: 'Post',
        data: {},
        beforeSend: function () {
            //  Modal Clean
            $('#reseller-first-name, #reseller-last-name, #reseller-user-name, #reseller-email, #reseller-licences, #reseller-expire-date').text('');
        },
        success: function ({data}) {
            // Append Data for Inputs
            $('#reseller-first-name').val(data?.first_name ?? '');
            $('#reseller-last-name').val(data?.last_name ?? '');
            $('#reseller-user-name').val(data?.username ?? $('.userName').html());
            $('#reseller-email').val(data?.email ?? '');
            $('#reseller-licences').val(`Used ${data?.current_user_count} out of ${data?.total_allowed_user_count}, ${data?.total_allowed_user_count - data?.current_user_count} - Licenses left`);
            $('#reseller-expire-date').val(data?.expiry_date.replace(/"/g, '') ?? moment().format('YYYY-MM-DD'));
            noOfUsers = data?.total_allowed_user_count - data?.current_user_count;
            return noOfUsers;
        }
    });
}

let openResellerProfile = () => {
    $("#resellerProfile").modal('show');
    getResellerProfileDetails();
}
//  for updating uninstall passsword
function eyeButton() {
    if ($('#password_field').attr('type') === 'password') {
        $('#password_field').attr('type', 'text');
        $('#passwordEye').attr('class', 'fas toggle-password fa-eye');
    } else {
        $('#password_field').attr('type', 'password');
        $('#passwordEye').attr('class', 'fas toggle-password fa-eye-slash');
    }
}

function updatePassword() {

    if ($('#password_field').val() === "") {
        $('#pass_error').html(uninstall_password_require);
        $("#pass_error").removeAttr("style")
        return false;
    }

    let password = $('#password_field').val();
    $.ajax({
        type: "post",
        url: "/" + userType + "/update-uninstall-password",
        data: {
            password: password,
        },
        beforeSend: function () {
            $('#passwordModal').modal('hide');
        },
        success: function (response) {
            (response.data.code === 200) ? customSuccessHandler(response.data.message) : customErrorHandler(response.data.message);
        },
        error: function () {
            customErrorHandler("Error in data ... ");
        },
    });
}


function uninstallPassword() {

    $.ajax({
        type: "get",
        url: "/" + userType + "/get-uninstall-password",
        data: {},
        beforeSend: function () {
            $('#password_field').val('');
            $('#pass_error').html('');
            $('#password_field').attr('type', 'password');
            $('#passwordEye').attr('class', 'fas toggle-password fa-eye-slash');
        },
        success: function (response) {
            // console.log(response.code);
            if (response.code == 200) {
                $('#password_field').val(response.data.uninstall_password);
            } else {
                customErrorHandler(response.msg)
            }
        },
        error: function () {
            customErrorHandler("Error in data ... ");
        },
    });
}

let change_status = false;

function get2FASettings() {

    $.ajax({
        type: "get",
        url: "/" + userType + "/get-2fa-settings",
        data: {},
        beforeSend: function () {

        },
        success: function (response) {
            let status;
            if (response.code == 200) {
                status = response.data[0].is2FAEnable;
                change_status = true;
                status === 1 ? $('#setting2fa').bootstrapToggle('on') : $('#setting2fa').bootstrapToggle('off');
            } else {
                customErrorHandler(response.msg)
            }
        },
        error: function () {
            customErrorHandler("Error in data ... ");
        },
    });
}

$('#setting2fa').change(function (e) {
    if (change_status) {
        change_status = false;
        return;
    }
    get2FAOTP();
});

function get2FAOTP() {

    $.ajax({
        type: "get",
        url: "/" + userType + "/get-2fa-otp",
        data: {},
        beforeSend: function () {

        },
        success: function (response) {

            if (response.statusCode === 200 && response.data.code === 200) {
                $('#Settings2FAModal').modal('show');
            } else {
                customErrorHandler(response.msg)
            }
        },
        error: function () {
            customErrorHandler("Error in data ... ");
        },
    });
}

function set2FASettings() {

    let status = $('#setting2fa').prop("checked") === true ? 1 : 0;
    $.ajax({
        type: "get",
        url: "/" + userType + "/set-2fa-settings",
        data: {
            status
        },
        beforeSend: function () {
        },
        success: function (response) {
            if (response.statusCode === 200 && response.data.code === 200) {
                customSuccessHandler("Updated Sucessfullly");
                $('#Settings2FAModal').modal('hide');
                $('#digit-1,#digit-2,#digit-3,#digit-4,#digit-5,#digit-6').val('');
            } else {
                customErrorHandler(response.msg)
            }
        },
        error: function () {
            customErrorHandler("Error in data ... ");
        },
    });
}

function check2FAOTP() {
    let email = $('#otp_check_email').val();
    let otp = '' + $('#digit-1').val() + $('#digit-2').val() + $('#digit-3').val() + $('#digit-4').val() + $('#digit-5').val() + $('#digit-6').val();
    $.ajax({
        type: "get",
        url: "/" + userType + "/admin-otp-check",
        data: {
            email, otp
        },
        beforeSend: function () {

        },
        success: function (response) {
            if (response.statusCode === 200 && response.data.code === 200) {
                set2FASettings();
            } else {
                customErrorHandler(response.message);
            }
        },
        error: function () {
            customErrorHandler("Error in data ... ");
        },
    });
}

function resend2FAOTP() {
    let email = $('#otp_check_email').val();
    $.ajax({
        type: "get",
        url: "/" + userType + "/resend-2fa-otp",
        data: {email},
        beforeSend: function () {
        },
        success: function (response) {

            if (response.statusCode === 200 && response.data.code === 200) {
                customSuccessHandler('OTP Sent Sucessfully');
            } else {
                customErrorHandler(response.message);
            }
        },
        error: function () {
            customErrorHandler("Error in data ... ");
        },
    });
}
function clearOTPBox(){
    $('#digit-1,#digit-2,#digit-3,#digit-4,#digit-5,#digit-6').val('');
}
