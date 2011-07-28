//  Ribs.js 0.1.0
//  (c) 2011 Michal Kuklis, Incandescent Software.
//  Ribs may be freely distributed under the MIT license.

(function () {

  // extend String with trim
  if (typeof String.trim == "undefined") {
    String.prototype.trim = function () {
      return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
  }

  // setup Ribs namespace
  if (typeof Ribs == "undefined") {
    this.R = this.Ribs = function (ctx, selector) {
      var self = this;
      this.ctx = ctx || window;
      this.selector = selector || R.selector;

      // Registers bindings defined on the element
      this.bind = function (el) {
        var dec = R.parser.parse(this, el);
        el.data('declaration', dec);
        dec.bind(el);
        dec = null;
      };
      
      /**
       * Returns object for given name.
       *
       * @param name {String} String representation of the object.
       * @return object
       */
      this.getObj = function (name) {
        var obj = self.ctx;
        _(name.split('.')).each(function (prop) {
          if (obj.hasOwnProperty(prop)) {
            obj = obj[prop];
          }
          else {
            throw new Error("Object or function '" + name + "' not found.");
          }
        });
        return obj;
      };
      
      // Initializes Ribs by discovering and binding all annotated elements
      var init = function () {
        $('[' + this.selector + ']').each(function () {
            self.bind($(this));
        });
      };
      
      // Initialize on construction
      init();
    };
  }
  
  // Globals
  
  // Ribs version
  R.version = '0.1';

  // the default Ribs binding attribute selector
  R.selector = "data-bind";

  // array of backbone events
  R.bevents = "add change remove all route error".split(' ');
  // array of dom events
  R.devents = "click mouseover mouseout keyup keydown keypress onchange mouseenter".split(' ');
  // array of all events
  R.events = R.bevents.concat(R.devents);
}());