(function (R) {

  // text handlers
  R.text = new R.El({
    update: function (value) {
      this.text(value);
    },
    getValue: function () {
      return this.text();
    }
  });
  
})(Ribs);
