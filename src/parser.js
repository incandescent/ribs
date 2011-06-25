(function (Ribs) {

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
     *    data:car:color, change:set 
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
     * @param {string} expr - represents binding expression
     * @param {object} ctx - current context/namespace
     * @return {Ribs.Declaration} declaration - declaration object
     */
    _parse: function (expr, ctx) {
      var tokens = expr.split(','),
          dec = new Ribs.Declaration(),
          token, i, l;
      
      this.ctx = ctx || window; 
       
      for (i = 0, l = tokens.length; i < l; i++) {
        token = tokens[i].trim().split(':');
        this._parseToken(token, dec);
      }
      
      this._updateBindings(dec);
           
      return dec;
    },
    
    /**
    * Updates bindings with missing attributes
    * @param {Ribs.Declaration} dec - declaration
    */
    _updateBindings: function (dec) {
      _(dec.bindings).each(function (binding, index) {           
        if (!binding.data) {
          binding.data = dec.data;
        }
        if (!binding.attr) {
          binding.attr = dec.attr;
        }
      });
    },

    /**
     * Parses single token and updates binding object.
     * @param {array} token
     * @param {Ribs.Declaration} dec 
     */
    _parseToken: function (token, dec) {
      
      if (!_.isArray(token) || token.length < 2) {
        throw new Error("Token " + token + " has a wrong format.");
      }
      
      var key = token[0],
          v1 = token[1],
          v2 = token[2];
          
      switch (key) {
      case "data":
        dec.data = this._getObjectByName(v1);
        dec.attr = v2;
        break;
      case "template":
        dec.template = v1;
        break;
      case "option":
        dec.options[v1] = v2;
        break;
      default: // binding
        this._parseBinding(token, dec);
      }
    },
    
    /**
     * Parses single binding.
     * @param {array} token
     * @param {Ribs.Declaration} dec
     */
    _parseBinding: function (token, dec) {
      var event = token[0],
          handler = this._findHandler(token[1]),
          binding = new Ribs.Binding(event, handler);
      dec.bindings.push(binding);
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
    * Searches for handler in Ribs.Handlers for given string
    * and falls into ctx search if handle is not found
    * @param {string} handler - handler's name
    *
    */
    _findHandler: function (handler) {
      if (Ribs.handlers[handler]) {
        return Ribs.handlers[handler];
      }
      else {
        return this._getObjectByName(handler);
      }
    }
  }
})(Ribs);
