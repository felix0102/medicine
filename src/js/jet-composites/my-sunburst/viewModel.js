/**
 Copyright (c) 2015, 2017, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
define(
        ['ojs/ojcore', 'knockout', 'jquery', 'viewModels/weekDrilling', 'ojs/ojchart', 'ojs/ojrouter', 'ojs/ojchart', 'ojs/ojsunburst', 'jet-composites/demo-chart-three-d-effect-control/loader'
        ], function (oj, ko, $, drill) {
    'use strict';

    function ExampleComponentModel(context) {
        var self = this;

        self.composite = context.element;
        //Example observable
        self.chartName = ko.observable('');
        self.desDetail = ko.observable('');

        context.props.then(function (propertyMap) {
            //Store a reference to the properties for any later use

            self.properties = propertyMap;

            if (self.properties.chartName != undefined) {
                self.chartName(self.properties.chartName)
                self.desDetail(self.properties.desDetail)
            }


            //Parse your component properties here 

        });
        var handler = new oj.ColorAttributeGroupHandler();
        var unitedStates = createNode("总计63份", 63, 51425);

        var reg_NE = createNode("通知级36份", 36, 7208);
        var reg_MW = createNode("警告级27份", 27, 19932);

        var div_NE = createNode("完成16份", 16, 61511);
        var div_MA = createNode("未完成20份", 20, 55726);

        var div_EN = createNode("完成10份", 10, 50156);
        var div_WN = createNode("未完成17份", 17, 49443);


        addChildNodes(unitedStates, [reg_NE, reg_MW]);

        addChildNodes(reg_NE, [div_NE, div_MA]);
        addChildNodes(reg_MW, [div_EN, div_WN]);

        self.nodeValues = ko.observableArray([unitedStates]);




        function createNode(label, population, meanIncome) {
            return {label: label,
                id: label,
                value: population,
                color: getColor(meanIncome),
                shortDesc: "&lt;b&gt;" + label +
                        "&lt;/b&gt;&lt;br/&gt;数量: " +
                        population};
        }

        function getColor(meanIncome) {
            if (meanIncome < 45000) // 1st quartile
                return handler.getValue('1stQuartile');
            else if (meanIncome < 49000) // 2nd quartile
                return handler.getValue('2ndQuartile');
            else if (meanIncome < 56000) // 3rd quartile
                return handler.getValue('3rdQuartile');
            else
                return handler.getValue('4thQuartile');
        }

        function addChildNodes(parent, childNodes) {
            parent.nodes = [];
            for (var i = 0; i < childNodes.length; i++) {
                parent.nodes.push(childNodes[i]);
            }
        }
    }
    ;

    //Lifecycle methods - uncomment and implement if necessary 
    //ExampleComponentModel.prototype.activated = function(context){
    //};

    //ExampleComponentModel.prototype.attached = function(context){
    //};

    //ExampleComponentModel.prototype.bindingsApplied = function(context){
    //};

    //ExampleComponentModel.prototype.detached = function(context){
    //};

    return ExampleComponentModel;
});