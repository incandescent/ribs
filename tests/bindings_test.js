$(function() {

  module("Backbone.Bindings", {
    setup: function () {
      var Car = Backbone.Model;
      this.car = new Car();

      var Cars = Backbone.Collection.extend({
        model: Car  
      });
      
      this.cars = new Cars();
      this.car.set({color: "red"});
      this.cars.add(this.car);
      
      this.nm = {cars: this.cars, car: this.car, a: function (){}, b:function(){}}; // namespace
      this.b = new Backbone.Binding(this.nm);
    },
    teardown: function () {
      this.nm = null;
      this.b = null;
    }
  });

  test("parse one action", function () {
    var binding = this.b._parse("click:a");
    equal(binding.actions.length, 1, "one action should be present");
  });

  test("parse multiple actions", function () {
    var binding = this.b._parse("click:a, click:b");
    equal(binding.actions.length, 2, "two actions should be present");
  });

  test("parse multiple actions with data", 2,  function () {
    var binding = this.b._parse("data:car, init:a, click:b");
    equal(binding.actions.length, 2, "two actions should be present");
    deepEqual(this.car, binding.data, "binding data should be the same as car model");
  });

  test("wrong syntax raises exception", function () {
    raises(function () {
      var binding = this.b._parse("wrong syntaxt");
     }, "fails because syntax is wrong" );
  });

  test("missing data and backbone event raises exception", function () {
    raises(function () {
      var binding = this.b._parse("init:a");
     }, "fails because data is not present for init event" );
  });

});
