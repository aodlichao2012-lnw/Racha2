app.controller('KmotorReportController', ['$scope', '$rootScope', '$compile', '$location', 'BaseService',
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
        $scope.uriController = "KmotorReport";
        $scope.textFile = {};
        dateparam = '';
        $scope.dataID = {
            ID: ''
        };
        $scope.dataFilter = {
            CDN: ''
        }


        angular.element(document).ready(function () {

            var start = moment();
           
            $scope.dataFilter.startDate = start.format('YYYYMMDD');
        

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
                        $('#request_date_range span').html(start.format('MMMM D, YYYY'));//
                        $scope.dataFilter.startDate = start.format('YYYYMMDD');
                 
                        var Callback_Id = $scope.dataFilter.Callback_Id;
                        $scope.retrieveAll();
                    }

                    $('#request_date_range').daterangepicker({
                        startDate: start,
                        showCustomRangeLabel: true,
                        ranges: {
                            'Yesterday': [moment().subtract(1, 'days')],
                            'Today': [moment()],
                            'Tomorrow': [moment().subtract(-1, 'days')]
                        }
                    }, cb);

                    cb(start);

                }, 200);


                //$scope.retrieveAll();

            });
        });

        function getDataFilterFromRange(dataFilter) {
            if (hasValue(dataFilter) && hasValue(dataFilter.range)) {
                switch (dataFilter.range) {
                    case 'Today':
                        dataFilter.startDate = moment().format('YYYYMMDD');
                        
                        break;
                    case 'Yesterday':
                        dataFilter.startDate = moment().subtract(1, 'days').format('YYYYMMDD');
                      
                        break;
                    case 'Last 7 Days':
                        dataFilter.startDate = moment().subtract(6, 'days').format('YYYYMMDD');
                       
                        break;
                    case 'Last 30 Days':
                        dataFilter.startDate = moment().subtract(29, 'days').format('YYYYMMDD');
                     
                        break;
                    case 'This Month':
                        dataFilter.startDate = moment().startOf('month').format('YYYYMMDD');
                      
                        break;
                    case 'Last Month':
                        dataFilter.startDate = moment().subtract(1, 'month').startOf('month').format('YYYYMMDD');
                    
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
                    //$.each($scope.dataDetail, function (index, item) {
                    //    item.rowId = BaseService.generateId(18);
                    //});

                    //$scope.selectedInfo = ($scope.dataDetail) ? $scope.dataDetail[0] : {};
                    $scope.renderTable($scope.dataDetail);
                    BaseService.focusTableRow($scope.table, 0);
                },
                function (response) {
                    BaseService.alertError(response.message);
                }
            );
        };





        $scope.renderTable = function (dataSource) {
      
            //alert('test');
            if (dataSource != null) {

                $scope.table = $('#table_list').dataTable({
                    "data": dataSource,
                    "columns": [
                        {
                            "data": "Agent_Name", "class": "text-center"
                        },
                        
                        
                        {
                            "data": "Kmotor", "class": "text-center"
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