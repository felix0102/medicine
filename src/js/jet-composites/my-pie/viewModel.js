/**
 Copyright (c) 2015, 2017, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
define(
        ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojchart','jet-composites/demo-chart-three-d-effect-control/loader'], function (oj, ko, $) {
    'use strict';

    function ExampleComponentModel(context) {
        var self = this;

        self.threeDValue = ko.observable('off');
        
        self.composite = context.element;
        //Example observable
        self.chartName = ko.observable('');
        self.dataUrl = ko.observable('dataUrl');
        self.pieSeriesValue = ko.observableArray();
        self.threeDValue = ko.observable('off');
        self.innerRadius = ko.observable(0);
        self.centerLabel = ko.observable("");

        self.serToolValue = ko.observable();
        self.valToolValue = ko.observable();
        self.groupToolValue = ko.observable();
        context.props.then(function (propertyMap) {
            //Store a reference to the properties for any later use

            self.properties = propertyMap;

            if (self.properties.chartName != undefined) {
                self.chartName(self.properties.chartName)
            }
            if (self.properties.innerRadius != undefined) {
                self.innerRadius(self.properties.innerRadius)
            }
            if (self.properties.centerLabel != undefined) {
                self.centerLabel(self.properties.centerLabel)
            }
            if (self.properties.dataUrl != undefined) {
                self.dataUrl(self.properties.dataUrl);
                $.getJSON(self.properties.dataUrl, function (data) {
                    self.serToolValue(data.seriesTooltip);
                    self.valToolValue(data.valueTooltip);
                    self.groupToolValue(data.groupTooltip);
                    self.pieSeriesValue(data.dataArr)
                });
            }

            //Parse your component properties here 

        });
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