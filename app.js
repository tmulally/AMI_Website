// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
  baseUrl: 'lib',
  shim : {
    "bootstrap" : { "deps" :['jquery'] } // remember to add comma when adding more
  },
  paths: {
    jquery: 'jquery',
    knockout: 'knockout',
    "modernizr.custom":'modernizr.custom',
    bootstrap: 'bootstrap',
    sammy:'sammy'
  }
});

// Application Logic

define('avd', ['jquery', 'knockout', 'sammy', 'bootstrap'], function ( $, ko, sammy) {
  var self = avd = {},
    Sammy = sammy,

    msgTemplate = ko.observable('blank-tmpl'),
    isSU = ko.observable(false),
    displayMessage = ko.observable(),
    pageHeading = ko.observable(),
    pageBody = ko.observable('blank-tmpl'),
    pageImgSrc = ko.observable("img/noimage.png"),
    imgVisible = ko.observable(false),
    reuSection = ko.observable('blank-tmpl'),
    reuSectionHeading = ko.observable(),
    accountTmpl = ko.observable('account-login'),
    accountUsername = ko.observable(),
    projects = ko.observableArray(),
    userAccount;

  /*
  * loadPage: generates page using templates, bindings and abservables
  * loding from content.js (JSON object of page content)
  * @params: _str = pageName coming from url
  */
  self.loadPage = function(_str){
    var str = _str;
    clearObservables();
   
    pageBody(str + "-tmpl");
    pageHeading(avdContent[str].mainHeading);
    pageImgSrc(avdContent[str].imgIcon);
    imgVisible(true);
    //$('#page-heading-wrap').fadeOut();
    $('#page-heading-wrap').fadeIn();

    // deal with link
    avd.clearLinks("avd-nav-list");
    document.getElementById("avd-link-" + str).parentNode.className = "active";

    switch(str){
      case "reu":
        avd.loadSection("overview");
        break;
      case "contactus":
        loadContactSection();
        break;
      case "home":
        break;
    }

  }; // end loadPage

  /*
  * loadSection: loads the selected section on the REU page
  * @params: _str = pageName coming from url
  */
  self.loadSection = function(_str){
    var str = _str;
    reuSectionHeading(avdContent["reu"].content[str].sectionTitle);
    reuSection("reu-" + str + "-sect-tmpl");

    // handle links
    avd.clearLinks("reu-nav");
    document.getElementById("reu-link-" + str).className = "side-link active";
  };

  /*
  * setPageUrl: appends "#value" to URL where 
  * "value" = manipulated string from innerHTML 
  * of item clicked passed in
  *
  * @params: _ele = element passed in from click event
  */
  self.setPageUrl = function(_ele){
    // prepare string
    var str = _ele.innerHTML.toLowerCase();
    str = str.replace(/ /g, "");

    // handle links
    avd.clearLinks("avd-nav-list");
    _ele.parentNode.className = "active";
    // rewrite url
    document.location.hash = str;
    document.title = "AVD | " + avdContent[str].pageTitle;
  }

  /*
  * setREUPageUrl: appends "#value" to URL where 
  * "value" = manipulated string from innerHTML 
  * of item clicked passed in
  * --- SPECIFICALLY FOR "REU" LINKS ---
  *
  * @params: _ele = element passed in from click event
  */
  self.setREUPageUrl = function(_ele){
    var str = _ele.innerHTML.toLowerCase();

    // set up reu template
    pageBody("reu-tmpl");
    pageHeading(avdContent["reu"].mainHeading);

    console.log(_ele.className);
    // handle links
    avd.clearLinks("reu-nav");
    _ele.className = "side-link active";

    // rewrite url
    document.location.hash = "reu/" + str; 
    document.title = "AVD | REU | " + str;  
  }

  /*
  * loadContactSection: displays Google map on contact us page
  */
  function loadContactSection(){
    var map = new GMaps({
      div: '#gmap',
      lat: -12.043333,
      lng: -77.028333
    });
    GMaps.geocode({
      address: "96 Lomb Memorial Drive, Rochester, NY 14623",
      callback: function(results, status) {
        if (status == 'OK') {
          var latlng = results[0].geometry.location;
          map.setCenter(latlng.lat(), latlng.lng());
          map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng()
          });
        }
      }
    });
  }


  /*
  * clearObservables: resets templates and text bound observables
  */
  function clearObservables(){
    //clearObservables
    pageBody("blank-tmpl");
    pageHeading();
  }

  /*
  * clearLinks: removes active classes on all "a" tags withing the div of the passed in id
  * @params: _parentId = id of parent that contains all "a" tags
  */
  self.clearLinks = function(_parentId){
    $('#' + _parentId + ' a').each(function(){
      $(this).parent().removeClass("active");
      $(this).removeClass("active");
    });
  };

  /*
  * runSearch: dynamic search engine built for searching "data-" attributes
  */
  function runSearch(){
    var searchTerm = $("#search-projects").val();
    if(searchTerm != ""){
      console.log(searchTerm);
      // loop through a tags
      $("#og-grid a").each(function(){
        var item = $(this);
        var bool = false;
        var attrs = $(this).getAttributes();
        // loop through attributes of "a"
        for(attr in attrs){
          // if attribute has "data-"
          if(attr.indexOf("data-") > -1){
            // if match is found
            if(attrs[attr].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1){
               bool = true;
            }
          }
        }
        // found match
        if(bool){
          item.show();
        }
        else{
          //not a match
          item.hide();
        }
      });
    }
    else{
      $("#og-grid a").each(function(){
        $(this).show();
      });
    }
  }

  /*
  * $.getAttributes: custom jquery function for getting all attributes in a given element
  */
  (function($) {
      $.fn.getAttributes = function() {
          var attributes = {};

          if( this.length ) {
              $.each( this[0].attributes, function( index, attr ) {
                  attributes[ attr.name ] = attr.value;
              } );
          }

          return attributes;
      };
  })(jQuery);

  // functions
  self.runSearch = runSearch;

  //template observables
  self.accountTmpl = accountTmpl;
  self.msgTemplate = msgTemplate;

  //variables
  self.userAccount = userAccount;
  self.reuSection = reuSection;
  self.reuSectionHeading = reuSectionHeading;
  self.pageBody = pageBody;
  self.pageHeading = pageHeading;
  self.pageImgSrc = pageImgSrc;
  self.imgVisible = imgVisible;
  self.accountUsername = accountUsername;
  self.projects = projects;
  self.isSU = isSU;
  return self;
}); // end avd module

define(['avd', 'jquery', 'knockout', 'sammy', 'bootstrap'], function (avd, $, ko, sammy) {
  var Sammy = sammy;
  window._avd = avd;

  ko.applyBindings(avd, document.getElementById('avd-main'));

  /*
  * windowScroll: handles manipulating the navbar when the user scrolls
  */
  $(window).scroll(function(){
    //  console.log($(window).scrollTop());
     if($(window).scrollTop() > 50){ // used to be five
       $('#avd-nav').addClass('active-scroll');
     }

    if($(window).scrollTop() < 1){
      $('#avd-nav').removeClass('active-scroll');
     }
  });


  /*
  * Sammy: Client side Routing with Knockout.js
  * Fuctions below will get the url of the page and fill content accordingly
  */
  Sammy(function() {

    this.get('#:pageName', function() {
      avd.loadPage(this.params.pageName);
    });

    this.get('#:pageName/:avdSubpage', function() {
      avd.loadPage(this.params.pageName);
      avd.loadSection(this.params.avdSubpage);
    });
  
    this.get('', function() { this.app.runRoute('get', '#reu') });

  }).run();

}); // end of main module
