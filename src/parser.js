(function (R) {

  R.parser = {

    /**
    * Converts expression to declaration
    * @param {string} expr - expression
    */
    parse: function (exp, el) {
      var that = this,
          t = R.scanner.scan(exp),
          d = new R.Declaration();

      if (typeof t.data == "undefined") {
        throw new Error("data attribute is missing");
      }

      d.data = R.getObj(t.data);
      d.attr = t.attr;
      d.options = t.options;

      if (t.view) {
        this._processView(d, t, el);
      }

      // process bindings
      _(t.bindings).each(function (b, i) {
        b.data = d.data;
        b.attr = d.attr;
        b.handler = (d.view) ? d.view[b.handler] : that._findHandler(b.handler);
        d.bindings.push(b);
      });

      return d;
    },

    _processView: function (d, t, el) {
      d.view = R.getObj(t.view);
      // wire backbone view with data
      if (d.data.models) {
        d.view.options.collection = d.view.collection = d.data;
      }
      else {
        d.view.options.model = d.view.model = d.data;
      }
      // el is not jQuery or Zepto
      if (!(d.view instanceof $)) {
        d.view.el = el;
      }
    },

    /**
    * Searches for handler in Ribs.Handlers for given string
    * and falls into ctx search if handle is not found
    * @param {string} handler - handler's name
    *
    */
    _findHandler: function (handler) {
      if (R.handlers[handler]) {
        return R.handlers[handler];
      }
      else {
        return R.getObj(handler);
      }
    }
  }
})(Ribs);
