var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits index page', function() {
    var browser = new Browser();
    
    before(function() {
        return browser.visit('/');
    });
    
    it('should be successful', function() {
        browser.assert.success();
    });
    
    it('should see login page', function() {
        browser.assert.redirected();
        browser.assert.success();
        browser.assert.url({ pathname: '/login' });
    });
});
