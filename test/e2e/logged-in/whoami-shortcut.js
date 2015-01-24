(function () {
  'use strict';

  module.exports = {
    'WhoAmI per shortcut': function (browser) {
      browser
        .url('http://localhost:9000')
        .waitForElementVisible('body', 1000)
        .execute(function(){
          localStorage.setItem('ghreview.accessToken', '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad');
          return true;
        })
        .click('.navbar-brand')
        .keys(['g', 'w'])
        .assert.urlContains('whoami')
        .end();
    }
  };

}());
