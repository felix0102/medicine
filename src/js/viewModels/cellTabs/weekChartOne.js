/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * weekChartOne module
 */
define(['ojs/ojcore', 'knockout', 'viewModels/weekDrilling', 'ojs/ojchart', 'ojs/ojrouter', 'jet-composites/my-pie/loader', 'jet-composites/my-bar/loader', 'jet-composites/my-line/loader', 'jet-composites/my-combo/loader','jet-composites/my-drilling-pie/loader'
], function (oj, ko, dril) {
    /**
     * The view model for the main content view template
     */
    function weekChartOneContentViewModel() {
        var self = this;
        self.titleOne = ko.observable("新红旗H8-FL上市");
        self.drillingButtonAction = function () {
//            dril.callMeInOtherContrller("weeklyChart");
//            oj.Router.rootInstance.go('weekDrilling');
        };



        self.dataurlarr = ko.observableArray();
        self.dataurlarr2 = ko.observableArray();
        self.dataurlarr3 = ko.observableArray();
        

        self.refreshReport = function(weekStr,carType,dateStr){
            var path=weekStr+"/"+carType+"/";
            self.dataurlarr.removeAll()
            self.dataurlarr2.removeAll()
            self.dataurlarr3.removeAll()
            self.dataurlarr.push({ dataurl: 'js/data/week/'+path+'pie1.json', chartname: '质量问题反馈情况' });
            self.dataurlarr2.push({ dataurl: 'js/data/week/'+path+'line2.json', chartname: '千车抱怨率' });
            self.dataurlarr3.push({ dataurl: 'js/data/week/'+path+'combo3.json', chartname: '项目改进状态' });
            self.titleOne("新红旗"+carType+"-FL自"+dateStr+"上市")
        }
        self.refreshReport('week1','H7','');
    }

    return new weekChartOneContentViewModel;
});
