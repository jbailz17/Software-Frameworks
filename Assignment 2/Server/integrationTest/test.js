let request = require('supertest');
let server = 'http://localhost:3000';

describe('Test for group routes', function() {
    describe('Test get request', function() {
        before(function(done) {
            done();
        });

        it('Returns 200 status', function(done) {
            request(server).get('/api/groups').expect(200, done);
        });
        it('Returns content type text', function(done) {
            request(server).get('/api/groups').expect('Content-Type', /text/, done);
        });

        after(function(done) {
            done();
        });

    });

    describe('Test put request', function() {
        before(function(done) {
            done();
        });

        it('Returns 200 status', function(done) {
            request(server).post('/api/group').expect(200, done);
        });
        it('Returns content type text', function(done) {
            request(server).get('/api/group').expect('Content-Type', /text/, done);
        });

        after(function(done) {
            done();
        });
    });

    describe('Test put request', function() {
        before(function(done) {
            done();
        });

        it('Returns 200 status', function(done) {
            request(server).post('/api/group').expect(200, done);
        });
        it('Returns content type text', function(done) {
            request(server).get('/api/group').expect('Content-Type', /text/, done);
        });

        after(function(done) {
            done();
        });
    });

    describe('Test delete request', function() {
        before(function(done) {
            done();
        });

        it('Returns 200 status', function(done) {
            request(server).post('/api/group').expect(200, done);
        });
        it('Returns content type text', function(done) {
            request(server).get('/api/group').expect('Content-Type', /text/, done);
        });

        after(function(done) {
            done();
        });
    });
});

describe('Test for user routes', function() {
    describe('Test get request', function() {
        before(function(done) {
            done();
        });

        it('Returns 200 status', function(done) {
            request(server).get('/api/user').expect(200, done);
        });
        it('Returns content type JSON', function(done) {
            request(server).get('/api/user').expect('Content-Type', /json/, done);
        });

        after(function(done) {
            done();
        });

    });

    describe('Test post request', function() {
        before(function(done) {
            done();
        });

        it('Returns 200 status', function(done) {
            request(server).post('/api/user').expect(200, done);
        });
        it('Returns content type text', function(done) {
            request(server).post('/api/user').expect('Content-Type', /text/, done);
        });

        after(function(done) {
            done();
        });
    });

    describe('Test delete request', function() {
        before(function(done) {
            done();
        });

        it('Returns 200 status', function(done) {
            request(server).delete('/api/user').expect(200, done);
        });
        it('Returns content type text', function(done) {
            request(server).delete('/api/user').expect('Content-Type', /text/, done);
        });

        after(function(done) {
            done();
        });
    });
});