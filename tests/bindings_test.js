$(function() {

  module("Backbone.Bindings", {
    setup: function () {},
    teardown: function () {}
  });

  test("parse action", function() {
    var b = new Backbone.Binding(),
        binding = b._parse("test:click");
    
  });
});
