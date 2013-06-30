var config = require('../config_prod.json');
var restify = require('restify');
var MailSender = require('./MailSender.js');

if(!config) {
    console.error('Could not find config.json. Make sure it is in the same directory as server.js.');
    process.exit(1);
}

// Valid services
// Gmail, Hotmail, iCloud, Yahoo, ...
// see http://www.nodemailer.com/#well-known-services-for-smtp

var mailSender = MailSender.createTransport (
    config.mailServerCredentials.user,
    config.mailServerCredentials.pass,
    config.mailTransportService);

// Some HTTP response codes
// See http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
var ACCEPTED = 202;
var BAD_REQ = 400;

var sendMail = function (req, res, next) {
    var logger = req.log;
    logger.info("Email send request received");

    if (reqParamsValid(req, logger)) {

        mailSender.send(req.params.fromEmail, config.mailReceivers, req.params.subject, req.params.msg,
        function() {
            if(error){
                logger.error({params: reg.params}, error);
            }else{
                logger.info({message: response.message},"Message sent.");
            }
        });
        res.send(ACCEPTED, "Mail sent!");
        return next();
    }
    else
        return next(new restify.InvalidArgumentError("Invalid parameters."));
};

var reqParamsValid = function(req, logger) {
    var isValid = true;

    // Make sure request has all expected params.
    if(!(req.params.from && req.params.subject && req.params.msg)) {
        logger.error({params: req.params}, "Invalid params!")
        isValid = false;
    }

    return isValid;
};

exports.sendMail = sendMail;
