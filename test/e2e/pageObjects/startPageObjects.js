exports.HeaderMenu = function () {
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
                if(!visible){
                    _this.reviewLink.all(by.tagName('a')).first().click();
                }
            });
    };

    this.hideReviewMenu = function () {
        var _this = this;
        this.modulesLink.isDisplayed()
            .then(function (visible) {
                if(visible){
                    _this.reviewLink.all(by.tagName('a')).first().click();
                }
            });
    };
};
