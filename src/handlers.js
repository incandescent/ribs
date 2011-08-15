(function (R) {

  // list of predefined handlers
  // which currently don't fit into any view
  // Currently handlers execute in the context of given view
  // or if view is not present in the context of declaration
  R.handlers = {
    render: function (declaration, binding) {
      var that = this,
          html, t, model, attrs,
          b = binding,
          dec = declaration;

      t = dec.getTemplate();

      // collection given
      if (b.data.models) {
        model = b.data.last();
        if (model) {
          attrs = model.attributes;
          html = t(attrs);
          html = $(html).appendTo(that);
        }
      }
      else { // single model
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
