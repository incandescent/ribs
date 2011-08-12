describe("Views.View", function () {
  beforeEach(function () {
    this.addMatchers(instanceOfMatcher);
    this.car = new Backbone.Model;
    this.car.set({color: 'red'});
    this.ribs = Ribs(this);

    this.CustomView = Backbone.View.extend({
    });
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
  });
});
