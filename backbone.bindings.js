// Backbone.Bindings
(function () {

  // extend String with trim
  if (typeof String.trim === "undefined") { 
    String.prototype.trim = function () {
      return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
  }
  
  // valid backbone events
  var BACKBONE_EVENTS = ['add', 'change', 'remove', 'all', 'route', 'error'],
      DOM_EVENTS = ['click'];

  // object which represents binding
  Backbone.Binding = function () {
  };

  // extend Binding with methods
  Backbone.Binding.prototype = {

    /**
     * Converts a declarative binding string into a binding object.
     * 
     * Current declarative format can contain following elements:
     * 
     *   data - backbone model or collection,
     *   template - template used for rendering
     *   actions - array of pairs: event:handler. All Backbone events are supported. Additionary
     *             custom events can be defined. All handlers should be added to Backbone.Binding.Handlers 
     *   options - hash of additional options which could be used by handlers 
     *  
     * Examples of declarative binding:
     * 
     *    data:car, init:color:set, change:color:set 
     * 
     * which translates into: 
     *  
     *    1. bind to car model, 
     *    2. set value of current element to model.color attribute during initialization
     *    3. set value of current element to model.color attribute on every change
     *
     *    data:cars, init:render, all:render, template:car-tmpl
     * 
     * which translates into:  
     *  
     *    1. bind to collection cars, 
     *    2. render all collection items on initialization 
     *    3. re-render collection on collection change
     *
     * @param tokens {String} - represents declarative binding
     * @return binding {Object} - binding object
     */
    _parse: function (tokens) {
      var params = tokens.split(','),
          binding = {actions: [], options:{}, templates: {}},
          token, i, l;
          
      for (i = 0, l = params.length; i < l; i++) {
        token = params[i].trim().split(':');
        this._parseToken(token, binding);
      }

      return binding;
    },

    /**
     * Parses single token and updates binding object.
     * @param token {Array}
     * @param binding {Object} 
     */
    _parseToken: function (token, binding) {
      if (!_.isArray(token) || token.length < 2) {
        throw new Error("Token " + token + " has a wrong format.");
      }

      var key = token[0],
          value = token[1],
          extra = token[2],
          attr,
          action;
          
      switch (key) {
      case "data":
        binding.data = this._getObjectByName(value);
        break;
      case "template":
        binding.template = value;
        break;
      case "option":
        binding.options[value] = extra;
        break;
      default:
        if (extra) {
          key = token.slice(0, 2).join(":");
          attr = value;
          value = extra;
        }
        action = {event: key, attr: attr, handler: this._findHandler(value)};
        binding.actions.push(action);
      }
    },

    /**
     * Returns object for given name.
     *
     * @param objStr {String} String representation of the object.
     * @return object
     */
    _getObjectByName: function (objStr) {
      var obj = window;
      _(objStr.split('.')).each(function (prop) {
        if (obj.hasOwnProperty(prop)) {
          obj = obj[prop];
        }
        else {
          throw new Error("Object or function '" + objStr + "' not found.");
        }
      });
      return obj;
    },

    /**
    * Searches for handler in Backbone.Binding.Handlers for given string.
    * @param handler {String} handler's name
    *
    */
    _findHandler: function (handler) {
      if (Backbone.Binding.Handlers[handler]) {
        return Backbone.Binding.Handlers[handler];
      }
      else {
        return this._getObjectByName(handler);
      }
    },

    /**
     * Binds actions to element.
     * 
     * @param el {$}
     * @param tokens {String} declarative binding
     */
    bind: function (el, tokens) {
      var binding = this._parse(tokens);
      _(binding.actions).each(function (action) {
        // process backbone bindings only if data present
        if (binding.data) {
          if (BACKBONE_EVENTS.indexOf(action.event) > -1) {  
            binding.data.bind(action.event, action.handler);
          }

          // handle init events
          if (action.event.match(/init/)) {
            // data attribute present
            if (action.attr) {
              action.handler.call(el, action.attr, binding.data.get(action.attr), binding);
            }
            else {
              action.handler.call(el, binding, action);
            }
          }
        }

        // handle dom events
        if (DOM_EVENTS.indexOf(action.event) > -1) {
          el.bind(action.event, action.handler);
        }
      });

      return binding;
    }
  };

  // build-in handlers
  // all handlers execute in the context of the current element
  // extend it if you want to add more handlers 
  Backbone.Binding.Handlers = {
    set: function (attr, value, binding) {
      this.val(value);
    },
    
    render: function (binding, action) {
      var that = this,
          tmpl = binding.template,
          html;
          
      // cache template
      if (!binding.templates[tmpl]) {
        html = $("#" + tmpl).html();
        binding.templates[tmpl] = _.template(html);
      }

      if (binding.data.models) {
        binding.data.each(function (model) {
          html = binding.templates[tmpl]({model: model.attributes});
          that.append(html);
        });
      }
      else {
        html = binding.templates[tmpl]({model: binding.data.attributes});
        that.append(html);
      }
    }
  };

  // entry point
  Backbone.Binding.bindAll = function () {
    $('[data-bind]').each(function () {
      var el = $(this),
          binding = new Backbone.Binding();
      binding.bind(el, el.attr('data-bind'));
    });
  };
}());
