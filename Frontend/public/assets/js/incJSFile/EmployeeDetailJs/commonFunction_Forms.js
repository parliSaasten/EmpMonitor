let fileinput = false ;
//for getting the single user detials
function getdetails(id, test, details) {
    $("#valid-msgs").html("");
    $("#error-msgs").html("");
    let userId = (id != undefined) ? ($("#FormCalled").val(1), id) : ($("#FormCalled").val(2) , $(".edit-loc").attr('value', $('#userId').attr('value')), ($('#userId').attr('value')));
    if ($("#FormCalled").val() === '2') details = 0;
    TimeZones();
    $('#password-editEmp').attr('type', 'password');
    $('#cpassword-editEmp').attr('type', 'password');
    $('#ErrorsName').text("");
    $('#ErrorsFullName').text("");
    $('#ErrorsEmailAddress').text("");
    $('#ErrorsPaswd').text("");
    $('#ErrorsCPaswd').text("");
    $('#ErrorsContact').text("");
    $('#ErrorsEmpCode').text(""); 
    $("#emp_emailAddress").prop("readonly", false);
     let input = document.querySelector("#Edittelephones");
    let countryData = edititi.getSelectedCountryData();
    let dialCode = countryData.dialCode;
    $("#Emp-edit").trigger("reset");
    $.ajax({
        type: "post",
        url: "/" + userType + '/show_details',
        data: {
            userId,
            editOption: details
        },
        beforeSend: function () {
              $(".js-example-tokenizer").val([]); 
        },
        success: function (response) {
            let data = response.data; 
             $('#Name').val(data.first_name);
            $('#fullName').val(data.last_name);
            $('#emp_emailAddress').val(data.email);
            (data.mobile_number != "" && data.mobile_number!="null" )? $('#Edittelephones').val(data.mobile_number) : null;
            $('#emp_code').val(data.employee_code);
            $('#Employeeaddress').val(data.address); 
            $('#password-editEmp').val(data.password);
            $('#cpassword-editEmp').val(data.password);
            $("#timezoneAddendEdit option[value='" + data.time_zone + "']").attr('selected', 'selected');
               
            if (data.mobile_number != "" && data.mobile_number != null && data.mobile_number != 'null') {
                let phoneNumber = data.mobile_number.split("-");
                let phoneNum = "+" + phoneNumber[0] + phoneNumber[1];
                (phoneNumber[0] && phoneNumber[1]) ? edititi.setNumber(phoneNum) : $('#Edittelephones').val('');
            }
            // if (data.photo_path.substring(0, 5) === "https") {
            //     $("#img").attr("src", data.photo_path);
            // } else {
            //     $("#img").attr("src", envApiHost + data.photo_path);
            // } 
            current_Emp = data.id;
         },
        error: function () {
            errorSwal()
        },
        complete:function(){
            getToAssignedDetails();
        },
    });
    $('#editEmpModal').css('z-index', '1050');
}
let readURL = function (input) {
    if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.onload = function (e) {
            $('.profile-pic').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
};
$("#profilepicupload").on('change', function () {
    if (imageValidation())
        readURL(this);
    else
        return false;
});

function imageValidation() {
    const fileSize = document.getElementById("profilepicupload").files[0];
    const path = document.getElementById("profilepicupload").value;
    const fileName = path.split("\\").pop();
    let file_extension = fileName.split('.').pop().toLowerCase();
    if (!(file_extension === "png" || file_extension === "jpeg" || file_extension === "jpg")) {
        fileinput = true;
        errorSwal(imagetype);
        return false;
    } else if (fileSize.size > 500000) {
        fileinput = true;
        errorSwal(imagesize);
        return false;
    }
    fileinput = false;
    return true;
}

//        Edit employeee details
$(document).on('submit', '#Emp-edit', function (e) {
    e.preventDefault();
    let input = document.querySelector("#Edittelephones");
    let countryData = edititi.getSelectedCountryData();
    let dialCode = countryData.dialCode;
    let form = document.getElementById('Emp-edit');
    let formData = new FormData(form);
    let locId = $("#locations-editEmp option:selected").attr('id');
    let depId = $("#Empedit_departments option:selected").attr('id');
    let roleId = $("#role-EditEmployee option:selected").attr('id');
    let RoleId = [];
    let id = $("#role-EditEmployee").select2('data');
    id.forEach(function (dept) {
        RoleId.push(dept.id);
    });
    let timezoneAddendEdit = $("#timezoneAddendEdit option:selected").attr('data-offset');
    let timezoneName = $("#timezoneAddendEdit option:selected").attr('data-zone');
    let ContactCheck = $("#validContactEdit").val();
    formData.append('locId', locId);
    formData.append('depId', depId);
    formData.append('roleId', RoleId.toString());
    formData.append('CountryCode', dialCode);
    formData.append('timeZoneOffset', timezoneAddendEdit);
    formData.append('timeZoneName', timezoneName);
    formData.append('ContactCheck', ContactCheck);
    fileinput && formData.delete('file');
    formData.append('EDmobileTracking', $("#EDmobileTracking").prop("checked")? 'on' : 'off');
    // formData.append('manager_role_id', $('#role_id_to_get_managers').val());
    // formData.append('assigned_manager', $('#selectedManagerList').val());
    $.ajax({
        type: "post",
        url: "/" + userType + '/Emp-edit',
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('#emp-edit').attr("disabled", true);
            $("#loaderForm").css('display', 'block');
            $('#ErrorsName').text("");
            $('#ErrorsFullName').text("");
            $('#ErrorsEmailAddress').text("");
            $('#ErrorsPaswd').text("");
            $('#ErrorsCPaswd').text("");
            $('#ErrorsContact').text("");
            $('#ErrorsEmpCode').text("");
            $('#ErrorsLocationId').text("");
            $('#ErrorsDeptIdMessage').text("");
            $('#ErrorsAddressBox').text("");
            $('#ErrorsRoleIdError').text("");
        },
        success: function (response) {
            $.each(response, function (index, value) {
                $("#loaderForm").css('display', 'none');
                switch (index) {
                    case "name":
                        document.getElementById('ErrorsName').innerHTML = EMPLOYEE_DETAILS_ERROR.firstName;
                        break;
                    case "Full_name":
                        document.getElementById('ErrorsFullName').innerHTML = EMPLOYEE_DETAILS_ERROR.lastName;
                        break;
                    case "email":
                        document.getElementById('ErrorsEmailAddress').innerHTML =EMPLOYEE_DETAILS_ERROR.emailError;
                        break;
                    case "password":
                        // if (response.password[0] == 'The password field is required.') document.getElementById('ErrorsPaswd').innerHTML = EMPLOYEE_DETAILS_ERROR.password_field_required;
                        // if (response.password[0] == 'The password format is invalid.') document.getElementById('ErrorsPaswd').innerHTML = EMPLOYEE_DETAILS_ERROR.password_invalid;
                        document.getElementById('ErrorsPaswd').innerHTML = value[0];
                        break;
                    case "confirmPassword":
                        document.getElementById('ErrorsCPaswd').innerHTML = EMPLOYEE_DETAILS_ERROR.passMissmatch;
                        break;
                    case "number":
                        document.getElementById('ErrorsContact').innerHTML = response.number;
                        break;
                    case "EmpCode":
                        document.getElementById('ErrorsEmpCode').innerHTML = EMPLOYEE_DETAILS_ERROR.empCodeError;
                        break;
                    case "locId":
                        document.getElementById('ErrorsLocationId').innerHTML = EMPLOYEE_DETAILS_ERROR.empLocationError;
                        break;
                    case "depId":
                        document.getElementById('ErrorsDeptIdMessage').innerHTML = EMPLOYEE_DETAILS_ERROR.empDeptError;
                        break;
                    case "address":
                        document.getElementById('ErrorsAddressBox').innerHTML = EMPLOYEE_DETAILS_ERROR.empAdressError;
                        break;
                    case "roleId":
                        document.getElementById('ErrorsRoleId').innerHTML = EMPLOYEE_DETAILS_ERROR.empRoleError;
                        break;
                    case "date":
                        document.getElementById('Join').innerHTML = EMPLOYEE_DETAILS_ERROR.empDOJError;
                        break;
                    case "TimeZoneOffeset":
                        document.getElementById('ErrorTimeZoneField').innerHTML = EMPLOYEE_DETAILS_ERROR.empTimezoneError;

                }
            })
            if (response.code == 200) {
                let id = response.data.data[0].id;
                let appendData = "", check = "", names = [];
                let rowId = response.data.data[0].id;
                let editResponse = response.data.data[0];
                $('#editEmpModal').modal('hide');
                customSuccessHandler(response.msg)
                $('#emp-edit').attr("disabled", false);
                $("#loaderForm").css('display', 'none');
                document.getElementById('Emp-edit').reset();
                if ($("#FormCalled").val() == 1) {
                    $('#fn' + rowId + '').html(editResponse.full_name);
                    $('#em' + rowId + '').html(editResponse.email);
                    $('#lo' + rowId + '').html(editResponse.location_name);
                    $('#dpt' + rowId + '').html(editResponse.department_name);
                    $('#ec' + rowId + '').html(editResponse.emp_code);
                    if (userType === "admin" || $("#PermissionData").data('list').some(obj => obj.permission === "employee_user_setting")) {
                        appendData += '<a href="track-user-setting?id=' + id + '" title="track-user-setting   " class="mr-2"><i class="fas fa-cog text-primary"></i></a>';
                    }
                    editResponse.roles.forEach(function (roles) {
                        names.push(roles.name);
                    });
                    if (editResponse.status == 1) {
                        if (editResponse.roles.length > 1) {

                            appendData += '<a  href="#" onclick="ManagerList(' + id + ',2)" class="open-editModal text-warning mr-2"  data-toggle="modal" data-target="#ManagerUsersModal"  data-id="' + id + '"><i class="fa fa-eye" style="margin-left: 2px; color:black " data-toggle="tooltip" data-placement="top" title="Employee Is Not Assigned" ></i></a>';
                            if (userType === "admin" || $("#PermissionData").data('list').some(obj => obj.permission === "employee_assign_employee")) {
                                appendData += '<a  href="#" onclick=" getRoles()" class="open-editModal text-success mr-2"  data-toggle="modal" data-target="#MultiManagerModal"  data-id="' + id + '"><i class="far fa-arrow-alt-circle-up fa-fw" data-toggle="tooltip" data-placement="top" title="Assign Employee" ></i></a>';
                            }
                        } else if (editResponse.roles.length === 1) {
                            if ((editResponse.roles[0].name).toLowerCase() == "employee") {
                                appendData += '<a id="editedId" href="#" onclick="ManagerList(' + id + ',2)" class="open-editModal text-warning mr-2 disabled_effect"  data-toggle="modal" data-target="#ManagerUsersModal"  data-id="' + id + '"><i class="fa fa-eye" style="margin-left: 2px; color:black " data-toggle="tooltip" data-placement="top" title="Employee Is Not Assigned" ></i></a>';
                                if (userType === "admin" || $("#PermissionData").data('list').some(obj => obj.permission === "employee_assign_employee")) {
                                    appendData += '<a  href="#" onclick=" getRoles()" class="open-editModal text-success mr-2"  data-toggle="modal" data-target="#MultiManagerModal"  data-id="' + id + '"><i class="far fa-arrow-alt-circle-up fa-fw" data-toggle="tooltip" data-placement="top" title="Assign Employee" ></i></a>';
                                }
                            } else {

                                appendData += '<a  href="#" onclick="ManagerList(' + id + ',2)" class="open-editModal text-warning mr-2"  data-toggle="modal" data-target="#ManagerUsersModal"  data-id="' + id + '"><i class="fa fa-eye" style="margin-left: 2px; color:black " data-toggle="tooltip" data-placement="top" title="Employee Is Not Assigned" ></i></a>';
                                if (userType === "admin" || $("#PermissionData").data('list').some(obj => obj.permission === "employee_assign_employee")) {
                                    appendData += '<a href="#" onclick=" getRoles()" class="open-editModal text-success mr-2"  data-toggle="modal" data-target="#MultiManagerModal"  data-id="' + id + '"><i class="far fa-arrow-alt-circle-up fa-fw" data-toggle="tooltip" data-placement="top" title="Assign Employee" ></i></a>';
                                }
                            }
                        }
                        if (userType === "admin" || $("#PermissionData").data('list').some(obj => obj.permission === "employee_change_role")) {
                            appendData += '<a id="upgrade" class="open-upgradeModal text-success mr-2 "  href="#"  data-toggle="modal" onclick="getRoles(' + editResponse.roles[0].role_id + ',null,' + id + ')" data-target="#upgradeManagerModal" title="Update The Role"  data-id="' + id + '"><i class="fas fa-arrow-up fa-fw" data-toggle="tooltip" data-placement="top" ></i></a>';
                        }
                    }
                    if (userType === "admin" || $("#PermissionData").data('list').some(obj => obj.permission === "employee_modify")) {
                        appendData += '<a  onclick="getdetails(' + id + ', 2, 0)" id="editedId"  class="open-editModal text-success mr-2"  href="#"  data-toggle="modal" data-target="#editEmpModal" title="Edit Employee"  data-id="' + id + '"><i class="fas fa-user-edit fa-fw" data-toggle="tooltip" data-placement="top" ></i></a>';
                    }
                    if (userType === "admin" || $("#PermissionData").data('list').some(obj => obj.permission === "employee_delete")) {
                        appendData += '<a id="delete" class="open-editModal text-danger mr-2" href="#"  data-toggle="modal" data-target="#DeleteSingleModal" title="Delete Employee" data-id="' + id + '"> <i class="far fa-trash-alt" data-toggle="tooltip" data-placement="top"></i></a>';
                        appendData += '<a onclick="getSuperiorData(' + id + ')" data-toggle="modal" data-target="#superiorRolesModal" title="' + EMPLOYEE_DETAILS_CONST.superiordetails + '"> <i class="fa fa-eye text-primary" data-toggle="tooltip" data-placement="top"></i></a>';
                        appendData += '<a data-toggle="modal" class="text-danger mr-2" title="' + EMPLOYEE_DETAILS_CONST.logout + '" id="emplogout" onclick ="logoutEmp(' + id + ')" style="padding-left:5px"> <i class="fas fa-sign-out-alt" data-toggle="tooltip" data-placement="top" ></i></a>';
                    }
                    if (names.length === 1) $('#ro' + rowId + '').html(names.toString());
                    else {
                        $('#ro' + id + '').html(names.toString().substring(0,8)+'..');
                        $("#ro" + id).attr('title', names.toString());
                    }
                    $('#act' + id + '').html(appendData);
                    $('#sus' + id + '').html(appendData);
                    let SLI = editResponse.location_id;
                    let SDI = editResponse.department_id;
                    let SRI = editResponse.role_id;
                    if (LocationId) var LI = LocationId;
                    else var LI = "0";
                    if (RoleId) var RI = RoleId;
                    else var RI = "0";
                    if (DI != "") var DI = DepartementId.split(",");
                    else var DI = 0;
                    let DIStutus = false;
                    if (DI != 0 && DI.length != 0) {
                        for (i = 0; i < DI.length; i++) {
                            if (DI[i] == SDI) {
                                DIStutus = false;
                                break;
                            } else DIStutus = true;
                        }
                    }
                    if ((LI != 0 && SLI != LI && LI != "") || DIStutus) {
                        $("#empDetails_Table").dataTable().fnDestroy();
                        $('table#empDetails_Table tr#' + rowId + '').remove();
                        // $("#empDetails_Table").DataTable({
                        //     stateSave: true,
                        //     "scrollX": true,
                        // });
                    }

                } else $("#userId").html(editResponse.full_name)
                reInitializeFilters();
            } else if (response.code == 404 || response.code == 400) {
                errorSwal(response.msg, response.error)
                $('#emp-edit').attr("disabled", false);
            }
            $('#emp-edit').attr("disabled", false);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            if (jqXHR.status == 410) {
                $("#UnaccessModal").empty();
                $("#UnaccessModal").css('display', 'block');
                $("#UnaccessModal").append('<div class="alert alert-danger text-center"><button type="button" class="close" data-dismiss="alert" >&times;</button><b  id="ErrorMsgForUnaccess"> ' + jqXHR.responseJSON.error + '</b></div>')
            } else errorSwal(DASHBOARD_JS_ERROR.reload);
            $('#editEmpModal').modal('hide');
            $("#loaderForm").css('display', 'none');
        }
    });
});

