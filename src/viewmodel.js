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

  // TODO: should ViewModel be a mixin
  // which extends regular backbone view
  // if `observable` is present?
  R.ViewModel = Backbone.View.extend({
    initialize: function (options) {
      this.attr = options.attr;
    },

    // updates view with model's value
    _updateView: function () {
      this.el.val(this.model.get(this.attr));
    },

    // updates model with current value from view
    _updateModel: function () {
      var keyValue = {};
      keyValue[this.attr] = this._getValue();
      this.model.set(keyValue);
    },

    // returns view's value
    // this is a default implementation
    // other views should override this method
    _getValue: function () {
      return this.el.val();
    }
  });

  // Factory which produces new ViewModel based
  // on given element type
  R.ViewModel.factory = function (el, options) {
    var constr = cel.getType();
    return new R[constr](options);
  }

})(Ribs);
