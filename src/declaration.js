(function (R) {

  /**
   * Declaration represents single declarative expression defined
   * on DOM element turned into object
   */
  R.Declaration = function (token) {
    this.bindings = [];
    this.options = token.options;
  };

  R.Declaration.prototype = {

    /**
     * Binds actions to element.
     *
     * @param {object} el
     */
    bind: function (el) {
      var that = this;

      // process all bindings
      _(this.bindings).each(function (b) {
        //console.log(b.event);
        var handler = that.execute(el, b);
        
        // If the binding represents a Backbone event bind to the Backbone model
        if (b.isBackboneEvent()) {
          // TODO review unbind
          that.data.unbind(b.getEventName(), handler);
          that.data.bind(b.getEventName(), handler);
          // execute handler initially
          //handler();
        }
        // Otherwise if it is a DOM event, bind to the element on which it declared
        else if (b.isDomEvent()) {
          el.unbind(b.getEvent(), handler).bind(b.getEvent(), handler);
        }
      });

      // init hook
      R.handlers.init.call(el, this);
    },

    /**
     * Returns closure to handler which
     * executes in the context of given element.
     * @param {object} el
     * @param {Ribs.Binding} binding
     *
     */
    execute: function (el, binding) {
      var that = this;
      return function () {
        // if the declaration specified a view, then call the handler in the context of the view
        if (that.view) {
          binding.handler.call(that.view);
        }
        // otherwise call the handler in the context of the declaration element
        else {
          binding.handler.call(el, that, binding);
        }
      }
    }
  };
})(Ribs);
