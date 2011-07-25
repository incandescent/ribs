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

      // proccess all bindings
      _(this.bindings).each(function (b) {
        //console.log(b.event);
        var handler = that.execute(el, b);
        if (b.isBackboneEvent()) {
          // TODO review unbind
          that.data.unbind(b.getEventName(), handler);
          that.data.bind(b.getEventName(), handler);
          // execute handler initially
          //handler();
        }
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
        if (that.view) {
          binding.handler.call(that.view);
        }
        else {
          binding.handler.call(el, that, binding);
        }
      }
    }
  };
})(Ribs);
