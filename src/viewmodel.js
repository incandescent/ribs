(function (R) {

  // returns element's tag name
  $.fn.tagName = function () {
    return this.get(0).tagName.toLowerCase();
  };

  // returns one of the types:
  // [checkbox, radio, select, input, text]
  // for given DOM element
  $.fn.getType = function () {
    var formTags = ["input", "textarea", "select"];
    if (_.include(formTags, this.tagName())) {
      if (this.is(':checkbox')) {
        return "checkbox";
      }
      if (this.is(':radio')) {
        return "radio";
      }
      if (this.tagName() === 'select') {
        return "select";
      }
      return "input";
    }
    else {
      return "text";
    }
  };

  R.ViewModel = Backbone.View.extend({
    initialize: function () {},

    // updates view with model's value
    _updateView: function () {
    },

    // updates model with current value from view
    _updateModel: function () {
    }
  });

  R.ViewModel.factory = function (el) {
    var constr = cel.getType();
    return new R[constr];
  }

})(Ribs);
