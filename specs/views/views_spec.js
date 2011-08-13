describe("Views", function () {
  beforeEach(function () {
    this.addMatchers(instanceOfMatcher);
    this.car = new Backbone.Model;
    this.car.set({color: 'red'});
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
});
