// Ribs - Give your Backbone some Ribs - declarative bindings for Backbone.js
(function () {

  // extend String with trim
  if (typeof String.trim == "undefined") { 
    String.prototype.trim = function () {
      return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
  }
  
  // setup Ribs namespace
  if (typeof Ribs == "undefined") {
    var Ribs = this.Ribs = {};
  }

  // backbone events
  Ribs.bevents = ['add', 'change', 'remove', 'all', 'route', 'error'];
  // dom events
  Ribs.devents = ['click', 'mouseover', 'mouseout', 'keyup', 'keydown', 'keypress', 'onchange', 'mouseenter'];
  // all events
  Ribs.events = Ribs.bevents.concat(Ribs.devents);

  // entry
  Ribs.bindAll = function () {
    $('[data-bind]').each(function () {
      var el = $(this),
          dec = Ribs.Parser._parse(el.attr('data-bind'));
      dec.bind(el);
    });
  };
}());
