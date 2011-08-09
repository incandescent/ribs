(function (R) {

  /**
   * Declaration represents single declarative expression defined
   * on DOM element turned into object
   * el should be a jQuery or Zepto element wrapper
   */
  R.Declaration = function (ribs, el, config) {
    this.ribs = ribs;
    this.el = el;
    this.data = null;
    this.attr = null;
    this.bindings = [];
    this.options = config.options;

    this._resolveData(config);
    this._resolveView(config);
    this._resolveBindings(config);

    // initialize widget on declaration element
    // keep in declaration for now?
    // R.handlers.init.call(this.el, this);
  };

  _.extend(R.Declaration.prototype, {
    // resolves the data model for this declaration, consulting ancestors if no data name is provided
    _resolveData: function (config) {
      if (config.data) {
        this.data = this.ribs.getObj(config.data);
        this.attr = config.attr;
      }
      else {
        // if the config did not provide a model, find ancestor model
        var self = this;
        this.ribs.declarations(this.el.parents(), function (ancestorDec) {
          if (ancestorDec.data) {
            self.attr = ancestorDec.attr;
            self.data = ancestorDec.data;
            return false; // stop iteration
          }
        });
      }

      if (typeof this.data == "undefined" || this.data == null) {
        throw new Error("data attribute is missing");
      }

      // associate declaration object with element
      this.el.data('declaration', this);
    },

    // resolves the view for this declaration, consulting ancestors if no view name is provided
    _resolveView: function (config) {
      var self = this;

      // if the config specifies a view name, look it up in the Ribs context
      if (config.view || config.observable) {
        this.view = R.View.factory(this, config);
      }
      else {
       // if the config did not provide a view name find ancestor view
        this.ribs.declarations(this.el.parents(), function (ancestorDec) {
          if (ancestorDec.view) {
            self.view = ancestorDec.view;
            return false; // stop iteration
          }
        });
      }
      // it's ok if no view is found for the declaration hierarchy
      // any handlers will be resolved in the ribs context as functions
    },

    // resolves declared bindings against this declaration
    _resolveBindings: function (config) {
      var self = this;
      // process bindings
      _(config.bindings).each(function (binding, i) {
        binding.resolve(self);
        self.bindings.push(binding);
      });
    },

    // retrieves the template on this declaration, or throws error if none is defined
    getTemplate: function() {
      var html = null;

      if (!this.options.template) {
        throw new Error('no template present for element: ' + this);
      }

      // cache template
      if (typeof this.options.template == "string") {
        html = $("#" + this.options.template).html();
        if (!html) {
          throw new Error("Template " + this.options.template + " doesn't exist");
        }
        this.options.template = _.template(html);
      }

      return this.options.template;
    }
  });
})(Ribs);
