describe('Directive: file-input', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var $compile, $rootScope, event;

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
    event = new CustomEvent('change');
  }));

  it('Should call change callback if change event is called', function (done) {
    $rootScope.changeCallback = function(event, files){
      expect(event).toBeDefined();
      expect(files).toBeDefined();
      done();
    };
    var element = $compile('<input type="file" data-file-change="changeCallback($event, files)">')($rootScope);
    $rootScope.$digest();
    element[0].dispatchEvent(event);
  });

});