function reInitializeFilters() {
    GetLocation_role((RoleId == 0 || RoleId == "") ? 0 : RoleId);
    getDepartments((getCookie("LocationIdCookie") == 0 || getCookie("LocationIdCookie") == "") ? 0 : getCookie("LocationIdCookie"), RoleId);
    setTimeout(updateSelectedVlaues, 2000);
}

function updateSelectedVlaues(){
    $("#locations option[id=" + LocationId + "]").attr("selected", "selected");
    selectedDepartements();
}

//for getting the departement in edit form
function getDepartmentsEdit(LocationId, deptId) {
    let location = 0;
    if (LocationId == "" || LocationId == 0) {
        location = 0;
    } else location = LocationId;
    $.ajax({
        type: "get",
        url: "/" + userType + '/get-department-by-location',
        data: {id: location},
        beforeSend: function () {
            $('#EmpReg_departments').empty();
            $('#Empedit_departments').empty();
        },
        success: function (response) {
            if (response.code == 200) {
                let departmentsDropdown = '';
                $('#EmpReg_departments').append('<option selected>'+EMP_DROPDOWN_TEXT.selDept+'</option>')
                $('#Empedit_departments').append('<option selected>'+EMP_DROPDOWN_TEXT.selDept+'</option>')
                let departmentsData = response.data;
                for (let i = 0; i < departmentsData.length; i++) {
                    departmentsDropdown += '<option id="' + departmentsData[i].department_id + '"  value="' + departmentsData[i].name  + '"> ' + departmentsData[i].name + '</option>';
                }
                $('#Empedit_departments').append(departmentsDropdown);
                $('#EmpReg_departments').append(departmentsDropdown);
                if (deptId != 0) $("#Empedit_departments option[id='" + deptId + "']").attr("selected", "selected");
            } else {
                $('#EmpReg_departments').append('<option selected disabled>'+noValue+' '+DEPARTMENT_MSG+'</option>')
                $('#Empedit_departments').append('<option selected disabled>'+noValue+' '+DEPARTMENT_MSG+'</option>')
            }
        },
        error: function () {
            errorSwal()
        }
    });
}

