(function (R) {
  R.InputView = R.View.extend({

    events: {
      "keyup": "_updateModel"
    },

    // updates view with model's value
    _updateView: function (model) {
      this.el.val(this.model.get(this.attr));
    },

    // updates model with current value from view
    _updateModel: function () {
      this.model.set(R.utils.make(this.attr, this.el.val()));
    }
  });
})(Ribs);
