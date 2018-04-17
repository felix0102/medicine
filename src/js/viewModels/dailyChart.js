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
        var pageTitle1 = "";
        if (USER_ROLE == "factory")
        {
            pageTitle1 = USERNAME + "制药厂";
        } else if (USER_ROLE == "superviser") {
            pageTitle1 = USERNAME + "质检部";
        } else if (USER_ROLE == "transport") {
            pageTitle1 = USERNAME + "运输公司";
        } else if (USER_ROLE == "pharmacy") {
            pageTitle1 = USERNAME + "药房";
        } else if (USER_ROLE == "hospital") {
            pageTitle1 = USERNAME + "医院";
        }
        self.pageTitle = ko.observable(pageTitle1);
        self.currentMedicine = ko.observable("板蓝根");
        self.sysTip = ko.observable("")
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
            var  currentDate = new Date();
            var batchid = initBatchid();
            var selectedMedicine = radiosetBasicDemoId.value;
            self.batchid(batchid);
            console.log("batchid:" + batchid + ":selectedMedicine:" + selectedMedicine);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);

            modalDialogFactory.open();




        };
        self.buttonFactory = function (data) {

            var  currentDate = new Date();
            var batchid = self.batchid();
            var memo = self.memo();
            if (memo.length == 0)
            {
                self.sysTip("请输入备注信息.");
                modalDialogAlert.open();
                return;
            }
            console.log("batchid:" + batchid);
            var time = formatTime(new Date());
            var selectedMedicine = self.currentMedicine();
            // new batchid save to super ledger block 
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [KEY_BATCH, "batchid", batchid, "starttime", "endtime", "status", "memo", time], "chaincodeVer": BCS_VERSION};
            console.log(JSON.stringify(payload));
            modalDialogLoading.open();
            var aj = $.ajax({
                url: BCS_URL,
                contentType: 'application/json;charset=utf-8',
                type: 'POST',
                data: JSON.stringify(payload),
                success: function (data) {

                    console.log("batchid" + batchid);
                    var name = self.pageTitle();
                    payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "factory", name, time, "endtime", selectedMedicine, memo, time], "chaincodeVer": BCS_VERSION};
                    console.log(JSON.stringify(payload));
                    aj = $.ajax({
                        url: BCS_URL,
                        contentType: 'application/json;charset=utf-8',
                        type: 'POST',
                        data: JSON.stringify(payload),
                        success: function (data) {

                            var dataJson = parseBlockDataSet(data);
                            if (dataJson.returnCode === "Success")
                            {

                                modalDialogFactory.close();

                                self.sysTip("药品出库成功.");
                                modalDialogAlert.open();
                            } else {
                                modalDialogFactory.close();

                                self.sysTip("药品出库失败,请稍候再试。.");
                                modalDialogAlert.open();
                            }
                            modalDialogLoading.close();
                            //js_saveIOTData(js_dataAll);
                        },
                        error: function (XMLHttpRequest, textStatus, errorThrown) {
                            // view("异常！");  

                            console.log(XMLHttpRequest);
                            console.log(textStatus);
                            console.log("errorThrown=" + errorThrown);

                        }
                    });

                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });


        };
        self.buttonBatchidCheck = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
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
                    console.log(data);
                    modalDialogLoading.close();

                    var returnCode = data.substring();
                    data = parseBlockDataGet(data);
                    console.log(data);


                    self.medicineName("没有查询到药品");
                    self.medicineFactory("");
                    self.medicineTime("");
                    self.medicineMemo("");
                    for (var i = 0; i < data.length; i++)
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
                    } else if (USER_ROLE == "hospital")
                    {
                        modalDialogHospital.open();
                    }
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });


        };
        self.buttonQualified = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = self.memo();
            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            // new batchid save to super ledger block 
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "superviser", name, time, "endtime", "合格", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("质检完成.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });


        };

        self.buttonNotQualified = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = self.memo();
            if (memo.length == 0)
            {
                self.sysTip("请输入备注信息.");
                modalDialogAlert.open();
                return;
            }
            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "superviser", name, time, "endtime", "不合格", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("质检完成.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    modalDialogLoading.close();
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonTransportStart = function (data) {

            //console.log(checkboxColdchain.value);

            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = checkboxColdchain.value + ":" + self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "开始", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("运输开始.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonTransportEnd = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = checkboxColdchain.value + ":" + self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "结束", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("运输结束.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    modalDialogLoading.close();
                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonPharmacyIn = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "进货", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("药品进货完成.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonPharmacyOut = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "销售", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("药品销售完成.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };

        self.buttonHospitalIn = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "进货", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("药品进货完成.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

                    console.log(XMLHttpRequest);
                    console.log(textStatus);
                    console.log("errorThrown=" + errorThrown);

                }
            });
            // new batchid save to super ledger block 



        };
        self.buttonHospitalOut = function (data) {
            var  currentDate = new Date();
            var batchid = self.batchid();
            g_currentBatchid = batchid;
            var memo = self.memo();

            console.log("batchid:" + batchid);
            console.log("BCS_URL:" + BCS_URL);
            var time = formatTime(currentDate);
            console.log("time:" + time);
            var name = self.pageTitle();
            var payload = {"channel": BCS_CHANNEL, "chaincode": BCS_CHAINCODE, "method": "setInfo", "args": [batchid, "transport", name, time, "endtime", "使用", memo, time], "chaincodeVer": BCS_VERSION};
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
                    self.sysTip("药品使用完成.");
                    modalDialogAlert.open();
                    //js_saveIOTData(js_dataAll);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    // view("异常！");  

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
