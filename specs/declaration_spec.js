describe("Ribs.Declaration", function () {
 
  beforeEach(function () {
    var Car = Backbone.Model;
    this.car = new Car();

    var Cars = Backbone.Collection.extend({
      model: Car  
    });
    
    Ribs.ctx = this; // set ribs context
    
    this.cars = new Cars();
    this.car.set({'color': 'red'});
    this.cars.add(this.car);
    var counter = 0;
    this.handler = function () {
      counter += 1;
    }
  });

  afterEach(function () {
    this.cars = null;
    this.car = null;
    Ribs.ctx = null;
  });

  describe("when bind is executed on given element", function () {
    it("should bind to click event", function () {
    });
  });
});
