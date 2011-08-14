(function (R) {
  R.CheckboxView = R.View.extend({

    events: {
      "click": "_updateModel"
    },

    // updates view with model's value
    _updateView: function () {
      var val = this.model.get(this.attr);
      console.log()
      // TODO revisit testing for truthy/falsy values
      if (val.toString() == "true") {
        this.el.prop('checked', true);
      }
      else {
        this.el.prop('checked', false);
      }
      this.el.val(val);
    },

    // updates model with current value from view
    _updateModel: function () {
      var val = this.el.prop('checked');
      this.model.set(R.utils.make(this.attr, val));
    }
  });
})(Ribs);
