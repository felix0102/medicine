/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */
const VERSION="1.0.2";
const WWW_SERVER="http://www.4exam.cn"
var BCS_URL = "http://129.157.179.22:3019";
var BCS_CONTROL = "http://129.157.179.22:3011";
var BCS_CHANNEL = "appdev1orderer";
var BCS_CHAINCODE = "medicine";
var BCS_VERSION = "v1";
const KEY_BATCH = "batchid";
var USER_ROLE = "factory";
var INFO_ROLE = "client";
var g_currentBatchid="";
var USERNAME="";

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n;
}
function  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('')  + [hour, minute, second].map(formatNumber).join('')
}
function  initBatchid() {
    var date = new Date();
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('') + [hour, minute, second].map(formatNumber).join('');
}

function parseBlockDataSet(data) {
    data = data.replace(/[\'\\\/\b\f\n]/g, '');
    //data = data.substring(35, data.length - 15);
    data = data.substring(1, data.length - 1);
    console.log(data);
    return JSON.parse(data);
}
function parseBlockDataGet(data) {
    data = data.replace(/[\'\\\/\b\f\n]/g, '');
    data = data.substring(35, data.length - 15);
    //data = data.substring(1, data.length - 1);
    console.log(data);
    return JSON.parse(data);
}
requirejs.config(
        {

            baseUrl: 'js',

            // Path mappings for the logical module names
            // Update the main-release-paths.json for release mode when updating the mappings
            paths:
                    //injector:mainReleasePaths
                            {
                                'knockout': 'libs/knockout/knockout-3.4.0.debug',
                                'jquery': 'libs/jquery/jquery-3.1.1',
                                'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.0',
                                'promise': 'libs/es6-promise/es6-promise',
                                'hammerjs': 'libs/hammer/hammer-2.0.8',
                                'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0',
                                'ojs': 'libs/oj/v4.1.0/debug',
                                'ojL10n': 'libs/oj/v4.1.0/ojL10n',
                                'ojtranslations': 'libs/oj/v4.1.0/resources',
                                'text': 'libs/require/text',
                                'signals': 'libs/js-signals/signals',
                                'customElements': 'libs/webcomponents/custom-elements.min',
                                'proj4': 'libs/proj4js/dist/proj4-src',
                                'css': 'libs/require-css/css',
                            }
                    //endinjector
                    ,
                    // Shim configurations for modules that do not expose AMD
                    shim:
                            {
                                'jquery':
                                        {
                                            exports: ['jQuery', '$']
                                        }
                            }
                }
        );

        /**
         * A top-level require call executed by the Application.
         * Although 'ojcore' and 'knockout' would be loaded in any case (they are specified as dependencies
         * by the modules themselves), we are listing them explicitly to get the references to the 'oj' and 'ko'
         * objects in the callback
         */
        require(['ojs/ojcore', 'knockout', 'appController', 'ojs/ojknockout',
            'ojs/ojmodule', 'ojs/ojrouter', 'ojs/ojnavigationlist'],
                function (oj, ko, app) { // this callback gets executed when all required modules are loaded

                    $(function () {

                        function init() {
                            oj.Router.sync().then(
                                    function () {
                                        // Bind your ViewModel for the content of the whole page body.
                                        ko.applyBindings(app, document.getElementById('globalBody'));
                                    },
                                    function (error) {
                                        oj.Logger.error('Error in root start: ' + error.message);
                                    }
                            );
                        }

                        // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready 
                        // event before executing any code that might interact with Cordova APIs or plugins.
                        if ($(document.body).hasClass('oj-hybrid')) {
                            document.addEventListener("deviceready", init);
                        } else {
                            init();
                        }

                    });
                }
        );
