/*global describe, it, browser, element, by*/
(function () {
    'use strict';
    var menuObjects = require('../pageObjects/menuObjects.js');
    var headerMenu = new menuObjects.HeaderMenu();
    var userMenu = new menuObjects.UserMenu();
    browser.get('http://localhost:9001');
    browser.executeScript('localStorage.setItem("ghreview.accessToken","aa66cb267dbe5c26674a9b4309054602c597bfc1");');
    browser.get('http://localhost:9001/#/');

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

            it('should have 6 entries', function () {
                expect(userMenu.menuEntries.count()).toEqual(6);
            });

            it('should have correct login name', function () {
                var userName = element(by.binding('name'));
                expect(userName.getText()).toEqual('jwebertest');
            });

            it('should have correct link names', function () {
                userMenu.show();
                expect(userMenu.getLinkText(userMenu.whoAmILink)).toEqual('Who am I');
                expect(userMenu.getLinkText(userMenu.bugLink)).toEqual('I found a bug');
                expect(userMenu.getLinkText(userMenu.moreLink)).toEqual('I need more');
                expect(userMenu.getLinkText(userMenu.howtoLink)).toEqual('How to use');
                expect(userMenu.getLinkText(userMenu.aboutLink)).toEqual('About');
                expect(userMenu.getLinkText(userMenu.logoutLink)).toEqual('Logout');
                userMenu.hide();
            });

            it('should have correct link url\'s', function () {
                userMenu.show();
                expect(userMenu.getLinkUrl(userMenu.whoAmILink)).toEqual('http://localhost:9001/#/whoami');
                expect(userMenu.getLinkUrl(userMenu.bugLink)).toEqual('https://github.com/Dica-Developer/gh-review/issues');
                expect(userMenu.getLinkUrl(userMenu.moreLink)).toEqual('https://github.com/Dica-Developer/gh-review');
                expect(userMenu.getLinkUrl(userMenu.howtoLink)).toEqual('https://github.com/Dica-Developer/gh-review/wiki');
                expect(userMenu.getLinkUrl(userMenu.aboutLink)).toBeNull();
                expect(userMenu.getLinkUrl(userMenu.logoutLink)).toBeNull();
                userMenu.hide();
            });
        });

    });
}());