//on-change of locations: get department by location in dashboard
$("#locations-editEmp").change(function () {
    let id = $(this).children(":selected").attr("id");
    getDepartmentsEdit(id, 0);
});

//function for loading the timezones
function TimeZones() {
    $("#timeZoneAppend").empty();
    $("#timezoneAddendEdit").empty();
    $('#timeZoneAppend').append('<option id="" data-offset="" disabled selected>'+SELECT_MSG+' '+TIMEZONE_LOCALE_MSG+'</option>')
    $('#timezoneAddendEdit').append('<option id="" data-offset="" disabled selected>'+SELECT_MSG+' '+TIMEZONE_LOCALE_MSG+'</option>')
    timezones.forEach(function (zone, i) {
        $('#timeZoneAppend').append('<option id="tz-opt-' + i + '"  data-zone="' + zone.zone + '" data-offset="' + zone.offset + '">' + zone.name + '</option>')
        $('#timezoneAddendEdit').append('<option id="tz-opt-' + i + '" value="' + zone.zone + '" data-zone="' + zone.zone + '" data-offset="' + zone.offset + '">' + zone.name + '</option>')
    })
}

function numbersOnly(event) {
    let k;
    document.all ? k = event.keyCode : k = event.which;
    return (k == 8 || (k >= 48 && k <= 57));
}

