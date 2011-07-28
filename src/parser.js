// TODO: refactor
(function (R) {

  R.parser = {

    /**
    * Converts token to declaration
    * @param {object} el
    */
    parse: function (ribs, el) {
      var that = this,
          exp = el.attr(ribs.selector),
          t = R.scanner.scan(exp),
          d = new R.Declaration(ribs, t);
      this._processData(ribs, t, d, el);

      if (typeof d.data == "undefined") {
        throw new Error("data attribute is missing");
      }

      if (t.view) {
        this._processView(ribs, d, t, el);
      }

      // process bindings
      _(t.bindings).each(function (b, i) {
        b.data = d.data;
        b.attr = d.attr;
        b.handler = that._findHandler(ribs, b.handler, d, el);
        d.bindings.push(b);
      });

      return d;
    },

    // TODO this should only happen once for all declarations
    _processView: function (ribs, d, t, el) {
      d.view = ribs.getObj(t.view);

      // create new view
      if (typeof d.view == "function") {
        d.view = new d.view
        d.view.el = el;
      }

      // wire backbone view with data
      if (d.data.models) {
        d.view.options.collection = d.view.collection = d.data;
      }
      else {
        d.view.options.model = d.view.model = d.data;
      }

      // el is not jQuery or Zepto
      if (!(d.view.el instanceof $)) {
        var v = $('#' + t.view);
        d.view.el = (v.size()) ? v : el;
      }
    },

    /**
    * Searches for handler in Ribs.Handlers for given string
    * and falls into ctx search if handle is not found
    * @param {string} handler - handler's name
    *
    */
    _findHandler: function (ribs, name, d, el) {
      var handler;

      if (d.view) {
        handler = d.view[name];
      }
      else if (el) {
        // test for views first
        el.parents('[' + ribs.selector + ']').each(function () {
          var dec = $(this).data('declaration');
          if (dec.view) {
            d.view = dec.view;
            handler = dec.view[name];
            return handler;
          }
        });
      }

      if (!handler) {
        handler = (R.handlers[name]) ? R.handlers[name] : ribs.getObj(name);
      }
      return handler;
    },

    _processData: function (ribs, t, d, el) {
      if (t.data) {
        d.data = ribs.getObj(t.data);
        d.attr = t.attr;
      }
      else {
        el.parents('[' + ribs.selector + ']').each(function () {
          var dec = $(this).data('declaration');
          if (dec.data) {
            d.attr = dec.attr;
            return d.data = dec.data;
          }
        });
      }
    }
  }
})(Ribs);
