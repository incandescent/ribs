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
    var Ribs = this.Ribs = {},
        R = Ribs;
  }

  // backbone events
  R.bevents = ['add', 'change', 'remove', 'all', 'route', 'error'];
  // dom events
  R.devents = ['click', 'mouseover', 'mouseout', 'keyup', 'keydown', 'keypress', 'onchange', 'mouseenter'];
  // all events
  R.events = R.bevents.concat(R.devents);

  /**
    * Returns object for given name.
    *
    * @param objStr {String} String representation of the object.
    * @return object
    */
  R.getObjectByName = function (objStr) {
    var obj = R.ctx;
    _(objStr.split('.')).each(function (prop) {
      if (obj.hasOwnProperty(prop)) {
        obj = obj[prop];
      }
      else {
        throw new Error("Object or function '" + objStr + "' not found.");
      }
    });
    return obj;
  };

  // entry
  R.bindAll = function (ctx) {
    R.ctx = ctx || window;
    $('[data-bind]').each(function () {
      var el = $(this),
          dec = R.Parser.parse(el.attr('data-bind'));
      dec.bind(el);
    });
  };
}());
