app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            var triggerChange = false;

            element.bind('change', function (e) {
                if (!triggerChange) {
                    scope.$apply(function () {
                        var file = (element[0].files) ? element[0].files[0] : FileAPI.getFiles(e)[0];
                        if (!file.size) {
                            if (FileAPI) {
                                FileAPI.upload({
                                    url: '/file/get-image-size',
                                    data: { foo: "bar" },
                                    files: { image: file },
                                    complete: function (err, xhr, currentfile) {
                                        if (!err) {
                                            file.size = xhr.responseText;
                                            modelSetter(scope, file);
                                            triggerChange = true;
                                            $(element[0]).trigger('change');
                                        }
                                    }
                                });
                            }
                        }
                        else {
                            modelSetter(scope, file);
                        }
                    });
                }
                else triggerChange = false;
            });
        }
    };
}]);

app.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;

            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });

            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber;
                if (attrs.numericDecimal2 != null) {
                    plainNumber = viewValue;
                    if (plainNumber.split('.').length == 2) {
                        elem.val(plainNumber);
                        var numberWith2Digit = $filter(attrs.format)(plainNumber.replace(/[^\d|\-+|\.+]/g, ''), 2);
                        return numberWith2Digit.replace(',', '');
                    }
                    else plainNumber = viewValue.replace(',', '');
                }
                else {
                    plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                }
                if (attrs.numericInteger != null) {
                    var re = new RegExp("^\\d+$|^\\d*\\d+$");
                    if (!re.exec(plainNumber)) {
                        elem.val('');
                        return '';
                    }
                }
                if (attrs.min != null) {
                    if (parseFloat(plainNumber) < parseFloat(attrs.min)) {
                        elem.val($filter(attrs.format)(attrs.min));
                        return attrs.min;
                    }
                }
                if (attrs.max != null) {
                    if (parseFloat(plainNumber) > parseFloat(attrs.max)) {
                        elem.val($filter(attrs.format)(attrs.max));
                        return attrs.max;
                    }
                }
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });

            $(elem).on('blur', function (e) {
                if (attrs.numericDecimal2 != null) {
                    if (this.value != "") {
                        this.value = $filter(attrs.format)(this.value.replace(/[^\d|\-+|\.+]/g, ''), 2);
                    }
                }
            });
        }
    };
}]);

app.directive('errSrc', function () {
    return {
        link: function (scope, element, attrs) {
            var errImage = currentUrl + "/App_Assets/images/no-image.png";
            element.bind('error', function () {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', errImage);
                }
            });

            attrs.$observe('ngSrc', function (value) {
                if (!value) {
                    attrs.$set('src', errImage);
                }
            });
        }
    }
});

app.directive('vertilizeContainer', [
    function () {
        return {
            restrict: 'EA',
            controller: [
                '$scope', '$window',
                  function ($scope, $window) {
                      // Alias this
                      var _this = this;

                      // Array of children heights
                      _this.childrenHeights = [];

                      // API: Allocate child, return index for tracking.
                      _this.allocateMe = function () {
                          _this.childrenHeights.push(0);
                          return (_this.childrenHeights.length - 1);
                      };

                      // API: Update a child's height
                      _this.updateMyHeight = function (index, height) {
                          _this.childrenHeights[index] = height;
                      };

                      // API: Get tallest height
                      _this.getTallestHeight = function () {
                          var height = 0;
                          for (var i = 0; i < _this.childrenHeights.length; i = i + 1) {
                              height = Math.max(height, _this.childrenHeights[i]);
                          }
                          return height;
                      };

                      // Add window resize to digest cycle
                      angular.element($window).bind('resize', function () {
                          return $scope.$apply();
                      });
                  }
            ]
        };
    }
]);

app.directive('vertilize', [
    function () {
        return {
            restrict: 'EA',
            require: '^vertilizeContainer',
            link: function (scope, element, attrs, parent) {
                // My index allocation
                var myIndex = parent.allocateMe();

                // Get my real height by cloning so my height is not affected.
                var getMyRealHeight = function () {
                    var clone = element.clone()
                        .removeAttr('vertilize')
                        .css({
                            height: '',
                            width: element.width(),
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            visibility: 'hidden'
                        });
                    element.after(clone);
                    var realHeight = clone.height();
                    clone['remove']();
                    return realHeight;
                };

                // Watch my height
                scope.$watch(getMyRealHeight, function (myNewHeight) {
                    if (myNewHeight) {
                        parent.updateMyHeight(myIndex, myNewHeight);
                    }
                });

                // Watch for tallest height change
                scope.$watch(parent.getTallestHeight, function (tallestHeight) {
                    if (tallestHeight && window.innerWidth >= 768) {
                        element.css('height', tallestHeight);
                    }
                    else {
                        element.css('height', 'auto');
                    }
                });
            }
        };
    }
]);

app.filter('range', function () {
    return function (input, start, end) {
        start = parseInt(start);
        end = parseInt(end);
        var direction = (start <= end) ? 1 : -1;
        while (start != end) {
            input.push(start);
            start += direction;
        }
        return input;
    };
});

app.filter('rangeYear', function () {
    return function (input) {
        start = new Date().getFullYear() - 20;
        end = new Date().getFullYear() + 5;
        var direction = (start <= end) ? 1 : -1;
        while (start != end) {
            input.push(start);
            start += direction;
        }
        return input;
    };
});