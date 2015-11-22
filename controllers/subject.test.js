var Browser = require('zombie');

Browser.localhost(process.env.IP, process.env.PORT);

describe('User visits new error page', function (argument) {

    var browser = new Browser();
    
    before(function() {
        return browser.visit('/subjects/new');
    });
    
    it('should go to the authentication page', function () {
        browser.assert.redirected();
        browser.assert.success();
        browser.assert.url({ pathname: '/login' });
    });
    
    it('should be able to login with correct credentials', function (done) {
        browser
            .fill('neptun', 'k81dnc')
            .fill('password', 'jelszo')
            .pressButton('button[type=submit]')
            .then(function () {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/subjects/list' });
                done();
            });
    });
    
    it('should go the error page', function () {
        return browser.visit('/subjects/new')
        .then(function () {
            browser.assert.success();
            browser.assert.text('div.page-header > h1', 'Új tárgy hozzáadása');
        });
    });
    
    it('should show errors if the form fields are not right', function () {
        return browser
            .fill('helyszin', '')
            .fill('leiras', '')
            .pressButton('button[type=submit]')
            .then(function() {
                // browser.assert.redirected();
                browser.assert.success();
                browser.assert.element('form .form-group:nth-child(1) [name=helyszin]');
                browser.assert.hasClass('form .form-group:nth-child(1)', 'has-error');
                browser.assert.element('form .form-group:nth-child(2) [name=leiras]');
                browser.assert.hasClass('form .form-group:nth-child(2)', 'has-error');
            });
    });
    
    it('should show submit the right-filled form fields and go back to list page', function() {
        browser
            .fill('helyszin', 'pc6')
            .fill('leiras', 'Elromlott a liszt')
            .pressButton('button[type=submit]')
            .then(function() {
                browser.assert.redirected();
                browser.assert.success();
                browser.assert.url({ pathname: '/subjects/list' });
                
                browser.assert.element('table.table');
                browser.assert.text('table.table tbody tr:last-child td:nth-child(2) span.label', 'Új');    
                browser.assert.text('table.table tbody tr:last-child td:nth-child(3)', 'pc6');    
                browser.assert.text('table.table tbody tr:last-child td:nth-child(4)', '0 Elromlott a liszt');
            });
    });
});