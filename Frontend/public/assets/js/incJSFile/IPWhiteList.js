var deptID = [];
//statusID is used to store the status value of the storage type
var statusID = [];
var Lengths = [];

if (Ip_whitelist.code === 200) {
    Lengths[2] = Ip_whitelist.data.data.whitelist_ips ? Ip_whitelist.data.data.whitelist_ips.length : 0;
} else {
    Lengths[2] = 0;
}
var session_plan = $('#session_plan').val();
session_plan = (session_plan === "true") ? 1 : 0;

/**
 * @Desc Ajax to Add Ip Address.
 * @return status message.
 */
function addIpWhiteForm() {
    $('#addIpError2').html("");
    $('#addIpAddress').attr("disabled", false);
    document.getElementById('addIpSelect').reset();
}

$(document).on('submit', '#addIpSelect', function (e) {
    e.preventDefault();
    var form = document.getElementById('addIpSelect');
    var formData = new FormData(form);
    var emailId = $("#addIpGmail").attr('name');
    var ipName = $("#addIpName").attr('name');
    $.ajax({
        type: "post",
        url: "/"+userType+"/add-ip-whitelist",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('#addIpError2').html("");
            $('#addIpAddress').attr("disabled", true);
        },
        success: function (response) {
            var msg = response.msg;
            if (response.code === 200) {
                $('#addIPModal').modal('hide');
                successHandler(msg);
                $('#addIpAddress').attr("disabled", true);
                var appendLocData;
                var ipAddress = response.data.ip;
                var id = response.data.id;
                appendLocData += '<tr id="' + id + '"><td>' + ipAddress + '</td>';

                appendLocData += '<td><div class="dropdown show">';
                if (session_plan === 1) {
                    appendLocData += '<a class="btn btn-sm btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true"aria-expanded="false">' +
                        '<i class="fas fa-cog"></i></a>';
                }
                appendLocData += '<div class="dropdown-menu"> <a id="editIP" href="#" class="small dropdown-item mr-2" data-toggle="modal" data-target="#editIPModal" onclick="editIpForm(' + id + ',\'' + ipAddress + '\')">' +
                    '<i class="fas fa-edit fa-fw text-success mr-2" data-toggle="tooltip" data-placement="top"></i>Edit IP</a>' +
                    '<a id="delIP" href="#" class="small open-deleteIPModal dropdown-item mr-2" data-toggle="modal" data-target="#deleteIPModal" onclick="deleteIpForm(' + id + ')">' +
                    '<i  class="far fa-trash-alt text-danger mr-2" data-toggle="tooltip" data-placement="top" ></i>Delete IP</a></td></tr>';
                $('#listedIp').append(appendLocData);
                $("table#ipTable tr#whitelistIPDataNotFound").remove();
                document.getElementById('addIpSelect').reset();
                Lengths[2]++;
            } else if (response.code === 400) {
                errorHandler(msg);
                $('#addIpAddress').attr("disabled", false);
            } else if (response.code === 201) {
                $('#addIpAddress').attr("disabled", false);
                for (i = 0; i < 1; i++) {
                    if (msg[i] === 'IP address is required') {
                        $('#addIpError2').html(response.msg[i]);
                    }
                    if (msg[i] === 'IP address is invalid') {
                        $('#addIpError2').html(response.msg[i]);
                    }
                }
            } else {
                $('#addIpAddress').attr("disabled", false);
                errorHandler(msg);
            }
        },
        error: function (error) {
            if (error.status === 403) {
                errorHandler('Permission Denied');
            } else {
                errorHandler('Not able to load');
            }
        }
    });
});

/**
 * @Desc Ajax to Edit Ip Address.
 * @return status message.
 */
function editIpForm(dataId, ipAddress) {
    $('#editIpError1').html("");
    $("#editIpId").attr('value', dataId);
    $('#editIpAddress').val(ipAddress);
    $('#updateIpId').attr("disabled", false);
}

