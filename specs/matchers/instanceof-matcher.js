var instanceOfMatcher = {
  toBeInstanceOf: function (expected) {
    if (this.actual instanceof expected) {
      return true;
    }
    else {
      this.actual = this.actual + " is not an instance of " + expected;
      return false;
    }
  }
};
