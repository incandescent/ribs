(function (R) {
  R.RadioView = R.View.extend({

    events: {
      "click": "_updateModel"
    },

    // updates view with model's value
    _updateView: function () {
      var val = this.model.get(this.attr) || false;
      if (this.el.val() == val.toString()) {
        this.el.prop('checked', true);
      }
      else {
        this.el.prop('checked', false);
      }
    },

    // updates model with current value from view
    _updateModel: function () {
      var val = this.el.val();
      this.model.set(R.utils.make(this.attr, val));
    }
  });
})(Ribs);
