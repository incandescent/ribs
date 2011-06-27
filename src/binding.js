(function (Ribs) {

 /**
   * Binding constructor
   * @param {string} event
   * @param {function} handler
   */
  Ribs.Binding = function (event, handler) {
    this.event = event;
    this.handler = handler;
    this.eventName = event.replace(/^on/, '');
  };

  Ribs.Binding.prototype = {
    isBackboneEvent: function () {
      return _.include(Ribs.bevents, this.event);
    },
    isDomEvent: function () {
      return _.include(Ribs.devents, this.event);
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
})(Ribs);
