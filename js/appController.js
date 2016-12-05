/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'navigation', 'ojs/ojrouter', 'ojs/ojdialog',
  'ojs/ojoffcanvas','ojs/ojknockout'],
  function (oj, ko, nav) {
    /*
     * Your application specific code will go here
     */
    function AppControllerViewModel() {
      var self = this;

      // Router setup
      self.router = oj.Router.rootInstance;
      self.router.configure({
         'cr_list_full': {label: 'Care Recipient', isDefault: true},
        'cr_list': {label: 'Care Recipient dummy'},
//        'people': {label: 'People'},
//        'library': {label: 'Library'},
        'detection_ges': {label: 'Detection GES'},
        'detection_gef': {label: 'Detection GEF'}
      });
      oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

      // Media queries for repsonsive layouts
      var smQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY);
      self.smScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
      var mdQuery = oj.ResponsiveUtils.getFrameworkQuery(oj.ResponsiveUtils.FRAMEWORK_QUERY_KEY.MD_UP);
      self.mdScreen = oj.ResponsiveKnockoutUtils.createMediaQueryObservable(mdQuery);

      // Navigation and Offcanvas
      self.drawerParams = {
        displayMode: 'push',
        selector: '#offcanvas',
        content: '#pageContent'
      };
      // Called by navigation drawer toggle button and after selection of nav drawer item
      self.toggleDrawer = function() {
        return oj.OffcanvasUtils.toggle(self.drawerParams);
      };
      // Close offcanvas on medium and larger screens
      self.mdScreen.subscribe(function() {oj.OffcanvasUtils.close(self.drawerParams);});
      self.navDataSource = nav.dataSource;
      // Called by nav drawer option change events so we can close drawer after selection
      self.navChange = function(event, ui) {
        if (ui.option === 'selection' && ui.value !== self.router.stateId()) {
          self.toggleDrawer();
        }
      };

      // Header
      // Application Name used in Branding Area
      self.appName = ko.observable("C4A");
      // User Info used in Global Navigation area
      self.userLogin = ko.observable("Dr Leonardo Mutti");
      // Dropdown menu states
      self.menuItemSelect = function (event, ui) {
        switch (ui.item.attr("id")) {       
           case "out":
            $("#aboutDialog").ojDialog("open");
            break;
           case "help-list":
            $("#help-hover").ojDialog("open");
            break;
          default:
        }
      };

      // Footer
      function footerLink(name, id, linkTarget) {
        this.name = name;
        this.linkId = id;
        this.linkTarget = linkTarget;
      }
      self.footerLinks = ko.observableArray([
        new footerLink('About Project', 'about', 'http://www.city4ageproject.eu/index.php/about/'),
        new footerLink('Contact Us', 'contactUs', 'http://www.city4ageproject.eu/index.php/contact/'),
        new footerLink('Legal Notices', 'legalNotices', 'http://www.city4ageproject.eu/'),
        new footerLink('Terms Of Use', 'termsOfUse', 'http://www.city4ageproject.eu/'),
        new footerLink('Your Privacy Rights', 'yourPrivacyRights', 'http://www.city4ageproject.eu/')
      ]);
    }

    return new AppControllerViewModel();
  }
);