function alphaOnly(event, name) {
    if (name == 1) {
        clearErrorMsgs(name);
        const inputField = event.target;
        const currentValue = inputField.value;
        const key = event.key;
        if (
            key === "Backspace" ||
            key === "ArrowLeft" ||
            key === "ArrowRight" ||
            key === "Delete"
        ) {
            return true;
        }

        let alphaOnlyRegex = /^[a-zA-Zء-ي]+( [a-zA-Zء-ي]*)?$/;
        const updatedValue = currentValue + key;

        if (!/^[a-zA-Zء-ي ]$/.test(key) || !alphaOnlyRegex.test(updatedValue)) {
            return false;
        }

        return true;
    } else if (name == 2) {
        clearErrorMsgs(name);
        let alphaOnlyRegex = /^[a-zA-Zء-ي]+$/;
        return alphaOnlyRegex.test(event.key);
    }
}

function onspace (e,field){
    clearErrorMsgs(field);
    if (e.which == 32) return false;
}

//on keydown clear the error messages
let clearErrorMsgs = (field) => {
    switch (field) {
        case 1:
            $('#usrname').text(""), $('#ErrorsName').text("");
            break;
        case 2:
            $('#FullName').text(""), $('#ErrorsFullName').text("");
            break;
        case 'email':
            $('#EmailAddress').text(""), $('#ErrorsEmailAddress').text("");
            break;
        case 'pswd':
            $('#Paswd').text(""), $('#ErrorsPaswd').text(""), $('#ErrorsPaswd').text("");
            break;
        case 'cpswd':
            $('#CPaswd').text(""), $('#ErrorsCPaswd').text("");
            break;
        case 'TZ':
            $('#ErrorTimeZone').text("");
            break;
        case 'loc':
            $('#ErrorLocationId').text(""), $('#ErrorsLocationId').text("");
            break;
        case 'rol':
            $('#RoleIdError').text(""), $('#ErrorsRoleIdError').text("");
            break;
        case 'dept':
            $('#DeptIdErrorMessage').text(""), $('#ErrorsDeptIdMessage').text("");
            break;
        case 'Ecode':
            $('#EmpCodeError').text(""), $('#ErrorsEmpCode').text("");
    }

};

