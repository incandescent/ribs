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
    }
  };
})(Ribs);
