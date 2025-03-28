//function for the getting departments by selected location
//if employee details page use param 0  else use param  1
function getDepartments(LocationId, param, role) {
    let location = 0;
    if (LocationId == "" || LocationId == 0) {
        location = 0;
    } else location = LocationId;
    let roleId = (role == "" || role == 'undefined' || role =='0') ? "" :role;
    if (getCookie("LocationIdCookie") != 0 && param === 0) location = CryptoJS.AES.decrypt(getCookie("LocationIdCookie").toString(), COOKIE_CONFIG_KEY).toString(CryptoJS.enc.Utf8);
    $.ajax({
        type: "get",
        url: "/" + userType + '/get-department-by-location',
        data: {id: location,roleId},
        beforeSend: function () {
            $('#departmentsAppend').empty();
            $('#DepartmentAppend').empty();
            $('#DepartmentAppendweb').empty();
        },
        success: function (response) {
            let departmentsDropdown = '';
            if (response.code == '200') {
                var departmentsData = response.data;
                $('#DepartmentAppend').append('<option  value="">'+WEB_APP_MODULE.All_Departments+'</option>');
                $('#DepartmentAppendweb').append('<option selected value="">'+WEB_APP_MODULE.All_Departments+'</option>');
                if (departmentsData[0].id) {
                    for (i = 0; i < departmentsData.length; i++) {
                        departmentsDropdown += '<option value="' + departmentsData[i].department_id + '"> ' + departmentsData[i].name + '</option>';
                    }
                } else {
                    for (i = 0; i < departmentsData.length; i++) {
                        departmentsDropdown += '<option value="' + departmentsData[i].department_id + '"> ' + departmentsData[i].name + '</option>';
                    }
                }
                $('#departmentsAppend').append(departmentsDropdown);
                $('#DepartmentAppend').append(departmentsDropdown);
                $('#DepartmentAppendweb').append(departmentsDropdown);


            } else {
                departmentsDropdown += '<option disabled>' + response.msg + '</option>';
                $('#departmentsAppend').append(departmentsDropdown);
                $('#DepartmentAppend').append(departmentsDropdown);
                $('#DepartmentAppendweb').append('<option disabled selected>'+WEB_APP_MODULE.NoDept+'</option>');
            }
            selectedDepartements()
        },
        error: function () {
            errorSwal()
        }
    });
}

function selectedDepartements() {
    let SelectedDept = [];
    let departmentCookie = CryptoJS.AES.decrypt(getCookie("DepartmentCookie").toString(), COOKIE_CONFIG_KEY).toString(CryptoJS.enc.Utf8);
    if (departmentCookie != "" && departmentCookie != '0') {
        SelectedDept = departmentCookie.split(",");
    }
    if (SelectedDept.length != 0) {
        for (let i = 0; i < SelectedDept.length; i++) {
            $('#departmentsAppend option[value=' + SelectedDept[i] + ']').prop('selected', true);
            let deptIds = new Array();
            deptIds.push(SelectedDept[i]);
            let id_s = deptIds.toString();
            DepartementId = id_s;
        }
    }
}

// for employee filtration
function getEmployee(loc_id, dept_id) {
    $.ajax({
        url: "/" + userType + "/get-emp-by-loc-id",
        method: 'post',
        data: {
            loc_id: loc_id,
            dept_id: dept_id
        },
        beforeSend: function () {
            $("#EmployeeData").empty();
        },
        success: function (response) {
            if (response.code == '200') {
                if (response.data.code == '200' && response.data.data != 'null') {
                    $("#EmployeeData").append('<option id="">'+WEB_APP_MODULE.All_Employees+'</option>');
                    response.data.data.map(function (emp) {
                        $("#EmployeeData").append('<option id="' + emp.id + '">' + emp.first_name + " " + emp.last_name + '</option>');
                    })
                } else $("#EmployeeData").append('<option selected disabled>'+WEB_APP_MODULE.no_employee_found+'</option>');
            } else $("#EmployeeData").append('<option selected disabled>'+WEB_APP_MODULE.no_employee_found+'</option>');
        },
        error: function (err) {
            $("#EmployeeData").append('<option selected disabled>'+WEB_APP_MODULE.no_employee_found+'</option>');
        }
    });
}


// function for the getting location based on the selected role ID

function GetLocation_role(roleId){
    let role=(roleId == undefined || roleId == "") ? 0 : roleId ;
    $.ajax({
        url:"/"+ userType+"/get-locations-roleid",
        type:"post",
        data:{id:role},
        beforeSend:function () {
            $("#locations").empty();
        },
        success:function (response) {
            if(response.code=='200'){
                $("#locations").append('<option id="">'+WEB_APP_MODULE.All_locations+'</option>');
                response.data.map(function (loc) {
                    $("#locations").append('<option id="'+loc.id+'">'+loc.name+'</option>');
                })
            }
            else {
                $("#locations").append('<option id="">'+WEB_APP_MODULE.No_Location+'</option>');
            }
        },
        error:function () {
            $("#locations").append('<option id="">'+WEB_APP_MODULE.No_Location+'</option>');
        }
    })
}


// for making excel
function downloadExcels(createXLSLFormatObj, xlsHeader, xlsRows, SheetName, custom = 0) {
    createXLSLFormatObj.push(xlsHeader);
    // custom = 1; Push values based on the header order
    if(custom){
        $.each(xlsRows, function (index, value) {
            var innerRowData = [];
            $.each(xlsHeader, function (headerIndex, headerValue) {
                innerRowData.push(value.hasOwnProperty(headerValue) ? value[headerValue] : "");
            });
            createXLSLFormatObj.push(innerRowData);
        });
    }else{
        $.each(xlsRows, function (index, value) {
            var innerRowData = [];
            $.each(value, function (ind, val) {
                innerRowData.push(val);
            });
            createXLSLFormatObj.push(innerRowData);
        });
    }
    /* File Name */
    let name= SheetName!==undefined? SheetName : exportSheetName;
    let filename = name+ ".xlsx";
    /* Sheet Name */
    let ws_name = name;
    let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);
    /* Add worksheet to workbook */
    XLSX.utils.book_append_sheet(wb, ws, ws_name);
    /* Write workbook and Download */
    XLSX.writeFile(wb, filename);
}
