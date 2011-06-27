(function (R) {
 
  /**
   * Declaration represents single declarative expression defined 
   * on DOM element turned into object
   * TODO: I'm not very happy with this name
   * basically this is a collection of bindings 
   * together with addtional options
   */
  R.Declaration = function () {
    this.bindings = [];
    this.options = {};
  };
  
  R.Declaration.prototype = {
    
    /**
     * Binds actions to element.
     * 
     * @param {object} el
     */
    bind: function (el) {  
      var that = this;

      if (!this.data) {
        throw new Error('data attribute is missing for: ' + el);
      }

      // proccess all bindings 
      _(this.bindings).each(function (b) {
        if (b.isBackboneEvent()) {
          that.data.bind(b.getEventName(), that.execute(el, b));
          b.handler.call(el, that, b);
        }
        else if (b.isDomEvent()) {
          el.bind(b.getEvent(), that.execute(el, b));
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
        binding.handler.call(el, that, binding);
      }
    }
  };
})(Ribs);
