/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your profile ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojbutton', 'ojs/ojrouter', 'ojs/ojarraydataprovider', 'ojs/ojmenu', 'ojs/ojdialog', 'ojs/ojtable', 'ojs/ojlistview'],
        function (oj, ko, $, app) {

            function ProfileViewModel() {
                var self = this;
                
                self.LabelName = ko.observable("ddd");
                self.pageTitle = ko.observable("我的信息");
                self.version = VERSION;
                self.userName = USERNAME;
                var deptArray = [{running: '', stop: '', healthPercent: '', time: '', blocks: '', invokes: '', 'transaction_activity': ''}];
                self.dataprovider = ko.observable(new oj.ArrayDataProvider(deptArray, {idAttribute: 'DepartmentId'}));

                self.buttonClick1 = function (event) {

                    USER_ROLE = "factory";
                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('dailyChart');
                    return true;
                };
                self.buttonClick2 = function (event) {

                    USER_ROLE = "superviser";
                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('dailyChart');
                    return true;
                };
                self.buttonClick3 = function (event) {

                    USER_ROLE = "transport";
                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('dailyChart');
                    return true;
                };
                self.buttonClick4 = function (event) {

                    USER_ROLE = "pharmacy";
                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('dailyChart');
                    return true;
                };
                self.buttonClick5 = function (event) {

                    USER_ROLE = "hospital";
                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('dailyChart');
                    return true;
                };
                self.buttonClick6 = function (event) {
                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('weeklyChart');
                    return true;
                }
                self.buttonClick7 = function (event) {


                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('weeklyChart');
                    return true;
                }
                self.userLabel = ko.computed(function () {
                    if (undefined !== self.LabelName()) {
                        return "用户：" + self.LabelName();
                    } else {
                        return "";
                    }
                });

                self.userImage = ko.computed(function () {
                    if (self.LabelName() === "EMPLOYEE") {
                        return "demo-emp-icon";
                    } else {
                        return "demo-mgr-icon";
                    }
                });

                self.userEmail = ko.computed(function () {
                    return  self.LabelName() + "@email.com";
                });
                self.initServerInfo=getBcsServerInfo();
                function getBcsServerInfo() {
                 
                    var aj = $.ajax({
                        url: BCS_CONTROL + '/api/v1/nodes',
                        contentType: 'application/json;charset=utf-8',
                        type: 'get',
                        success: function (res) {
                            console.log("res:" + JSON.stringify(res));
                            var nodes = res
                            var liveNodes = 0;
                            var allNodes = nodes.peers.concat(nodes.orderers).concat(nodes.gateways).concat(nodes.fabricCAs);
                            allNodes.forEach(function (node) {
                                if (node.status !== 'down')
                                    liveNodes++;
                            });
                            var topBatchids = [{}];
                            topBatchids[0].running = liveNodes;
                            ;
                            topBatchids[0].stop = (allNodes.length - liveNodes);
                            topBatchids[0].healthPercent = parseInt(liveNodes * 100 / allNodes.length) + '%';

                            

                            var aj = $.ajax({
                                url: WWW_SERVER+'/proxy/bcs/getLedgerInfo',
                                contentType: 'application/json;charset=utf-8',
                                type: 'get',
                                success: function (res) {
                                    console.log("res:" + JSON.stringify(res));
                                    topBatchids[0].blocks = res[0].data.blocks;
                                    topBatchids[0].invokes = res[0].data.invokes;
                                    topBatchids[0].transaction_activity = res[0].data.transaction_activity;
                                    self.dataprovider(new oj.ArrayDataProvider(topBatchids, {idAttribute: 'DepartmentId'}));
                                    //console.log(batchids.length);
                                    
                                    
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    // view("异常！");  
                                    
                                    console.log(XMLHttpRequest);
                                    console.log(textStatus);
                                    console.log("errorThrown=" + errorThrown);

                                }
                            });


                            //console.log(batchids.length);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            // view("异常！");  
                            
                            console.log(XMLHttpRequest);
                            console.log(textStatus);
                            console.log("errorThrown=" + errorThrown);

                        }
                    });
                }
                // Below are a subset of the ViewModel methods invoked by the ojModule binding
                // Please reference the ojModule jsDoc for additional available methods.

                /**
                 * Optional ViewModel method invoked when this ViewModel is about to be
                 * used for the View transition.  The application can put data fetch logic
                 * here that can return a Promise which will delay the handleAttached function
                 * call below until the Promise is resolved.
                 * @param {Object} info - An object with the following key-value pairs:
                 * @param {Node} info.element - DOM element or where the binding is attached. This may be a 'virtual' element (comment node).
                 * @param {Function} info.valueAccessor - The binding's value accessor.
                 * @return {Promise|undefined} - If the callback returns a Promise, the next phase (attaching DOM) will be delayed until
                 * the promise is resolved
                 */
                self.handleActivated = function (info) {
                    // Implement if needed
                    self.LabelName(userName);
                    
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
                    self.LabelName(userName);
                    
                    
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

            /*
             * Returns a constructor for the ViewModel so that the ViewModel is constructed
             * each time the view is displayed.  Return an instance of the ViewModel if
             * only one instance of the ViewModel is needed.
             */
            return new ProfileViewModel();
        }
);
