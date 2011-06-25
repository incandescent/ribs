(function (Ribs) {
 
  // Declaration represents single declarative expression defined 
  // on DOM element turned into object
  // TODO: I'm not very happy with this name
  // basically this is a collection of bindings 
  // together with addtional options
  Ribs.Declaration = function () {
    this.bindings = [];
    this.options = {};
  };
  
  Ribs.Declaration.prototype = {
    
    /**
     * Binds actions to element.
     * 
     * @param {jQuery} el
     */
    bind: function (el) {  
      var that = this;
      _(this.bindings).each(function (b) {
        // process backbone bindings only if data present
        if (that.data) {
          if (b.isBackboneEvent()) {
            that.data.bind(b.getEventName(), function () {
              that.execute(el, b, that);
            });

            that.execute(el, b, that);
          }
        }

        // handle dom events
        if (b.isDomEvent()) {
          el.bind(b.getEvent(), function (e) {
            b.handler.call(el, e, b, that);    
          });
        }
      });
    },

   /**
    *  Executes backbone binding.
    *
    *  @param {jQuery }el DOM element
    *  @param {object} binding
    *  @param {Ribs.Declaration} dec - declaration
    */
    execute: function (el, b, dec) {
      if (b.attr) {
        b.handler.call(el, b.attr, dec.data.get(b.attr), dec);
      }
      else {
        b.handler.call(el, dec, b);
      }
    }
  };
})(Ribs);
