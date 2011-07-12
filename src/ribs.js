//     Ribs.js 0.1.0
//     (c) 2011 Michal Kuklis, Incandescent Software.
//     Ribs may be freely distributed under the MIT license.

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

  R.version = '0.1';

  // backbone events
  R.bevents = "add change remove all route error".split(' ');
  // dom events
  R.devents = "click mouseover mouseout keyup keydown keypress onchange mouseenter".split(' ');
  // all events
  R.events = R.bevents.concat(R.devents);

  /**
    * Returns object for given name.
    *
    * @param name {String} String representation of the object.
    * @return object
    */
  R.getObj = function (name) {
    var obj = R.ctx;
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

  // entry
  R.bindAll = function (ctx) {
    R.ctx = ctx || window;
    $('[data-bind]').each(function () {
      var el = $(this),
          dec = R.parser.parse(el.attr('data-bind'));
      dec.bind(el);
    });
  };
}());
