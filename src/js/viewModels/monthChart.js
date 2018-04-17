/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * dailyChart module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'appController', 'ojs/ojradioset', 'ojs/ojlabel', 'ojs/ojbutton',
    'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojarraydataprovider', 'ojs/ojmenu', 'ojs/ojdialog','ojs/ojtable'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function dailyChartContentViewModel() {
        var self = this;
        self.pageTitle = ko.observable("药品批次列表查询");
        self.currentMedicine = ko.observable("板蓝根");
        self.batchid = ko.observable("")
        var deptArray = [{DepartmentId: 1001, LocationId: 200},
            {DepartmentId: 556, LocationId: 200},
            {DepartmentId: 10, LocationId: 200},
        ];
        self.dataprovider = ko.observable(new oj.ArrayDataProvider(deptArray, {idAttribute: 'DepartmentId'}));
        
        self.tableOnClick =function (event){
            
            g_currentBatchid = event.target.innerText;
            //app.isLoggedIn(true);
            oj.Router.rootInstance.go('weeklyChart');
            console.log(g_currentBatchid);
        }
        
        
        self.batchidInit = listBatchid();
        function listBatchid() {
            var  currentDate = new Date();

            var time = formatTime(currentDate);
            //console.log("time:" + time);
            // new batchid save to super ledger block 
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "getInfoHistory", "args": [KEY_BATCH], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    
                    data = data.replace(/[\'\\\/\b\f\n]/g, '');
                    data = data.substring(35, data.length - 15);
                    console.log(data);
                    var tmpBatchids = JSON.parse(data);
                    tmpBatchids.sort(function(a,b){
                        if(a.Value.name>b.Value.name){
                            return 1;
                        }else{
                            return -1;
                        }
                        
                    })
                    var topBatchids = [];
                    for (var i = 0; i < tmpBatchids.length; i++) {
                        var topBatchid = {};
                        topBatchid.batchid = tmpBatchids[i].Value.name;
                        topBatchids.unshift(topBatchid);
                        if(i>100)
                        {
                            topBatchids.pop();
                        }
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
