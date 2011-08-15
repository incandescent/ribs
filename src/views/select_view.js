(function (R) {
  R.SelectView = R.View.extend({

    caption: "Choose one",
    template: _.template("<option <%= s %> value='<%= v %>'><%= t %></value>"),

    events: {
      "change": "_updateModel"
    },

    initialize: function () {
      _.bindAll(this, '_renderOption');
      R.SelectView.__super__.initialize.call(this);
    },

    _updateView: function () {
      var data = this.dec.data,
          caption = this.dec.options.caption || this.caption;

      // if collection present
      if (data.models) {
        this.el.html('');

        if (caption !== "false") {
          this.el.append(this.template({s: "", v: "", t: caption}));
        }

        // process all models in collection
        data.each(this._renderOption);
      }
    },

    // updates model with current value from view
    _updateModel: function () {
      var model = $('option:selected', this.el).data('model'),
        c = this.dec.options.current;

      if (c) {
        if (typeof c == "string") {
          c = this.dec.ribs.getObj(c);
        }

        // TODO this sucks
        c.set(model.attributes);
        c.cid = model.cid;
        c.id = model.id;
      }
    },

    _renderOption: function (model) {
      var value = this.dec.options.value || this.dec.attr,
          // hmm no f@#%.. clue what I wanted to do here..
          // TODO revisit this
          v = (value) ? model.get(value) : model.cid,
          s = (v === model.get(value) || v === model.id) ? 'selected' : '',
          option = this.template({s:"", v:v, t:v});

      $(option).data('model', model).appendTo(this.el);
    }
  });
})(Ribs);
