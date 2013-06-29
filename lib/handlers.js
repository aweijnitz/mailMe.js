var config = require('../config.json');
var restify = require('restify');


if(!config) {
    console.error('Could not find config.json. Make sure it is in the same directory as server.js.');
    process.exit(1);
}

// Some HTTP response codes
// See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
var ACCEPTED = 202;
var BAD_REQ = 400;

var sendMail = function (req, res, next) {
    console.log("Sending email");

    if (reqParamsValid(req)) {
        res.send(ACCEPTED, "Mail enqueued.");
        return next();
    }
    else
        return next(new restify.InvalidArgumentError("Invalid parameters."));
};

var reqParamsValid = function(request) {
    var isValid = true;

    // Make sure request has all expected params.

    return isValid;
};

exports.sendMail = sendMail;
