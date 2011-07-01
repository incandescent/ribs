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
  });

  afterEach(function () {
    this.cars = null;
    this.car = null;
    Ribs.ctx = null;
  });

  describe("#bind", function () {
    it("should bind to click event", function () {
      this.handler = sinon.spy();
      setFixtures('<input id="text" type="text" data-bind="data:car:color, click:handler" />');
      Ribs.bindAll(this);
      $("#text").trigger('click');
      expect(this.handler.called).toBeTruthy();
    });
  });
});
