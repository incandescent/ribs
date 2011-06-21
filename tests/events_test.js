$(function() {

  module("Events", {
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
});
