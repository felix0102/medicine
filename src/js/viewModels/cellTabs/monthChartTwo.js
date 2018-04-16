/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * monthChartTwo module
 */
define(['ojs/ojcore', 'knockout', 'jet-composites/my-combo/loader', 'jet-composites/my-lineArea/loader'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function monthChartTwoContentViewModel() {
        var self = this;

        self.dataurlarr = ko.observableArray();
        self.dataurlarr2 = ko.observableArray();
        self.dataurlarr3 = ko.observableArray();
        self.dataurlarr4 = ko.observableArray();

        self.refreshReport = function (weekStr, carType, dateStr) {
            var path = weekStr + "/" + carType + "/";
            self.dataurlarr.removeAll()
            self.dataurlarr2.removeAll()
            self.dataurlarr3.removeAll()
            self.dataurlarr4.removeAll()

            self.dataurlarr.push({ dataurl: 'js/data/month/' + path + 'combo21.json', chartname: '整车Audit评审等级' });
            self.dataurlarr2.push({ dataurl: 'js/data/month/' + path + 'bar22.json', chartname: '整车PDU' });
            self.dataurlarr3.push({ dataurl: 'js/data/month/' + path + 'line23.json', chartname: '总装PDU' });
            self.dataurlarr4.push({ dataurl: 'js/data/month/' + path + 'line24.json', chartname: '整车直通率' });
            //self.titleOne("新红旗" + carType + "-FL自" + dateStr + "上市")
        }
        self.refreshReport('month1', 'H7', '');
    }

    return new monthChartTwoContentViewModel;
});
