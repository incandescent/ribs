(function (R) {

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
