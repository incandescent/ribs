// Ribs - Give your Backbone some Ribs - declarative bindings for Backbone.js
(function () {

  // extend String with trim
  if (typeof String.trim == "undefined") { 
    String.prototype.trim = function () {
      return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    };
  }
  
  // valid backbone events
  var BACKBONE_EVENTS = ['add', 'change', 'remove', 'all', 'route', 'error'],
      DOM_EVENTS = ['click', 'mouseover', 'mouseout', 'keyup'];

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
            var e = (binding.attr) ? binding.event + ":" + binding.attr : binding.event;
            dec.data.bind(e, function () {
              Ribs.Bindings.execute(el, binding, dec);
            });
          }
          // handle init events
          if (binding.event.match(/init/)) {
            Ribs.Bindings.execute(el, binding, dec);
          }
        }

        // handle dom events
        if (DOM_EVENTS.indexOf(binding.event) > -1) {
          el.bind(binding.event, function (e) {
            binding.handler.call(el, e, binding, dec);    
          });
        }
      });

      return dec;
    },
    
    /**
    *  Executes backbone binding.
    *  @param el {$} DOM element
    *  @param binding {Object}
    *  @param dec {Ribs.Declaration}
    */
    execute: function (el, binding, dec) {
      if (binding.attr) {
        binding.handler.call(el, binding.attr, dec.data.get(binding.attr), dec);
      }
      else {
        binding.handler.call(el, dec, binding);
      }
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
     * TODO: cases which should be supported:
     *    1. data:model:attr, event1:handler1, event2:handler2
     *    2. model:event1:handler1, model:attr:event2:handler2
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
     * @param dec {Ribs.Declaration} 
     * @param ctx {Object} current context/namespace
     */
    _parseToken: function (token, dec, ctx) {
      if (!_.isArray(token) || token.length < 2) {
        throw new Error("Token " + token + " has a wrong format.");
      }
      
      var key = token[0],
          v1 = token[1],
          v2 = token[2],
          binding;
          
      switch (key) {
      case "data":
        dec.data = this._getObjectByName(v1, ctx);
        break;
      case "template":
        dec.template = v1;
        break;
      case "option":
        dec.options[v1] = v2;
        break;
      default: // binding
        binding = {event:key};
       // 3th element present
       if (v2) { 
          // backbone event
          if (BACKBONE_EVENTS.indexOf(key) > -1 || key.match(/init/)) {  
            _.extend(binding, {attr:v1, handler:this._findHandler(v2)});
          }
          else {
            _.extend(binding, {attr:v2, handler:this._findHandler(v1)});
          }
        }
        else {
          _.extend(binding, {handler:this._findHandler(v1)});
        }
        dec.bindings.push(binding);
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
    }
  }

  // build-in handlers
  // all handlers execute in the context of the current element
  // extend it if you want to add more handlers 
  Ribs.Handlers = {
    set: function (e, binding, dec) {
      if (binding.attr) {
        var val = {};
        val[binding.attr] = $(this).val();
        dec.data.set(val);
      }
    },

    update: function (attr, value, binding) {
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
          that.html(html);
        });
      }
      else {
        html = binding.template({model: binding.data.attributes});
        that.html(html);
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
