describe('Directive: formatted-Date', function () {
  'use strict';

  beforeEach(module('GHReview'));
  beforeEach(module('app/directives/formatted-date/formatted-date.html'));

  var $compile, $rootScope;

  beforeEach(inject(function ($injector) {
    $compile = $injector.get('$compile');
    $rootScope = $injector.get('$rootScope');
  }));

  it('Should set date', function () {
    var date = moment().subtract('week', 2);
    var element = $compile('<small formatted-date date="' + date + '"></small>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe('14 days ago');
    expect(element.find('span').attr('tooltip')).toBe(moment(date).format('llll'));
  });

  it('Should set date with custom format', function () {
    var date = moment().subtract('week', 2);
    var element = $compile('<small formatted-date date="' + date + '" format="LL"></small>')($rootScope);
    $rootScope.$digest();
    expect(element.text()).toBe(moment(date).format('LL'));
  });
});