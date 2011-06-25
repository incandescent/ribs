(function (Ribs) {

  // valid backbone events
  var BACKBONE_EVENTS = ['add', 'change', 'remove', 'all', 'route', 'error'],
      DOM_EVENTS = ['click', 'mouseover', 'mouseout', 'keyup', 'keydown', 'keypress', 'onchange', 'mouseenter', 'mouseout'];

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
})(Ribs);
