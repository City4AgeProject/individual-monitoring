define(['ojs/ojcore', 'knockout', 'setting_properties', 'jquery', 'ojs/ojknockout', 'ojs/ojtable', 'ojs/ojgauge', 'ojs/ojarraytabledatasource'],
        function (oj, ko, sp, $)
        {

            function ListViewModel() {
                var self = this;
                self.data = ko.observableArray();

                var url = sp.baseUrl + sp.receiversMethod;
                
                $.getJSON(url).
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
                                   $(".loader-hover").hide();
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

                self.viewGes = function () {

                    oj.Router.rootInstance.go("detection_ges");
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



