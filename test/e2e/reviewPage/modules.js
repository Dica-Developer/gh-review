describe('Review modules', function () {

    browser.get('http://localhost:9001');
    browser.executeScript('localStorage.setItem("ghreview.accessToken","aa66cb267dbe5c26674a9b4309054602c597bfc1");');
    browser.get('http://localhost:9001/#/');
    var menuObjects = require('../pageObjects/menuObjects.js');
    var headerMenu = new menuObjects.HeaderMenu();

    headerMenu.navigateToReviewModules();

    var searchInput = element(by.id('searchValue'));
    var searchButton = element(by.id('searchButton'));
    var resultItems = element.all(by.repeater('item in result'));

    it('should have an search input field', function () {
        expect(searchInput.isDisplayed()).toBeTruthy();
    });

    it('should have a search button', function () {
        expect(searchButton.isDisplayed()).toBeTruthy();
    });

    it('search button should have text "Search"', function () {
        expect(searchButton.getText()).toBe('Search');
    });

    it('search input field should be empty', function () {
        expect(searchInput.getAttribute('value')).toBe('');
    });

    it('do search should show results', function () {
        searchInput.sendKeys('review modules repo:Dica-Developer/gh-review');
        searchButton.click();
        browser.wait(function () {
            return resultItems.count()
                .then(function (count) {
                    return count > 0;
                });
        }, 1000, 'wait for results more then 0 timed out')
            .then(function () {
                expect(resultItems.count()).toBeGreaterThan(1);
            });


    });

    //TODO
    xit('do search w/o results should show message', function () {
        searchInput.sendKeys('review modules repo:jwebertest/gh-review');
        searchButton.click();
    });

});
