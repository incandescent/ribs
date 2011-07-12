describe("Ribs.parser", function () {

  beforeEach(function () {
    var Car = Backbone.Model;
    this.car = new Car();

    var Cars = Backbone.Collection.extend({
      model: Car
    });

    var View = Backbone.View.extend({
      render: function () {
      }
    });

    this.view = new View();

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
    this.view = null;
    Ribs.ctx = null;
  });

  describe("when parsing and creating declaration", function () {
    it("should reference model", function () {
      var dec = Ribs.parser.parse('data:car');
      expect(dec.data).toBe(this.car);
    });

    it("should reference collection", function () {
      var dec = Ribs.parser.parse('data:cars');
      expect(dec.data).toBe(this.cars);
    });

    it("should reference view", function () {
      var dec = Ribs.parser.parse('data:cars, view:view');
      expect(dec.view).toBe(this.view);
    });

    it("should reference model and create one binding", function () {
      var dec = Ribs.parser.parse('data:car, click:handler');
      expect(dec.data).toBe(this.car);
      expect(dec.bindings.length).toBe(1);
      expect(dec.bindings[0].handler).toBe(this.handler);
      expect(dec.bindings[0].event).toBe("click");
    });

    it("should reference model and create two bindings", function () {
      var dec = Ribs.parser.parse('data:car, click:handler, change:update');
      expect(dec.data).toBe(this.car);
      expect(dec.bindings.length).toBe(2);
    });

    it("should contain attribute", function () {
      var dec = Ribs.parser.parse('data:car:color, click:handler, change:update');
      expect(dec.attr).toBe('color');
    });

    it("should contain template option", function () {
      var dec = Ribs.parser.parse('data:cars, change:render, template:cars-tmpl');
      expect(dec.options).toBeTruthy();
      expect(dec.options.template).toBe('cars-tmpl');
    });

    it("shouldn't contain model", function () {
      var dec = Ribs.parser.parse('click:handler');
      expect(dec.data).toBeFalsy();
    });

    it("should throw an exception about wrong format", function () {
      expect(function () {
        Ribs.parser.parse('data');
      }).toThrow(new Error('Token data has a wrong format.'));
    });

    it("should throw an exception about missing handler", function () {
      expect(function () {
        Ribs.parser.parse('data:cars, click:wrongHandler');
      }).toThrow(new Error("Object or function 'wrongHandler' not found."));
    });
  });
});
