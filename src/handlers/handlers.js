(function (R) {

  // returns element's tag name
  $.fn.tagName = function () {
    return this.get(0).tagName.toLowerCase();
  };

  // returns one of the types:
  // [checkbox, radio, select, input, text]
  // for given DOM element
  $.fn.getType = function () {
    var formTags = ["input", "textarea", "select"];
    if (_.include(formTags, this.tagName())) {
      if (this.is(':checkbox')) {
        return "checkbox";
      }
      if (this.is(':radio')) {
        return "radio";
      }
      if (this.tagName() === 'select') {
        return "select";
      }
      return "input";
    }
    else {
      return "text";
    }
  };

  // 'interface' for elements
  R.El = function (props) {
    for (var attr in props) {
      if (props.hasOwnProperty(attr)) {
        this[attr] = props[attr];
      }
    }
  };

  R.El.prototype = {
    init: function (dec) {},
    getCurrent: function () {},
    update: function (value) {
      this.val(value);
    },
    getValue: function (b) {
      return this.val();
    }
  };

  // proxy for handlers
  R.handlers = {
    // init hook
    init: function (dec) {
      var type = this.getType();
      R[type].init.call(this, dec);
    },

    /**
     * Sets value on attribute which belongs to model or collection.
     */
    set: function (dec, b) {
      if (b.attr) {
        var type = this.getType(),
            val = R[type].getValue.apply(this, arguments),
            value = {};
        value[b.attr] = val;
        dec.data.set(value);
      }
    },

    /**
      * Sets current model
      */
    setCurrent: function (dec, b) {
      var type = this.getType();

      if (!dec.options.current) {
        throw new Error('no current element found for ' +  this);
      }

      if (typeof dec.options.current == "string") {
        dec.options.current = R.getObj(dec.options.current);
      }

      var model = R[type].getCurrent.call(this);
      dec.options.current.set(model.attributes);
      dec.options.current.cid = model.cid;
    },

    /**
     * Updates DOM element's value.
     */
    update: function (dec, b) {
      if (b.attr) {
        var value = b.data.get(b.attr),
            type = this.getType();
        R[type].update.call(this, value);
      }
    },

    // TODO: refactor
    render: function (dec, b) {
      var that = this,
          html, t, model, attrs;

      if (!dec.options.template) {
        throw new Error('no template present for element: ' + this);
      }

      // cache template
      if (typeof dec.options.template == "string") {
        html = $("#" + dec.options.template).html();
        if (!html) {
          throw new Error("Template " + dec.options.template + " doesn't exist");
        }
        dec.options.template = _.template(html);
      }

      t = dec.options.template;

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
        html.find('*').andSelf().filter('[' + R.selector + ']').each(function () {
          R.exec($(this));
          var dec = $(this).data('declaration');
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
