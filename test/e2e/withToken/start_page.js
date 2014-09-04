/*global describe, it, browser, element, by*/
(function () {
    'use strict';
    var startPageObjects = require('../pageObjects/startPageObjects.js');
    var headerMenu = new startPageObjects.HeaderMenu();
    browser.get('http://localhost:9000');
    browser.executeScript('localStorage.setItem("ghreview.accessToken","14d762f65ea69243176f9933566144d552fb2f64");');
    browser.get('http://localhost:9000/#/');

    describe('GH-Review start page', function () {

        describe('Header menu', function () {

            it('should have 4 entries', function () {
                expect(headerMenu.menuElements.count()).toEqual(4);
            });

            it('should have "Review" as top level menu', function () {
                expect(headerMenu.getLinkText(headerMenu.reviewLink)).toBe('Review');
            });

            it('should show "Modules" and "Commits" as sub menu of "Review" after click', function () {
                expect(headerMenu.modulesLink.isDisplayed()).toBeFalsy();
                expect(headerMenu.commitsLink.isDisplayed()).toBeFalsy();

                headerMenu.showReviewMenu();
                expect(headerMenu.modulesLink.isDisplayed()).toBeTruthy();
                expect(headerMenu.commitsLink.isDisplayed()).toBeTruthy();
                expect(headerMenu.getLinkText(headerMenu.modulesLink)).toBe('Modules');
                expect(headerMenu.getLinkText(headerMenu.commitsLink)).toBe('Commits');
                headerMenu.hideReviewMenu();
            });

            it('should have "Filter" as top level menu', function () {
                expect(headerMenu.getLinkText(headerMenu.filterLink)).toBe('Filter');
            });
        });

        describe('User menu', function () {

            it('should have correct login name', function () {
                var userName = element(by.binding('name'));
                expect(userName.getText()).toEqual('Jörg Weber');
            });
        });

    });
}());
