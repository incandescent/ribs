(function (Ribs) {

  // valid backbone events
  var BACKBONE_EVENTS = ['add', 'change', 'remove', 'all', 'route', 'error'],
      DOM_EVENTS = ['click', 'mouseover', 'mouseout', 'keyup', 'keydown', 'keypress', 'onchange', 'mouseenter', 'mouseout'];

  // Declaration represents single declarative expression defined 
  // on DOM element turned into object
  // TODO: I'm not very happy with this name
  // basically this is a collection of bindings 
  // together with addtional options
  Ribs.Declaration = function () {
    this.bindings = [];
    this.options = {};
  };

  /**
   * Binding constructor
   * @param {string} event
   * @param {function) handler
   */
  Ribs.Binding = function (event, handler) {
    this.event = event;
    this.handler = handler;
    this.eventName = event.replace(/^on/, '');
  };

  Ribs.Binding.prototype = {
    isBackboneEvent: function () {
      return _.include(BACKBONE_EVENTS, this.event);
    },
    isDomEvent: function () {
      return _.include(DOM_EVENTS, this.event);
    },
    hasAttr: function () {
      return (this.attr);
    },
    getEvent: function () {
      return this.eventName;
    },
    getEventName: function () {
      return (this.hasAttr()) ? this.eventName + ":" + this.attr : this.eventName;
    }
  };

  // Ribs bindings
  Ribs.Bindings = { 

    /**
     * Binds actions to element.
     * 
     * @param {jQuery} el
     * @param {Ribs.Declaration} dec - declaration 
     */
    bind: function (el, dec) {  
      var that = this;
      _(dec.bindings).each(function (b) {
        // process backbone bindings only if data present
        if (dec.data) {
          if (b.isBackboneEvent()) {
            dec.data.bind(b.getEventName(), function () {
              that.execute(el, b, dec);
            });

            that.execute(el, b, dec);
          }
        }

        // handle dom events
        if (b.isDomEvent()) {
          el.bind(b.getEvent(), function (e) {
            b.handler.call(el, e, b, dec);    
          });
        }
        // handle special case
      });
      return dec;
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
