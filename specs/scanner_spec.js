describe("Ribs.Scanner", function () {
  describe("Token", function () {
    it('should contain data', function () {
      var token = R.scanner.scan('data:cars');
      expect(token.data).toBe('cars');
    });

    it('should contain view', function () {
      var token = R.scanner.scan('view:View');
      expect(token.view).toBe('View');
    });

    it('should contain data and view', function () {
      var token = R.scanner.scan('data:cars, view:View');
      expect(token.view).toBe('View');
      expect(token.data).toBe('cars');
    });

    it('should contain binding', function () {
      var token = R.scanner.scan('data:cars, click:update');
      expect(token.bindings).toBeTruthy();
      expect(token.bindings.length).toBe(1);
      expect(token.bindings[0].event).toBe('click');
      expect(token.bindings[0].handler).toBe('update');
    });

    it('should contain options', function () {
      var token = R.scanner.scan('data:cars, template:tmpl-name');
      expect(token.options).toBeTruthy();
      expect(token.options.template).toBe('tmpl-name');
    });
  });

  it("should throw an exception about wrong format", function () {
    expect(function () {
      R.scanner.scan('data');
    }).toThrow(new Error('Block data has a wrong format.'));
  });
});
