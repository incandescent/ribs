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
        return "Checkbox";
      }
      if (this.is(':radio')) {
        return "Radio";
      }
      if (this.tagName() === 'select') {
        return "Select";
      }
      return "Input";
    }
    else {
      return "Text";
    }
  };

  // TODO: should ViewModel be a mixin
  // which extends regular backbone view
  // if `observable` is present?
  R.View = Backbone.View.extend({
    initialize: function (options) {
      console.log('R.ViewModel');
      this.attr = options.dec.attr;
    },

    // updates view with model's value
    _updateView: function () {
      this.el.val(this.model.get(this.options.dec.attr));
    },

    // updates model with current value from view
    _updateModel: function () {
      var keyValue = {};
      keyValue[this.options.dec.attr] = this._getValue();
      this.model.set(keyValue);
    },

    // returns view's value
    // this is a default implementation
    // other views should override this method
    _getValue: function () {
      return this.el.val();
    }
  });

  R.View.extend = Backbone.View.extend;

  // Factory which produces new View
  R.View.factory = function (dec, config) {
    var view,
        options = {};

    if (config.view) {
      view = dec.ribs.getObj(config.view);
    }
    else if (config.observable) {
      view = R[dec.el.getType() + 'View'];
    }

    if (typeof view == "undefined") {
      throw new Error("could not resolve view");
    }

    // wire backbone view with data
    if (dec.data.models) {
      options.collection = dec.data;
    } else {
      options.model = dec.data;
    }

    options.dec = dec;
    options.el = dec.el;

    // create new view and set its element
    if (typeof view == "function") {
      view = new view(options);
    }
    else {
      view._configure(options);
    }

    // if the element object is not a jQuery or Zepto object
    // attempt to wrap it
    if (!(view.el instanceof $)) {
      var v = $('#' + config.view);
      view.el = (v.size()) ? v : dec.el;
    }

    return view;
  }

  // Input view
  R.InputView = R.View.extend({
    initialize: function () {
      var self = this;

      this.el.bind('keyup', function () {
        self._updateModel();
      });

      this.model.bind('change:' + this.options.dec.attr, function () {
        self._updateView();
      });
    }
  });

})(Ribs);
