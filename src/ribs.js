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
        return new R.Declaration(this, el, R.scanner.scan(el.attr(this.selector)));
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
      
      // binds all declarations in an element subtree
      // if tree is given, it is filtered as a jQuery/Zepto result set; otherwise the entire document is scanned
      // if callback is given then it is called with each declaration object
      this.bind_tree = function(tree, callback) {
        var nodes = null;
        if (tree) {
            nodes = tree.filter('[' + this.selector + ']');
        } else {
            nodes = $('[' + this.selector + ']');
        }
        nodes.each(function () {
          var dec = self.bind($(this));
          if (callback) {
            callback(dec);
          }
        });
      };
      
      // Initializes Ribs by discovering and binding all annotated elements
      this.bind_tree();
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