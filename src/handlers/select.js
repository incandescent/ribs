(function (R) {
  
  var optionTmpl = _.template("<option <%= s %> value='<%= v %>'><%= t %></value>");

  // select handlers
  R.select = new R.El({
    /**
     * Populates select with models
     */
    init: function (dec) {
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
        that.append(optionTmpl({s: "", v: "", t: caption}));
        data.each(function (model) {
          v = (value) ? model.get(value) : model.cid;
          s = (v === model.get(value) || v === model.id) ? 'selected' : ''; 
          var option = optionTmpl({s:s, v:v, t:v});
          $(option).data('model', model).appendTo(that);
        });
      }
    },

    getCurrent: function () {
      return $('option:selected', this).data('model');
    }
  });
})(Ribs);
