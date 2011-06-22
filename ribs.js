// Ribs
(function () {

  // extend String with trim
  if (typeof String.trim == "undefined") { 
    String.prototype.trim = function () {
      return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
  }
  
  // valid backbone events
  var BACKBONE_EVENTS = ['add', 'change', 'remove', 'all', 'route', 'error'],
      DOM_EVENTS = ['click', 'mouseover', 'mouseout'];

  // object which represents binding
  if (typeof Ribs == "undefined") {
    var Ribs = this.Ribs = {};
  }

  // Ribs bindings
  Ribs.Bindings = { 

    /**
     * Binds actions to element.
     * 
     * @param el {$}
     * @param dec {Ribs.Declaration} 
     */
    bind: function (el, dec) {
       _(dec.bindings).each(function (binding) {
        // process backbone bindings only if data present
        if (dec.data) {
          if (BACKBONE_EVENTS.indexOf(binding.event) > -1) {  
            dec.data.bind(binding.event, binding.handler);
          }

          // handle init events
          if (binding.event.match(/init/)) {
            // data attribute present
            if (binding.attr) {
              binding.handler.call(el, binding.attr, dec.data.get(binding.attr), dec);
            }
            else {
              binding.handler.call(el, dec, binding);
            }
          }
        }

        // handle dom events
        if (DOM_EVENTS.indexOf(binding.event) > -1) {
          el.bind(binding.event, binding.handler);
        }
      });

      return dec;
    }
  };
  
  // Declaration represents single declarative expression defined 
  // on DOM element turned into object
  // TODO: I'm not very happy with this name
  // basically this is a collection of bindings 
  // together with addtional options
  Ribs.Declaration = function () {
    this.bindings = [];
    this.options = {};
  };

  // Ribs parser and linker
  Ribs.Parser = {
 
    /**
     * Converts declarative binding expressions into declaration object
     * 
     * Current declarative format can contain following elements:
     * 
     *   data - backbone model or collection,
     *   template - template used for rendering
     *   bindings - array of pairs: event:handler. All Ribs events are supported. Additionary
     *             custom events can be defined. All handlers should be added to Ribs.Handlers 
     *   options - hash of additional options which could be used by handlers 
     *  
     * Examples of declarative attributes which become bindings:
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
     * @param tokens {String} - represents binding expression
     * @param ctx {Object} - current context/namespace
     * @return binding {Ribs.Declaration} - declaration object
     */
    _parse: function (expression, ctx) {
      var tokens = expression.split(','),
          declaration = new Ribs.Declaration(),
          token, i, l;
      
      this.ctx = ctx || window; 

      for (i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i].trim().split(':');
        this._parseToken(token, declaration);
      }

      return declaration;
    },

    /**
     * Parses single token and updates binding object.
     * @param token {Array}
     * @param declaration {Ribs.Declaration} 
     * @param ctx {Object} current context/namespace
     */
    _parseToken: function (token, declaration, ctx) {
      if (!_.isArray(token) || token.length < 2) {
        throw new Error("Token " + token + " has a wrong format.");
      }

      var key = token[0],
          value = token[1],
          extra = token[2],
          attr,
          binding;
          
      switch (key) {
      case "data":
        declaration.data = this._getObjectByName(value, ctx);
        break;
      case "template":
        declaration.template = value;
        break;
      case "option":
        declaration.options[value] = extra;
        break;
      default:
        if (extra) {
          key = token.slice(0, 2).join(":");
          attr = value;
          value = extra;
        }
        binding = {event: key, attr: attr, handler: this._findHandler(value)};
        declaration.bindings.push(binding);
      }
    },

    /**
     * Returns object for given name.
     *
     * @param objStr {String} String representation of the object.
     * @return object
     */
    _getObjectByName: function (objStr) {
      var obj = this.ctx;
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
    * Searches for handler in Ribs.Handlers for given string.
    * @param handler {String} handler's name
    *
    */
    _findHandler: function (handler) {
      if (Ribs.Handlers[handler]) {
        return Ribs.Handlers[handler];
      }
      else {
        return this._getObjectByName(handler);
      }
    },   
  
  }

  // build-in handlers
  // all handlers execute in the context of the current element
  // extend it if you want to add more handlers 
  Ribs.Handlers = {
    set: function (attr, value, binding) {
      this.val(value);
    },
    
    render: function (dec, action) {
      var that = this,
          html;
          
      // cache template
      if (typeof dec.template == "string") {
        html = $("#" + dec.template).html();
        dec.template = _.template(html);
      }

      if (dec.data.models) {
        dec.data.each(function (model) {
          html = dec.template({model: model.attributes});
          that.append(html);
        });
      }
      else {
        html = binding.template({model: binding.data.attributes});
        that.append(html);
      }
    }
  };

  // entry point
  Ribs.bindAll = function () {
    $('[data-bind]').each(function () {
      var el = $(this),
          dec = Ribs.Parser._parse(el.attr('data-bind'));
      Ribs.Bindings.bind(el, dec);
    });
  };
}());
