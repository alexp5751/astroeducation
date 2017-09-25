describe('Protractor Demo App', function() {
  it('should have a title', function() {
    browser.get(browser.baseUrl + 'index.html');

    expect(element(by.css('.site-name')).getText()).toEqual('AstroEducation');
  });
});