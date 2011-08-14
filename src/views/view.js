(function (R) {

  R.utils = {
    // a convenient method which creates
    // object with predefined key/value
    make: function (key, value) {
      var o = {};
      o[key] = value;
      return o;
    }
  };

  // default observable View implementation
  R.View = Backbone.View.extend({

    initialize: function () {
      this.dec = this.options.dec;
      this.attr = this.dec.attr;
      this._setup();
    },

    _setup: function () {
      _.bindAll(this, '_updateView');

      if (this.model) {
        this.model.bind('change:' + this.attr, this._updateView);
      }
      else {
        this.collection.bind('change:' + this.attr, this._updateView);
      }
      this._updateView();
    },

    // updates view with the value from the model
    _updateView: function () {
      this.el.text(this.model.get(this.attr));
    },

    // updates model with current value from the view
    _updateModel: function () {
      this.model.set(R.utils.make(this.attr, this.el.text()));
    }
  });

  R.View.extend = Backbone.View.extend;

  // Factory which produces views
  R.View.factory = function (dec, config) {
    var view,
        options = {};

    if (config.view) {
      view = (R[config.view]) ? R[config.view] : dec.ribs.getObj(config.view);
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

})(Ribs);
