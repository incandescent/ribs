describe("Views", function () {
  beforeEach(function () {
    this.addMatchers(instanceOfMatcher);

    var Car = Backbone.Model.extend({
      collection: Cars,
      initialize: function () {
        this.set({ready: false});
      }
    });
    var Cars = Backbone.Collection.extend({
      model: Car
    });

    this.cars = new Cars();
    this.cars.add([{color: 'red'}, {color: 'blue'},{color: 'green'}]);
    this.car = new Car();

    this.car.set({color: 'red'});
    this.cars.add(this.car);

    this.ribs = Ribs(this);
    this.CustomView = Backbone.View.extend({});
  });

  describe("Factory", function () {
    describe('Built-in views', function () {
      it('should create new view', function () {
        var self = this;
        _(['Input', 'Checkbox', 'Radio', 'Select', 'Text']).each(function (type) {
          var dec = self.ribs.bind($('<input data-bind="data:car:color, view:' + type + 'View" />'));
          expect(dec.view).toBeInstanceOf(Ribs[type + 'View']);
        });
      });
    });

    describe('Custom View', function () {
      it('should create custom view', function () {
        var dec = this.ribs.bind($('<input data-bind="data:car:color, view:CustomView" />'));
        expect(dec.view).toBeInstanceOf(this.CustomView);
      });
    });

    it('should reference model from view', function () {
      var dec = this.ribs.bind($('<input data-bind="data:car:color, view:CustomView" />'));
      expect(dec.view.model).toBe(this.car);
    });
  });

  describe('TextView', function () {
    beforeEach(function () {
      this.dec = this.ribs.bind($('<input data-bind="data:car:color, view:TextView" />'));
    });

    it("should bind text element to model's attribute", function () {
      this.car.set({color: 'blue'});
      expect(this.dec.view.el.text()).toBe('blue');
    });
  });

  describe('InputView', function () {
    beforeEach(function () {
      this.dec = this.ribs.bind($('<input data-bind="data:car:color, view:InputView" />'));
    });

    it("should change element's value when model changes", function () {
      this.car.set({color: 'blue'});
      expect(this.dec.view.el.val()).toBe('blue');
    });

    it("should change model's attribute value when element's value changes", function () {
      this.dec.view.el.val('blue');
      this.dec.view.el.trigger('keyup');
      expect(this.dec.view.model.get('color')).toBe('blue');
    });
  });

  describe('CheckboxView', function () {
    beforeEach(function () {
      this.dec = this.ribs.bind($('<input type="checkbox" data-bind="data:car:ready, view:CheckboxView" />'));
    });

    it("should check the checkbox when model's value is truthy", function () {
      this.car.set({ready: true});
      expect(this.dec.view.el).toBeChecked();
    });

    it("should uncheck the checkbox when model's value is falsy", function () {
      this.car.set({ready: false});
      expect(this.dec.view.el).not.toBeChecked();
    });

    it("should change model's attribute value when checkbox is clicked", function() {
      this.dec.view.el.prop("checked", true).trigger("click");
      expect(this.car.get('ready')).toBe(true);
    });
  });

  describe('RadioView', function () {
    beforeEach(function () {
      this.dec1 = this.ribs.bind($('<input type="radio" name="ready" data-bind="data:car:ready, view:RadioView" value="true" />'));
      this.dec2 = this.ribs.bind($('<input type="radio" name="ready" data-bind="data:car:ready, view:RadioView" value="false" />'));
    });

    it("should select radio button with value true", function () {
      this.car.set({ready: true});
      expect(this.dec1.view.el).toBeChecked();
      expect(this.dec2.view.el).not.toBeChecked();
    });

    it("should select radio button with value false", function () {
      this.car.set({ready: true});
      this.car.set({ready: false});
      expect(this.dec2.view.el).toBeChecked();
      expect(this.dec1.view.el).not.toBeChecked();
    });

    it("should change model's attribute value when radio button is selected", function () {
      this.dec1.view.el.prop("checked", true).trigger("click");
      expect(this.car.get('ready')).toBe(true);
    });
  });

  describe('SelectView', function () {
    beforeEach(function () {
      this.dec = this.ribs.bind($('<select data-bind="data:cars"></select>'));
    });

    it("should set options for select element from collection", function () {
      //this.dec.view.el
    });
  });
});
