(function (Ribs) {
 
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
  function El(props) {
    for (var attr in props) {
      if (props.hasOwnProperty(attr)) {
        this[attr] = props[attr];
      }
    }
  };

  El.prototype = {
    update: function (value) {
      this.val(value);
    },
    getValue: function (b) {
      return this.val();
    }
  };

  // checkbox handlers
  Ribs.checkbox = new El({
    update: function (value) {
      this.attr('checked', value);
      this.val(value);
    },
    getValue: function (e, b) {
      return this.is(':checked');
    }
  });
  
  // radio handlers
  Ribs.radio = new El({
    update: function (value) {
      if (this.val() === value) {
        this.attr('checked', true);
      }
      else {
        this.removeAttr('checked');
      }
    }
  });
  
  // select handlers
  Ribs.select = new El({
    //update: function (value) {
     // console.log(value);
    //}
  });
  
  // text handlers
  Ribs.text = new El({
    update: function (value) {
      this.text(value);
    },
    getValue: function () {
      return this.text();
    }
  });
  
  // value handlers
  Ribs.input = new El();

  // build-in handlers
  // all handlers execute in the context of the current DOM element
  // extend it if you want to add more handlers 
  // TODO: refactor this with strategy?
  Ribs.handlers = {
    
    /**
     * Sets value on attribute which belongs to model or collection.
     */
    set: function (dec, b) {    
      if (b.attr) {
        var value = {};
            val = Ribs[this.getType()].getValue.apply(this, arguments);
        value[b.attr] = val;
        dec.data.set(value);
      }
    },
    
    /**
     * Updates DOM element's value. 
     */
    update: function (dec, b) {
      if (b.attr) {
        var value = b.data.get(b.attr);      
        Ribs[this.getType()].update.call(this, value); 
      }
    },
    
    render: function (dec, b) {
      var that = this,
          html;
      
      if (!dec.options.template) {
        throw new Error('no template present for element: ' + this);
      }

      // cache template
      if (typeof dec.options.template == "string") {
        html = $("#" + dec.options.template).html();
        dec.options.template = _.template(html);
      }
      
      var t = dec.options.template;

      if (b.data.models) {
        this.html('');
        b.data.each(function (model) {
          html = t({model: model.attributes});
          that.append(html);
        });
      }
      else {
        html = t({model: b.data.attributes});
        that.html(html);
      }
    },
    toggle: function (dec, b) {
      this.toggle(b.data.get(b.attr));
    }
  };
 })(Ribs);