$(document).on('submit', '#editIpSelects', function (e) {
    e.preventDefault();
    var form = document.getElementById('editIpSelects');
    var formData = new FormData(form);
    var EditIp = $("#editIpAddress").attr('name');
    var appendLocData = "";
    var id = "";
    $.ajax({
        type: "post",
        url: "/"+userType+"/edit-ip-whitelist",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('#updateIpId').attr("disabled", true);
        },
        success: function (response) {
            var msg = response.msg;
            if (response.code === 200) {
                $('#updateIpId').attr("disabled", true);
                $('#editIPModal').modal('hide');
                $('#editIpError1').html("");
                successHandler(msg);
                id = response.data.ip_id;
                $('table#ipTable tr#' + response.data.ip_id + '').remove();
                appendLocData += '<tr id="' + id + '"><td>' + response.data.ip + '</td>';
                appendLocData += '<td><div class="dropdown show">';
                if (session_plan === 1) {
                    appendLocData += '<a class="btn btn-sm btn-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true"aria-expanded="false">' +
                        '<i class="fas fa-cog"></i></a>';
                }
                appendLocData += '<div class="dropdown-menu"><a id="editIP" href="#" class="small dropdown-item mr-2" data-toggle="modal" data-target="#editIPModal" onclick="editIpForm(' + id + ',\'' + response.data.ip + '\')">' +
                    '<i class="fas fa-edit fa-fw text-success mr-2" data-toggle="tooltip" data-placement="top"></i>Edit IP</a>' +
                    '<a id="delIP" href="#" class="small open-deleteIPModal dropdown-item mr-2" data-toggle="modal" data-target="#deleteIPModal" onclick="deleteIpForm(' + id + ')">' +
                    '<i  class="far fa-trash-alt text-danger mr-2" data-toggle="tooltip" data-placement="top"  ></i>Delete IP</a></td></tr>';
                $('#listedIp').append(appendLocData);
            } else if (response.code === 400) {
                errorHandler(msg);
                $('#updateIpId').attr("disabled", false);
            } else if (response.code === 201) {
                $('#updateIpId').attr("disabled", false);
                $('#editIpError1').html(msg['0']);
                $('#editIpError2').html(msg['1']);
            } else {
                errorHandler(msg);
            }
        },
        error: function (error) {
            if (error.status === 403) {
                errorHandler('Permission Denied');
            } else {
                errorHandler('Not able to load');
            }
        }
    });
});

/**
 * @Desc Ajax to Delete Ip Address.
 * @return status message.
 */
function deleteIpForm(dataId) {
    $("#deleteIpId").attr('value', dataId);
    $('#delIpAddress').attr("disabled", false);
}

$(document).on('submit', '#deleteIpSelects', function (e) {
    e.preventDefault();
    var form = document.getElementById('deleteIpSelects');
    var formData = new FormData(form);
    $.ajax({
        type: "post",
        url: "/"+userType+"/delete-ip-whitelist",
        data: formData,
        cache: false,
        processData: false,
        contentType: false,
        beforeSend: function () {
            $('#delIpAddress').attr("disabled", true);
        },
        success: function (response) {
            var appendLocData = "";
            var id = $("input[id=deleteIpId]").val();
            var msg = response.msg;
            if (response.code === 200) {
                $('table#ipTable tr#' + id + '').remove();
                $('#deleteIPModal').modal('hide');
                successHandler(msg);
                $('#delIpAddress').attr("disabled", true);
                Lengths[2]--;
                if (Lengths[2] < 1) {
                    appendLocData += '<tr align="center" id="whitelistIPDataNotFound"><td colspan="1"><p>Whitelist IP Data Not Found.</p></td></tr>';
                    $('#listedIp').append(appendLocData);
                }
            } else if (response.code === 400) {
                $('#delIpAddress').attr("disabled", false);
                errorHandler(msg);
            } else {
                $('#delIpAddress').attr("disabled", false);
                errorHandler(msg);
            }
        },
        error: function (error) {
            if (error.status === 403) {
                errorHandler('Permission Denied');
            } else {
                errorHandler('Not able to load');
            }
        }
    });
})
