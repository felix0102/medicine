/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
/*
 * Your application specific code will go here
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'ojs/ojarraytabledatasource', 'ojs/ojknockout', 'ojs/ojmoduleanimations','ojs/ojdatetimepicker', 'ojs/ojvalidation-datetime', 'ojs/ojtimezonedata', 'ojs/ojlabel'],
        function (oj, ko) {
            function ControllerViewModel() {
                var self = this;

                // Save the theme so we can perform platform specific navigational animations
                var platform = oj.ThemeUtils.getThemeTargetPlatform();
                var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
                self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
                var lgQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.LG_UP);
                self.large = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(lgQuery);
                self.isLoggedIn = ko.observable(false);
                // Router setup
                self.router = oj.Router.rootInstance;

                self.router.configure({
                    'login': {label: '登录', isDefault: true},
                    'dailyChart': {label: '日报'},
                    'weeklyChart': {label: '周报'},
                    'monthChart': {label: '月报'},
                    'profile': {label: '我的信息'},
                    'weekDrilling': {label: '详细信息'}
                });

                self.appName = ko.observable("质量数据可视化平台");
                // User Info used in Global Navigation area
                self.userLogin = ko.observable("xiaoqiang@126.com");

                oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
                // Callback function that can return different animations based on application logic.
                function switcherCallback(context) {
                    if (platform === 'android')
                        return 'fade';
                    return null;
                }
                ;

                function mergeConfig(original) {
                    return $.extend(true, {}, original, {
                        'animation': oj.ModuleAnimations.switcher(switcherCallback)
                    });
                }

                self.moduleConfig = mergeConfig(self.router.moduleConfig);

                // Navigation setup
                var navData = [
                    {name: '信息登记', id: 'dailyChart',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-catalog-icon-24'},
                    {name: '信息查询', id: 'weeklyChart',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-info-icon-24'},
                    {name: '批次列表', id: 'monthChart',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-chart-icon-24'},
                    {name: '我', id: 'profile',
                        iconClass: 'oj-navigationlist-item-icon demo-icon-font-24 demo-person-icon-24'}
                ];

                self.navDataSource = new oj.ArrayTableDataSource(navData, {idAttribute: 'id'});
                self.dateValue = ko.observable(oj.IntlConverterUtils.dateToLocalIso(new Date()));
//                // Header Setup
//                self.getHeaderModel = function () {
//                    var headerFactory = {
//                        createViewModel: function (params, valueAccessor) {
//                            var model = {
//                                pageTitle: self.router.currentState().label,
//                                dataValue : self.dateValue(),
//                                handleBindingsApplied: function (info) {
//                                    // Adjust content padding after header bindings have been applied
//                                    self.adjustContentPadding();
//                                },
//                                calbuttonClick: function (event) {
//                                    console.log(event+"1");
//                                    return true;
//                                }
//                            };
//                            return Promise.resolve(model);
//                        }
//                    }
//                    return headerFactory;
//                }

                // Method for adjusting the content area top/bottom paddings to avoid overlap with any fixed regions. 
                // This method should be called whenever your fixed region height may change.  The application
                // can also adjust content paddings with css classes if the fixed region height is not changing between 
                // views.
                self.adjustContentPadding = function () {
                    var topElem = document.getElementsByClassName('oj-applayout-fixed-top')[0];
                    var contentElem = document.getElementsByClassName('oj-applayout-content')[0];
                    var bottomElem = document.getElementsByClassName('oj-applayout-fixed-bottom')[0];

                    if (topElem) {
                        contentElem.style.paddingTop = topElem.offsetHeight + 'px';
                    }
                    if (bottomElem) {
                        contentElem.style.paddingBottom = bottomElem.offsetHeight + 'px';
                    }
                    // Add oj-complete marker class to signal that the content area can be unhidden.
                    // See the override.css file to see when the content area is hidden.
                    contentElem.classList.add('oj-complete');
                }

            }

            return new ControllerViewModel();
        }
);
