(function (Ribs) {

  // build-in handlers
  // all handlers execute in the context of the current element
  // extend it if you want to add more handlers 
  // TODO: refactor this with strategy?
  Ribs.handlers = {
    
    /**
     * Sets value on attribute which belongs to model or collection 
     */
    set: function (e, binding, dec) {
      var tagName = this.get(0).tagName,
          val;
      
      if (!binding.attr) {
        return;
      }

      if (Ribs.U.isFormEl(tagName)) {
        if (this.is(':checkbox')) {
          val = this.is(":checked");
        }
        else {
          val = this.val();
        }
      }
      else {
        val = this.text();
      }
      
      if (binding.attr) {
        var value = {};
        value[binding.attr] = val;
        dec.data.set(value);
      }
    },
    
    /**
     * Updates DOM element's value or content. 
     */
    update: function (attr, value, binding) {
      var el = this.get(0);

      if (Ribs.U.isFormEl(el.tagName)) {
        if (this.is(':checkbox')) {
          this.attr('checked', value);
          this.val(value);
        }
        else if (this.is(':radio')) {
          if (this.val() === value) {
            this.attr('checked', true);
          }
          else {
            this.removeAttr('checked');
          }
        }
        else {
          this.val(value);
        }
      }
      else {
        this.text(value);
      }
    },
    
    render: function (dec, b) {
      var that = this,
          html;

      // cache template
      if (typeof dec.template == "string") {
        html = $("#" + dec.template).html();
        dec.template = _.template(html);
      }
      if (b.data.models) {
        this.html('');
        b.data.each(function (model) {
          html = dec.template({model: model.attributes});
          that.append(html);
        });
      }
      else {
        html = dec.template({model: b.data.attributes});
        that.html(html);
      }
    },

    toggle: function (attr, value, binding) {
      this.toggle(value);
    }
  };

 })(Ribs);
