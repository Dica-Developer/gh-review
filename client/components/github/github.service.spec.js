/*global Github*/
describe('Service: github', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var github;

  beforeEach(inject(function ($injector) {
    github = $injector.get('github');
  }));

  afterEach(function () {
    localStorage.clear();
  });

  it('Should be defined', function () {
    expect(github instanceof Github).toBeTruthy();
  });

});