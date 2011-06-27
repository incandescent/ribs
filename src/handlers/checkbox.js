(function (R) { 
  // checkbox handlers
  R.checkbox = new R.El({
    update: function (value) {
      this.attr('checked', value);
      this.val(value);
    },
    getValue: function (e, b) {
      return this.is(':checked');
    }
  });
 })(Ribs);
