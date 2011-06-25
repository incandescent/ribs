// Ribs - Give your Backbone some Ribs - declarative bindings for Backbone.js
(function () {

  // extend String with trim
  if (typeof String.trim == "undefined") { 
    String.prototype.trim = function () {
      return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
  }

  var FORM_TAGS = ['input', 'select', 'textarea'];

  // setup Ribs namespace
  if (typeof Ribs == "undefined") {
    var Ribs = this.Ribs = {};
  }
  
  // various utilities
  Ribs.U = {
    isFormEl: function (tagName) {
      return _.include(FORM_TAGS, tagName.toLowerCase());
    }
  };

  // entry
  Ribs.bindAll = function () {
    $('[data-bind]').each(function () {
      var el = $(this),
          dec = Ribs.Parser._parse(el.attr('data-bind'));
      dec.bind(el);
    });
  };
}());