// // Vanilla Javascript
let edit_tel = document.querySelector("#Edittelephones");
let edititi= window.intlTelInput(edit_tel, {
    utilsScript: "../assets/plugins/intel-tel-input/utils.js",
    initialCountry: "in",
    separateDialCode: true,
    customContainer: "col-md-12 no-padding intelinput-styles"
});
let edit_errorMsg = document.querySelector("#error-msgs"),
    edit_validMsg = document.querySelector("#valid-msgs");
let edit_errorMap = [phone_number_error_msg.invalid_number, phone_number_error_msg.invalid_country_code, phone_number_error_msg.too_short, phone_number_error_msg.too_long];
let edit_reset = function () {
    $('#Contact').text("");
    edit_tel.classList.remove("error");
    edit_errorMsg.innerHTML = "";
    edit_errorMsg.classList.add("visable");
    edit_validMsg.classList.add("visable");
};
// on blur: validate
edit_tel.addEventListener('blur', function () {
    edit_reset();
    if (edit_tel.value.trim()) {
        if (edititi.isValidNumber()) {
            $("#validContactEdit").val(1);
            edit_validMsg.classList.remove("visable");
            $('#valid-msgs').html('valid');

        } else {
            $("#validContactEdit").val(5);
            $('#valid-msgs').text("");
            edit_tel.classList.add("error");
            let errorCode = edititi.getValidationError();
            edit_errorMsg.innerHTML = edit_errorMap[errorCode];
            edit_errorMsg.classList.remove("visable");
        }
    }
});

