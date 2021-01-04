app.controller('BasketController', ['$scope', '$rootScope', '$compile', '$location', 'BaseService',
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
        $scope.uriController = "basket";
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
            //dataSource = _.sortByOrder(dataSource, ['Case_Id']);
            //alert('test');
            if (dataSource != null) {

                $scope.table = $('#table_list').dataTable({
                    "data": dataSource,
                    "columns": [
                        {
                            "data": "Case_Id"
                        },
                        {
                            "data": "ServiceGroup_Name"
                        },
                        {
                            "data": "ServiceType_Name"
                        },
                        {
                            "data": "Create_Date"
                        },
                        {
                            "data": "Owner_Name"
                        },
                        {
                            "data": "Owner_Phone"
                        },
                        {
                            "data": "Book_Name"
                        },
                        {
                            "data": "Book_Phone"
                        },
                        {
                            "data": "Address"
                        },
                        {
                            "data": "Close_Date"
                        },
                        {
                            "data": "DeliveryBy"
                        },
                        {
                            "data": "LastDesc"
                        },
                        {
                            "data": "TrackingCode"
                        },
                        {
                            "data": "Delivery_Date"
                        },
                        {
                            "data": "Delivery_Time"
                        },
                        {
                            "data": "Create_By"
                        },
                        {
                            "data": "น้องหอมจัง"
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
            $rootScope.showModalProcessing(true);
            var data = {
                dataFilter: $scope.dataFilter
            };
            BaseService.post($scope.uriController, 'Export', data).then(
                function (response) {
                    $rootScope.showModalProcessing(true);
                    if (response.data.result !== 'No Data.') {
                        $rootScope.showModalProcessing(true);
                        window.location = currentUrl + '/' + $scope.uriController + '/DownloadFile?FileName=' + response.data.result;
                        console.log(window.location);
                        $rootScope.showModalProcessing(false);
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
            $rootScope.showModalProcessing(false);
        };
    }
    
]);