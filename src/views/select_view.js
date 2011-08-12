(function (R) {
  R.SelectView = R.View.extend({

    template: _.template("<option <%= s %> value='<%= v %>'><%= t %></value>"),

    events: {
      "change": "_updateModel"
    },

    _updateView: function (dec) {
      var data = dec.data,
          that = this,
          value = dec.options.value || dec.attr,
          caption = dec.options.caption || "Choose one",
          c = dec.options.current,
          v, s;

      if (c) {
        c = this.dec.ribs.getObj(c);
      }

      if (data.models) {
        that.append(this.template({s: "", v: "", t: caption}));
        data.each(function (model) {
          v = (value) ? model.get(value) : model.cid;
          s = (v === model.get(value) || v === model.id) ? 'selected' : '';
          var option = optionTmpl({s:s, v:v, t:v});
          $(option).data('model', model).appendTo(that);
        });
      }
    },

    // updates model with current value from view
    _updateModel: function () {
      var val = $('option:selected', this.el).data('model');
      this.model.set(R.utils.make(this.attr, val));
    }
  });
})(Ribs);
