exports.config = {
  baseUrl: 'http:/localhost:8080/',
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['functional/**/*.js']
}