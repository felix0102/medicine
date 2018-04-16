/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your about ViewModel code goes here
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'appController', 'ojs/ojlabel',
    'ojs/ojinputtext', 'ojs/ojbutton', 'ojs/ojrouter'],
        function (oj, ko, $, app) {

            function LoginViewModel() {
                var self = this;
                self.username = ko.observable("");
                self.password = ko.observable("123");
                self.isLoggedIn = ko.pureComputed(function () {
                    return app.isLoggedIn()
                });
                self.version = VERSION;
                self.buttonClick = function (event) {
                    console.log(self.username(), self.password());
                    if (self.username().length > 0 && self.password() === "123") {
                        USERNAME = self.username();
                        self.loginSuccess(true);

                    } else {
                        alert("请输入正确的用户名（密码都为123）");
                    }

                    return true;
                }

                self.loginSuccess = function (data) {

                    app.isLoggedIn(true);
                    oj.Router.rootInstance.go('dailyChart');
                    userName = self.username();
                    userCheck = data;
                };

                self.loginFailure = function (statusCode, data) {
                    alert("登陆失败");
                };

                function initServerInfo() {
                    //init server info
                    var aj = $.ajax({
                        url: WWW_SERVER+'/proxy/bcs/getServerInfo',
                        contentType: 'application/json;charset=utf-8',
                        type: 'get',
                        success: function (res) {
                            console.log("res:" + JSON.stringify(res));
                            //console.log(batchids.length);
                            BCS_URL=res[0].data.BCS_URL;
                            BCS_CHANNEL=res[0].data.BCS_CHANNEL;
                            BCS_VERSION=res[0].data.BCS_VERSION;
                            BCS_CHAINCODE=res[0].data.BCS_CHAINCODE;
                            BCS_CONTROL=res[0].data.BCS_CONTROL;
                            
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            // view("异常！");  
                            //alert("error");
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
                    initServerInfo();

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
            return new LoginViewModel();
        }
);
