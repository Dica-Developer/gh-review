describe('Service: humanReadableDate', function () {
  'use strict';

  beforeEach(module('GHReview'));

  var humanReadableDate, date;

  beforeEach(inject(function ($injector) {
    humanReadableDate = $injector.get('humanReadableDate');
    //FIXME these tests will fail again in 2016
    date = new Date(new Date().getFullYear() - 36, 11, 10).getTime();
  }));

  it('Should be defined', function () {
    expect(humanReadableDate).toBeDefined();
    expect(humanReadableDate.fromNow).toBeDefined();
    expect(humanReadableDate.format).toBeDefined();
    expect(humanReadableDate.customFormat).toBeDefined();
  });

  it('.fromNow should return an "ago" string', function () {
    expect(humanReadableDate.fromNow(date)).toBe('35 years ago');
  });

  it('.fromNow should return null if no date is given', function () {
    expect(humanReadableDate.fromNow()).toBeNull();
  });

  it('.format should return a string', function () {
    expect(humanReadableDate.format(date)).toBe('Mon, Dec 10, 1979 12:00 AM');
  });

  it('.format should return null if no date is given', function () {
    expect(humanReadableDate.format()).toBeNull();
  });

  it('.customFormat should return a date in default format if pattern is null', function () {
    expect(humanReadableDate.customFormat(date, null)).toContain('1979-12-10T00:00:00');
  });

  it('.customFormat should return only the year if pattern is "YYYY"', function () {
    expect(humanReadableDate.customFormat(date, 'YYYY')).toBe('1979');
  });

  it('.customFormat should return only "1979 jub jub 00" if pattern is "YYYY jub jub ss"', function () {
    expect(humanReadableDate.customFormat(date, 'YYYY jub jub ss')).toBe('1979 jub jub 00');
  });

  it('.customFormat should return null if no date is given', function () {
    expect(humanReadableDate.customFormat()).toBeNull();
  });
});