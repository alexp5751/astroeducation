describe('Filter: humanize', function() {
    var humanizeFilter;

    beforeEach(module('astronomyApp'));
    beforeEach(inject(function(_humanizeFilter_) {
        console.log("hello")
        console.log(_humanizeFilter_)
        humanizeFilter = _humanizeFilter_;
    }));

    it('should be able to humanize an entire input', function() {
        console.log(humanizeFilter)
        expect(humanizeFilter('hello')).toBe('Hello');
        expect(humanizeFilter('hello world')).toBe('Hello world');
    });
});