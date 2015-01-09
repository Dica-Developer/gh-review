(function () {
    'use strict';

    var token = '44046cd4b4b85afebfe3ccaec13fd8c08cc80aad';

    describe('Github#authenticate', function () {
        var github, consoleErrorSpy, consoleInfoSpy;

        beforeEach(function () {
            github = new Github();
            consoleErrorSpy = spyOn(window.console, 'error');
            consoleInfoSpy = spyOn(window.console, 'info');
        });

        it('Should fail passing invalid authentication type', function(){
            github.authenticate({
                type: 'invalid'
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Invalid authentication type, must be "basic", "oauth" or "token"');
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleInfoSpy).toHaveBeenCalledWith('Continuing without authentication');
            expect(github.auth).toBe(false);
        });

        it('Should fail if auth type "basic" but "username" and/or "password" is missing', function(){
            github.authenticate({
                type: 'basic'
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Basic authentication requires both a username and password to be set');
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleInfoSpy).toHaveBeenCalledWith('Continuing without authentication');
            expect(github.auth).toBe(false);

            github.authenticate({
                type: 'basic',
                username: 'me'
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Basic authentication requires both a username and password to be set');
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleInfoSpy).toHaveBeenCalledWith('Continuing without authentication');
            expect(github.auth).toBe(false);

            github.authenticate({
                type: 'basic',
                password: 'you'
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('Basic authentication requires both a username and password to be set');
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleInfoSpy).toHaveBeenCalledWith('Continuing without authentication');
            expect(github.auth).toBe(false);
        });

        it('Should pass if auth type "basic" and "username", "password" is given', function(){
            github.authenticate({
                type: 'basic',
                password: 'you',
                username: 'me'

            });

            expect(consoleErrorSpy).not.toHaveBeenCalled();
            expect(github.auth).toEqual({ type : 'basic', password : 'you', username : 'me' });
            expect(consoleInfoSpy).not.toHaveBeenCalled();
        });

        it('Should fail if auth type "token" but "token" is missing', function(){
            github.authenticate({
                type: 'token'
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('OAuth2 authentication requires a token to be set');
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleInfoSpy).toHaveBeenCalledWith('Continuing without authentication');
            expect(github.auth).toBe(false);
        });

        it('Should pass if auth type "token" and "token" is given', function(){
            github.authenticate({
                type: 'token',
                token: 'token'
            });

            expect(consoleErrorSpy).not.toHaveBeenCalled();
            expect(github.auth).toEqual({ type : 'token', token : 'token'});
        });

        it('Should fail if auth type "oath" but "token" is missing', function(){
            github.authenticate({
                type: 'oauth'
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('OAuth2 authentication requires a token to be set');
            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(consoleInfoSpy).toHaveBeenCalledWith('Continuing without authentication');
            expect(github.auth).toBe(false);
        });

        it('Should pass if auth type "oauth" and "token" is given', function(){
            github.authenticate({
                type: 'oauth',
                token: 'token'
            });

            expect(consoleErrorSpy).not.toHaveBeenCalled();
            expect(github.auth).toEqual({ type : 'oauth', token : 'token'});
        });

        it('Should set Github#auth to "false" if no argument is given', function(){
            github.authenticate();

            expect(consoleInfoSpy).toHaveBeenCalled();
            expect(github.auth).toBe(false);
        });
    });

    describe('Pagination', function(){
        var github, consoleErrorSpy;

        beforeEach(function(){
            github = new Github();
            consoleErrorSpy = spyOn(window.console, 'error');
        });

        it('Should call "console.error" if no url is fetched', function(){
            var httpSendForGetPageSpy = spyOn(github, 'httpSendForGetPage');
            github.getNextPage('<https://test.meta.noop/?page=2>; rel="invalid"', null);
            expect(httpSendForGetPageSpy).not.toHaveBeenCalled();
            expect(consoleErrorSpy).toHaveBeenCalledWith('No next page found');
        });

        describe('Github#hasNextPage', function(){
            it('Should return true', function(){
                var linksAsString = '<nextlink>; rel="next"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<nextlink>; rel="next"'
                    }
                };
                var linksAsLinkHash = {
                    link: '<nextlink>; rel="next"'
                };
                expect(github.hasNextPage(linksAsString)).toBe(true);
                expect(github.hasNextPage(linksAsMetaHash)).toBe(true);
                expect(github.hasNextPage(linksAsLinkHash)).toBe(true);
            });

            it('Should return false', function(){
                var linksAsString = '<nextlink>; rel="invalid"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<nextlink>; rel="invalid"'
                    }
                };
                var linksAsLinkHash = {
                    link: []
                };
                expect(github.hasNextPage(linksAsString)).toBe(false);
                expect(github.hasNextPage(linksAsMetaHash)).toBe(false);
                expect(github.hasNextPage(linksAsLinkHash)).toBe(false);
            });
        });

        describe('Github#hasPreviousPage', function(){
            it('Should return true', function(){
                var linksAsString = '<prevlink>; rel="prev"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<prevlink>; rel="prev"'
                    }
                };
                var linksAsLinkHash = {
                    link: '<prevlink>; rel="prev"'
                };
                expect(github.hasPreviousPage(linksAsString)).toBe(true);
                expect(github.hasPreviousPage(linksAsMetaHash)).toBe(true);
                expect(github.hasPreviousPage(linksAsLinkHash)).toBe(true);
            });

            it('Should return false', function(){
                var linksAsString = '<nextlink>; rel="invalid"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<nextlink>; rel="invalid"'
                    }
                };
                var linksAsLinkHash = {
                    link: []
                };
                expect(github.hasPreviousPage(linksAsString)).toBe(false);
                expect(github.hasPreviousPage(linksAsMetaHash)).toBe(false);
                expect(github.hasPreviousPage(linksAsLinkHash)).toBe(false);
            });
        });

        describe('Github#hasFirstPage', function(){
            it('Should return true', function(){
                var linksAsString = '<prevlink>; rel="first"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<prevlink>; rel="first"'
                    }
                };
                var linksAsLinkHash = {
                    link: '<prevlink>; rel="first"'
                };
                expect(github.hasFirstPage(linksAsString)).toBe(true);
                expect(github.hasFirstPage(linksAsMetaHash)).toBe(true);
                expect(github.hasFirstPage(linksAsLinkHash)).toBe(true);
            });

            it('Should return false', function(){
                var linksAsString = '<nextlink>; rel="invalid"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<nextlink>; rel="invalid"'
                    }
                };
                var linksAsLinkHash = {
                    link: []
                };
                expect(github.hasFirstPage(linksAsString)).toBe(false);
                expect(github.hasFirstPage(linksAsMetaHash)).toBe(false);
                expect(github.hasFirstPage(linksAsLinkHash)).toBe(false);
            });
        });

        describe('Github#hasLastPage', function(){
            it('Should return true', function(){
                var linksAsString = '<prevlink>; rel="last"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<prevlink>; rel="last"'
                    }
                };
                var linksAsLinkHash = {
                    link: '<prevlink>; rel="last"'
                };
                expect(github.hasLastPage(linksAsString)).toBe(true);
                expect(github.hasLastPage(linksAsMetaHash)).toBe(true);
                expect(github.hasLastPage(linksAsLinkHash)).toBe(true);
            });

            it('Should return false', function(){
                var linksAsString = '<nextlink>; rel="invalid"';
                var linksAsMetaHash = {
                    meta: {
                        link: '<nextlink>; rel="invalid"'
                    }
                };
                var linksAsLinkHash = {
                    link: []
                };
                expect(github.hasLastPage(linksAsString)).toBe(false);
                expect(github.hasLastPage(linksAsMetaHash)).toBe(false);
                expect(github.hasLastPage(linksAsLinkHash)).toBe(false);
            });
        });

        describe('Github#getNextPage', function(){

            it('Should call "Github#httpSendForGetPage"', function(){
                var httpSendForGetPageSpy = spyOn(github, 'httpSendForGetPage');
                github.getNextPage('<https://test.meta.noop/?page=2>; rel="next"', null);
                expect(httpSendForGetPageSpy).toHaveBeenCalled();
                var callArgs = httpSendForGetPageSpy.calls.argsFor(0)[0];
                expect(callArgs).toBe('https://test.meta.noop/?page=2');
            });

            it('Should work with a real world example', function(done){
                github.authenticate(
                    {
                        type: 'token',
                        token: token
                    }
                );

                github.search.users(
                    {
                        q: 'a',
                        per_page: 5,
                        page: 10
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(github.hasNextPage(res)).toBe(true);
                        github.getNextPage(res, function(err, res){
                            expect(err).toBeNull();
                            done();
                        });
                    }
                );

            });

        });

        describe('Github#getPreviousPage', function(){

            it('Should call "Github#httpSendForGetPage"', function(){
                var httpSendForGetPageSpy = spyOn(github, 'httpSendForGetPage');
                github.getPreviousPage('<https://test.meta.noop/?page=2>; rel="prev"', null);
                expect(httpSendForGetPageSpy).toHaveBeenCalled();
                var callArgs = httpSendForGetPageSpy.calls.argsFor(0)[0];
                expect(callArgs).toBe('https://test.meta.noop/?page=2');
            });

            it('Should work with a real world example', function(done){
                github.authenticate(
                    {
                        type: 'oauth',
                        token: token
                    }
                );

                github.search.users(
                    {
                        q: 'a',
                        per_page: 5,
                        page: 10
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(github.hasPreviousPage(res)).toBe(true);
                        github.getPreviousPage(res, function(err, res){
                            expect(err).toBeNull();
                            done();
                        });
                    }
                );

            });

        });

        describe('Github#getLastPage', function(){

            it('Should call "Github#httpSendForGetPage"', function(){
                var httpSendForGetPageSpy = spyOn(github, 'httpSendForGetPage');
                github.getLastPage('<https://test.meta.noop/?page=2>; rel="last"', null);
                expect(httpSendForGetPageSpy).toHaveBeenCalled();
                var callArgs = httpSendForGetPageSpy.calls.argsFor(0)[0];
                expect(callArgs).toBe('https://test.meta.noop/?page=2');
            });

            it('Should work with a real world example', function(done){
                github.authenticate(
                    {
                        type: 'token',
                        token: token
                    }
                );

                github.search.users(
                    {
                        q: 'a',
                        per_page: 5,
                        page: 10
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(github.hasLastPage(res)).toBe(true);
                        github.getLastPage(res, function(err, res){
                            expect(err).toBeNull();
                            done();
                        });
                    }
                );

            });

        });

        describe('Github#getFirstPage', function(){

            it('Should call "Github#httpSendForGetPage"', function(){
                var httpSendForGetPageSpy = spyOn(github, 'httpSendForGetPage');
                github.getFirstPage('<https://test.meta.noop/?page=2>; rel="first"', null);
                expect(httpSendForGetPageSpy).toHaveBeenCalled();
                var callArgs = httpSendForGetPageSpy.calls.argsFor(0)[0];
                expect(callArgs).toBe('https://test.meta.noop/?page=2');
            });

            it('Should work with a real world example', function(done){

                github.authenticate(
                    {
                        type: 'token',
                        token: token
                    }
                );
                github.search.users(
                    {
                        q: 'a',
                        per_page: 5,
                        page: 10
                    },
                    function(err, res){
                        expect(err).toBeNull();
                        expect(github.hasFirstPage(res)).toBe(true);
                        github.getFirstPage(res, function(err, res){
                            expect(err).toBeNull();
                            done();
                        });
                    }
                );

            });
        });

    });
}());
