/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * weekDrilling module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojrouter'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function weekDrillingContentViewModel() {
        var self = this;
        self.backView;
        self.callMeInOtherContrller = function (param) {
            self.backView = param;
        }

        self.backButtonClick = function (event) {
            oj.Router.rootInstance.go(self.backView);
            return true;
        }
    }

    return new weekDrillingContentViewModel;
});
