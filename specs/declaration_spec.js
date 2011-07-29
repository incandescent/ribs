describe("Ribs.Declaration", function () {

  beforeEach(function () {
    this.addMatchers(eventMatchers);

    var Car = Backbone.Model;
    var self = this;
    this.counter = 0;
    this.car = new Car();
    this.car2 = new Car();

    var Cars = Backbone.Collection.extend({
      model: Car
    });

    this.View = Backbone.View.extend({
      render: function () {
        this.el.html('render executed');
      }
    });

    this.view = new this.View();
    this.cars = new Cars();
    this.car.set({'color': 'red'});
    this.cars.add(this.car);

    this.handler = function () {
      console.log('executing');
      self.counter++;
    }

    this.ribs = new Ribs(this);
  });

  afterEach(function () {
    this.cars = null;
    this.car = null;
    this.view = null;
  });

  describe("Handler", function () {
    describe("when view is present", function () {
      it("should execute in the context of the view", function () {
        setFixtures('<div id="el" type="text" data-bind="data:car:color, view:view, change:render" />');
        Ribs(this);
        this.car.set({color: "blue"});
        expect($('#el').html()).toBe("render executed");
      });
    });
  });

  describe("Views", function () {
    describe("Nested element", function () {
      it("should reference view from outer element", function () {
        setFixtures('<div id="outer" data-bind="data:car:color, view:view"><div id="inner" data-bind="data:car, click:remove" /></div>');
        Ribs(this);
        var dec = $('#inner').data('declaration');
        expect(dec.view).toBe(this.view);
      });

      it("should reference model from collection", function () {
        setFixtures('<script type="text/html" id="carTmpl"><li data-bind="view:View"><%= color %></li></script>' +
          '<ul id="list" data-bind="data:cars, add:render, template:carTmpl" />');

        Ribs(this);
        this.cars.add({color: "blue"});
        this.cars.add({color: "red"});
        expect($('#list > li').size()).toBe(2);
        var dec = $('#list > li:first').data('declaration');
        expect(dec.view.model).toBe(this.cars.at(1));
      });
    });
  });

  describe("Options", function () {
    describe("when template is present", function () {
      it("should be rendered inside element", function () {
        setFixtures('<div id="el" data-bind="data:car, change:render, template:car-tmpl" />' +
          '<script type="text/html" id="car-tmpl"><%= color %></script>');
        Ribs(this);
        this.car.set({color: 'blue'});
        expect($('#el').html()).toBe('blue');
      });
    });

    describe("when bind expression is present inside template", function () {
      it("should be turned into biding declaration", function () {
        setFixtures('<div id="outer" data-bind="data:car, change:render, template:car-tmpl" />' +
          '<script type="text/html" id="car-tmpl">' +
            '<div id="inner" data-bind="data:car2, change:update"><%= color %></div></script>');
        Ribs(this);
        //this.car2.set({color: 'yellow'});
        expect($('#inner').data('declaration')).toBe();
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
        dec = this.ribs.bind($('#text'));

        _(dec.bindings).each(function (binding) {
          expect($('#text')).toHaveEvent(binding.getEvent());
        });
      });
    });

    describe("when model attribute is changed", function () {
      it("should change input text value", function () {
        setFixtures('<input id="text" type="text" data-bind="data:car:color, change:update" />');
        Ribs(this);
        this.car.set({color: "blue"});
        expect($('#text').val()).toBe("blue");
      });
    });
  });
});
