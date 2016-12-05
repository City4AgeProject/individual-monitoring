
define(function () {
            /**
             * The shared view model for navigation
             */
            function getUrls() {
                var self = this;
                /**
                 * Define base Url settings
                 */
//                self.baseUrl ="http://10.10.10.195:8080";
               self.baseIP ="http://localhost:8084";
               self.pathRoot = "/c4AServices/rest/careReceiversData";
               self.baseUrl = self.baseIP+ self.pathRoot;
               /**
                * Define methods
                */
               self.receiversMethod="/getCareReceivers";
               self.groupsMethod="/getGroups";
               
            }

            return new getUrls();
        }
);
