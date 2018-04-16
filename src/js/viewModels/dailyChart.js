/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * dailyChart module
 */
define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojselectcombobox', 'appController', 'ojs/ojradioset', 'ojs/ojlabel', 'ojs/ojbutton',
    'ojs/ojpopup', 'ojs/ojlistview', 'ojs/ojarraydataprovider', 'ojs/ojmenu', 'ojs/ojcheckboxset', 'ojs/ojdialog'
], function (oj, ko) {
    /**
     * The view model for the main content view template
     */
    function dailyChartContentViewModel() {
        var self = this;
        let pageTitle = "";
        if (USER_ROLE == "factory")
        {
            pageTitle = USERNAME + "制药厂";
        } else if (USER_ROLE == "superviser") {
            pageTitle = USERNAME + "质检部";
        } else if (USER_ROLE == "transport") {
            pageTitle = USERNAME + "运输公司";
        } else if (USER_ROLE == "pharmacy") {
            pageTitle = USERNAME + "药房";
        } else if (USER_ROLE == "hospital") {
            pageTitle = USERNAME + "医院";
        }
        self.pageTitle = ko.observable(pageTitle);
        self.currentMedicine = ko.observable("板蓝根");
        self.medicineFactory = ko.observable("");
        self.medicineName = ko.observable("");
        self.medicineMemo = ko.observable("");
        self.medicineTime = ko.observable("");

        self.superviserCheck = ko.observable("none");
        self.superviserClose = ko.observable("");
        self.batchid = ko.observable(g_currentBatchid);
        self.memo = ko.observable("");

        self.factoryShow = ko.observable("none");
        self.superviserShow = ko.observable("none");
        self.transportShow = ko.observable("none");
        self.pharmacyShow = ko.observable("none");
        self.hospitalShow = ko.observable("none");

        self.coldchain = ko.observableArray();
        self.initUserRole = initUserRole();

        self.buttonClick = function (data) {
            let  currentDate = new Date();
            let batchid = initBatchid();
            let selectedMedicine = radiosetBasicDemoId.value;
            self.batchid(batchid);
            console.log("batchid:" + batchid + ":selectedMedicine:" + selectedMedicine);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);

            modalDialogFactory.open();




        };
        self.buttonFactory = function (data) {
            
            let  currentDate = new Date();
            let batchid = self.batchid();
            let memo = self.memo();
            if (memo.length == 0)
            {
                alert("请输入备注.");
                return;
            }
            console.log("batchid:" + batchid);
            let time = formatTime(new Date());
            let selectedMedicine = self.currentMedicine();
            // new batchid save to super ledger block 
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [KEY_BATCH, "batchid", batchid, "starttime", "endtime", "status", "memo", time], "chaincodeVer": BCS_VERSION};
            console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    // alert(self.decryptByDES(data) );
                    console.log("batchid" + batchid);
                    let name = self.pageTitle();
                    payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "factory", name, time, "endtime", selectedMedicine, memo, time], "chaincodeVer": BCS_VERSION};
                    console.log(JSON.stringify(payload));
                    aj = $.ajax({
                        url: BCS_URL,
                        contentType: 'application/json;charset=utf-8',
                        type: 'POST',
                        data: JSON.stringify(payload),
                        success: function (data) {
                            // alert(self.decryptByDES(data) );
                            let dataJson = parseBlockDataSet(data);
                            if (dataJson.returnCode === "Success")
                            {

                                modalDialogFactory.close();
                                alert("药品出库成功");
                            } else {
                                modalDialogFactory.close();
                                alert("药品出库失败,请稍候再试。");
                            }
                            modalDialogLoading.close();
                            //js_saveIOTData(js_dataAll);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            // view("异常！");  
                            //alert("error");
                            console.log(XMLHttpRequest);
                            console.log(textStatus);
                            console.log("errorThrown=" + errorThrown);

                        }
                    });

                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });


        };
        self.buttonBatchidCheck = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            // new batchid save to super ledger block 
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "getInfoHistory", "args": [batchid], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    console.log(data);
                    modalDialogLoading.close();
                    // alert(self.decryptByDES(data) );
                    let returnCode = data.substring();
                    data = parseBlockDataGet(data);
                    console.log(data);


                    self.medicineName("没有查询到药品");
                    self.medicineFactory("");
                    self.medicineTime("");
                    self.medicineMemo("");
                    for (let i = 0; i < data.length; i++)
                    {
                        if (data[i].Value.flag == "factory") {
                            self.medicineFactory(data[i].Value.name);
                            self.medicineName(data[i].Value.status);
                            self.medicineTime(data[i].Value.time);
                            self.medicineMemo(data[i].Value.memo);
                            self.superviserCheck("");
                            self.superviserClose("none");
                            continue;
                        }
                    }
                    if (USER_ROLE == "superviser") {
                        modalDialogSuperviser.open();
                    } else if (USER_ROLE == "transport")
                    {
                        modalDialogTransport.open();
                    } else if (USER_ROLE == "pharmacy")
                    {
                        modalDialogPharmacy.open();
                    }
                    else if (USER_ROLE == "hospital")
                    {
                        modalDialogHospital.open();
                    }
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });


        };
        self.buttonQualified = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = self.memo();
            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            // new batchid save to super ledger block 
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "superviser", name, time, "endtime", "合格", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    console.log(data);
                    modalDialogLoading.close();
                    modalDialogSuperviser.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });


        };

        self.buttonNotQualified = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = self.memo();
            if (memo.length == 0)
            {
                alert("请输入备注.");
                return;
            }
            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "superviser", name, time, "endtime", "不合格", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    modalDialogLoading.close();
                    console.log(data);
                    modalDialogSuperviser.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    modalDialogLoading.close();
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonTransportStart = function (data) {

            //console.log(checkboxColdchain.value);

            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = checkboxColdchain.value + ":" + self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "开始", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    console.log(data);
                    modalDialogLoading.close();
                    modalDialogTransport.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonTransportEnd = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = checkboxColdchain.value + ":" + self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "结束", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    modalDialogLoading.close();
                    console.log(data);
                    modalDialogTransport.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    modalDialogLoading.close();
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonPharmacyIn = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "进货", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    modalDialogLoading.close();
                    console.log(data);
                    modalDialogPharmacy.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonPharmacyOut = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "销售", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    modalDialogLoading.close();
                    console.log(data);
                    modalDialogPharmacy.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
 
        self.buttonHospitalIn = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "进货", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    console.log(data);
                    modalDialogLoading.close();
                    modalDialogHospital.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonHospitalOut = function (data) {
            let  currentDate = new Date();
            let batchid = self.batchid();
            g_currentBatchid = batchid;
            let memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            let time = formatTime(currentDate);
            console.log("time:" + time);
            let name = self.pageTitle();
            let payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "使用", memo, time], "chaincodeVer": BCS_VERSION};
            //console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {
                    modalDialogLoading.close();
                    console.log(data);
                    modalDialogHospital.close();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  
                    //alert("error");
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
  

        function initUserRole() {
            if (USER_ROLE == "factory") {
                self.factoryShow("");
            } else {
                self.factoryShow("none");
            }
            if (USER_ROLE == "superviser") {
                self.superviserShow("");
            } else {
                self.superviserShow("none");
            }
            if (USER_ROLE == "transport") {
                self.transportShow("");
            } else {
                self.transportShow("none");
            }
            if (USER_ROLE == "pharmacy") {
                self.pharmacyShow("");
            } else {
                self.pharmacyShow("none");
            }
            if (USER_ROLE == "hospital") {
                self.hospitalShow("");
            } else {
                self.hospitalShow("none");
            }
        }
    }

    return dailyChartContentViewModel;
});
