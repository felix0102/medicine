/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * monthChartOne module
 */
define(['ojs/ojcore', 'knockout', 'ojs/ojrouter', 'jet-composites/my-line/loader'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function monthChartOneContentViewModel() {
        var self = this;

        //        self.drillingAction = function () {
        //            dril.callMeInOtherContrller("monthChartOne");
        //            oj.Router.rootInstance.go('weekDrilling');
        //        };
        self.dataurlarr2 = ko.observableArray();
        self.data_divs = ko.observableArray();
        self.refreshReport = function (weekStr, carType, dateStr) {
            var path = weekStr + "/" + carType + "/";
            self.dataurlarr2.removeAll()
            self.dataurlarr2.push({dataurl: 'js/data/month/' + path + 'line2.json', chartname: '千车抱怨率'});
            //self.data_divs.push({ dataurl: 'js/data/month/' + path + 'div.json', chartname: 'divData' });
            //self.titleOne("新红旗" + carType + "-FL自" + dateStr + "上市")
           // self.data_divs.removeAll();
            $.getJSON('js/data/month/' + path + 'div.json', function (data) {
                //self.seriesValue(data.series);
                //console.log(data);
                self.data_divs(data);
                //self.data_divs.push(data);
                //console.log("data_divs:"+JSON.stringify(self.data_divs));
            });
        }
        self.refreshReport('month1', 'H7', '');
    }

    return new monthChartOneContentViewModel;
});
