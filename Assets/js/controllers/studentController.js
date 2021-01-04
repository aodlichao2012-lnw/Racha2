app.controller('StudentController', ['$scope', '$rootScope', '$compile', '$location', 'BaseService',
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
            projectName : ''
        };
        $scope.dataCheck = [];
        $scope.dataLog = null;
        $scope.dataInfo = [];
        $scope.uriController = "student";
        $scope.textFile = {};
        dateparam = '';
        $scope.dataID = {
            ID: ''
        };
        $scope.dataFilter = {
            CDN : ''
        }
    

        angular.element(document).ready(function () {

            var start = moment().startOf('month');
            var end = moment().endOf('month');
            $scope.dataFilter.startDate = start.format('YYYY-MM-DD');
            $scope.dataFilter.endDate = end.format('YYYY-MM-DD');
      

           
    
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
                        $scope.dataFilter.startDate = start.format('YYYY-MM-DD');
                        $scope.dataFilter.endDate = end.format('YYYY-MM-DD');
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


                $scope.retrieveAll();

            });
        });

        function getDataFilterFromRange(dataFilter) {
            if (hasValue(dataFilter) && hasValue(dataFilter.range)) {
                switch (dataFilter.range) {
                    case 'Today':
                        dataFilter.startDate = moment().format('YYYY-MM-DD');
                        dataFilter.endDate = moment().format('YYYY-MM-DD');
                        break;
                    case 'Yesterday':
                        dataFilter.startDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                        dataFilter.endDate = moment().subtract(1, 'days').format('YYYY-MM-DD');
                        break;
                    case 'Last 7 Days':
                        dataFilter.startDate = moment().subtract(6, 'days').format('YYYY-MM-DD');
                        dataFilter.endDate = moment().format('YYYY-MM-DD');
                        break;
                    case 'Last 30 Days':
                        dataFilter.startDate = moment().subtract(29, 'days').format('YYYY-MM-DD');
                        dataFilter.endDate = moment().format('YYYY-MM-DD');
                        break;
                    case 'This Month':
                        dataFilter.startDate = moment().startOf('month').format('YYYY-MM-DD');
                        dataFilter.endDate = moment().endOf('month').format('YYYY-MM-DD');
                        break;
                    case 'Last Month':
                        dataFilter.startDate = moment().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
                        dataFilter.endDate = moment().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
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


        $('#chkRequestAll').on('click', function () {
            // Get all rows with search applied
            var rows = $scope.table.api().rows({ 'search': 'applied' }).nodes();
            // Check/uncheck checkboxes for all rows in the table
            var check = this.checked;

            if ($scope.dataFilter.VENDOR_ID === null || $scope.dataFilter.VENDOR_ID === '0') {
                // BaseService.alertVendorEmpty('Vendor');
                // return;
            }

            $('input[type="checkbox"]:not(:disabled)', rows).prop('checked', this.checked);


        });

        $('input[type="checkbox"]:not(:disabled)').on('click', function () {

            // $('td').filter((i, el) => (el.textContent === $(this).parent().closest("tr").find("td:nth-child(4)").text())).parent().find('input[type="checkbox"]:not(:disabled)').prop('checked', this.checked);

        });

        // Handle click on checkbox to set state of "Select all" control
        $('.table_list tbody').on('change', 'input[type="checkbox"]', function () {
            // If checkbox is not checked

            if (!this.checked) {
                var el = $('#chkRequestAll').get(0);
                // If "Select all" control is checked and has 'indeterminate' property
                if (el && el.checked && ('indeterminate' in el)) {
                    // Set visual state of "Select all" control
                    // as 'indeterminate'
                    el.indeterminate = true;
                }
            }
        });
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
            //dataSource = _.sortByOrder(dataSource, ['Date']);
            //alert('test');
            if (dataSource != null) {

                $scope.table = $('#table_list').dataTable({
                    "data": dataSource,
                    "columns": [

                            {
                                "class": "text-center",
                                "render": function (data, type, row) {
                                    return '<input type="checkbox" name="id[]" value="' + $('<div/>').text(row.Callback_Id).html() + '">';
                                }
                            },
                        {
                            "data": "Callback_Id", "class": "text-center"
                        },
                        {
                            "data": "Project_Name", "class": "text-center"
                        },
                        {
                            "data": "CDN", "class": "text-center"
                        },
                        {
                            "data": "Telephone_No", "class": "text-center"
                        },
                        {
                            "data": "Callback_Date", "class": "text-center"
                        },
                        {
                            "data": "Callback_Time", "class": "text-center"
                        },
                        {
                            "data": "Callback_Type", "class": "text-center"
                        },
                        {
                            "data": "Export", "class": "text-center",
                            "render": function (data, type, row) {
                                if (data == 0) {
                                    data = 'ยังไม่ได้โทร'
                                }
                                else
                                {
                                    data = 'โทรแล้ว'

                                }
                                return data;
                            }
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



        $scope.UpdateData = function () {

            var TabID = [0];
            

            $scope.checkData(TabID, 'Request for Approve', function () {
                $rootScope.showModalProcessing(true);

                var data = {
                    DT: $scope.dataCheck
                };
                 console.log(data);

                var datacheck = $scope.dataCheck;

                for (var i = 0; datacheck.length; i++)
                {
                    var listid = _.find(datacheck[i]);
                    $scope.Save(datacheck[i]);

                }
                $rootScope.showModalProcessing(false);
                BaseService.alertSaveSuccess();
            
            });
        }

        $scope.Save = function (id)
        {
            $scope.dataID.ID = id.Callback_Id;
            var data = {
                dataFilter: $scope.dataFilter,
                dataID: $scope.dataID

            };

            BaseService.post($scope.uriController, 'GetUpdateStatus', data).then(
                function (response) {

                    $rootScope.showModalProcessing(false);
                    BaseService.alertSaveSuccess(function () {

                        $scope.retrieveAll();
                    });

                },
                function (response) {
                    $rootScope.showModalProcessing(false);
                    BaseService.alertError(response.message);
                }
            );
        }

        $scope.checkData = function (StatusIDArray, TabName, callback) {
            $scope.dataCheck = [];
            TabName = 'Request for Approve';
           
                var rows = $scope.table.api().rows({ 'search': 'applied' }).nodes();
                $.each($('input[type="checkbox"]', rows), function (index, item) {
                    if (item.checked) {
                        var datas = $scope.table.api().rows($(this).parent()).data();
                        $scope.dataCheck.push(datas[0]);
                    }
                });

                if ($scope.dataCheck.length <= 0) {
                    BaseService.alertEmpty('select data');
                    return;
                }
                else {
                    if (callback) {
                        callback();
                    }

                }
            }
          
          

         }
    
]);