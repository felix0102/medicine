/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * weekChartTwo module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'jet-composites/my-sunburst/loader', 'ojs/ojsunburst', 'ojs/ojbutton', 'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojarraydataprovider', 'ojs/ojinputtext', 'ojs/ojlabel'
], function (oj, ko, $) {
    /**
     * The view model for the main content view template
     */
    function weekChartTwoContentViewModel() {
        var self = this;
        self.dataurlarr = ko.observableArray();
        self.dataurlarr2 = ko.observableArray();
        var mainlegend = "共：63份   本周完成：9份  累计完成：21份";
        self.sunDes = ko.observable("共：63份   本周完成：9份  累计完成：21份");
        var handler = new oj.ColorAttributeGroupHandler();
        self.jsonData = {};
        self.nodeValues = ko.observableArray();
        self.desList = ko.observableArray([]);
        self.sugValue = ko.observable("");

        self.po1 = ko.observable();
        self.po2 = ko.observable();
        self.po3 = ko.observable();
        self.po4 = ko.observable();
        self.po5 = ko.observable();
        self.po6 = ko.observable();

        self.isManager = ko.observable(true);


        self.fbbuttonClick = function () {
            if (self.sugValue() !== null || self.sugValue() !== "") {
                setTimeout(function () {
                    self.sugValue("");
                    alert("提交成功");
                }, 1000);
            }
        }
        self.refreshReport = function (weekStr, carType, dateStr) {
            var path = weekStr + "/" + carType + "/";
            self.dataurlarr.removeAll()
            self.dataurlarr2.removeAll()
            self.dataurlarr.push({dataurl: 'js/data/week/' + path + 'bar22.json', chartname: '质量问题整改通知单发放情况'});
            self.dataurlarr2.push({dataurl: 'js/data/week/' + path + 'bar23.json', chartname: '责任单位分布情况'});

            $.getJSON('js/data/week/' + path + 'sun.json',
                    function (data)
                    {
                        mainlegend = "共：" + data.total + "份   本周完成：" + data.weekDone + "份  累计完成：" + data.done + "份";
                        self.sunDes(mainlegend);

                        var dataArray = createNode("总计", data.total, 0);
                        var reg_NE = createNode(data.N.NNAME, data.N.count, 2);
                        var reg_MW = createNode(data.W.WNAME, data.W.count, 1);
                        var div_NE = createNode(data.N.NDNAME, data.N.ND, 2);
                        var div_EN = createNode(data.W.WDNAME, data.W.WD, 1);
                        var div_WN = createNode(data.W.WUNAME, data.W.WU, 3);
                        var div_MA = createNode(data.N.NUNAME, data.N.NU, 4);
                        addChildNodes(dataArray, [reg_NE, reg_MW]);
                        addChildNodes(reg_NE, [div_NE, div_MA]);
                        addChildNodes(reg_MW, [div_EN, div_WN]);
                        self.nodeValues([dataArray]);
                        self.jsonData = data;
                    });
        }

        self.refreshReport('week1', 'H7', '');

        function createNode(label, population, meanIncome) {
            return {label: label,
                id: label,
                value: population,
                color: getColor(meanIncome),
                shortDesc: "&lt;b&gt;" + label +
                        "&lt;/b&gt;&lt;br/&gt;数量: " +
                        population};
        }

        self.k2chech = function (str) {
            if (str === "警告级") {
                return "1";
            } else {
                return false;
            }
        };

        self.k7chech = function (str) {
            if (str === "未完成") {
                return "1";
            } else {
                return false;
            }
        };

        self.listener = function (event) {
            var legend;
            var checkString = event.detail.id.substring(0, 1);
            if (checkString == "完" || checkString == "未") {

                legend = event.detail.id + "份 双击查看详细表单信息";
                self.sunDes(legend);
                var cellArray = self.jsonData.cells;
                for (var i = 0; i < cellArray.length; i++) {
                    if (cellArray[i].name === event.detail.id) {
                        if (cellArray[i].list.length !== 0) {
                            self.desList(cellArray[i].list);
                        }
                    }
                }
                var popup = document.querySelector('#popupWeek');
                popup.open();
            } else if (checkString == "总") {
                self.sunDes(mainlegend);
            } else {
                legend = event.detail.id.substring(0, 2) + "共 " + event.detail.data.value + " 份 双击“完成”或“未完成”查看详细表单信息";
                self.sunDes(legend);
            }
        };

        self.startAnimationListener = function (data, event)
        {
            var ui = event.detail;
            if (!$(event.target).is("#popupWeek"))
                return;

            if ("open" === ui.action)
            {
                event.preventDefault();
                var options = {"direction": "top"};
                oj.AnimationUtils.slideIn(ui.element, options).then(ui.endCallback);
            } else if ("close" === ui.action)
            {
                event.preventDefault();
                ui.endCallback();
            }
        }


        function getColor(meanIncome) {
            if (meanIncome === 0) {
                return handler.getValue('1stQuartile');
            } else if (meanIncome === 1) {
                return handler.getValue('2ndQuartile');
            } else if (meanIncome === 2) {
                return handler.getValue('3rdQuartile');
            } else if (meanIncome === 4) {
                return handler.getValue('5thQuartile');
            } else {
                return handler.getValue('4thQuartile');
            }
        }


        function addChildNodes(parent, childNodes) {
            parent.nodes = [];
            for (var i = 0; i < childNodes.length; i++) {
                parent.nodes.push(childNodes[i]);
            }
        }

        self.dataProvider = new oj.ArrayDataProvider(self.desList, {idAttribute: 'id'});
        this.content = ko.observable("");

        self.gotoList = function (event, ui) {
            document.getElementById("weeklistview").currentItem = null;
            self.slide();
        };

        self.gotoContent = function (event) {
            if (event.detail.value !== null)
            {
                var row = self.desList()[event.detail.value];
                self.po1(row.content.id);
                self.po2(row.content.car);
                self.po3(row.content.department);
                self.po4(row.content.due);
                self.po5(row.content.des);
                self.po6(row.content.doneState);

                self.slide();
            }
        };

        self.backToWeekPage = function ()
        {
            if ($("#drillList1").hasClass("demo-page1-hide")) {
                self.gotoList();
            }
            var popup = document.querySelector('#popupWeek');
            popup.close();
        }


        this.slide = function () {
            $("#drillList1").toggleClass("demo-page1-hide");
            $("#drillList2").toggleClass("demo-page2-hide");
        }
        self.handleActivated = function (info) {
            // Implement if needed
            self.isManager(userCheck);
        };

        /**
         * Optional ViewModel method invoked after the View is inserted into the
         * document DOM.  The application can put logic that requires the DOM being
         * attached here.
         * @param {Object} info - An object with the following key-value pairs:
         * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
         * @param {Function} info.valueAccessor - The binding's value accessor.
         * @param {boolean} info.fromCache - A boolean indicating whether the module was retrieved from cache.
         */
        self.handleAttached = function (info) {
            // Implement if needed
            self.isManager(userCheck);
        };


        /**
         * Optional ViewModel method invoked after the bindings are applied on this View. 
         * If the current View is retrieved from cache, the bindings will not be re-applied
         * and this callback will not be invoked.
         * @param {Object} info - An object with the following key-value pairs:
         * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
         * @param {Function} info.valueAccessor - The binding's value accessor.
         */
        self.handleBindingsApplied = function (info) {
            // Implement if needed
        };

        /*
         * Optional ViewModel method invoked after the View is removed from the
         * document DOM.
         * @param {Object} info - An object with the following key-value pairs:
         * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
         * @param {Function} info.valueAccessor - The binding's value accessor.
         * @param {Array} info.cachedNodes - An Array containing cached nodes for the View if the cache is enabled.
         */
        self.handleDetached = function (info) {
            // Implement if needed
        };
    }

    return new weekChartTwoContentViewModel;
});
