/**
 Copyright (c) 2015, 2017, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
define(
        ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojchart','jet-composites/demo-chart-orientation-control/loader'], function (oj, ko, $) {
    'use strict';

    function ExampleComponentModel(context) {
        var self = this;
        self.composite = context.element;
        self.orientationValue = ko.observable('vertical');

        //Example observable
        self.chartName = ko.observable('');
        self.dataUrl = ko.observable('dataUrl');
        self.seriesValue = ko.observableArray();
        self.groupsValue = ko.observableArray();

        self.stackValue = ko.observable('off');
        self.orientationValue = ko.observable('vertical');
        self.serToolValue = ko.observable();
        self.valToolValue = ko.observable();
        self.groupToolValue = ko.observable();

        context.props.then(function (propertyMap) {
            //Store a reference to the properties for any later use
            self.properties = propertyMap;
            if (self.properties.chartName != undefined) {
                self.chartName(self.properties.chartName)
            }

            if (self.properties.stackValue != undefined) {
                self.stackValue(self.properties.stackValue)
            }
            if (self.properties.orientationValue != undefined) {
                self.orientationValue(self.properties.orientationValue)
            }

            if (self.properties.dataUrl != undefined) {
                self.dataUrl(self.properties.dataUrl);

                $.getJSON(self.properties.dataUrl, function (data) {
                    self.seriesValue(data.series);
                    self.groupsValue(data.groups);
                    self.serToolValue(data.seriesTooltip);
                    self.valToolValue(data.valueTooltip);
                    self.groupToolValue(data.groupTooltip);
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