/**
* DropdownsController
* @namespace jackies.layout.controllers
*/
(function () {
    'use strict';

    angular
    .module('jackies.layout.controllers')
    .controller('DropdownsController', DropdownsController);

    DropdownsController.$inject = ['$scope', 'api', 'generic_functions'];

    /**
    * @namespace DropdownsController
    */
    function DropdownsController($scope, api, generic_functions) {
        var vm = this;
        $scope.productsDict = {};
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

        //Function to select the category, flavor or size
        //ToDo add a blink class to the current question
        $scope.selectDropdown = function(btn_name, item_selected){
            $scope.selectedDropdownItem[btn_name] = item_selected;
            $scope.selectedProduct = {"image":""};


            $("#dropdown-" + btn_name).removeClass("col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 vertical-center").addClass("col-xs-4");
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
            $scope.selectedProduct = product;
            $("#product-preview").show("slow");
            $("#wrapper").addClass("wrapper-back-modal");
        };

        $scope.closeProduct = function(){
            $("#product-preview").hide("slow");
            $("#wrapper").removeClass("wrapper-back-modal")
        };
    }
})();

