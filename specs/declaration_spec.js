describe("Ribs.Declaration", function () {
 
  beforeEach(function () {
    this.addMatchers(eventMatchers);

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

  describe("Event", function () {
    describe("when biding with click event is present", function () {
      it("should be bound to element", function () {
        this.handler = sinon.spy();
        setFixtures('<input id="text" type="text" data-bind="data:car:color, click:handler" />');
        Ribs.bindAll(this);
        expect($('#text')).toHaveEvent('click');
        //$("#text").trigger('click');
        //expect(this.handler.called).toBeTruthy();
      });
    });

    describe("when model attribute is changed", function () {
      it("should change input text value", function () {
        setFixtures('<input id="text" type="text" data-bind="data:car:color, change:update" />');
        Ribs.bindAll(this);
        this.car.set({color: "blue"});
        expect($('#text').val()).toBe("blue");
      });
    });
  });
});
