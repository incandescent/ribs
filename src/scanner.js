(function (R) {

  // Ribs scanner
  R.scanner = {

    /**
     * Converts declarative binding expressions into declaration object
     *
     * Current declarative format can contain following elements:
     *
     *    * `data`     - backbone model or collection in format *`data:[collection|model](:attr)`*
     *    * `template` - template used for rendering
     *    * `view`     - backbone view
     *    * `observable` - marks an element as observable
     *    * `bindings` - array of pairs: `event:handler`. All Ribs events are supported. Additionary
     *                   custom events can be defined. All handlers should be added to Ribs.Handlers
     *    * `options`  - hash of additional options which could be used by handlers
     *
     * Examples of declarative attributes which become bindings:
     *
     * `data:car:color, change:set`
     *
     * which translates into:
     *
     *    1. bind to `car` model,
     *    2. set value of current element to `model.color` attribute during initialization
     *    3. set value of current element to `model.color` attribute on every change
     *
     * `data:cars, init:render, all:render, template:car-tmpl`
     *
     * which translates into:
     *
     *    1. bind to collection `cars`,
     *    2. render all collection items on initialization
     *    3. re-render collection on collection change
     *
     * @param {string} expr - represents binding expression
     * @return {Object} token - declaration object
     */
    scan: function (expr) {
      var blocks = expr.split(','),
          token = {bindings:[], options:{}, expr:expr};

      for (var i = 0, l = blocks.length; i < l; i++) {
        block = blocks[i].trim().split(':');
        this._tokenize(block, token);
      }

      return token;
    },

    /**
     * Scans single block and updates the parsed structure.
     * If the parameter is an event, adds a new `Binding`.
     * If the parameter is not recognized it is added to the `options`
     * object.
     *
     * @param {array} block
     * @param {Object} token
     */
    _tokenize: function (block, token) {

      var k, v1, v2, t = token;

      if (!_.isArray(block) || block.length < 1) {
        throw new Error("Block " + block + " has a wrong format.");
      }

      k = block[0];
      v1 = block[1];
      v2 = block[2];

      switch (k) {
      case "observable":
        t.observable = true;
        break;
      case "data":
        t.data = v1;
        t.attr = v2;
        break;
      case "view":
        t.view = v1;
        break;
      default:
        if (_.include(R.events, k)) {
          t.bindings.push(new R.Binding(k, v1));
        }
        else {
          t.options[k] = v1; // options
        }
      }
    }
  }
})(Ribs);
