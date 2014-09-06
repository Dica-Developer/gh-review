/*global describe, beforeEach, it, browser, element, by*/
(function(){
    'use strict';
    describe('GH-Review start page', function() {
        browser.get('http://localhost:9001');

        var loginButton = element(by.id('loginLogoutContainer'));
        var welcomeMessage = element(by.id('welcomeMessage'));


        it('should have correct title', function() {
            expect(browser.getTitle()).toEqual('GH-Review');
        });

        describe('Header', function(){

            it('should have login button', function() {
                expect(loginButton.isPresent()).toBeTruthy();
            });

            it('should have login button with text "Sign in with Github"', function() {
                var buttonLink = loginButton.element(by.css('.btn'));
                expect(buttonLink.getText()).toBe('Sign in with Github');
            });

        });

        describe('Welcome message', function(){

            it('should be present', function() {
                expect(welcomeMessage.isPresent()).toBeTruthy();
            });

            it('should have header with text "github review"', function(){
                var header = welcomeMessage.element(by.tagName('h1'));
                expect(header.getText()).toBe('github review');
            });

            it('should have login button', function() {
                var button = element(by.name('gh-review_login'));
                expect(button.isPresent()).toBeTruthy();
            });

            it('should have pro account button', function() {
                var button = element(by.name('gh-review_proaccount'));
                expect(button.isPresent()).toBeTruthy();
            });

            it('should have pro account button with text "PRO ACCOUNT"', function() {
                var button = element(by.name('gh-review_proaccount'));
                expect(button.getText()).toBe('PRO ACCOUNT');
            });

            //TODO leads into 'Error: Error while waiting for Protractor to sync with the page: {}'
            xit('should redirect to "https://github.com/Dica-Developer/gh-review" when click pro account button', function() {
                var button = element(by.name('gh-review_proaccount'));
                button.click().then(function(){
                    expect(browser.getCurrentUrl()).toBe('PRO ACCOUNT');
                });
            });

        });

    });
}());
