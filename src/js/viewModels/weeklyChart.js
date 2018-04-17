/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * dailyChart module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'appController', 'ojs/ojradioset', 'ojs/ojlabel', 'ojs/ojbutton',
    'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojarraydataprovider', 'ojs/ojmenu', 'ojs/ojdialog', 'ojs/ojtable', 'ojs/ojlistview'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function dailyChartContentViewModel() {
        var self = this;
        self.pageTitle = ko.observable("药品追踪查询");
        self.currentMedicine = ko.observable("板蓝根");
        self.batchid = ko.observable(g_currentBatchid)
        var deptArray = [{name:'', status:'',memo:'',time:''}];
        self.dataprovider = ko.observable(new oj.ArrayDataProvider(deptArray, {idAttribute: 'DepartmentId'}));

        self.tableOnClick = function (event) {

            g_currentBatchid = event.target.innerText;
            console.log(g_currentBatchid);

            return true;
        }



        self.buttonMedicineInfo = function (data) {
            var  currentDate = new Date();

            var time = formatTime(currentDate);
            var batchid = self.batchid();
            //console.log("time:" + time);
            // new batchid save to super ledger block 
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "getInfoHistory", "args": [batchid], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    modalDialogLoading.close();
                    
                    data = data.replace(/[\'\\\/\b\f\n]/g, '');
                    data = data.substring(35, data.length - 15);
                    console.log(data);
                    var tmpBatchids = JSON.parse(data);
                    var topBatchids = [];
                    for (var i = 0; i < tmpBatchids.length; i++) {
                        var topBatchid = {};
                        topBatchid.batchid = tmpBatchids[i].Value.name + ":" + tmpBatchids[i].Value.status + ":" + tmpBatchids[i].Value.memo + ":" + tmpBatchids[i].Value.time;
                        topBatchid.name = tmpBatchids[i].Value.name ;
                        topBatchid.status = tmpBatchids[i].Value.status ;
                        topBatchid.memo = tmpBatchids[i].Value.memo ;
                        topBatchid.time = tmpBatchids[i].Value.time;

                        topBatchids.unshift(topBatchid);
                    }

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


        }
        ;
    }

    return dailyChartContentViewModel;
});
