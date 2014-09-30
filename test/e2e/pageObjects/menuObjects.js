exports.HeaderMenu = function () {
    'use strict';

    this.menuElements = element.all(by.name('ghr-top-menu-links'));
    this.reviewLink = this.menuElements.get(0);
    this.modulesLink = this.menuElements.get(1);
    this.commitsLink = this.menuElements.get(2);
    this.filterLink = this.menuElements.get(3);

    this.getLinkText = function (link) {
        return link.all(by.tagName('a')).first().getText();
    };

    this.showReviewMenu = function () {
        var _this = this;
        this.modulesLink.isDisplayed()
            .then(function (visible) {
                if (!visible) {
                    _this.reviewLink.all(by.tagName('a')).first().click();
                }
            });
    };

    this.hideReviewMenu = function () {
        var _this = this;
        this.modulesLink.isDisplayed()
            .then(function (visible) {
                if (visible) {
                    _this.reviewLink.all(by.tagName('a')).first().click();
                }
            });
    };

    this.navigateToReviewModules = function () {
        this.showReviewMenu();
        this.modulesLink.all(by.tagName('a')).first().click();
        browser.wait(function () {
            return browser.getLocationAbsUrl()
                .then(function (url) {
                    return url === 'http://localhost:9001/#/filter/modules';
                });
        }, 1000, 'Navigate to filter/modules timed out');
    };
};

exports.UserMenu = function () {
    'use strict';

    this.menuElements = element(by.id('userMenu')).all(by.tagName('a'));
    this.menuEntries = element(by.id('userMenuDropdown')).all(by.tagName('a'));
    this.menuDropdown = this.menuElements.get(0);
    this.whoAmILink = this.menuElements.get(1);
    this.bugLink = this.menuElements.get(2);
    this.moreLink = this.menuElements.get(3);
    this.howtoLink = this.menuElements.get(4);
    this.aboutLink = this.menuElements.get(5);
    this.logoutLink = this.menuElements.get(6);

    this.getLinkText = function (link) {
        return link.getText();
    };

    this.getLinkUrl = function (link) {
        return link.getAttribute('href');
    };

    this.show = function () {
        var _this = this;
        this.whoAmILink.isDisplayed()
            .then(function (visible) {
                if (!visible) {
                    _this.menuDropdown.click();
                }
            });
    };

    this.hide = function () {
        var _this = this;
        this.whoAmILink.isDisplayed()
            .then(function (visible) {
                if (visible) {
                    _this.menuDropdown.click();
                }
            });
    };
};
