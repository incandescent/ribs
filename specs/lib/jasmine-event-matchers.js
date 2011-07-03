var eventMatchers = {
  toHaveEvent: function (event) {   
    var data = jQuery.data(this.actual.get(0));
    for (obj in data) {
      if (data.hasOwnProperty(obj)) {
        for (eventName in data[obj].events) {
          if (data[obj].events.hasOwnProperty(eventName)) {
            if (event === eventName) {
              return true;
            }
          }
        }
      }
    }
    return false;
  },

  toHaveBinding: function () {
  }
};
