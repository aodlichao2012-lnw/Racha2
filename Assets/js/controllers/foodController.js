﻿app.controller('FoodController', ['$scope', '$rootScope', '$compile', '$location', 'BaseService',
    function ($scope, $rootScope, $compile, $location, BaseService) {

        $scope.dataDetail = [];
        $scope.selectedDetail = {};
        $scope.selectedDetailPrev = {};
        callbackIdParam = '5';
        if ($location.search().Callback_Id) {
            callbackIdParam = $location.search().Callback_Id;
        }
        $scope.dataCmbCarType = [];
        $scope.selectedCarType = {};
        $scope.selectedMarketBrand = {};
        $scope.dataFilter = {
            startDate: BaseService.getDatetime(new Date(), 'dd/MM/yyyy', true),
            endDate: BaseService.getDatetime(new Date(), 'dd/MM/yyyy', true),
            Callback_Id: callbackIdParam,
            projectName: ''
        };
        $scope.dataCheck = [];
        $scope.dataLog = null;
        $scope.dataInfo = [];
        $scope.uriController = "Food";
        $scope.textFile = {};
        dateparam = '';
        $scope.dataID = {
            ID: ''
        };
        $scope.dataFilter = {
            CDN: ''
        }


        angular.element(document).ready(function () {

            var start = moment().startOf('week');
            var end = moment().endOf('week');
            $scope.dataFilter.startDate = start.format('YYYYMMDD');
            $scope.dataFilter.endDate = end.format('YYYYMMDD');

            $scope.retrieveMasterData(function () {
                var dataFilter = BaseService.getLocalStorage($scope.uriController);
                setTimeout(function () {
                    if (BaseService.hasValue(dataFilter)) {
                        $scope.dataFilter = dataFilter;
                        if (callbackIdParam) {
                            $('.tabStatus' + callbackIdParam).trigger("click");
                            //statusIdParam = '';
                        }
                        else {
                            $('.tabStatus' + $scope.dataFilter.Callback_Id).trigger("click");
                        }
                    } else {
                        $('.tabStatus4').trigger("click");
                        BaseService.setLocalStorage($scope.uriController + 'AW', $scope.dataFilter);
                    }

                    function cb(start, end) {
                        $('#request_date_range span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));//
                        $scope.dataFilter.startDate = start.format('YYYYMMDD');
                        $scope.dataFilter.endDate = end.format('YYYYMMDD');
                        var Callback_Id = $scope.dataFilter.Callback_Id;
                        $scope.retrieveAll();
                    }

                    $('#request_date_range').daterangepicker({
                        startDate: start,
                        endDate: end,
                        showCustomRangeLabel: true,
                        ranges: {
                            'Last Week': [moment().startOf('week').subtract(7, 'days'), moment().endOf('week').subtract(7, 'days')],
                            'This Week': [moment().startOf('week'), moment().endOf('week')],
                            'Next Week': [moment().startOf('week').subtract(-7, 'days'), moment().endOf('week').subtract(-7, 'days')]
                        }
                    }, cb);

                    cb(start, end);

                }, 200);


                //$scope.retrieveAll();

            });
        });

        function getDataFilterFromRange(dataFilter) {
            if (hasValue(dataFilter) && hasValue(dataFilter.range)) {
                switch (dataFilter.range) {
                    case 'Today':
                        dataFilter.startDate = moment().format('YYYYMMDD');
                        dataFilter.endDate = moment().format('YYYYMMDD');
                        break;
                    case 'Yesterday':
                        dataFilter.startDate = moment().subtract(1, 'days').format('YYYYMMDD');
                        dataFilter.endDate = moment().subtract(1, 'days').format('YYYYMMDD');
                        break;
                    case 'Last 7 Days':
                        dataFilter.startDate = moment().subtract(6, 'days').format('YYYYMMDD');
                        dataFilter.endDate = moment().format('YYYYMMDD');
                        break;
                    case 'Last 30 Days':
                        dataFilter.startDate = moment().subtract(29, 'days').format('YYYYMMDD');
                        dataFilter.endDate = moment().format('YYYYMMDD');
                        break;
                    case 'This Month':
                        dataFilter.startDate = moment().startOf('month').format('YYYYMMDD');
                        dataFilter.endDate = moment().endOf('month').format('YYYYMMDD');
                        break;
                    case 'Last Month':
                        dataFilter.startDate = moment().subtract(1, 'month').startOf('month').format('YYYYMMDD');
                        dataFilter.endDate = moment().subtract(1, 'month').endOf('month').format('YYYYMMDD');
                        break;
                    default:
                        break;
                }
            }
            return dataFilter;
        }

        function getDatetime(date, format, checkTimeZone) {
            checkTimeZone = checkTimeZone || checkTimeZone == false ? checkTimeZone : true;
            if (date) {
                format = (format) ? format : 'DD/MM/YYYY HH:mm';
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

        function hasValue(item) {
            var _result = false;
            try {
                if (item !== undefined && item !== null && item.toString() !== '') {
                    _result = true;
                }
            } catch (err) {
                console.log(err.message);
            } finally {
                return _result;
            }
        }

        $scope.retrieveMasterData = function (callback) {

            $scope.dataFilter.NameLink = $scope.uriController;

            var data = {
                dataFilter: $scope.dataFilter
            };
            BaseService.post('Master', 'MasterProjectName', data).then(
                function (response) {
                    $scope.dataMaster = response.data.result;

                    if ($scope.dataMaster == null || $scope.dataMaster.length == 0) {
                        $scope.selectedInfo = ($scope.dataDetail) ? $scope.dataDetail[0] : {};
                        $scope.selectedInfoTemp = angular.copy($scope.selectedInfo);

                        BaseService.setDisabledControl(true);
                        setTimeout(function () {
                            $scope.$apply();
                        }, 50);
                    }

                    if (callback) {
                        callback();
                    }
                },
                function (response) {
                    BaseService.alertError(response.message);
                }
            );
        };



        $scope.$on('onSearchClick', function () {
            $scope.retrieveAll();
        });


        $scope.retrieveAll = function () {
            var data = {
                dataFilter: $scope.dataFilter
            };
            BaseService.post($scope.uriController, 'GetByDate', data).then(
                function (response) {
                    $scope.dataDetail = response.data.result;
                    $.each($scope.dataDetail, function (index, item) {
                        item.rowId = BaseService.generateId(18);
                    });

                    $scope.selectedInfo = ($scope.dataDetail) ? $scope.dataDetail[0] : {};
                    $scope.renderTable($scope.dataDetail);
                    BaseService.focusTableRow($scope.table, 0);
                },
                function (response) {
                    BaseService.alertError(response.message);
                }
            );
        };



        $scope.renderTable = function (dataSource) {
            dataSource = _.sortByOrder(dataSource, ['Case_Id']);
            //alert('test');
            if (dataSource != null) {

                $scope.table = $('#table_list').dataTable({
                    "data": dataSource,
                    "columns": [
                        {
                            "data": "Case_Id", "class": "text-center"
                        },
                        {
                            "data": "ServiceGroup_Name", "class": "text-center"
                        },
                        {
                            "data": "ServiceType_Name", "class": "text-center"
                        },
                        {
                            "data": "Create_Date", "class": "text-center"
                        },
                        {
                            "data": "Owner_Name", "class": "text-center"
                        },
                        {
                            "data": "Owner_Phone", "class": "text-center"
                        },
                        {
                            "data": "Book_Name", "class": "text-center"
                        },
                        {
                            "data": "Book_Phone", "class": "text-center"
                        },
                        {
                            "data": "Address", "class": "text-center"
                        },
                        {
                            "data": "วันที่นัดหมาย", "class": "text-center"
                        },
                        {
                            "data": "ServiceType_Name1", "class": "text-center"
                        },
                        {
                            "data": "Close_Date", "class": "text-center"
                        },
                        {
                            "data": "DeliveryBy", "class": "text-center"
                        },
                        {
                            "data": "LastDesc", "class": "text-center"
                        },
                        {
                            "data": "TrackingCode", "class": "text-center"
                        },
                        {
                            "data": "Delivery_Date", "class": "text-center"
                        },
                        {
                            "data": "Delivery_Time", "class": "text-center"
                        },
                        {
                            "data": "DeliveryType", "class": "text-center"
                        }
                        ,
                        {
                            "data": "Amount", "class": "text-center"
                        }
                        ,
                        {
                            "data": "Create_By", "class": "text-center"
                        },
                        {
                            "data": "จำนวนน้องหอมจัง", "class": "text-center"
                        }
                    ],
                    "createdRow": function (row, data, index) {
                        $compile(row)($scope);
                    },
                    "bDestroy": true,
                    "paging": true,
                    "bSort": false,
                    "filter": false,
                    "info": false,
                    scrollCollapse: true,
                    "pageLength": 50,
                    select: true
                });
            }
        };

        $scope.ExportAllExcel = function () {
            var data = {
                dataFilter: $scope.dataFilter
            };
            BaseService.post($scope.uriController, 'Export', data).then(
                function (response) {
                    $rootScope.showModalProcessing(true);
                    if (response.data.result !== 'No Data.') {

                        window.location = currentUrl + '/' + $scope.uriController + '/DownloadFile?FileName=' + response.data.result;
                        console.log(window.location);
                    }
                    else {
                        BaseService.alertWarning(response.data.result);
                    }
                    $rootScope.showModalProcessing(false);
                },
                function (response) {
                    BaseService.alertError(response.message);
                }
            );
        };
    }
    
]);