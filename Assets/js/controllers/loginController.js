app.controller('LoginController', ['$scope', '$rootScope', '$compile', '$location', 'BaseService',
    function ($scope, $rootScope, $compile, $location, BaseService) {

        $scope.dataDetail = null;
        $scope.selectedDetail = {};
        $scope.selectedDetailPrev = {};
        $scope.dataCmbCarType = [];
        $scope.selectedCarType = {};
        $scope.selectedMarketBrand = {};
        $scope.dataFilter = {};
        $scope.dataLog = null;

        $scope.uriController = "Login";
        $scope.excelFile = {};

        angular.element(document).ready(function () {

            BaseService.setDisabledControl(true);
            $scope.retrieveMasterData(function () {
                //$scope.retrieveAll();
            });
        });

        $scope.retrieveMasterData = function (callback) {

            BaseService.post('Login', 'GetMaster').then(
                function (response) {
                    $scope.dataMasterAll = response.data.result;
                    setTimeout(function () {
                        $scope.$apply();
                    }, 500);
                    if (callback) {
                        callback();
                    }
                },
                function (response) {
                    BaseService.alertError(response.message);
                }
            );
        }

        $scope.$on('onReloadClick', function () {
            $scope.retrieveAll();
        });

        $scope.$on('onSaveClick', function () {
            if ($scope.validateSave()) {
                $scope.saveItem();
            }
        });

        $scope.retrieveAll = function () {
            var d = new Date();
            var Month = d.getMonth();
            var year = d.getFullYear();
            $scope.dataFilter.Date = '01/' + ("0" + Month).slice(-2) + '/' + year;
            var data = {
                dataFilter: $scope.dataFilter
            };
            BaseService.post($scope.uriController, 'GetByDate', data).then(
                function (response) {
                    $scope.dataDetail = response.data.result;
                    $.each($scope.dataDetail, function (index, item) {
                        item.rowId = BaseService.generateId(18);
                    });
                    if ($scope.dataDetail.length > 0) {
                        $scope.selectedDetail = ($scope.dataDetail) ? $scope.dataDetail[0] : {};

                        $scope.renderTableDetail($scope.dataDetail);
                    }
                    else {
                        $scope.dataDetail = null;
                    }
                    //BaseService.focusTableRow($scope.table, 0);
                },
                function (response) {
                    BaseService.alertError(response.message);
                }
            );
        };


        $scope.renderTableDetail = function (dataSource) {
            //dataSource = _.sortByOrder(dataSource, ['Date']);
            if (dataSource !== null) {

                $scope.table_detail = $('#table_list').dataTable({
                    "data": dataSource,
                    "columns": [{
                        "data": "DATE_DISPLAY",
                        "class": "text-center"
                    }, {
                        "data": "PLAN",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            if ((data === null || data === '') && data !== '0') return "";
                            else {
                                return BaseService.formatDecimal(data, 4);
                            }
                        }
                    }, {
                        "data": "ACTUAL",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            if ((data === null || data === '') && data !== '0') return "";
                            else {
                                return BaseService.formatDecimal(data, 4);
                            }
                        }
                    }, {
                        "data": "CT",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            if ((data === null || data === '') && data !== '0') return "";
                            else {
                                return BaseService.formatDecimal(data, 4);
                            }
                        }
                    }, {
                        "data": "TD",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            if ((data === null || data === '') && data !== '0') return "";
                            else {
                                return BaseService.formatDecimal(data, 4);
                            }
                        }
                    }, {
                        "data": "TC",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            if ((data === null || data === '') && data !== '0') return "";
                            else {
                                return BaseService.formatDecimal(data, 4);
                            }
                        }
                    }, {
                        "data": "M_PRICE",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            if ((data === null || data === '') && data !== '0') return "";
                            else {
                                return BaseService.formatDecimal(data, 2) + '%';
                            }
                        }
                    }, {
                        "data": "P_PRICE",
                        "class": "text-right",
                        "render": function (data, type, row) {
                            if ((data === null || data === '') && data !== '0') return "";
                            else {
                                return BaseService.formatDecimal(data, 4);
                            }
                        }
                    }],

                    "columnDefs": [{
                        "searchable": false,
                        "orderable": false,
                        "targets": [0, 4, 5, 6, 7]
                    }],
                    "createdRow": function (row, data, index) {
                        $compile(row)($scope);
                    },
                    "bDestroy": true,
                    "paging": false,
                    "filter": false,
                    "info": false,
                });

                //BaseService.setFixedHeader($scope.table_detail);
                //BaseService.generateRowNumber($scope.table_detail, 0);

                //setTimeout(function () {
                //    $scope.table_detail.off('click', 'tbody tr').on('click', 'tbody tr', function (e) {
                //        BaseService.setRowFocus(this);
                //        $scope.currentDetailRow = this;
                //        var aData = $scope.table_detail.api().row(this).data();
                //        if (aData !== null) {
                //            $scope.selectedDetail = aData;
                //            $scope.selectedDetailPrev = angular.copy(aData);
                //            $scope.selectedCarType = BaseService.findObject($scope.dataCmbCarType, "TYPENAME", $scope.selectedDetail.CARTYPE);
                //            $scope.selectedMarketBrand = $scope.selectedDetail.MARKETBRAND + "";
                //            $scope.$apply();
                //        }
                //    });
                //}, 50);
            }
        };

        $scope.saveItem = function () {
            $rootScope.showModalProcessing(true);

            var arrDatail = [];
            if ($scope.dataDetail !== null) {
                $.each($scope.dataDetail, function (index, item) {
                    var detail = {
                        ID: "",
                        UPLOADPRICE_VERSION: "",
                        DATE_PRICE: item.DATE_PRICE,
                        DATE_DISPLAY: item.DATE_DISPLAY,
                        PLAN: item.PLAN,
                        ACTUAL: item.ACTUAL,
                        CT: item.CT,
                        TD: item.TD,
                        TC: item.TC,
                        M_PRICE: item.M_PRICE,
                        P_PRICE: item.P_PRICE,
                        rowId: BaseService.generateId(18),
                        CREATEDBY: (item.CREATEDBY) ? item.CREATEDBY : 0,
                        CREATEDDATE: (item.CREATEDDATE) ? item.CREATEDDATE : "",
                    };
                    arrDatail.push(detail);
                });
            }

            //$rootScope.stampAudit(arrDatail);

            var data = {
                DT: arrDatail
            };

            BaseService.post($scope.uriController, 'save', data).then(
                function (response) {
                    if (response.data.status !== -1) {
                        $rootScope.showModalProcessing(false);
                        BaseService.alertSaveSuccess(function () {
                            $scope.retrieveAll();
                        });
                    }
                },
                function (response) {
                    $rootScope.showModalProcessing(false);
                    BaseService.alertError(response.message);
                }
            );
        };

        $scope.validateSave = function () {
            if (!$scope.dataDetail) {
                BaseService.alertWarning('Please Add Data.');
                return false;
            }

            return true;
        };

        $scope.validateAdd = function () {
            if ($scope.selectedCarType.UID === null) {
                BaseService.alertWarning('Please select Car Type.');
                return false;
            }
            if ($scope.selectedMarketBrand !== "0" && $scope.selectedMarketBrand !== "1") {
                BaseService.alertWarning('Please select Market Brand.');
                return false;
            }
            if (!$scope.selectedDetail.YEAR) {
                BaseService.alertWarning('Please select Year.');
                return false;
            }

            if (!$scope.selectedDetail.MONTH12 && !$scope.selectedDetail.MONTH24 && !$scope.selectedDetail.MONTH36
                && !$scope.selectedDetail.MONTH48 && !$scope.selectedDetail.MONTH60 && !$scope.selectedDetail.MONTH72) {
                BaseService.alertWarning('Please fill interest rate in at least one field.');
                return false;
            }

            var existData = _.filter($scope.dataDetail, function (data) {
                return data.rowId !== $scope.selectedDetail.rowId
                    && data.CARTYPE === $scope.selectedCarType.TYPENAME
                    && data.MARKETBRAND === $scope.selectedMarketBrand
                    && data.YEAR === $scope.selectedDetail.YEAR;
            });
            if (existData && existData.length > 0) {
                BaseService.alertWarning('Select Car Type, Market Brand and Year already exists.');
                return false;
            }

            return true;
        };

        $scope.addConditionClick = function () {
            $scope.selectedDetail = {
                ACTION: 'I',
                rowId: BaseService.generateId(18),
                UID: ""
            };
            $scope.selectedCarType = {};
            $scope.selectedMarketBrand = {};
            $('#popup_condition').modal('show');
        };

        $scope.confirmConditionClick = function () {
            if ($scope.validateAdd()) {
                $('#popup_condition').modal('hide');
                var existData = _.filter($scope.dataDetail, function (data) {
                    return (data.rowId === $scope.selectedDetail.rowId);
                });
                var currentAction = ($scope.selectedDetail.ACTION === 'I' && existData.length === 0) ? 'add' : 'edit';
                if (currentAction === 'add') {
                    $scope.dataDetail = ($scope.dataDetail) ? $scope.dataDetail : [];
                    var newItemDetail = {
                        YEAR: $scope.selectedDetail.YEAR,
                        CARTYPE: $scope.selectedCarType.TYPENAME ? $scope.selectedCarType.TYPENAME : "",
                        MARKETBRAND: $scope.selectedMarketBrand ? $scope.selectedMarketBrand : "",
                        MONTH12: $scope.getNumberFormat($scope.selectedDetail.MONTH12),
                        MONTH24: $scope.getNumberFormat($scope.selectedDetail.MONTH24),
                        MONTH36: $scope.getNumberFormat($scope.selectedDetail.MONTH36),
                        MONTH48: $scope.getNumberFormat($scope.selectedDetail.MONTH48),
                        MONTH60: $scope.getNumberFormat($scope.selectedDetail.MONTH60),
                        MONTH72: $scope.getNumberFormat($scope.selectedDetail.MONTH72),
                        ACTION: $scope.selectedDetail.ACTION,
                        rowId: BaseService.generateId(18),
                        UID: $scope.selectedDetail.UID
                    };
                    $scope.dataDetail.push(newItemDetail);
                    $scope.renderTableDetail($scope.dataDetail);
                    BaseService.focusTableRow($scope.table_detail, -1);
                }
                else {
                    if ($scope.currentDetailRow) {
                        var rowFocus = $scope.table_detail.api().row($scope.currentDetailRow);
                        var rowFocusData = rowFocus.data();
                        if (rowFocusData !== null) {
                            rowFocusData.YEAR = $scope.selectedDetail.YEAR;
                            rowFocusData.CARTYPE = $scope.selectedCarType.TYPENAME ? $scope.selectedCarType.TYPENAME : "";
                            rowFocusData.MARKETBRAND = $scope.selectedMarketBrand ? $scope.selectedMarketBrand : "";
                            rowFocusData.MONTH12 = $scope.getNumberFormat($scope.selectedDetail.MONTH12);
                            rowFocusData.MONTH24 = $scope.getNumberFormat($scope.selectedDetail.MONTH24);
                            rowFocusData.MONTH36 = $scope.getNumberFormat($scope.selectedDetail.MONTH36);
                            rowFocusData.MONTH48 = $scope.getNumberFormat($scope.selectedDetail.MONTH48);
                            rowFocusData.MONTH60 = $scope.getNumberFormat($scope.selectedDetail.MONTH60);
                            rowFocusData.MONTH72 = $scope.getNumberFormat($scope.selectedDetail.MONTH72);
                            rowFocusData.ACTION = (rowFocusData.ACTION === 'I') ? 'I' : 'U';

                            $scope.renderTableDetail($scope.dataDetail);
                            BaseService.focusTableRow($scope.table_detail, rowFocus.index());
                        }
                    }
                }
            }
        };

        $scope.cancelConditionClick = function () {
            $('#popup_condition').modal('hide');
            if ($scope.currentDetailRow) {
                var rowFocus = $scope.table_detail.api().row($scope.currentDetailRow);
                var rowFocusData = rowFocus.data();
                if (rowFocusData !== null) {
                    rowFocusData.YEAR = $scope.selectedDetailPrev.YEAR;
                    rowFocusData.CARTYPE = $scope.selectedDetailPrev.CARTYPE;
                    rowFocusData.MARKETBRAND = $scope.selectedDetailPrev.MARKETBRAND;
                    rowFocusData.MONTH12 = $scope.selectedDetailPrev.MONTH12;
                    rowFocusData.MONTH24 = $scope.selectedDetailPrev.MONTH24;
                    rowFocusData.MONTH36 = $scope.selectedDetailPrev.MONTH36;
                    rowFocusData.MONTH48 = $scope.selectedDetailPrev.MONTH48;
                    rowFocusData.MONTH60 = $scope.selectedDetailPrev.MONTH60;
                    rowFocusData.MONTH72 = $scope.selectedDetailPrev.MONTH72;

                    $scope.renderTableDetail($scope.dataDetail);
                    //BaseService.focusTableRow($scope.table_detail, rowFocus.index());
                }
            }
        };

        $scope.editDetailClick = function () {
            $('#popup_condition').modal('show');
        };

        $scope.deleteDetailClick = function () {
            setTimeout(function () {
                BaseService.alertConfirmDelete(function (button) {
                    if (button === 'confirm') {
                        if ($scope.selectedDetail.rowId !== null) {
                            var rowFocus = $scope.table_detail.api().row($scope.currentDetailRow);
                            var rowFocusData = rowFocus.data();
                            if (rowFocusData !== null) {
                                if (rowFocusData.ACTION === 'I') {
                                    _.remove($scope.dataDetail, { "rowId": rowFocusData.rowId });
                                }
                                else {
                                    rowFocusData.ACTION = 'D';
                                }
                                $scope.renderTableDetail($scope.dataDetail);
                                BaseService.focusTableRow($scope.table_detail, rowFocus.index());
                            }
                        }
                    }
                });
            }, 100);
        };

        $scope.importExcelClick = function () {
            if ($scope.excelFile.name) {
                $scope.getExcelFileData($scope.excelFile, function (err, xhr, currentfile) {
                    $scope.dataDetail = [];
                    var data = JSON.parse(xhr.responseText);
                    if (xhr.status === 200 && data.result && data.result.length > 0) {
                        //if (data.result.length > 0) {
                        //    var existingData = _.filter($scope.dataDetail, function (item) {
                        //        return item.ACTION !== 'D' && item.ACTION !== 'IM';
                        //    });
                        //    if (existingData.length > 0) {
                        //        BaseService.alertConfirm("The transaction will remove all existing interest rate.<br>Are you sure you want to proceed?", function (button) {
                        //            if (button === 'confirm') {
                        //                $.each($scope.dataDetail, function (index, item) {
                        //                    item.ACTION = 'D';
                        //                });
                        //                $scope.assignInterestRateData(data.result);
                        //            }
                        //        });
                        //        return;
                        //    }
                        //}
                        $scope.assignInterestRateData(data.result);
                    }
                    else {
                        BaseService.alertError("An error occurred while importing file.<br>Please check excel file.");
                    }
                });
            }

        };

        $scope.assignInterestRateData = function (data) {
            // delete the previously imported data.
            $scope.dataDetail = [];

            $.each(data, function (index, item) {
                var Price = {
                    ID: "",
                    UPLOADPRICE_VERSION: "",
                    DATE_PRICE: item.DATE_PRICE,
                    DATE_DISPLAY: item.DATE_DISPLAY,
                    PLAN: item.PLAN,
                    ACTUAL: item.ACTUAL,
                    CT: item.CT,
                    TD: item.TD,
                    TC: item.TC,
                    M_PRICE: item.M_PRICE,
                    P_PRICE: item.P_PRICE,
                    rowId: BaseService.generateId(18)
                };
                $scope.dataDetail.push(Price);
            });
            $scope.renderTableDetail($scope.dataDetail);

            //clear input file
            $scope.excelFile = {};
            $('input[name="file-excel"]').val('');
            $scope.$apply();
        };

        $scope.getExcelFileData = function (file, callback) {
            if (file) {
                if (FileAPI) {
                    FileAPI.upload({
                        url: currentUrl + '/' + $scope.uriController + '/GetExcelFileData',
                        files: { image: file },
                        complete: function (err, xhr, currentfile) {
                            if (callback) {
                                callback(err, xhr, currentfile);
                            }
                        }
                    });
                }
            }
        };

        $scope.getNumberFormat = function (number) {
            if ((number === null || number === '') && number !== 0) {
                return null;
            }
            if ($.isNumeric(number)) {
                return parseFloat(number);
            }
            else {
                return null;
            }
        };

        $scope.openHistoryLogPopup = function () {
            $('#popup_history_log').modal('show');
            setTimeout(function () {
                $scope.retrieveHistoryLog();
            }, 200);
        };
    }

]);