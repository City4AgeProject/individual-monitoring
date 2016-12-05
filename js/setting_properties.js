
define(['ojs/ojcore', 'knockout'], function (oj, ko) {
    /**
     * The shared view model for navigation
     */
    function getUrls() {
        var self = this;
        /**
         * Define base Url settings
         */
//                self.baseUrl ="http://10.10.10.195:8080";
        self.baseIP = "http://localhost:8084";
        self.pathRoot = "/c4AServices/rest/careReceiversData";
        self.baseUrl = self.baseIP + self.pathRoot;
        /**
         * Define methods
         */
        self.receiversMethod = "/getCareReceivers";
        self.groupsMethod = "/getGroups";

        self.userId = ko.observable();
        self.setUserId = function (userId) {
            getUrl.userId = userId;
        };

        self.userTextline = ko.observable();
        self.setuserTextline = function (userTextline) {
            getUrl.userTextline = userTextline;
        };

        self.userGender = ko.observable();
        self.setuserGender = function (userGender) {
            getUrl.userGender = userGender;
        };

        self.userAge = ko.observable();
        self.setuserAge = function (userAge) {
            getUrl.userAge = userAge;
        };
    }
    var getUrl = new getUrls();
    return getUrl;
}
);
