describe("Ribs.Declaration", function () {

  beforeEach(function () {
    this.addMatchers(eventMatchers);

    var Car = Backbone.Model;
    this.car = new Car();

    var Cars = Backbone.Collection.extend({
      model: Car
    });

    var View = Backbone.View.extend({
      render: function () {
        this.el.html('render executed');
      }
    });

    this.view = new View();
    this.cars = new Cars();
    this.car.set({'color': 'red'});
    this.cars.add(this.car);
    Ribs.ctx = this;
  });

  afterEach(function () {
    this.cars = null;
    this.car = null;
    this.view = null;
  });

  describe("Handler", function (){
    describe("when view is present", function () {
      it("should execute in the context of the view", function () {
        setFixtures('<div id="el" type="text" data-bind="data:car:color, view:view, change:render" />');
        Ribs.bindAll(this);

        this.car.set({color: "blue"});
        expect($('#el').html()).toBe("render executed");
      });
    });
  });

  describe("Event", function () {
    describe("when dom event is present", function () {
      it("should be bound to element", function () {
        this.handler = sinon.spy();
        var bind = "data:car:color",
            dec;

        // bind to all dom events
        _(Ribs.devents).each(function (event) {
          bind += ", " + event + ":handler";
        });

        setFixtures('<input id="text" type="text" data-bind="' + bind + '" />');
        dec = Ribs.parser.parse($('#text').attr('data-bind'));
        dec.bind($('#text'));

        _(dec.bindings).each(function (binding) {
          expect($('#text')).toHaveEvent(binding.getEvent());
        });
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
