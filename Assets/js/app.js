"use strict";
//global variable 555s
var currentUrl = window.location.origin;
var apiUrl = currentUrl + "/api/";
var userLogin, userGroup, unAuthLink ,testVaraiable;
var isPageReload = false;
var isIE8 = false;
var isBom = false;
//var app = angular.module('app', ['ngRoute']);
var app = angular.module('app', []);
app.config(['$httpProvider', '$locationProvider', function ($httpProvider, $locationProvider) {
    //initialize get if not there
   
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};
        $locationProvider.html5Mode(true);
    }

    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}]);
app.controller('AppController', ['$scope', '$rootScope', '$compile', '$location', 'BaseService',
    function ($scope, $rootScope, $compile, $location, BaseService) {

        var validNavigation = false;
        $rootScope.userLogin = userLogin;
        $rootScope.userGroup = userGroup;
        $rootScope.testVaraiable = testVaraiable;
        angular.element(document).ready(function() {
            BaseService.initail();
            BaseService.activateDatePicker();
            $rootScope.isIE8 = isIE8;
            setTimeout(function () {
                $rootScope.$apply();
                $rootScope.checkActiveMenu();
            }, 100);
        });
        
        $rootScope.apply = function(){
            $('input:not(.picker-input)').blur();
        };
        
        $rootScope.refresh = function(time){
            time = (time === null) ? 10 : time;
            setTimeout(function(){
                $scope.$apply();
            }, time);
        };
        
        $rootScope.baseButtonClick = function (buttonType) {
           // alert(buttonType);
            switch(buttonType.toLowerCase()){
                case 'search': 
                    $rootScope.apply();
                    setTimeout(function(){
                        $rootScope.$broadcast('onSearchClick');
                    },100);
                    break;
                case 'add': 
                    $rootScope.apply();
                    setTimeout(function(){
                        $rootScope.$broadcast('onAddClick');
                    },100);
                    break;
                case 'new': 
                    $rootScope.apply();
                    setTimeout(function(){
                        $rootScope.$broadcast('onNewClick');
                    },100);
                    break;
                case 'edit':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onEditClick');
                    }, 100);
                    break;
                case 'delete': 
                    $rootScope.apply();
                    setTimeout(function(){
                        $rootScope.$broadcast('onDeleteClick');
                    },100);
                    break;
                case 'save': 
                    $rootScope.apply();
                    setTimeout(function(){
                        $rootScope.$broadcast('onSaveClick');
                    },100);
                    break;
                case 'resave':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onReSaveClick');
                    }, 100);
                    break;
                case 'savedraft':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onSaveDraftClick');
                    }, 100);
                    break;
                case 'reload':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onReloadClick');
                    }, 100);
                    break;
                case 'approve':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onApproveClick');
                    }, 100);
                    break;
                case 'unapprove':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onUnApproveClick');
                    }, 100);
                    break;
                case 'reject':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onRejectClick');
                    }, 100);
                    break;
                case 'revert':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onRevertClick');
                    }, 100);
                    break;
                case 'exporttemplate':
                    //alert('testbase2');
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onExportTemplateClick');
                    }, 100);
                    break;
                case 'export':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onExportClick');
                    }, 100);
                    break;
                case 'view':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onViewClick');
                    }, 100);
                    break;
                case 'retrive':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onRetriveClick');
                    }, 100);
                    break;
                case 'cancelsap':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('oncancelSAPClick');
                    }, 100);
                    break;
                case 'back':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onBackClick');
                    }, 100);
                    break;
                case 'printpdf':
                    $rootScope.apply();
                    setTimeout(function () {
                        $rootScope.$broadcast('onPrintPDFClick');
                    }, 100);
                    break;
            }
        };

        $rootScope.getLoadingImage = function () {
            if (!isIE8) {
                return '~/App_Assets/images/progress/progress-circle-warning.svg';
            }
            else {
                return '';
            }
        };
        
        $rootScope.showModalProcessing = function(isShow){
            var action = (isShow) ? 'show' : 'hide';
            $('#modalProcessing').modal(action);
        };
        
        $rootScope.dateTimeFormat = function(dateStr){
            return BaseService.dateFormat(dateStr, 'dd/MM/yyyy HH:mm');
        };
        
        $rootScope.stampAudit = function (data) {
            var date = new Date();
            var dateString = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2);
            if ($.isArray(data)) {
                $.each(data, function (index, item) {
                    item.CREATE_BY = (item.CREATE_BY) ? item.CREATE_BY : $rootScope.userLogin.ID;
                    item.CREATE_DATE = (item.CREATE_DATE) ? item.CREATE_DATE : dateString;
                    item.UPDATE_BY = $rootScope.userLogin.ID;
                });
            }
            else {
                data.CREATE_BY = (data.CREATE_BY) ? data.CREATE_BY : $rootScope.userLogin.ID;
                data.CREATE_DATE = (data.CREATE_DATE) ? data.CREATE_DATE : dateString;
                data.UPDATE_BY = $rootScope.userLogin.ID;
            }
        };

        $rootScope.stampAuditData = function (data) {
            var date = new Date();
            var dateString = ("0" + date.getDate()).slice(-2) + '/' + ("0" + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear() + ' ' + ("0" + date.getHours()).slice(-2) + ':' + ("0" + date.getMinutes()).slice(-2) + ':' + ("0" + date.getSeconds()).slice(-2);
            if ($.isArray(data)) {
                $.each(data, function (index, item) {
                    item.CREATE_BY = (item.CREATE_BY) ? item.CREATE_BY : $rootScope.userLogin.ID;
                    item.CREATE_DATE = (item.CREATE_DATE) ? item.CREATE_DATE : dateString;
                    item.UPDATE_BY = $rootScope.userLogin.ID;
                    item.UPDATE_DATE = (item.UPDATE_DATE) ? item.UPDATE_DATE : dateString;
                });
            }
            else {
                data.CREATE_BY = (data.CREATE_BY) ? data.CREATE_BY : $rootScope.userLogin.ID;
                data.CREATE_DATE = (data.CREATE_DATE) ? data.CREATE_DATE : dateString;
                data.UPDATE_BY = $rootScope.userLogin.ID;
                data.UPDATE_DATE = (data.UPDATE_DATE) ? data.UPDATE_DATE : dateString;
            }
        };

        $rootScope.checkActiveMenu = function (menu) {
            var pageUrl = window.location.pathname.replace(/\//g, "").replace("info", "|").split('|')[0];
            $("#page_sidebar ul li a").each(function () {
                var href = $(this).attr("href").replace(/\//g, "").replace("info", "|").split('|')[0];
                if (href === pageUrl || href === '') {
                    $(this.parentElement).addClass("active");
                    var submenu = $(this).closest('ul.sub-menu');
                    if (submenu) {
                        $(submenu).css('display', 'block');
                    }
                    var droplink = $(this).closest('li.droplink');
                    if (droplink) {
                        $(droplink).addClass('open');
                    }
                    $rootScope.sidebarAndContentHeight();
                    return false;
                }
            });
        };

        $rootScope.sidebarAndContentHeight = function () {
            var content = $('.page-inner'),
                sidebar = $('.page-sidebar'),
                body = $('body'),
                height,
                footerHeight = $('.page-footer').outerHeight(),
                pageContentHeight = $('.main-content').height();

            content.attr('style', 'min-height:' + sidebar.height() + 'px !important');

            if (body.hasClass('page-sidebar-fixed')) {
                height = sidebar.height() + footerHeight;
            } else {
                height = sidebar.height() + footerHeight;
                if (height < $(window).height()) {
                    height = $(window).height();
                }
            }

            if (height >= content.height()) {
                content.attr('style', 'min-height:' + height + 'px !important');
            }
        };

        $rootScope.signOut = function () {
            BaseService.get('login', 'signout');
            if (unAuthLink) {
                window.location.href = unAuthLink;
            }
            else {
                window.location.href = currentUrl + "/login";
            }
        };
    }
]);