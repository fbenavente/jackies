/**
* DropdownsController
* @namespace jackies.layout.controllers
*/
(function () {
    'use strict';

    angular
    .module('jackies.layout.controllers')
    .controller('DropdownsController', DropdownsController);

    DropdownsController.$inject = ['$scope', 'api', 'generic_functions', '$timeout', '$interval'];

    /**
    * @namespace DropdownsController
    */
    function DropdownsController($scope, api, generic_functions, $timeout, $interval) {
        var vm = this;
        $scope.productsDict = {};
        $scope.backgrounds = {};
        $scope.currentBackground = 1;
        $scope.categoryQuestionNumber = "1";
        $scope.flavorQuestionNumber = "2";
        $scope.sizeQuestionNumber = "3";
        $scope.selectedDropdownItem = {
            "category": "Que quiero?",
            "flavor": "De que tipo?",
            "size": "Que tamaño?"
        };
        $scope.flavor_number_class = "";
        $scope.size_number_class = "";
        $scope.selectedProduct = "";
        var images = new Array();
        var myInterval;

        // Calculating margin-top for product image and dropdowns vertical center

        $scope.verticalCenter = {
            "image": {"margin-top":"0px"},
            "category":{},
            "flavor": {},
            "size": {}
        };

        $scope.setDropdownsCenters = function(){
            var container_height = $(window).height();
            var navbar_height = $(".navbar").height();
            var navbar_margin = parseInt($(".navbar").css("margin-bottom"));
            var dropdown_category_height = $("#dropdown-category").height();
            var margin_top_category = (container_height/2) - (dropdown_category_height/2) - navbar_height - navbar_margin;
            var margin_top_dropdowns = margin_top_category - (dropdown_category_height/2);
            $scope.verticalCenter["category"] = {"margin-top": parseInt(margin_top_category) + "px"};
            $scope.verticalCenter["flavor"] = {"margin-top": parseInt(margin_top_dropdowns) + "px"};
            $scope.verticalCenter["size"] = {"margin-top": parseInt(margin_top_dropdowns) + "px"};
        };



        //Function to select the category, flavor or size
        $scope.selectDropdown = function(btn_name, item_selected){
            $scope.selectedDropdownItem[btn_name] = item_selected;
            $scope.selectedProduct = {"image":""};

            $("#dropdown-" + btn_name).removeClass("col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2").addClass("col-xs-4");
            $scope.verticalCenter[btn_name] = {};
            $("#dropdown-" + btn_name + "-btn").removeClass("btn-question-big").addClass("btn-question-small");
            $("#dropdown-" + btn_name + "-menu").removeClass("dropdown-menu-big").addClass("dropdown-menu-small");
            $("#dropdown-" + btn_name + "-btn .question-text").addClass("xs-hidden");
            if (btn_name == "category") {
                if ("" in $scope.productsDict[item_selected]["flavors"]) {
                    $scope.selectedDropdownItem["flavor"] = "";
                    $scope.hideRow("flavor");
                    $scope.flavor_number_class = "";
                    if ("" in $scope.productsDict[item_selected]["flavors"][""]["sizes"]) {
                        $scope.selectedDropdownItem["size"] = "";
                        $scope.hideRow("size");
                        $scope.size_number_class = "";
                        $scope.loadProduct($scope.productsDict[item_selected]["flavors"][""]["sizes"][""]["data"]);
                    }
                    else{
                        $scope.closeProduct();
                        if($("#dropdown-size-btn").hasClass("btn-question-small")){
                            $scope.size_number_class = "blink";
                        }
                        $scope.selectedDropdownItem["size"] = "Que tamaño?";
                        $scope.sizeQuestionNumber = "2";
                        $scope.showRow("size");
                    }
                }
                else{
                    $scope.closeProduct();
                    $scope.hideRow("size");
                    if($("#dropdown-flavor-btn").hasClass("btn-question-small")){
                            $scope.flavor_number_class = "blink";
                            $scope.size_number_class = "";
                        }
                    $scope.sizeQuestionNumber = "3";
                    $scope.selectedDropdownItem["flavor"] = "De que tipo?";
                    $scope.showRow("flavor");
                }
            }
            else {
                if (btn_name == "flavor") {
                    $("#dropdown-" + btn_name).addClass("col-xs-offset-4 margin-negative");
                    if ("" in $scope.productsDict[$scope.selectedDropdownItem["category"]]["flavors"][item_selected]["sizes"]) {
                        $scope.selectedDropdownItem["size"] = "";
                        $scope.hideRow("size");
                        $scope.flavor_number_class = "";
                        $scope.loadProduct($scope.productsDict[$scope.selectedDropdownItem["category"]]["flavors"][item_selected]["sizes"][""]["data"]);
                    }
                    else{
                        $scope.closeProduct();
                        if($("#dropdown-size-btn").hasClass("btn-question-small")){
                            $scope.size_number_class = "blink";
                            $scope.flavor_number_class = "";
                        }
                        $scope.selectedDropdownItem["size"] = "Que tamaño?";
                        $scope.showRow("size");
                    }

                }
                else {
                    if (btn_name == "size") {
                        $("#dropdown-" + btn_name).addClass("col-xs-offset-8 margin-negative");
                        $scope.loadProduct($scope.productsDict[$scope.selectedDropdownItem["category"]]["flavors"][$scope.selectedDropdownItem["flavor"]]["sizes"][item_selected]["data"]);
                        $scope.size_number_class = "";
                    }
                }
            }
        };

        // seteamos los margenes top de los dropdowns para que queden centrados
        $scope.setDropdownsCenters();

        // Load backgrounds
        api.getBackgrounds().then(function(response) {
            $scope.backgrounds = response.data;
            images.push($( '<img src="' + $scope.backgrounds.results[0].image + '">' ));
            $( 'body' ).css( 'background-image', 'url(' + $scope.backgrounds.results[0].image + ')' );
            myInterval = $interval(function(){
                if(!images[$scope.currentBackground]) {
                    images.push($('<img src="' + $scope.backgrounds.results[$scope.currentBackground].image + '">'));
                    images[$scope.currentBackground].bind('load', function () {
                        $('body').css('background-image', 'url(' + $scope.backgrounds.results[$scope.currentBackground].image + ')');
                    });
                    if (images[$scope.currentBackground][0].width) {
                        images[$scope.currentBackground].trigger('load');
                    }
                }
                else{
                    $('body').css('background-image', 'url(' + $scope.backgrounds.results[$scope.currentBackground].image + ')');
                }

                if($scope.currentBackground < $scope.backgrounds.count - 1){
                    $scope.currentBackground++;
                }
                else{
                    $scope.currentBackground = 0;
                }
            }, 10000);
        },
        function(response) {
            //generic_functions.show_message(generic_functions.get_error_message(response), false);
        });

        $scope.$on('$destroy', function() {
                $interval.cancel( myInterval );
            });

        // Load products dict
        api.getProducts().then(function(response) {
            $scope.productsDict = response.data;
            $("#dropdown-category").removeClass("dropdown-hidden");
        },
        function(response) {
            //generic_functions.show_message(generic_functions.get_error_message(response), false);
        });

        $scope.showRow = function(element_name){
            $("#row-"+element_name).show("fast", function () {
                    // Animation complete.
                    $("#dropdown-"+element_name).removeClass("dropdown-hidden");
                });

        };

        $scope.hideRow = function(element_name){
            $("#row-"+element_name).hide("slow", function () {
                    // Animation complete.
                    $("#dropdown-"+element_name).addClass("dropdown-hidden");
                });

        };

        $scope.loadProduct = function(product){
            $("#product-preview-image").hide();
            $("#product-image-loading").show();
            $scope.selectedProduct = product;
            $("#product-preview").removeClass("dropdown-hidden");
            if($("#product-preview-image")[0].complete){
                $scope.setImageMarginTop();
            }
            else{
                $("#product-preview-image").load(function(){
                    $scope.setImageMarginTop();
                });
            }

            $("#wrapper").addClass("wrapper-back-modal");
        };

        $scope.closeProduct = function(){
            $("#product-preview").addClass("dropdown-hidden");
            $("#wrapper").removeClass("wrapper-back-modal")
        };

        $scope.setImageMarginTop = function(){

            var container_height = $(window).height();
            var navbar_margin = parseInt($(".navbar").css("margin-bottom"));
            var row_category_height = $("#dropdown-category").height();
            var image_height = $(".product-preview-image").height();
            var margin_top_temp = (container_height / 2) - (image_height / 2);
            var margin_top = margin_top_temp - (navbar_margin + row_category_height);
            if (margin_top < 0) {
                margin_top = 30;
            }

            // we update the margin-top of the product image ONLY if the difference with the previous margin is significant (+-10)
            if((parseInt($scope.verticalCenter["image"]["margin-top"]) < margin_top -10) || (parseInt($scope.verticalCenter["image"]["margin-top"]) > margin_top +10)) {

                // method apply allows to include angular bindings inside jquery functions
                $timeout(function () {
                    $scope.verticalCenter["image"] = {"margin-top": parseInt(margin_top) + "px"};
                },10);
            }

            $("#product-image-loading").hide();
            $("#product-preview-image").show("fade",600);
        };
    }
})();

