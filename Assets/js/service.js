app.service("BaseService", ['$http', '$q',
    function ($http, $q) {
        return ({
            initail: initail,
            handleError: handleError,
            handleSuccess: handleSuccess,
            get: get,
            post: post,
            focusTableRow: focusTableRow,
            generateRowNumber: generateRowNumber,
            filterObject: filterObject,
            findObject: findObject,
            setRowFocus: setRowFocus,
            alertSuccess: alertSuccess,
            alertInfo: alertInfo,
            alertWarning: alertWarning,
            alertError: alertError,
            alertEmpty: alertEmpty,
            alertVendorEmpty: alertVendorEmpty,
            alertEmptyFullMes: alertEmptyFullMes,
            alertConfirm: alertConfirm,
            alertSaveSuccess: alertSaveSuccess,
            alertVendorUploadSuccess: alertVendorUploadSuccess,
            alertNomSuccess: alertNomSuccess,
            alertSendEmailSuccess: alertSendEmailSuccess,
            alertSendEmailFail: alertSendEmailFail,
            alertReNomSuccess: alertReNomSuccess,
            alertApproveSuccess: alertApproveSuccess,
            alertApproveRenomSuccess: alertApproveRenomSuccess,
            alertNoSaveData: alertNoSaveData,
            alertDataChange: alertDataChange,
            alertConfirmDelete: alertConfirmDelete,
            getParameterByName: getParameterByName,
            setDisabledControl: setDisabledControl,
            setFixedHeader: setFixedHeader,
            setImageURIs: setImageURIs,
            setFileURIs: setFileURIs,
            activateDatePicker: activateDatePicker,
            generateId: generateId,
            getTimeFormat: getTimeFormat,
            getBase64: getBase64,
            dateFormat: dateFormat,
            formatDecimal: formatDecimal,
            getDatetime: getDatetime,
            getDatetimeNext: getDatetimeNext,
            getLocalStorage: getLocalStorage,
            setLocalStorage: setLocalStorage,
            hasValue: hasValue,
            alertRenom: alertRenom
        });

        function initail() {

            //if ($.browser.msie) {
            //    var ieVersion = $.browser.version.split('.')[0];
            //    if ($.isNumeric(ieVersion) && parseFloat(ieVersion) < 9) {
            //        isIE8 = true;
            //        //$('.page-sidebar').addClass('hide');
            //        $('.sidebar-toggle').addClass('hide');
            //        //$('.nav-ie8').removeClass('hide');
            //        $('body').addClass('browser-ie8');
            //        //$('.page-inner').addClass('container');
            //        $('.page-content').css('background', '#f1f4f9');
            //    }
            //}

            //if ($.browser.webkit) {
            //    $(document).dblclick(function (evt) {
            //        if (window.getSelection)
            //            window.getSelection().removeAllRanges();
            //        else if (document.selection)
            //            document.selection.empty();
            //    });
            //}

            setTimeout(function () {
                if (!$.browser.webkit) {
                    $('table.dataTable.table-bordered').width('99%');
                }
            }, 500);


            moment.createFromInputFallback = function (config) {
                // unreliable string magic, or
                config._d = new Date(config._i);
            };

            $(".btn").mouseup(function () {
                $(this).blur();
            });

            $("input[numeric]").numeric();
            $("input[numeric-integer]").numeric(false);
            $("input[numeric-positive]").numeric({ negative: false });
            $("input[numeric-positive-integer]").numeric({ decimal: false, negative: false });
            $("input[numeric-decimal-2]").numeric({ decimalPlaces: 2, negative: false });

            $('textarea').keyup(function (e) {
                var maxLength = $(this).attr("maxLength");
                if (maxLength) {
                    if ($(this).val().length > maxLength) {
                        $(this).val($(this).val().substr(0, maxLength));

                        var format = $(this).attr("format");
                        if (format == 'number') {
                            $(this).val($filter(format)($(this).val().replace(/,/g, "")));
                        }
                    }
                }
            });

            $('label.required-label').prepend('<span class="f-red">*</span>&nbsp;');

            // Prevent the backspace key from navigating back.
            $(document).on("keydown", function (e) {
                if (e.which == 8 && !$(e.target).is("input, textarea, .note-editable")) {
                    e.preventDefault();
                }
            });

            $('.no-special-char').bind('keypress', function (event) {
                var regex = new RegExp(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\"|\;|\:|\s/g);
                var regexType = $(this).attr('regex-type');
                if (regexType == '1') {
                    regex = new RegExp(/\<|\>|\~|\^|\:|\;|\%|\&|\'|\"|\{|\}|\[|\]|\@/g);
                }
                if (regexType == '2') {
                    regex = new RegExp(/\<|\>|\~|\^|\;|\%|\'|\"|\{|\}|\[|\]|\@/g);
                }
                if (regexType == '3') {
                    regex = new RegExp(/^([A-Za-z0-9\-\_\$\\])+$/g);
                }
                if (regexType == '4') {
                    regex = new RegExp(/^([A-Za-z0-9\_])+$/g);
                }
                if (regexType == '5') {
                    regex = new RegExp(/\<|\>|\~|\^|\:|\;|\&|\'|\"|\{|\}|\[|\]|\@/g);
                }
                if (regexType == '6') {
                    regex = new RegExp(/^([A-Za-z0-9])+$/g);
                    // regex = new RegExp(/^([A-Za-z0-9\<|\>|\~|\^|\:|\;|\%|\&|\'|\"|\{|\}|\[|\]|\.|\_|\-|\$\\])+$/g);
                }
                var keycode = event.keyCode ? event.keyCode : event.which;
                if (keycode != 8 && keycode != 9 && keycode != 13) {
                    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
                    if (regexType == '3' || regexType == '4' || regexType == '6') {
                        if (!regex.test(key)) {
                            event.preventDefault();
                            return false;
                        }
                    }
                    else {
                        if (regex.test(key)) {
                            event.preventDefault();
                            return false;
                        }
                    }
                }
            });

            $('.no-special-char').bind('paste', function (event) {
                var regex = new RegExp(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\+|\=|\[|\{|\]|\}|\||\\|\'|\<|\,|\.|\>|\?|\/|\"|\;|\:|\s/g);
                var regexType = $(this).attr('regex-type');
                if (regexType == '1') {
                    regex = new RegExp(/\<|\>|\~|\^|\:|\;|\%|\&|\'|\"|\{|\}|\[|\]|\@/g);
                }
                if (regexType == '2') {
                    regex = new RegExp(/\<|\>|\~|\^|\;|\%|\'|\"|\{|\}|\[|\]|\@/g);
                }
                if (regexType == '3') {
                    regex = new RegExp(/^([A-Za-z0-9\-\_\$\\])+$/g);
                }
                if (regexType == '4') {
                    regex = new RegExp(/^([A-Za-z0-9\_])+$/g);
                }
                if (regexType == '5') {
                    regex = new RegExp(/\<|\>|\~|\^|\:|\;|\&|\'|\"|\{|\}|\[|\]|\@/g);
                }
                var clipboardData = "";
                if ($.browser.msie) {
                    clipboardData = window.clipboardData.getData('text');
                }
                else {
                    clipboardData = event.originalEvent.clipboardData.getData('text');
                }
                var currentValue = this.value + clipboardData;
                if (regexType == '3' || regexType == '4') {
                    if (!regex.test(currentValue)) {
                        //$(this).val("");
                        event.preventDefault();
                        return false;
                    }
                }
                else {
                    if (regex.test(currentValue)) {
                        //$(this).val(currentValue.replace(regex, ''));
                        event.preventDefault();
                        return false;
                    }
                }
            });

            $("input[max]").keyup(function (e) {
                var $this = $(this);
                var max = $this.attr("max");
                if (max && $.isNumeric(max)) {
                    var maxVal = parseInt(max);
                    var val = $this.val();
                    if (val > maxVal) {
                        e.preventDefault();
                        $this.val(maxVal);
                    }
                }
            });

            $('.date-picker-container input.date-picker').on('keydown', function (event) {
                var keycode = event.keyCode ? event.keyCode : event.which;
                if (keycode == 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
            });
        }

        function handleError(response) {
            console.log(response);
            if (response.data.message) {
                response.message = response.data.message;
                response.messageStackTrace = response.data.message_stack_trace;
            } else if (!angular.isObject(response.data) || !response.data.message) {
                response.message = (response.statusText != null) ? response.statusText : response.message;
            }
            else if (response.status == -1) {
                response.message = "Connection refused.";
            }
            return ($q.reject(response));
        }

        function handleSuccess(response) {

            if (response.data != null && response.data.result_error == null) {

                response.message = response.data.message;

                return (response);

            } else {

                console.log(response.data);
               
                if (response.data.result_error == undefined) {
                  response.message = response.data.message;
                }
                else {
                  response.message = response.data.result_error.message_desc != null ? response.data.result_error.message_desc : "";
                }
                return ($q.reject(response));
            }
        }

        function get(controller, action, data) {
            var request = $http({
                method: "GET",
                url: currentUrl + '/' + controller + '/' + action,
                headers: {
                    "Cache-Control": "max-age=0",
                    "__RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
                },
                params: data
            });
            return (request.then(handleSuccess, handleError));
        }

        function post(controller, action, data) {
            var request = $http({
                method: "POST",
                url: currentUrl + '/' + controller + '/' + action,
                headers: {
                    "Cache-Control": "max-age=0",
                    "Context-Data-CRC": (data) ? JSON.stringify(data).length : 0,
                    "__RequestVerificationToken": $("input[name='__RequestVerificationToken']").val()
                },
                data: window.btoa(unescape(encodeURIComponent(JSON.stringify(data))))
            });
            return (request.then(handleSuccess, handleError));
        }

        function focusTableRow(oTable, rowIndex, columnIndex) {
            setTimeout(function () {
                if (oTable != null) {
                    var oTableApi = oTable.api();
                    var nodes = oTableApi.rows().nodes();
                    if (nodes != null) {
                        var selectedNode = null;
                        if (rowIndex == -1) {
                            selectedNode = nodes[nodes.length - 1];
                        }
                        else {
                            if (nodes.length > rowIndex) {
                                selectedNode = nodes[rowIndex];
                            }
                            else if (nodes.length == rowIndex && rowIndex > 0) {
                                selectedNode = nodes[rowIndex - 1];
                            }
                        }

                        if (selectedNode != null) {
                            if (columnIndex != null && selectedNode.cells != null) {
                                if (selectedNode.cells.length > columnIndex) {
                                    $(selectedNode.cells[columnIndex]).click();
                                }
                            }
                            else {
                                $(selectedNode).click();
                            }
                        }
                    }
                }
            }, 200);
        }

        function generateRowNumber(oTable, columnIndex) {
            if (oTable != null) {
                oTableApi = oTable.api();
                if (oTableApi.column(columnIndex).nodes() != null) {
                    var rowNum = 0;
                    oTableApi.column(columnIndex).nodes().each(function (cell, i) {
                        if (!$(cell.parentElement).hasClass('hide')) {
                            if (!oTableApi.row(cell.parentElement).data().skip_rownum) {
                                rowNum = rowNum + 1;
                                cell.innerHTML = rowNum;
                            }
                        }
                    });
                }
                oTableApi.on('order.dt search.dt', function () {
                    var rowNum = 0;
                    oTableApi.column(columnIndex, { search: 'applied', order: 'applied' }).nodes().each(function (cell, i) {
                        if (!$(cell.parentElement).hasClass('hide')) {
                            cell.innerHTML = rowNum + 1;
                            rowNum++;
                        }
                    });
                }).draw();
            }
        }

        function generateId(length, pool) {
            length = (length == null) ? 8 : length;
            pool = (pool == null) ? 'abcdefghijklmnopqrstuvwxyz' : pool;
            return chance.string({ length: length, pool: pool });
        }

        function activateDatePicker() {
            var datePickerContainer = $('div.date-picker-container');
            if (datePickerContainer.length > 0) {
                var dataPickerButtons = $('div.date-picker-container button.date-picker-button');;
                $.each(dataPickerButtons, function (index, button) {
                    if (button.hasAttribute('for')) {
                        $(button).on('click', function (e) {
                            var isPickTime = ($(button).attr("picktime") != null) ? true : false;
                            if (isPickTime) {
                                $('#' + $(button).attr("for")).datetimepicker('show');
                            }
                            else {
                                $('#' + $(button).attr("for")).datepicker('show');
                            }
                        });
                    }
                });
                var datePicker = $('input.date-picker');
                $.each(datePicker, function (index, elem) {
                    elem = $(elem);
                    var dateFormat = (elem.attr("date-format") == null) ? "yyyy/mm/dd" : elem.attr("date-format");
                    var dateStartView = (elem.attr("date-start-view") == null) ? 0 : elem.attr("date-start-view");
                    var dateMinViewMode = (elem.attr("date-min-view-mode") == null) ? 0 : elem.attr("date-min-view-mode");
                    var pickTime = (elem.attr("pick-time") != null && elem.attr("pick-time")) ? true : false;
                    if (pickTime) {
                        dateFormat = (dateFormat == 'yyyy/mm/dd') ? 'yyyy/mm/dd hh:ii' : dateFormat;
                        elem.datetimepicker({
                            format: dateFormat,
                            autoclose: true,
                            clearBtn: true,
                            //todayBtn: true,
                            todayHighlight: true,
                            minView: 1,
                            //minuteStep: 60
                        });

                        //add attribute at button
                        var pickerButton = $('button.date-picker-button[for="' + elem[0].id + '"]');
                        if (pickerButton != null && pickerButton.length > 0) {
                            $(pickerButton[0]).attr("picktime", true);
                        }
                    }
                    else {
                        elem.datepicker({
                            format: dateFormat,
                            startView: dateStartView,
                            minViewMode: dateMinViewMode,
                            clearBtn: true,
                            autoclose: true,
                        });
                    }

                    $(elem).attr("autocomplete", "off");

                    //----- Input Marks -----//
                    $(elem).attr("data-inputmask", "\'alias\': \'" + dateFormat + "\'");
                    $(elem).inputmask();
                });
            }
        }

        function dateFormat(date, format) {
            format = (format == null) ? 'dd/MM/yyyy' : format;
            if (date != null && date != "") {
                var a = date.split(" ");
                var d, t, dateTime;
                if (a.length > 1) {
                    d = a[0].split("-");
                    t = a[1].split(":");
                    dateTime = new Date(d[0], (d[1] - 1), d[2], t[0], t[1], t[2]);
                }
                else {
                    if (isIE8) {
                        date = date.replace(/-/g, '/');
                    }
                    dateTime = new Date(date);
                }
                if (!/Invalid|NaN/.test(new Date(dateTime))) {
                    return new Date(dateTime).toString(format);
                }
            }
            return null;
        }

        function formatDecimal(data, c, d, t) {
            var n = data + "";
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixedDown(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
            return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
        }

        function alertSuccess(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    html: message,
                    type: "success",
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert(message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertInfo(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Info",
                    html: message,
                    type: "info",
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert(message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertWarning(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Warning",
                    html: message,
                    type: "warning",
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert(message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertWarning_600(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Warning",
                    html: message,
                    width: 600,
                    type: "warning",
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert(message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertError(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Error",
                    html: message,
                    type: "error",
                    showRejectButton: false,
                    showCancelButton: false
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert(message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertConfirm(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Question ?",
                    html: message,
                    type: "info",
                    width: 510,
                    showRejectButton: true,
                    confirmButtonText: "Yes"
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                var button = (comfirm(message)) ? 'confirm' : 'reject';
                if (callback != null) {
                    callback(button);
                }
            }
        }

        function alertRenom(message, URL, callback) {
      
            if (!isIE8) {
                swal({
                    title: "Renomination",
                    html: message,
                    type: "info",
                    width: 510,
                    showCancelButton: true,
                    confirmButtonText: "OK"
                }, function (button) {
                    console.log(button);
                    if (button == 'cancel') {
//
                    }
                    else if (button == 'confirm') {
                        window.location.href = URL
                        if (callback != null) {
                            callback(button);
                        }
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');


            }
        }

        function alertEmpty(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Warning",
                    html: "Please enter " + message,
                    type: "warning",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert("Please enter " + message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertVendorEmpty(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Warning",
                    html: "Please select " + message,
                    type: "warning",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert("Please select " + message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertEmptyFullMes(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Warning",
                    html: message,
                    type: "warning",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                message = message.replace(/<br>/g, '\r\n');
                alert(message);
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertSaveSuccess(callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    text: "Processing is complete.",
                    type: "success",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("Processing is complete.");
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertApproveSuccess(callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    text: "Approve is complete.",
                    type: "success",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("Approve is complete.");
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertVendorUploadSuccess(callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    text: "Daily Upload is complete.",
                    type: "success",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("Daily Upload  is complete.");
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertNomSuccess(callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    text: "Nominate is complete.",
                    type: "success",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("Nominate is complete.");
                if (callback != null) {
                    callback();
                }
            }
        }
        
        function alertSendEmailSuccess(callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    text: "Email send complete.",
                    type: "success",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("Email send complete.");
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertSendEmailFail(message, callback) {
                if (!isIE8) {
                    swal({
                        title: "Error",
                        html: message,
                        type: "error",
                        showRejectButton: false,
                        showCancelButton: false
                    }, function (button) {
                        if (callback != null) {
                            callback(button);
                        }
                    });
                }
                else {
                    message = message.replace(/<br>/g, '\r\n');
                    alert(message);
                    if (callback != null) {
                        callback();
                    }
                }
            }

        function alertApproveRenomSuccess(callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    text: "Approve renom is complete.",
                    type: "success",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("Approve renom is complete.");
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertReNomSuccess(callback) {
            if (!isIE8) {
                swal({
                    title: "Success",
                    text: "ReNominate is complete.",
                    type: "success",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("ReNominate is complete.");
                if (callback != null) {
                    callback();
                }
            }
        }


        function alertNoSaveData(message, callback) {
            if (!isIE8) {
                swal({
                    title: "Warning",
                    html: "No data to save.",
                    type: "warning",
                    width: 350
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                alert("No data to save.");
                if (callback != null) {
                    callback();
                }
            }
        }

        function alertDataChange(callback) {
            if (!isIE8) {
                swal({
                    title: "Question ?",
                    text: "Details changed. Do you want to save ?",
                    type: "info",
                    showCancelButton: true,
                    showRejectButton: true,
                    confirmButtonText: "Yes"
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                var button = (confirm("Details changed. Do you want to save ?")) ? 'confirm' : 'reject';
                if (callback != null) {
                    callback(button);
                }
            }
        }

        function alertConfirmDelete(callback) {
            if (!isIE8) {
                swal({
                    title: "Question ?",
                    text: "Are you sure you want to delete this item ?",
                    type: "info",
                    width: 455,
                    showRejectButton: true,
                    confirmButtonText: "Yes"
                }, function (button) {
                    if (callback != null) {
                        callback(button);
                    }
                });
            }
            else {
                var button = (confirm("Are you sure you want to delete this item ?")) ? 'confirm' : 'reject';
                if (callback != null) {
                    callback(button);
                }
            }
        }

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        function setDisabledControl(isDisabled, wrapperClass) {
            wrapperClass = (wrapperClass) ? wrapperClass : 'info-wrapper';
            var inputs = $('.' + wrapperClass).find('input:not(.ignore-disabled)');
            $.each(inputs, function (index, item) {
                $(item).attr('disabled', isDisabled);
            });

            var buttons = $('.' + wrapperClass).find('button:not(.ignore-disabled)');
            $.each(buttons, function (index, item) {
                $(item).attr('disabled', isDisabled);
            });

            var selects = $('.' + wrapperClass).find('select:not(.ignore-disabled)');
            $.each(selects, function (index, item) {
                $(item).attr('disabled', isDisabled);
            });

            var textareas = $('.' + wrapperClass).find('textarea:not(.ignore-disabled)');
            $.each(textareas, function (index, item) {
                $(item).attr('disabled', isDisabled);
            });

            var buttonUploads = $('.' + wrapperClass).find('span.btn-file:not(.ignore-disabled)');
            $.each(buttonUploads, function (index, item) {
                $(item).attr('disabled', isDisabled);
            });
        }

        function findObject(data, key, value, isReturnNull) {
            isReturnNull = (isReturnNull) ? isReturnNull : false;
            var obj = _.find(data, key, value);
            if (obj == null && !isReturnNull) {
                obj = {};
            }
            return obj;
        }

        function filterObject(data, key, value) {
            var objs = _.filter(data, key , value );
            if (objs.length == 0) {
                objs = [];
            }
            return objs;
        }

        function setFixedHeader(oTable, classContainer) {
            if (!isIE8) {
                //if (oTable) {
                //    classContainer = (classContainer) ? classContainer : ".table-container";
                //    $(oTable.selector).floatThead('destroy');
                //    $(oTable.selector).floatThead({
                //        scrollContainer: function ($table) {
                //            return $table.closest(classContainer);
                //        }
                //    });
                //}
            }
        }

        function setRowFocus(rowElem) {
            if (rowElem) {
                $.each(rowElem.parentElement.childNodes, function (index, elem) {
                    $(elem).removeClass("row-focus");
                });
                $(rowElem).addClass("row-focus");
            }
        }

        function setImageURIs(file, callback) {
            if (file) {
                if (!isIE8) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        file.dataURI = event.target.result;
                        if (callback) {
                            callback();
                        }
                    };
                    reader.readAsDataURL(file);
                }
                else {
                    if (FileAPI) {
                        FileAPI.upload({
                            url: '/file/get-image-data-uri',
                            data: { foo: "bar" },
                            files: { image: file },
                            complete: function (err, xhr, currentfile) {
                                if (!err) {
                                    var result = xhr.responseText;
                                    file.dataURI = result.dataURI;
                                    file.dataPath = result.dataPath;
                                    if (callback) {
                                        callback();
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }

        function setFileURIs(file, callback) {
            if (file) {
                if (!isIE8) {
                    var reader = new FileReader();
                    reader.onload = function (event) {
                        file.dataURI = event.target.result;
                        if (callback) {
                            callback();
                        }
                    };
                    reader.readAsDataURL(file);
                }
                else {
                    if (FileAPI) {
                        FileAPI.upload({
                            url: '/file/get-file-data-uri',
                            data: { foo: "bar" },
                            files: { image: file },
                            complete: function (err, xhr, currentfile) {
                                if (!err) {
                                    var result = xhr.responseText;
                                    file.dataURI = result.dataURI;
                                    file.dataPath = result.dataPath;
                                    if (callback) {
                                        callback();
                                    }
                                }
                            }
                        });
                    }
                }
            }
        }

        function getTimeFormat(time) {
            var returnTime = "";
            if (time) {
                var arrTime = time.split(':');
                if (arrTime.length == 3) {
                    returnTime = arrTime[0] + ":" + arrTime[1];
                }
                else if (arrTime.length == 2) {
                    return time;
                }
            }
            return returnTime;
        }

        function getBase64(data) {
            var dataEncoded = "";
            if (data) {
                if (window.btoa) {
                    dataEncoded = window.btoa(encodeURIComponent(JSON.stringify(data)))
                } else { //for <= IE9
                    dataEncoded = $.base64.encode(encodeURIComponent(JSON.stringify(data)));
                }
            }
            return dataEncoded;
        }

        function getDatetime(date, format, checkTimeZone) {
            checkTimeZone = (checkTimeZone || checkTimeZone == false) ? checkTimeZone : true;
            if (date) {
                format = (format) ? format : 'yyyy-MM-dd HH:mm';
                var returnVal = new Date(date).toString(format);
                if (checkTimeZone) {
                    if (moment) {
                        var dateByTimezone = moment(date).utcOffset(date.getTimezoneOffset())
                        if (dateByTimezone._d) {
                            returnVal = new Date(dateByTimezone._d).toString(format);
                        }
                    }
                }
                return returnVal;
            } else {
                return null;
            }
        }

        function getDatetimeNext(date, format, checkTimeZone) {
            checkTimeZone = (checkTimeZone || checkTimeZone == false) ? checkTimeZone : true;
            if (date) {
                format = (format) ? format : 'yyyy-MM-dd HH:mm';
                var returnVal = new Date(date).toString(format);
                if (checkTimeZone) {
                    if (moment) {
                        var dateByTimezone = moment(date).subtract(-1, 'days').utcOffset(date.getTimezoneOffset())
                        if (dateByTimezone._d) {
                            returnVal = new Date(dateByTimezone._d).toString(format);
                        }
                    }
                }
                return returnVal;
            } else {
                return null;
            }
        }
        

        function getLocalStorage(name) {
            name = currentUrl + "/" + name;
            var data = [];
            if (window.localStorage) {
                var item = window.localStorage.getItem(name);
                if (item != null) {
                    data = JSON.parse(item);
                } else {
                    data = null;
                }
            }
            return data;
        }

        function setLocalStorage(name, data) {
            name = currentUrl + "/" + name;
            if (window.localStorage) {
                if (data != null) {
                    data = JSON.stringify(data);
                }
                window.localStorage.setItem(name, data);
                return true;
            }
            return false;
        }

        function hasValue(item) {
            var _result = false;
            try {
                if (item != undefined && item != null && item.toString() != '') {
                    _result = true;
                }
            } catch (err) {
                console.log(err.message);
            } finally {
                return _result;
            }
        }

       

    }


]);

var xmlHttp;
function srvTime() {
    try {
        //FF, Opera, Safari, Chrome
        xmlHttp = new XMLHttpRequest();
    }
    catch (err1) {
        //IE
        try {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        catch (err2) {
            try {
                xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
            }
            catch (eerr3) {
                //AJAX not supported, use CPU time.
                alert("AJAX not supported");
            }
        }
    }
    xmlHttp.open('HEAD', window.location.href.toString(), false);
    xmlHttp.setRequestHeader("Content-Type", "text/html");
    xmlHttp.send('');
    return xmlHttp.getResponseHeader("Date");
}