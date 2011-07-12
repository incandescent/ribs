describe("Ribs.Binding", function () {
  describe("when new Binding is created", function () {
    it("should contain event", function () {
      var binding = new Ribs.Binding("click");
      expect(binding.event).toBe("click");
      expect(binding.getEvent()).toBe('click');
    });

    it("should contain handler", function () {
      var handler = function () {},
          binding = new Ribs.Binding("click", handler);
      expect(binding.handler).toBe(handler);
    });

    it("should not contain 'on' in event's name", function () {
      var binding = new Ribs.Binding("onchange");
      expect(binding.getEvent()).toBe("change");
    });

    it("should return event name with attribute", function () {
      var handler = function () {},
          binding = new Ribs.Binding("change", handler, "color");
      expect(binding.getEventName()).toBe("change:color");
      expect(binding.getEvent()).toBe("change");
    });

    it("should contain attribute", function () {
      var binding = new Ribs.Binding("change", function () {}, "color");
      expect(binding.hasAttr()).toBeTruthy();
      expect(binding.attr).toBe("color");
    });

    it("should not contain attribute", function () {
      var binding = new Ribs.Binding("change", function () {});
      expect(binding.hasAttr()).toBeFalsy();
    });

    it("should contain backbone event", function () {
      _(Ribs.bevents).each(function (event) {
        var binding = new Ribs.Binding(event);
        expect(binding.isBackboneEvent()).toBeTruthy();
      });
    });

    it("should contain dom event", function () {
      _(Ribs.devents).each(function (event) {
        var binding = new Ribs.Binding(event);
        expect(binding.isDomEvent()).toBeTruthy();
      });
    });
  });
});
