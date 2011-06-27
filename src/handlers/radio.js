(function (R) {
  // radio handlers
  R.radio = new R.El({
    update: function (value) {
      if (this.val() === value) {
        this.attr('checked', true);
      }
      else {
        this.removeAttr('checked');
      }
    }
  });

})(Ribs);
