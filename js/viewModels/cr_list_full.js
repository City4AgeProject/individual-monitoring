define(['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojgauge', 'ojs/ojarraytabledatasource'],
        function (oj, ko, $)
        {
            function ListViewModel() {
                var self = this;
                self.data = ko.observableArray();

                $.getJSON("http://localhost:8084/c4AServices/rest/careReceiversData/getCareReceivers").
                        then(function (users) {
                            $.each(users.itemList, function () {
//                                console.log("userssss ", JSON.stringify(this));
                                self.data.push({
                                    cr_id: this.userId,
                                    fr_status: this.frailtyStatus,
                                    fr_notice: this.frailtyNotice,
                                    textline: this.textline,
                                    attention: this.attention,
                                    det_status: this.detectionStatus,
                                    det_date: this.detectionDate,
                                    interv_status: this.interventionstatus,
                                    interv_date: this.interventionDate
                                });
                            });
                        });



                self.dataSource = new oj.ArrayTableDataSource(
//                        data, {
                        self.data, {
                            idAttribute: "cr_id"
                        });




                self.viewGef = function (userId) {
                    oj.Router.rootInstance.store(userId);
                    oj.Router.rootInstance.go("detection_gef");
                };


                self.changeButtonIcon = function (isPaused, data, event) {
                    console.log("event ", event.type);

//                    if(event.type === 'click'){
//                          console.log("data ",data);
//                    }

//                    $("#menuButton").ojButton("option", "icons.start", "oj-fwk-icon-caret-s oj-fwk-icon");
//
////                    $( "#menuButton" ).ojButton( "widget" ).toggle( "oj-fwk-icon-caret-s oj-fwk-icon" )
//                    if (isPaused) {
//                        $("#menuButton").ojButton("widget").css("oj-fwk-icon-caret-s oj-fwk-icon");
//                    } else {
//                        $("#menuButton").ojButton("widget").css("oj-fwk-icon-caret-start oj-fwk-icon");
//                    }

                };


            }

            return new ListViewModel();

        });



