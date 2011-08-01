(function (R) {

  // A Binding object represents the association between an event and a handler which will
  // be run when the event is fired.
  //
  // Both DOM and Backbone events may be bound (see `Ribs.devents` and `Ribs.bevents`).
  // Backbone events support a second "attribute" component representing the model field.

  /**
   * Binding constructor
   * @param {string} event
   * @param {function} handler
   */
  R.Binding = function (event, handler, attr) {
    this.event = event;
    this.handler = handler;
    this.eventName = event.replace(/^on/, '');
    this.attr = attr;
  };

  R.Binding.prototype = {
    isBackboneEvent: function () {
      return _.include(R.bevents, this.event);
    },
    isDomEvent: function () {
      return _.include(R.devents, this.event);
    },
    hasAttr: function () {
      return (this.attr);
    },
    getEvent: function () {
      return this.eventName;
    },
    getEventName: function () {
      return (this.hasAttr()) ? this.eventName + ":" + this.attr : this.eventName;
    },
    setAttr: function (attr) {
      this.attr = attr;
    },
    // resolve this binding name in the context of a declaration
    // assigns the data attribute and wires a wrapping function that invokes the view correctly
    resolve: function (dec) {
      var self = this,
          handler = null,
          func = function () {
            // if the declaration specified a view, then call the handler in the context of the view
            if (dec.view) {
              self.handler.call(dec.view);
            }
            // otherwise call the handler in the context of the declaration element
            else {
              self.handler.call(dec.el, dec, self);
            }
          };

      // look for handler on the given view
      if (dec.view) {
        handler = dec.view[this.handler];
      }

      // look for handler in global handlers
      if (!handler) {
        handler = (R.handlers[this.handler]) ? R.handlers[this.handler] : dec.ribs.getObj(this.handler);
      }

      this.handler = handler;
      this.data = dec.data;
      this.attr = dec.attr;

     // If the binding represents a Backbone event bind to the Backbone model
      if (this.isBackboneEvent()) {
        // TODO review unbind
        this.data.unbind(this.getEventName(), func);
        this.data.bind(this.getEventName(), func);
        // execute handler initially
        //func();
      }
      // Otherwise if it is a DOM event, bind to the element on which it declared
      else if (this.isDomEvent()) {
        dec.el.unbind(this.getEvent(), func).bind(this.getEvent(), func);
      }
    }
  };
})(Ribs);