$(".js-example-tokenizer").select2({
    tokenSeparators: [",", " "]
});

/**
 * *For initialize the explorer for edit option
 */
// let readURL = function (input) {
//     if (input.files && input.files[0]) {
//         let reader = new FileReader();
//         reader.onload = function (e) {
//             $('.profile-pic').attr('src', e.target.result);
//         }
//         reader.readAsDataURL(input.files[0]);
//     }
// };

// $(".file-upload").on('change', function () {
//     readURL(this);
// });
$(".upload-button").on('click', function () {
    $(".file-upload").click();
});


function getManagerList() {
    let RoleId = $('#role_id_to_get_managers').val();
    $.ajax({
        type: "get",
        url: "/" + userType + "/Manager-list",
        data: {
            RoleId, AssignedId: null
        },
        beforeSend: function () {
            $("#selectedManagerList").empty();
            $("#selectedManagerList").select2({
                dropdownParent: $("#selectedManagerList").parent(),
                allowClear: true
            });
        },
        success: function (response) {
            if (response.code === 200) {
                response.data.forEach(function (roles) {
                    if (current_Emp != roles.id) {
                        let status = (jQuery.inArray(roles.id, superior_ids) !== -1) ? 'selected' : '';
                        $("#selectedManagerList").append('<option ' + status + ' value="' + roles.id + '">' + roles.full_name + '</option>');
                        $("#selectedManagerList").attr('multiple', 'multiple');
                    }
                })
            }
        },
    });
}

function getToAssignedDetails() {

    let role_id = $('#role_id_to_get_managers').val();
    if (role_id === '0') {
        $("#selectedManagerList").attr("disabled", true);
        $("#selectedManagerList").empty();
        return false;
    } else {
        $("#selectedManagerList").attr("disabled", false);
    }

    $.ajax({
        type: "get",
        url: "/" + userType + "/to-assigned-details",
        data: {
            user_id: current_Emp, role_id
        },
        beforeSend: function () {
        },
        success: function (response) {
            superior_ids = [];
            response = JSON.stringify([response.data]);
            response = JSON.parse(response);
            response.forEach(function (data) {
                superior_ids.push(data.superior_id);
            })
        },
        complete: function () {
            getManagerList();
        },
    });
}
