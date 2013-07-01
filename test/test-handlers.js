var should = require('should');
var bunyan = require('bunyan');
var handlers = require('../lib/handlers.js');

describe('Send Email Handler', function () {
    var val;
    var mailSender = {};
    var badMailSender = {}; // send will always fail
    var request = {};
    var response = {};
    var config = {};
    before(function () {
        var ringbuffer = new bunyan.RingBuffer({ limit: 100 }); // In-memory logging
        var logger = bunyan.createLogger({
            name: 'mailMe',
            streams: [{
                stream: ringbuffer
            }]
        });
        request.log = logger;
        // Create a mock mail transport objects
        mailSender.send = function(fromEmail, mailReceivers, subject, msg, callback) {
            callback(null, {message: "ok"});
        };

        badMailSender = function(fromEmail, mailReceivers, subject, msg, callback) {
            callback({message: "failed"}, null);
        };

        // Create mock request object
        request.params = {
            from: "Anders Weijnitz",
            fromEmail: "some.guy@emailservice.se",
            subject: "Your unknown uncle died. We need to transfer his money to you!",
            msg: "Please send us banking information and credit card details ASAP."
        };

        // Create a mock response object
        response.send = function(statusCode, msg) { };

        // Fake config
        config.mailReceivers = ["some@mailservice.se"];
    });

    it('should send an email if all params present', function (done) {
        var handler = handlers.createMailHandler(mailSender, config);
        handler(request, response, function(err) {
            should.not.exist(err);
            done();
        });

    });

    it('should NOT send an email if params missing', function (done) {
        var handler = handlers.createMailHandler(mailSender, config);

        // Remove some params
        request.params = {
            subject: "Your unknown uncle died. We need to transfer his money to you!",
            msg: "Please send us banking information and credit card details ASAP."
        };

        handler(request, response, function(err) {
           should.exist(err);
            done();
        });
    });

});