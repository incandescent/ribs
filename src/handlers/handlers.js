(function (R) {

  // TODO this should go away completelly
  // proxy for handlers
  R.handlers = {
    /**
      * Sets current model
      */
    setCurrent: function (dec, b) {
      /*
      var type = this.getType();

      if (!dec.options.current) {
        throw new Error('no current element found for ' +  this);
      }

      if (typeof dec.options.current == "string") {
        dec.options.current = dec.ribs.getObj(dec.options.current);
      }

      var model = R[type].getCurrent.call(this);
      dec.options.current.set(model.attributes);
      dec.options.current.cid = model.cid;
      */
    },

    // TODO: refactor
    render: function (dec, b) {
      var that = this,
          html, t, model, attrs;

      t = dec.getTemplate();

      if (b.data.models) {
        model = b.data.last();
        if (model) {
          attrs = model.attributes;
          html = t(attrs);
          html = $(html).appendTo(that);
        }
      }
      else {
        html = t(b.data.attributes);
        if ($(html).size() > 0) {
          html = $(html).appendTo(that);
        }
        else {
          that.html(html);
        }
      }

      // process nested bindings
      if ($(html).size() > 0) {
        // find including self
        dec.ribs.bindTree(html.find('*').andSelf(), function (dec) {
          if (dec.view) {
            dec.view.model = model;
          }
        });
      }
    },

    toggle: function (dec, b) {
      this.toggle(b.data.get(b.attr));
    }
  };
 })(Ribs);
