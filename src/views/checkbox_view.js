(function (R) {
  R.CheckboxView = R.View.extend({

    events: {
      "click": "_updateModel"
    },

    // updates view with model's value
    _updateView: function () {
      var val = this.model.get(this.attr);
      if (val.toString() == "true") {
        this.el.attr('checked', true);
      }
      else {
        this.el.removeAttr('checked');
      }
      this.el.val(val);
    },

    // updates model with current value from view
    _updateModel: function () {
      var val = this.el.is(':checked');
      this.model.set(R.utils.make(this.attr, val));
    }
  });
})(Ribs);
